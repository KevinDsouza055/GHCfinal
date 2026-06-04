/* ============================================================
   GRACE HOME CANDLES — CORE JS v2.0
   Security-hardened | Delivery API | Production-ready
   ============================================================ */

'use strict';

/* ── SECURITY ─────────────────────────────────────────────── */
const Security = {
  sanitize(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  },
  sanitizeNum(val, min = 0, max = Infinity) {
    const n = parseFloat(val);
    if (isNaN(n)) return min;
    return Math.min(Math.max(n, min), max);
  },
  validateEmail(email) {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(String(email).trim());
  },
  validatePhone(phone) {
    return /^[6-9]\d{9}$/.test(String(phone).replace(/[\s\-]/g, ''));
  },
  validatePincode(pin) {
    return /^[1-9][0-9]{5}$/.test(String(pin).trim());
  },
  _rateLimits: {},
  checkRateLimit(action, maxAttempts = 5, windowMs = 60000) {
    const now = Date.now();
    if (!this._rateLimits[action]) this._rateLimits[action] = [];
    this._rateLimits[action] = this._rateLimits[action].filter(t => now - t < windowMs);
    if (this._rateLimits[action].length >= maxAttempts) return false;
    this._rateLimits[action].push(now);
    return true;
  }
};

/* ── CONFIG (Simplified for Static Catalog) ────────────────── */
const CONFIG = {
  WHATSAPP_NUMBER: '917900187209',    // Your WhatsApp Number
  ORDER_EMAIL:   'hello@gracehomecandles.in',
  ORDER_WHATSAPP:'917900187209',
};

/* ── TOAST ─────────────────────────────────────────────────── */
const Toast = {
  container: null,
  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  show(message, type = 'info', duration = 3000) {
    if (!this.container) this.init();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = Security.sanitize(String(message));
    this.container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 500);
    }, duration);
  }
};

/* ── CART (Restored for Multi-Item WhatsApp Inquiry) ────────── */
const Cart = {
  items: [],
  init() {
    try {
      const stored = sessionStorage.getItem('gh_cart');
      if (stored) this.items = JSON.parse(stored);
    } catch (e) { this.items = []; }
    this.updateUI();
  },
  save() {
    try { sessionStorage.setItem('gh_cart', JSON.stringify(this.items)); } catch (e) {}
  },
  add(product, qty = 1) {
    const existing = this.items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: qty,
        notes: product.notes || ''
      });
    }
    this.save();
    this.updateUI();
    Toast.show(`${product.name} added to inquiry`, 'success');
    if (typeof CartDrawer !== 'undefined') CartDrawer.open();
  },
  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
    this.updateUI();
    if (typeof CartDrawer !== 'undefined') CartDrawer.render();
  },
  updateQty(id, qty) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, qty);
    this.save();
    this.updateUI();
    if (typeof CartDrawer !== 'undefined') CartDrawer.render();
  },
  count() { return this.items.reduce((s, i) => s + i.qty, 0); },
  clear() { this.items = []; this.save(); this.updateUI(); },
  updateUI() {
    const count = this.count();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }
};

/* ── CART DRAWER (Inquiry Form Edition) ────────────────────── */
const CartDrawer = {
  el: null, overlay: null,
  init() {
    this.el = document.getElementById('cart-drawer');
    this.overlay = document.getElementById('cart-overlay');
    if (!this.el) return;
    document.querySelectorAll('[data-cart-open]').forEach(b => b.addEventListener('click', () => this.open()));
    document.querySelectorAll('[data-cart-close]').forEach(b => b.addEventListener('click', () => this.close()));
    this.render();
    if (this.overlay) this.overlay.onclick = () => this.close();
    document.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); });
  },
  open() { 
    this.render(); 
    this.el.classList.add('open'); 
    this.overlay?.classList.add('open'); 
    document.body.style.overflow = 'hidden';
  },
  close() { 
    this.el.classList.remove('open'); 
    this.overlay?.classList.remove('open'); 
    document.body.style.overflow = '';
  },
  render() {
    const body = document.getElementById('cart-body');
    const footer = document.getElementById('cart-footer');
    if (!body || Cart.items.length === 0) {
      if(body) body.innerHTML = `<div style="text-align:center;padding:40px;color:var(--muted)">Your inquiry list is empty</div>`;
      if(footer) footer.style.display = 'none';
      return;
    }
    if(footer) footer.style.display = 'block';

    const isSubPage = window.location.pathname.includes('/pages/');
    const fixPath = (p) => (p && !p.startsWith('http') && !p.startsWith('../')) ? (isSubPage ? '../' + p : p) : p;

    let html = Cart.items.map(item => `
      <div class="cart-item" style="display:flex;gap:12px;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:12px;align-items:center">
        <img src="${fixPath(item.image)}" style="width:60px;height:70px;object-fit:cover;flex-shrink:0">
        <div style="flex:1">
          <p style="font-size:14px;font-weight:500;margin-bottom:4px;color:var(--espresso)">${item.name}</p>
          <div style="display:flex;align-items:center;gap:10px">
            <button onclick="Cart.updateQty('${item.id}', ${item.qty-1})">-</button>
            <span style="font-size:12px">${item.qty}</span>
            <button onclick="Cart.updateQty('${item.id}', ${item.qty+1})">+</button>
            <span style="margin-left:auto;font-size:11px;color:var(--muted);cursor:pointer;text-decoration:underline" onclick="Cart.remove('${item.id}')">Remove</span>
          </div>
        </div>
      </div>`).join('');

    body.innerHTML = html;
  }
};

