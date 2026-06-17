# GRACE HOME CANDLES — COMPLETE SETUP GUIDE v3

## How the System Works — The Big Picture

```
Admin Dashboard → Supabase Database → Store Frontend
      ↑                                      ↓
  You add/edit products here        Customers see live updates
  Change prices, add variants,      (no code changes ever needed)
  create bundles — all from browser
```

**You NEVER need to touch code again for:**
- ✅ Adding new products
- ✅ Changing prices (including sale prices)
- ✅ Adding variants (Set of 2, Set of 4, Unscented, etc.)
- ✅ Creating gift bundles
- ✅ Toggling products active/inactive
- ✅ Managing orders and updating statuses
- ✅ Reading contact messages
- ✅ Exporting subscriber lists

---

## PROJECT STRUCTURE

```
grace-home/
├── index.html                    ← Homepage (loads products from Supabase)
├── css/main.css                  ← All styles
├── js/
│   ├── core.js                   ← Cart, Security, Delivery, Supabase, Razorpay
│   └── products.js               ← ProductStore (Supabase-first, fallback included)
├── pages/
│   ├── shop.html                 ← Shop with filter (All/Bestsellers/New/Gift Sets)
│   ├── product.html              ← Product detail with variant selector
│   ├── checkout.html             ← Live shipping calc + Razorpay
│   ├── order-success.html        ← Post-payment confirmation
│   ├── admin.html                ← Admin dashboard (login protected)
│   ├── admin-products.js         ← Product CRUD module (loaded by admin.html)
│   ├── about.html
│   ├── contact.html
│   ├── faq.html
│   ├── gifting.html
│   ├── privacy-policy.html
│   ├── terms.html
│   ├── return-policy.html
│   └── shipping-policy.html
└── supabase-schema.sql           ← Full DB schema + seed data
```

---

## STEP 1 — Supabase Setup

### 1.1 Create Project
1. Go to https://supabase.com → New Project
2. Name: `grace-home-candles`, Region: `ap-south-1` (Mumbai)
3. Save your DB password somewhere safe

### 1.2 Run the Schema
1. Supabase Dashboard → SQL Editor → New Query
2. Paste entire `supabase-schema.sql` → Run
3. You'll see all tables created + seed data for 5 candles + variants + gift sets

### 1.3 Get Your API Keys
Settings → API → copy:
- **Project URL** e.g. `https://abcxyz.supabase.co`
- **anon/public key** (the long `eyJ...` string)

### 1.4 Add Keys to ALL Three Places

**`js/core.js`** (around line 20):
```js
SUPABASE_URL: 'https://wtnkefyyhzyjrlvrtrdg.supabase.co',
SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0bmtlZnl5aHp5anJsdnJ0cmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NTM4OTYsImV4cCI6MjA5NjEyOTg5Nn0.GmNJU0fQX8jgTnb45lkouBYPYEDPzD7l0g0EdRy_3NE',
```

**`pages/admin.html`** (in ADMIN_CONFIG near top of script):
```js
SUPABASE_URL: 'https://wtnkefyyhzyjrlvrtrdg.supabase.co',
SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0bmtlZnl5aHp5anJsdnJ0cmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NTM4OTYsImV4cCI6MjA5NjEyOTg5Nn0.GmNJU0fQX8jgTnb45lkouBYPYEDPzD7l0g0EdRy_3NE',
```

That's it. The entire site now reads from Supabase.

---

## STEP 2 — Razorpay Setup

### 2.1 Get Keys
1. https://razorpay.com → Settings → API Keys
2. Test Mode for development, Live Mode for production

### 2.2 Add Key
**`js/core.js`** (in CONFIG):
```js
RAZORPAY_KEY: 'rzp_test_XXXXXXXXXX',
```

### Test Cards
| Card | CVV | Expiry |
|---|---|---|
| 4111 1111 1111 1111 | Any 3 digits | Any future date |
| 5267 3181 8797 5449 | Any 3 digits | Any future date |

Test UPI: `success@razorpay`

---

## STEP 3 — Admin Dashboard

### Access
URL: `yoursite.com/pages/admin.html`

### Default Login
```
Username: admin
Password: GraceHome@2025
```
⚠️ **Change before going live** — in `pages/admin.html` find `ADMIN_CONFIG`:
```js
USERNAME: 'your_username',
PASSWORD: 'YourStrongPassword123!',
```

### What You Can Do From the Admin

#### Managing Products
1. Go to **Products** tab
2. Click **+ Add Product** or **Edit** on any existing product
3. Fill in the form — 3 tabs: Info, Pricing & Variants, Media & SEO
4. Click Save — changes are live on the store immediately

#### Adding a Variant (e.g. "Set of 4")
1. Edit the product → **Pricing & Variants** tab
2. Click **+ Add Variant**
3. Name: `Scented · Set of 4`
4. Qty: `4`
5. Set Original Price and Sale Price
6. Save

#### Creating an Unscented Version
Same as above:
- Name: `Unscented · Single`
- Select: Unscented
- Price: typically 10–15% lower than scented

#### Hiding a Product (without deleting)
Edit → check/uncheck **Active** → Save

#### Updating a Price
Edit → **Pricing & Variants** tab → change Sale Price → Save

---

## STEP 4 — Variant System Explained

Every single candle can have multiple **variants** in Supabase:

