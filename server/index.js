import express from 'express';
import { pool, withTransaction } from './db.js';
import { getTentativeDeliveryDate } from '../src/data/booksData.js';

const POINT_VALUE = 0.1; // 100 points = $10
const TAX_RATE = 0.085;
const FREE_SHIPPING_THRESHOLD = 35;
const STANDARD_SHIPPING = 4.99;
const CANCEL_WINDOW_HOURS = 48;
const round2 = (n) => Math.round(n * 100) / 100;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// ---- row -> API shape mappers (the React app uses camelCase) ----
const toBook = (r) => ({
  id: r.id,
  title: r.title,
  author: r.author,
  publisher: r.publisher,
  category: r.category,
  price: r.price,
  originalPrice: r.original_price,
  rating: r.rating,
  reviewsCount: r.reviews_count,
  cover: r.cover,
  description: r.description,
  pages: r.pages,
  language: r.language,
  isbn: r.isbn,
  stock: r.stock,
  pointsAwarded: r.points_awarded,
  deliveryDays: r.delivery_days,
  badge: r.badge,
  featured: r.featured,
  relatedIds: r.related_ids,
});

const toUser = (r) => ({
  id: r.id,
  name: r.name,
  email: r.email,
  avatar: r.avatar,
  giftPoints: r.gift_points,
});

const toAddress = (r) => ({
  id: r.id,
  title: r.title,
  fullName: r.full_name,
  street: r.street,
  city: r.city,
  state: r.state,
  zipCode: r.zip_code,
  country: r.country,
  phone: r.phone,
  isDefault: r.is_default,
});

const toOrder = (r, items) => ({
  id: r.id,
  createdAt: r.created_at.toISOString(),
  status: r.status,
  items: items.map((i) => ({
    bookId: i.book_id,
    title: i.title,
    author: i.author,
    price: i.price,
    quantity: i.quantity,
    cover: i.cover,
    deliveryDate: i.delivery_date,
  })),
  subtotal: r.subtotal,
  discountFromPoints: r.discount_from_points,
  pointsRedeemed: r.points_redeemed,
  pointsEarned: r.points_earned,
  shippingFee: r.shipping_fee,
  tax: r.tax,
  total: r.total,
  paymentMethod: r.payment_method,
  deliveryAddress: r.delivery_address,
  tentativeDelivery: r.tentative_delivery,
  canCancel: r.status === 'Processing',
});

// ---- queries (accept a pool or a transaction client) ----
const fetchOrders = async (db, where, params) => {
  const { rows: orders } = await db.query(
    `SELECT * FROM orders WHERE ${where} ORDER BY created_at DESC`,
    params
  );
  if (!orders.length) return [];
  const { rows: items } = await db.query(
    'SELECT * FROM order_items WHERE order_id = ANY($1) ORDER BY id',
    [orders.map((o) => o.id)]
  );
  return orders.map((o) => toOrder(o, items.filter((i) => i.order_id === o.id)));
};

const fetchAccount = async (db, userId) => {
  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
  if (!rows.length) throw new HttpError(404, 'User not found');
  const addresses = await db.query(
    'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, id',
    [userId]
  );
  const orders = await fetchOrders(db, 'user_id = $1', [userId]);
  return { user: toUser(rows[0]), addresses: addresses.rows.map(toAddress), orders };
};

const requireString = (value, field) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, `${field} is required`);
  }
  return value.trim();
};

const optionalString = (value, fallback) =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback;

const newId = (prefix) =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const app = express();
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok' });
});

app.get('/api/books', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM books ORDER BY length(id), id');
  res.json(rows.map(toBook));
});