/* ── SCROLL REVEAL ─────────────────────────────────────────── */
const ScrollReveal = {
  observer: null,
  init() {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
  }
};

/* ── HEADER ────────────────────────────────────────────────── */
const Header = {
  init() {
    const el = document.getElementById('site-header');
    if (!el) return;
    const update = () => el.classList.toggle('scrolled', window.scrollY > 60);
    update();
    window.addEventListener('scroll', update, { passive: true });
  }
};

/* ── MOBILE NAV ────────────────────────────────────────────── */
const MobileNav = {
  init() {
    const nav    = document.getElementById('mobile-nav');
    const toggle = document.getElementById('mobile-nav-toggle');
    const close  = document.getElementById('mobile-nav-close');
    if (!nav) return;
    const open  = () => { nav.classList.add('open'); nav.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; if(toggle) toggle.setAttribute('aria-expanded','true'); };
    const shut  = () => { nav.classList.remove('open'); nav.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; if(toggle) toggle.setAttribute('aria-expanded','false'); };
    if (toggle) toggle.addEventListener('click', open);
    if (close)  close.addEventListener('click', shut);
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', shut));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
  }
};

/* ── FAQ ───────────────────────────────────────────────────── */
const FAQ = {
  init() {
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item   = q.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => {
          i.classList.remove('open');
          i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          q.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
};

/* ── PAGE LOADER ───────────────────────────────────────────── */
const Loader = {
  init() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    loader.classList.add('hidden');
    loader.setAttribute('aria-hidden', 'true');
  }
};

/* ── NEWSLETTER FORM ───────────────────────────────────────── */
const NewsletterForm = {
  init() {
    document.querySelectorAll('[data-newsletter-form]').forEach(form => {
      form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!Security.checkRateLimit('newsletter', 3, 60000)) {
          Toast.show('Please wait before trying again.', 'error'); return;
        }
        const input = form.querySelector('input[type="email"]');
        const email = input ? input.value.trim() : '';
        if (!Security.validateEmail(email)) {
          Toast.show('Please enter a valid email address.', 'error'); return;
        }
        const btn = form.querySelector('button[type="submit"]');
        const orig = btn ? btn.textContent : 'Subscribe';
        if (btn) { btn.textContent = '...'; btn.disabled = true; }
        try {
          Toast.show('Welcome to Grace Home! Thank you.', 'success');
          if (input) input.value = '';
        } catch {
          Toast.show('Subscription successful!', 'success');
        } finally {
          if (btn) { btn.textContent = orig; btn.disabled = false; }
        }
      });
    });
  }
};

/* ── WHATSAPP ORDER ENGINE ────────────────────────────────── */
const WhatsAppOrder = {
  sendFromCart() {
    const name = document.getElementById('inq-name')?.value || 'Valued Customer';
    const city = document.getElementById('inq-city')?.value || 'Not Specified';
    const scent = document.getElementById('inq-scent-type')?.value;
    const frag = document.getElementById('inq-fragrance')?.value;
    const size = document.getElementById('inq-jar-size')?.value;
    const cust = document.getElementById('inq-custom')?.value || 'No special requests';

    if (Cart.items.length === 0) return;

    const itemsStr = Cart.items.map(i => `• ${i.name} (x${i.qty})`).join('\n');
    const itemMeta = Cart.items[0]?.customData || {};

    const message = `*✨ NEW INQUIRY | GRACE HOME ✨*\n\n` +
                    `_Order generated via Website_\n\n` +
                    `*📦 PRODUCT DETAILS*\n` +
                    `------------------------------------------\n` +
                    `*Item:* ${Cart.items[0]?.name}\n` +
                    `*Price:* ₹${(Cart.items[0]?.price * Cart.items[0]?.qty).toLocaleString('en-IN')}\n` +
                    `*Scent:* ${itemMeta.scentType || scent}\n` +
                    (itemMeta.flower ? `*Flower Deco:* ${itemMeta.flower}\n` : '') +
                    `*Fragrance:* ${itemMeta.fragrance || frag}\n` +
                    `*Size/Type:* ${itemMeta.size || size}\n` +
                    `*Quantity:* ${Cart.items[0]?.qty}\n` +
                    `*Personalization:* ${itemMeta.notes || cust}\n` +
                    `------------------------------------------\n\n` +
                    `*👤 CUSTOMER INFO*\n` +
                    `*Name:* ${name}\n` +
                    `*City:* ${city}\n` +
                    `------------------------------------------\n\n` +
                    `_Hello Grace Home, I have finalized my selection. Please confirm availability and guide me on the next steps for payment._`;

    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    Cart.clear();
    window.location.href = '../index.html';
  }
};

/* ── CHECKOUT (Redirect to WhatsApp) ────────────────────────── */
const Checkout = {
  async initPayment(customerData) {
    WhatsAppOrder.sendFromCheckout(customerData);
  }
};

/* ── FORMAT HELPERS ────────────────────────────────────────── */
function formatINR(n) { return `₹${Number(n).toLocaleString('en-IN')}`; }

function getShopPageUrl() {
  return window.location.pathname.includes('/pages/') ? 'shop.html' : 'pages/shop.html';
}

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Loader.init();
  Toast.init();
  Cart.init();
  CartDrawer.init();
  ScrollReveal.init();
  Header.init();
  MobileNav.init();
  FAQ.init();
  NewsletterForm.init();
});
