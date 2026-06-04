-- ============================================================
-- GRACE HOME CANDLES — COMPLETE SCHEMA v3
-- Single source of truth. Run full file in Supabase SQL Editor.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ══════════════════════════════════════════════════════════════
-- PRODUCTS (base candles)
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS products (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  type             TEXT NOT NULL DEFAULT 'single'
                   CHECK (type IN ('single','bundle','gift_set')),
  category         TEXT DEFAULT 'scented'
                   CHECK (category IN ('scented','unscented','both')),
  notes            TEXT,
  short_desc       TEXT,
  description      TEXT,
  fragrance_top    TEXT,
  fragrance_mid    TEXT,
  fragrance_base   TEXT,
  burn_time        TEXT,
  size             TEXT DEFAULT '300g',
  wax              TEXT DEFAULT 'Coconut-Soy Blend',
  wick             TEXT DEFAULT 'Cotton Braided',
  original_price   NUMERIC(10,2) NOT NULL,
  sale_price       NUMERIC(10,2) NOT NULL,
  badges           TEXT[]        DEFAULT '{}',
  image            TEXT,
  images           TEXT[]        DEFAULT '{}',
  is_active        BOOLEAN       DEFAULT TRUE,
  is_featured      BOOLEAN       DEFAULT FALSE,
  is_bestseller    BOOLEAN       DEFAULT FALSE,
  stock_count      INTEGER       DEFAULT 999,
  sort_order       INTEGER       DEFAULT 0,
  meta_title       TEXT,
  meta_desc        TEXT,
  created_at       TIMESTAMPTZ   DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════
-- PRODUCT VARIANTS
-- e.g. "Set of 2", "Set of 4", "100g", "300g", "Unscented"
-- Each product can have multiple variants with their own price
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS product_variants (
  id             UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id     TEXT    NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_name   TEXT    NOT NULL,        -- "Set of 2", "300g", "Unscented"
  variant_type   TEXT    NOT NULL         -- "quantity", "size", "scent_type", "bundle"
                 CHECK (variant_type IN ('quantity','size','scent_type','bundle','custom')),
  quantity       INTEGER DEFAULT 1,       -- how many candles in this variant
  size           TEXT,                    -- e.g. "100g", "300g"
  scent_type     TEXT    DEFAULT 'scented'
                 CHECK (scent_type IN ('scented','unscented')),
  original_price NUMERIC(10,2) NOT NULL,
  sale_price     NUMERIC(10,2) NOT NULL,
  sku            TEXT,
  is_active      BOOLEAN DEFAULT TRUE,
  is_default     BOOLEAN DEFAULT FALSE,   -- which variant is selected by default
  sort_order     INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════
-- BUNDLE ITEMS
-- Which products / how many are included in a bundle/set
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS bundle_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bundle_id   TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_id  TEXT NOT NULL REFERENCES products(id),
  quantity    INTEGER NOT NULL DEFAULT 1,
  sort_order  INTEGER DEFAULT 0
);

-- ══════════════════════════════════════════════════════════════
-- ORDERS
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS orders (
  id                UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name     TEXT    NOT NULL,
  customer_email    TEXT    NOT NULL,
  customer_phone    TEXT    NOT NULL,
  shipping_address  JSONB   NOT NULL,
  gift_message      TEXT    DEFAULT '',
  order_notes       TEXT    DEFAULT '',
  subtotal          NUMERIC(10,2) NOT NULL,
  shipping          NUMERIC(10,2) DEFAULT 0,
  shipping_label    TEXT    DEFAULT 'Standard Shipping',
  total             NUMERIC(10,2) NOT NULL,
  status            TEXT    DEFAULT 'pending'
                    CHECK (status IN ('pending','confirmed','processing','dispatched','delivered','cancelled','refunded')),
  payment_status    TEXT    DEFAULT 'pending'
                    CHECK (payment_status IN ('pending','paid','failed','refunded')),
  payment_id        TEXT,
  razorpay_order_id TEXT,
  tracking_number   TEXT,
  courier           TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════
-- ORDER ITEMS  (stores variant info too)
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS order_items (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   TEXT NOT NULL,
  product_name TEXT NOT NULL,
  variant_id   UUID,                 -- which variant was ordered
  variant_name TEXT,                 -- e.g. "Set of 2 · Scented"
  price        NUMERIC(10,2) NOT NULL,
  quantity     INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 50),
  subtotal     NUMERIC(10,2) NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════
-- CONTACT MESSAGES
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT FALSE,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════
-- NEWSLETTER SUBSCRIBERS
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           TEXT UNIQUE NOT NULL,
  is_active       BOOLEAN DEFAULT TRUE,
  subscribed_at   TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- ══════════════════════════════════════════════════════════════
-- DELIVERY ZONES (admin-configurable shipping rates)
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS delivery_zones (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_name        TEXT NOT NULL,
  pincode_prefixes TEXT[] NOT NULL,
  charge           NUMERIC(6,2) NOT NULL,
  label            TEXT NOT NULL,
  est_days         TEXT,
  is_active        BOOLEAN DEFAULT TRUE,
  sort_order       INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ══════════════════════════════════════════════════════════════
ALTER TABLE products             ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants     ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders               ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages     ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones       ENABLE ROW LEVEL SECURITY;

-- Public reads
CREATE POLICY "Public read active products"
  ON products FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public read active variants"
  ON product_variants FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public read bundle items"
  ON bundle_items FOR SELECT USING (TRUE);

CREATE POLICY "Public read delivery zones"
  ON delivery_zones FOR SELECT USING (is_active = TRUE);

-- Public inserts
CREATE POLICY "Anyone can create order"
  ON orders FOR INSERT WITH CHECK (total > 0 AND customer_name IS NOT NULL);

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT WITH CHECK (quantity > 0 AND price > 0);

CREATE POLICY "Anyone can update order payment"
  ON orders FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Anyone can submit contact"
  ON contact_messages FOR INSERT
  WITH CHECK (length(message) >= 10 AND length(message) <= 1000);

CREATE POLICY "Anyone can subscribe"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Admin writes (use service_role key from server-side / admin dashboard)
-- products: admin insert/update/delete via service_role bypasses RLS
-- For anon key-based admin (this dashboard), we add permissive policies:
CREATE POLICY "Admin can manage products"
  ON products FOR ALL USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Admin can manage variants"
  ON product_variants FOR ALL USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Admin can manage bundles"
  ON bundle_items FOR ALL USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Admin can read orders"
  ON orders FOR SELECT USING (TRUE);

CREATE POLICY "Admin can read order items"
  ON order_items FOR SELECT USING (TRUE);

CREATE POLICY "Admin can read messages"
  ON contact_messages FOR SELECT USING (TRUE);

CREATE POLICY "Admin can update messages"
  ON contact_messages FOR UPDATE USING (TRUE);

CREATE POLICY "Admin can read subscribers"
  ON newsletter_subscribers FOR SELECT USING (TRUE);

CREATE POLICY "Admin can manage delivery zones"
  ON delivery_zones FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- ══════════════════════════════════════════════════════════════
-- INDEXES
-- ══════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_products_active    ON products (is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_products_featured  ON products (is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_variants_product   ON product_variants (product_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_variants_active    ON product_variants (product_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_bundle_items       ON bundle_items (bundle_id);
CREATE INDEX IF NOT EXISTS idx_orders_status      ON orders (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_email       ON orders (customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_payment     ON orders (payment_id) WHERE payment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_order_items_order  ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_contact_unread     ON contact_messages (is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_email   ON newsletter_subscribers (email);

-- ══════════════════════════════════════════════════════════════
-- UPDATED_AT TRIGGER
-- ══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ══════════════════════════════════════════════════════════════
-- SEED: BASE PRODUCTS
-- ══════════════════════════════════════════════════════════════
INSERT INTO products (id,name,type,category,notes,short_desc,description,fragrance_top,fragrance_mid,fragrance_base,
  burn_time,original_price,sale_price,badges,image,images,is_active,is_featured,is_bestseller,sort_order)
VALUES
('velvet-vanilla','Velvet Vanilla','single','scented',
 'Tahitian Vanilla · Warm Musk · Amber','Enveloping and intimate, like cashmere on skin.',
 'A luxurious depth of pure Tahitian vanilla harmonises with warm amber and whispered musk.',
 'Madagascar Vanilla','Warm Amber','White Musk & Sandalwood','60–70 hours',
 1499,1199,ARRAY['Bestseller'],
 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=800&q=85',
 ARRAY['https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=800&q=85'],
 TRUE,TRUE,TRUE,1),

('midnight-oud','Midnight Oud','single','scented',
 'Aged Oud · Dark Rose · Patchouli','The scent of velvet dusk and ancient wood.',
 'Rare aged oud meets the shadow of dark rose petals, grounded in deep patchouli and cedarwood.',
 'Saffron & Black Pepper','Dark Rose & Oud','Patchouli & Cedarwood','65–75 hours',
 1799,1499,ARRAY['Bestseller','New'],
 'https://images.unsplash.com/photo-1608181831718-6b9c7e1bda9f?w=800&q=85',
 ARRAY['https://images.unsplash.com/photo-1608181831718-6b9c7e1bda9f?w=800&q=85'],
 TRUE,TRUE,TRUE,2),

('cashmere-rose','Cashmere Rose','single','scented',
 'Centifolia Rose · Cashmere Wood · Peony','Infinitely feminine. Quietly powerful.',
 'A bouquet of centifolia rose at full bloom, softened by cashmere wood and the tender blush of peony.',
 'Pink Peony & Bergamot','Centifolia Rose','Cashmere Wood & Vanilla','60–70 hours',
 1699,1349,ARRAY['New'],
 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=85',
 ARRAY['https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=85'],
 TRUE,TRUE,FALSE,3),

('amber-sandalwood','Amber Sandalwood','single','scented',
 'Mysore Sandalwood · Golden Amber · Vetiver','Sun-warmed skin and sacred wood.',
 'The richness of Mysore sandalwood married with golden amber resin and earthy vetiver.',
 'Bergamot & Cardamom','Mysore Sandalwood & Amber','Vetiver & Tonka Bean','70–80 hours',
 1699,1299,ARRAY['Bestseller'],
 'https://images.unsplash.com/photo-1543342384-1f1350e27861?w=800&q=85',
 ARRAY['https://images.unsplash.com/photo-1543342384-1f1350e27861?w=800&q=85'],
 TRUE,FALSE,TRUE,4),

('lavender-silk','Lavender Silk','single','scented',
 'Provençal Lavender · White Tea · Musk','The art of doing nothing, beautifully.',
 'Fields of Provençal lavender drift over delicate white tea and a barely-there silk musk.',
 'Lavender & Eucalyptus','White Tea & Iris','Silk Musk & Cedarwood','55–65 hours',
 1499,1149,ARRAY['New'],
 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=85',
 ARRAY['https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=85'],
 TRUE,FALSE,FALSE,5)
ON CONFLICT (id) DO NOTHING;

-- ══════════════════════════════════════════════════════════════
-- SEED: VARIANTS for each product
-- Scented Single → Set of 2 → Set of 4 | Unscented Single → Set of 2
-- ══════════════════════════════════════════════════════════════
INSERT INTO product_variants
  (product_id, variant_name, variant_type, quantity, scent_type, original_price, sale_price, is_default, sort_order)
SELECT
  p.id,
  v.variant_name,
  v.variant_type,
  v.quantity,
  v.scent_type,
  ROUND((p.original_price * v.price_mult)::NUMERIC, -1),
  ROUND((p.sale_price    * v.price_mult)::NUMERIC, -1),
  v.is_default,
  v.sort_order
FROM products p
CROSS JOIN (VALUES
  ('Scented · Single',   'scent_type', 1, 'scented',   1.0,  TRUE,  1),
  ('Scented · Set of 2', 'quantity',   2, 'scented',   1.85, FALSE, 2),
  ('Scented · Set of 4', 'quantity',   4, 'scented',   3.50, FALSE, 3),
  ('Unscented · Single', 'scent_type', 1, 'unscented', 0.90, FALSE, 4),
  ('Unscented · Set of 2','quantity',  2, 'unscented', 1.65, FALSE, 5)
) AS v(variant_name, variant_type, quantity, scent_type, price_mult, is_default, sort_order)
WHERE p.type = 'single'
ON CONFLICT DO NOTHING;

-- ══════════════════════════════════════════════════════════════
-- SEED: BUNDLE PRODUCTS (Gift Sets)
-- ══════════════════════════════════════════════════════════════
INSERT INTO products (id,name,type,category,notes,short_desc,description,burn_time,original_price,sale_price,
  badges,image,images,is_active,is_featured,sort_order)
VALUES
('gift-duo','The Signature Duo','gift_set','both',
 'Velvet Vanilla + Cashmere Rose','Two of our most-loved fragrances in one luxury box.',
 'Two bestselling Grace Home candles nestled in our signature champagne gift box with a handwritten note.',
 '60–70 hours each',2698,2199,ARRAY['Gift Set'],
 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=800&q=85',
 ARRAY['https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=800&q=85'],
 TRUE,TRUE,10),

('gift-complete','The Complete Set','gift_set','both',
 'All 5 Signature Fragrances','The ultimate Grace Home experience.',
 'All five signature candles in one grand presentation box. The perfect celebration gift.',
 '55–80 hours each',6745,5499,ARRAY['Gift Set','Most Gifted'],
 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=800&q=85',
 ARRAY['https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=800&q=85'],
 TRUE,TRUE,11),

('gift-evening','The Evening Ritual','gift_set','scented',
 'Midnight Oud + Lavender Silk','From dusk to sleep — a complete evening ritual.',
 'Two candles curated for the evening — bold Midnight Oud to open, and calming Lavender Silk to close.',
 '55–75 hours each',3298,2899,ARRAY['Gift Set','New'],
 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=85',
 ARRAY['https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=85'],
 TRUE,FALSE,12)
ON CONFLICT (id) DO NOTHING;

-- Bundle composition
INSERT INTO bundle_items (bundle_id, product_id, quantity, sort_order) VALUES
  ('gift-duo',      'velvet-vanilla',    1, 1),
  ('gift-duo',      'cashmere-rose',     1, 2),
  ('gift-complete', 'velvet-vanilla',    1, 1),
  ('gift-complete', 'midnight-oud',      1, 2),
  ('gift-complete', 'cashmere-rose',     1, 3),
  ('gift-complete', 'amber-sandalwood',  1, 4),
  ('gift-complete', 'lavender-silk',     1, 5),
  ('gift-evening',  'midnight-oud',      1, 1),
  ('gift-evening',  'lavender-silk',     1, 2)
ON CONFLICT DO NOTHING;

-- ══════════════════════════════════════════════════════════════
-- SEED: DELIVERY ZONES
-- ══════════════════════════════════════════════════════════════
INSERT INTO delivery_zones (zone_name, pincode_prefixes, charge, label, est_days, sort_order) VALUES
  ('Local – Mumbai & Pune',     ARRAY['40','41'],               49,  'Local Delivery',         '1–2 days', 1),
  ('Regional – Maharashtra/GJ', ARRAY['42','43','36','44','39'],79,  'Regional Shipping',      '2–3 days', 2),
  ('National – Delhi/Hyd',      ARRAY['50','51','56','57','58','11','12','16'],99,'Standard Shipping','3–4 days',3),
  ('South India',               ARRAY['60','61','62','63','64','65'],119,'Standard Shipping',   '3–5 days', 4),
  ('East India',                ARRAY['70','71','72','73','74'], 149, 'Long Distance',          '4–5 days', 5),
  ('Pan-India / Remote',        ARRAY['78','79','83','97'],      199, 'Pan-India Remote',       '5–7 days', 6)
ON CONFLICT DO NOTHING;