// Email-based sign in. Unknown emails are registered on the fly.
// NOTE: there is no password check; this is demo-level authentication.
app.post('/api/login', async (req, res) => {
  const email = requireString(req.body?.email, 'email').toLowerCase();
  const name = optionalString(req.body?.name, 'Reader');
  const found = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  let userId = found.rows[0]?.id;
  if (!userId) {
    userId = newId('usr');
    await pool.query('INSERT INTO users (id, name, email) VALUES ($1, $2, $3)', [userId, name, email]);
  }
  res.json(await fetchAccount(pool, userId));
});

app.get('/api/users/:userId', async (req, res) => {
  res.json(await fetchAccount(pool, req.params.userId));
});

app.post('/api/users/:userId/addresses', async (req, res) => {
  const { userId } = req.params;
  const b = req.body ?? {};
  const fullName = requireString(b.fullName, 'fullName');
  const street = requireString(b.street, 'street');
  const city = requireString(b.city, 'city');
  const state = requireString(b.state, 'state');
  const zipCode = requireString(b.zipCode, 'zipCode');
  const phone = requireString(b.phone, 'phone');
  const title = optionalString(b.title, 'Home');
  const country = optionalString(b.country, 'United States');

  const address = await withTransaction(async (client) => {
    const { rows: users } = await client.query('SELECT id FROM users WHERE id = $1 FOR UPDATE', [userId]);
    if (!users.length) throw new HttpError(404, 'User not found');
    const { rows: existing } = await client.query('SELECT 1 FROM addresses WHERE user_id = $1 LIMIT 1', [userId]);
    const { rows } = await client.query(
      `INSERT INTO addresses (id, user_id, title, full_name, street, city, state, zip_code, country, phone, is_default)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [newId('addr'), userId, title, fullName, street, city, state, zipCode, country, phone, existing.length === 0]
    );
    return toAddress(rows[0]);
  });
  res.status(201).json(address);
});

// Prices, totals, stock and points are all computed here from database values,
// never trusted from the client.
app.post('/api/orders', async (req, res) => {
  const b = req.body ?? {};
  const userId = requireString(b.userId, 'userId');
  const addressId = requireString(b.addressId, 'addressId');
  const paymentMethod = requireString(b.paymentMethod, 'paymentMethod');
  const pointsToRedeem = b.pointsToRedeem ?? 0;
  if (!Number.isInteger(pointsToRedeem) || pointsToRedeem < 0) {
    throw new HttpError(400, 'pointsToRedeem must be a non-negative integer');
  }
  if (!Array.isArray(b.items) || !b.items.length) {
    throw new HttpError(400, 'items must be a non-empty array');
  }

  const requested = new Map(); // bookId -> quantity (duplicates merged)
  for (const item of b.items) {
    if (typeof item?.bookId !== 'string' || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
      throw new HttpError(400, 'Each item needs a bookId and a quantity between 1 and 99');
    }
    requested.set(item.bookId, (requested.get(item.bookId) || 0) + item.quantity);
  }

  const result = await withTransaction(async (client) => {
    const { rows: users } = await client.query('SELECT * FROM users WHERE id = $1 FOR UPDATE', [userId]);
    if (!users.length) throw new HttpError(404, 'User not found');

    const { rows: addrs } = await client.query(
      'SELECT * FROM addresses WHERE id = $1 AND user_id = $2',
      [addressId, userId]
    );
    if (!addrs.length) throw new HttpError(400, 'Delivery address not found');
    const addr = addrs[0];

    if (pointsToRedeem > users[0].gift_points) throw new HttpError(400, 'Not enough gift points');

    const ids = [...requested.keys()];
    // Ordered locking avoids deadlocks between concurrent orders.
    const { rows: books } = await client.query(
      'SELECT * FROM books WHERE id = ANY($1) ORDER BY id FOR UPDATE',
      [ids]
    );
    if (books.length !== ids.length) throw new HttpError(400, 'One or more books no longer exist');

    let subtotal = 0;
    for (const book of books) {
      const qty = requested.get(book.id);
      if (book.stock < qty) {
        throw new HttpError(409, `Only ${book.stock} copies of "${book.title}" left in stock`);
      }
      subtotal += book.price * qty;
    }
    subtotal = round2(subtotal);

    const discount = round2(Math.min(pointsToRedeem * POINT_VALUE, subtotal));
    const taxable = Math.max(0, subtotal - discount);
    const tax = round2(taxable * TAX_RATE);
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
    const total = round2(taxable + tax + shippingFee);
    const pointsEarned = Math.round(total);

    const { rows: seq } = await client.query("SELECT nextval('order_number_seq') AS n");
    const orderId = 'ORD-' + seq[0].n;
    const deliveryAddress = {
      fullName: addr.full_name,
      street: addr.street,
      city: `${addr.city}, ${addr.state} ${addr.zip_code}`,
      phone: addr.phone,
    };

    await client.query(
      `INSERT INTO orders (id, user_id, status, subtotal, discount_from_points, points_redeemed,
                           points_earned, shipping_fee, tax, total, payment_method,
                           delivery_address, tentative_delivery)
       VALUES ($1,$2,'Processing',$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [orderId, userId, subtotal, discount, pointsToRedeem, pointsEarned, shippingFee, tax, total,
       paymentMethod, JSON.stringify(deliveryAddress), getTentativeDeliveryDate(2)]
    );

    for (const book of books) {
      const qty = requested.get(book.id);
      await client.query(
        `INSERT INTO order_items (order_id, book_id, title, author, price, quantity, cover, delivery_date)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [orderId, book.id, book.title, book.author, book.price, qty, book.cover,
         getTentativeDeliveryDate(book.delivery_days)]
      );
      await client.query('UPDATE books SET stock = stock - $1 WHERE id = $2', [qty, book.id]);
    }

    const { rows: updated } = await client.query(
      'UPDATE users SET gift_points = gift_points - $1 + $2 WHERE id = $3 RETURNING *',
      [pointsToRedeem, pointsEarned, userId]
    );

    const [order] = await fetchOrders(client, 'id = $1', [orderId]);
    return { order, user: toUser(updated[0]) };
  });
  res.status(201).json(result);
});

app.post('/api/orders/:orderId/cancel', async (req, res) => {
  const userId = requireString(req.body?.userId, 'userId');
  const result = await withTransaction(async (client) => {
    const { rows } = await client.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2 FOR UPDATE',
      [req.params.orderId, userId]
    );
    if (!rows.length) throw new HttpError(404, 'Order not found');
    const order = rows[0];
    if (order.status !== 'Processing') {
      throw new HttpError(409, `A ${order.status.toLowerCase()} order cannot be cancelled`);
    }
    const hoursElapsed = (Date.now() - order.created_at.getTime()) / 36e5;
    if (hoursElapsed > CANCEL_WINDOW_HOURS) {
      throw new HttpError(409, `Cancellation window (${CANCEL_WINDOW_HOURS} hours) has expired for this order.`);
    }

    await client.query("UPDATE orders SET status = 'Cancelled' WHERE id = $1", [order.id]);
    // Put the stock back.
    await client.query(
      `UPDATE books b SET stock = b.stock + oi.quantity
       FROM order_items oi WHERE oi.order_id = $1 AND oi.book_id = b.id`,
      [order.id]
    );
    // Give back redeemed points and take back the points the order earned.
    const { rows: users } = await client.query(
      'UPDATE users SET gift_points = GREATEST(0, gift_points + $1 - $2) WHERE id = $3 RETURNING *',
      [order.points_redeemed, order.points_earned, userId]
    );
    const [updatedOrder] = await fetchOrders(client, 'id = $1', [order.id]);
    return { order: updatedOrder, user: toUser(users[0]) };
  });
  res.json(result);
});

app.use('/api', (_req, _res, next) => next(new HttpError(404, 'Not found')));

app.use((err, _req, res, _next) => {
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' });
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`PageTurn API listening on http://localhost:${port}`));
