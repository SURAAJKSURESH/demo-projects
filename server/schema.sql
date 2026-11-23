CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  avatar      TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  gift_points INTEGER NOT NULL DEFAULT 0 CHECK (gift_points >= 0)
);

CREATE TABLE IF NOT EXISTS addresses (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL DEFAULT 'Home',
  full_name  TEXT NOT NULL,
  street     TEXT NOT NULL,
  city       TEXT NOT NULL,
  state      TEXT NOT NULL,
  zip_code   TEXT NOT NULL,
  country    TEXT NOT NULL DEFAULT 'United States',
  phone      TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS addresses_user_idx ON addresses (user_id);

CREATE TABLE IF NOT EXISTS books (
  id             TEXT PRIMARY KEY,
  title          TEXT NOT NULL,
  author         TEXT NOT NULL,
  publisher      TEXT NOT NULL,
  category       TEXT NOT NULL,
  price          NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  original_price NUMERIC(10,2),
  rating         NUMERIC(3,1),
  reviews_count  INTEGER NOT NULL DEFAULT 0,
  cover          TEXT,
  description    TEXT,
  pages          INTEGER,
  language       TEXT,
  isbn           TEXT,
  stock          INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  points_awarded INTEGER NOT NULL DEFAULT 0,
  delivery_days  INTEGER NOT NULL DEFAULT 2,
  badge          TEXT,
  featured       BOOLEAN NOT NULL DEFAULT FALSE,
  related_ids    TEXT[] NOT NULL DEFAULT '{}'
);

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 100000;

CREATE TABLE IF NOT EXISTS orders (
  id                   TEXT PRIMARY KEY,
  user_id              TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  status               TEXT NOT NULL DEFAULT 'Processing'
                       CHECK (status IN ('Processing', 'Delivered', 'Cancelled')),
  subtotal             NUMERIC(10,2) NOT NULL,
  discount_from_points NUMERIC(10,2) NOT NULL DEFAULT 0,
  points_redeemed      INTEGER NOT NULL DEFAULT 0,
  points_earned        INTEGER NOT NULL DEFAULT 0,
  shipping_fee         NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax                  NUMERIC(10,2) NOT NULL DEFAULT 0,
  total                NUMERIC(10,2) NOT NULL,
  payment_method       TEXT NOT NULL,
  delivery_address     JSONB NOT NULL,
  tentative_delivery   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS orders_user_idx ON orders (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  id            SERIAL PRIMARY KEY,
  order_id      TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  book_id       TEXT NOT NULL REFERENCES books(id),
  title         TEXT NOT NULL,
  author        TEXT NOT NULL,
  price         NUMERIC(10,2) NOT NULL,
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  cover         TEXT,
  delivery_date TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items (order_id);