| variant_name | variant_type | quantity | scent_type | price |
|---|---|---|---|---|
| Scented · Single | scent_type | 1 | scented | ₹1,199 |
| Scented · Set of 2 | quantity | 2 | scented | ₹2,199 |
| Scented · Set of 4 | quantity | 4 | scented | ₹3,999 |
| Unscented · Single | scent_type | 1 | unscented | ₹1,049 |
| Unscented · Set of 2 | quantity | 2 | unscented | ₹1,949 |

**On the product page**, customers see buttons to pick their variant. Price updates live. The selected variant is saved to the cart.

---

## STEP 5 — Delivery / Shipping

### Default (no API key needed)
Shipping is calculated from the customer's pincode prefix:

| Zone | Pincodes | Charge |
|---|---|---|
| Local Mumbai/Pune | 40x, 41x | ₹49 |
| Maharashtra/Gujarat | 42x–44x, 36x | ₹79 |
| Delhi/Hyderabad | 50x–58x, 11x–12x | ₹99 |
| South India | 60x–66x | ₹119 |
| East India | 70x–75x | ₹149 |
| Remote/Northeast | 78x, 79x, 97x | ₹199 |

Free shipping auto-applies when order ≥ ₹1999.

### To Change Free Shipping Threshold
`js/core.js` → `CONFIG`:
```js
FREE_SHIP_ABOVE: 1499,  // change to whatever you want
```

### Google Maps Distance-Based Pricing (optional)
1. Get a Google Maps API key (Distance Matrix API)
2. `js/core.js` → `DeliveryEngine`:
```js
const GMAPS_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
```
Now charges are calculated live based on actual km.

---

## STEP 6 — Deployment

### Netlify (recommended — free)
1. Create account at netlify.com
2. Drag the `grace-home/` folder to netlify.com/drop
3. Add custom domain: gracehomecandles.in

**Add `netlify.toml` in root of grace-home/**:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' https://checkout.razorpay.com https://fonts.googleapis.com 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src https://fonts.gstatic.com; img-src 'self' https://images.unsplash.com data: blob:; connect-src 'self' https://*.supabase.co https://api.razorpay.com https://maps.googleapis.com;"
```

### Vercel
```bash
npx vercel --prod
```

---

## STEP 7 — Customisation Checklist

Before going live, find+replace these across all files:

| Placeholder | Replace with |
|---|---|
| `gracehomecandles.in` | Your actual domain |
| `hello@gracehomecandles.in` | Your email |
| `+91 98765 43210` | Your phone |
| `Bandra West, Mumbai` | Your city |
| `400050` | Your warehouse pincode (also in `CONFIG.STORE_PINCODE`) |
| `YOUR_SUPABASE_URL` | Your Supabase project URL |
| `YOUR_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `YOUR_RAZORPAY_KEY_ID` | Your Razorpay Key ID |
| `GraceHome@2025` | Strong admin password |

---

## STEP 8 — Useful Supabase Queries

Run these in Supabase SQL Editor to manage your store:

```sql
-- See all active products with variant count
SELECT p.name, p.sale_price, p.is_active,
  COUNT(v.id) as variant_count
FROM products p
LEFT JOIN product_variants v ON v.product_id = p.id
GROUP BY p.id, p.name, p.sale_price, p.is_active
ORDER BY p.sort_order;

-- Update a product price (e.g. Velvet Vanilla sale price)
UPDATE products SET sale_price = 999 WHERE id = 'velvet-vanilla';

-- Add a new variant manually
INSERT INTO product_variants
  (product_id, variant_name, variant_type, quantity, scent_type, original_price, sale_price, is_default, sort_order)
VALUES
  ('velvet-vanilla', 'Scented · Set of 6', 'quantity', 6, 'scented', 8094, 5999, false, 6);

-- Today's paid orders
SELECT customer_name, customer_email, total, status
FROM orders
WHERE payment_status = 'paid'
AND DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;

-- Monthly revenue
SELECT
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as orders,
  SUM(total) as revenue
FROM orders
WHERE payment_status = 'paid'
GROUP BY 1 ORDER BY 1 DESC;

-- Unread messages
SELECT name, email, subject, created_at
FROM contact_messages
WHERE is_read = FALSE
ORDER BY created_at DESC;
```

---

## FAQ — Common Questions

**Q: I changed a price in the admin but the website still shows the old price.**
A: Make sure you clicked Save and your Supabase keys are correctly configured. The site loads prices fresh from Supabase on every page load.

**Q: Can I have different prices for different quantities without variants?**
A: No — use Variants. Create a variant called "Set of 2" with its own price. The customer picks their option on the product page.

**Q: How do I add a completely new candle?**
A: Admin → Products → + Add Product. Fill in all fields, set it Active. Done. No code changes.

**Q: What if Supabase is down?**
A: The site automatically falls back to the hardcoded product data in `products.js`. Orders will fail (can't save to DB) but products will still display.

**Q: How do I make a gift set appear on the Gifting page?**
A: In the admin, add a product with Type = `gift_set`. It will automatically appear in the Gift Sets filter on the shop page. For the gifting.html page, add it manually to the HTML (or we can build dynamic gifting page — just ask).

**Q: How do I track inventory?**
A: The `stock_count` column exists on products. Currently it's set to 999 (unlimited) for all products. Stock management UI in admin v4 (coming soon — just ask).
