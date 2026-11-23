import { readFileSync } from 'node:fs';
import pg from 'pg';
import { connectionConfig, pool } from './db.js';
import {
  INITIAL_BOOKS,
  INITIAL_USER,
  INITIAL_ORDERS,
} from '../src/data/booksData.js';

// Creates the database if needed, applies schema.sql and loads the demo data.
// Safe to run repeatedly: existing rows are left untouched.

const ensureDatabase = async () => {
  const { database } = connectionConfig;
  if (!/^\w+$/.test(database)) throw new Error(`Invalid PGDATABASE name: ${database}`);

  const admin = new pg.Client({ ...connectionConfig, database: 'postgres' });
  await admin.connect();
  try {
    const { rowCount } = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [database]);
    if (!rowCount) {
      await admin.query(`CREATE DATABASE "${database}"`);
      console.log(`Created database "${database}"`);
    }
  } finally {
    await admin.end();
  }
};

const seed = (client) => client.query('BEGIN').then(async () => {
  for (const b of INITIAL_BOOKS) {
    await client.query(
      `INSERT INTO books (id, title, author, publisher, category, price, original_price, rating,
                          reviews_count, cover, description, pages, language, isbn, stock,
                          points_awarded, delivery_days, badge, featured, related_ids)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
       ON CONFLICT (id) DO NOTHING`,
      [b.id, b.title, b.author, b.publisher, b.category, b.price, b.originalPrice ?? null,
       b.rating ?? null, b.reviewsCount ?? 0, b.cover, b.description, b.pages, b.language,
       b.isbn, b.stock, b.pointsAwarded ?? 0, b.deliveryDays ?? 2, b.badge ?? null,
       !!b.featured, b.relatedIds ?? []]
    );
  }

  const u = INITIAL_USER;
  await client.query(
    `INSERT INTO users (id, name, email, avatar, gift_points)
     VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING`,
    [u.id, u.name, u.email, u.avatar, u.giftPoints]
  );

  for (const a of u.addresses) {
    await client.query(
      `INSERT INTO addresses (id, user_id, title, full_name, street, city, state, zip_code,
                              country, phone, is_default)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (id) DO NOTHING`,
      [a.id, u.id, a.title, a.fullName, a.street, a.city, a.state, a.zipCode, a.country,
       a.phone, a.isDefault]
    );
  }

  for (const o of INITIAL_ORDERS) {
    const { rowCount } = await client.query(
      `INSERT INTO orders (id, user_id, created_at, status, subtotal, discount_from_points,
                           points_redeemed, points_earned, shipping_fee, tax, total,
                           payment_method, delivery_address, tentative_delivery)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) ON CONFLICT (id) DO NOTHING`,
      [o.id, u.id, o.createdAt, o.status, o.subtotal, o.discountFromPoints, o.pointsRedeemed,
       o.pointsEarned, o.shippingFee, o.tax, o.total, o.paymentMethod,
       JSON.stringify(o.deliveryAddress), o.tentativeDelivery]
    );
    if (!rowCount) continue; // already seeded, don't duplicate items
    for (const i of o.items) {
      await client.query(
        `INSERT INTO order_items (order_id, book_id, title, author, price, quantity, cover, delivery_date)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [o.id, i.bookId, i.title, i.author, i.price, i.quantity, i.cover, i.deliveryDate]
      );
    }
  }
  await client.query('COMMIT');
}).catch(async (err) => {
  await client.query('ROLLBACK');
  throw err;
});

try {
  await ensureDatabase();
  await pool.query(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));
  const client = await pool.connect();
  try {
    await seed(client);
  } finally {
    client.release();
  }
  const { rows } = await pool.query(
    `SELECT (SELECT count(*) FROM books) AS books,
            (SELECT count(*) FROM users) AS users,
            (SELECT count(*) FROM orders) AS orders`
  );
  console.log(`Database "${connectionConfig.database}" ready:`, rows[0]);
} catch (err) {
  // Node reports "connection refused" as an AggregateError with an empty message.
  const reasons = (err.errors || [err]).map((e) => e.message || `${e.code} ${e.address || ''}:${e.port || ''}`);
  console.error('Database setup failed:', [...new Set(reasons)].join('; '));
  if (['ECONNREFUSED', 'ENOTFOUND'].includes(err.code) || err.errors?.some((e) => e.code === 'ECONNREFUSED')) {
    console.error(
      `Cannot reach PostgreSQL at ${connectionConfig.host}:${connectionConfig.port}. ` +
        'Start it first (docker compose up -d) or set PGHOST / PGPORT.'
    );
  } else if (err.code === '28P01') {
    console.error('Wrong username or password. Set PGUSER / PGPASSWORD.');
  }
  process.exitCode = 1;
} finally {
  await pool.end();
}
