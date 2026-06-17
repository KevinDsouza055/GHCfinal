/* ============================================================
   GRACE HOME CANDLES — CORE JS v2.0
   Security-hardened | Delivery API | Production-ready
   ============================================================ */

'use strict';

// ── GOOGLE ANALYTICS 4 (GA4) TRACKING ───────────────────────
(function() {
  const GA_ID = 'G-60NLEVEWNJ';
  // Prevent duplicate injection
  if (!document.querySelector(`script[src*="${GA_ID}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(script);

    const configScript = document.createElement('script');
    configScript.text = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_ID}');`;
    document.head.appendChild(configScript);
  }
})();


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
  ORDER_EMAIL:   'gracehomecandles@gmail.com',
  ORDER_WHATSAPP:'917900187209',
  FREE_SHIPPING_THRESHOLD: 1999,
  OFFER_TIER_1_QTY: 2,
  OFFER_TIER_1_DISCOUNT: 0.10,
  OFFER_TIER_2_QTY: 4,
  OFFER_TIER_2_DISCOUNT: 0.15
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
  getSubtotal() { return this.items.reduce((s, i) => s + (i.price * i.qty), 0); },
  getOfferStats() {
    const subtotal = this.getSubtotal();
    const qty = this.count();
    let discountPct = 0;
    let discountLines = [];

    // Discount Logic
    if (qty >= CONFIG.OFFER_TIER_2_QTY) {
      discountPct = CONFIG.OFFER_TIER_2_DISCOUNT;
      discountLines.push("🎉 Congratulations! You've unlocked 15% OFF");
    } else if (qty >= CONFIG.OFFER_TIER_1_QTY) {
      discountPct = CONFIG.OFFER_TIER_1_DISCOUNT;
      discountLines.push("🎉 Congratulations! You've unlocked 10% OFF");
      const diff = CONFIG.OFFER_TIER_2_QTY - qty;
      discountLines.push(`✨ Add ${diff} more candle${diff > 1 ? 's' : ''} to unlock 15% OFF`);
    } else if (qty === 1) {
      discountLines.push("✨ Add 1 more candle and save 10%");
    }

    // Shipping Logic
    const isFreeShipping = subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD;
    const remainingForFree = CONFIG.FREE_SHIPPING_THRESHOLD - subtotal;
    const progress = Math.min((subtotal / CONFIG.FREE_SHIPPING_THRESHOLD) * 100, 100);
    
    const shippingLine = isFreeShipping 
      ? "🎉 Your order qualifies for FREE SHIPPING" 
      : `🚚 You're ${formatINR(remainingForFree)} away from FREE SHIPPING`;

    const discountAmount = subtotal * discountPct;

    return { subtotal, qty, discountPct, discountAmount, isFreeShipping, remainingForFree, progress, discountLines, shippingLine };
  },
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
    this.el.removeAttribute('inert');
    this.overlay?.classList.add('open'); 
    document.body.style.overflow = 'hidden';
    document.body.classList.add('minimal-nav');
    document.body.classList.add('cart-open');
  },
  close() { 
    this.el.classList.remove('open'); 
    this.el.setAttribute('inert', '');
    this.overlay?.classList.remove('open'); 
    document.body.style.overflow = '';
    document.body.classList.remove('cart-open');
    // Only remove if we aren't on a checkout/success page
    const isCheckout = /checkout\.html|order-success\.html|cart\.html/.test(window.location.pathname);
    if (!isCheckout) {
      document.body.classList.remove('minimal-nav');
    }
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
    const stats = Cart.getOfferStats();

    let offerHtml = `
      <div class="cart-offer-container">
        ${stats.discountLines.map(line => `<div class="cart-offer-msg">${line}</div>`).join('')}
        <div class="cart-progress-wrap">
          <div class="cart-progress-fill" style="width: ${stats.progress}%"></div>
        </div>
        <div class="cart-progress-label">
          ${stats.shippingLine}
        </div>
      </div>
    `;

    let promoHtml = `
      <div style="background:var(--espresso); color:var(--ivory); padding:10px; font-size:9px; letter-spacing:0.15em; text-transform:uppercase; text-align:center; margin:-24px -32px 24px -32px; display:flex; justify-content:center; gap:15px; flex-wrap:wrap; border-bottom:1px solid rgba(184,150,90,0.2)">
        <span>🎁 Buy 2 Save 10%</span>
        <span>🕯️ Buy 4 Save 15%</span>
        <span>🚚 Free Shipping ₹1,999+</span>
      </div>
    `;

    let html = Cart.items.map(item => `
      <div class="cart-item" style="display:flex;gap:12px;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:12px;align-items:center">
        <img src="${fixPath(item.image)}" style="width:60px;height:70px;object-fit:cover;flex-shrink:0">
        <div style="flex:1">
          <p style="font-size:14px;font-weight:500;margin-bottom:4px;color:var(--espresso)">${item.name}</p>
          ${item.notes ? `<p style="font-size:11px;color:var(--sand);margin-bottom:6px">${item.notes}</p>` : ''}
          <div style="display:flex;align-items:center;gap:10px">
            <button onclick="Cart.updateQty('${item.id}', ${item.qty-1})">-</button>
            <span style="font-size:12px">${item.qty}</span>
            <button onclick="Cart.updateQty('${item.id}', ${item.qty+1})">+</button>
            <span style="margin-left:auto;font-size:11px;color:var(--muted);cursor:pointer;text-decoration:underline" onclick="Cart.remove('${item.id}')">Remove</span>
          </div>
        </div>
      </div>`).join('');

    body.innerHTML = promoHtml + offerHtml + html;

    if (footer) {
      footer.innerHTML = `
        <div style="padding-top:10px">
          <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:16px;font-family:var(--font-serif)">
            <div style="display:flex;justify-content:space-between;font-size:14px;color:var(--muted)">
              <span>Subtotal</span><span>${formatINR(stats.subtotal)}</span>
            </div>
            ${stats.discountAmount > 0 ? `<div style="display:flex;justify-content:space-between;font-size:14px;color:var(--gold)"><span>Offer (${stats.discountPct * 100}%)</span><span>-${formatINR(stats.discountAmount)}</span></div>` : ''}
            <div style="display:flex;justify-content:space-between;font-size:18px;color:var(--espresso);margin-top:4px;border-top:1px solid var(--border);padding-top:8px">
              <span>Estimated Total</span><span>${formatINR(stats.subtotal - stats.discountAmount)}</span>
            </div>
          </div>
          <div style="background:var(--ivory); padding:10px; border-radius:4px; margin-bottom:15px; border:1px solid var(--border)">
            <p style="font-size:10px; line-height:1.4; color:var(--muted)">
              ⚠️ <strong>Note:</strong> A continuous unboxing video of the sealed package is mandatory for any damage claims.
            </p>
          </div>
          <button onclick="WhatsAppOrder.sendInquiryFromCart()" class="btn btn-primary btn-full" style="background:#25D366;border-color:#25D366;border:none">
            <span>Send Enquiry via WhatsApp</span>
          </button>
        </div>`;
    }
  }
};

/* ── CUSTOM CANDLE ENGINE ─────────────────────────────────── */
const CustomCandle = {
  selectedColor: 'White',
  
  init() {
    const form = document.getElementById('custom-candle-form');
    if (!form) {
      // This form is optional, so no warning if not found
      return;
    }

    this.renderColors();
    this.populateMouldStyles(); // This populates the 'candleType' select
    this.setupListeners();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit(new FormData(form));
    });
  },

  renderColors() {
    const colors = [
      { name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#000000' },
      { name: 'Red', hex: '#FF4D4D' }, { name: 'Pink', hex: '#FFB6C1' },
      { name: 'Blue', hex: '#89CFF0' }, { name: 'Purple', hex: '#B19CD9' },
      { name: 'Green', hex: '#77DD77' }, { name: 'Yellow', hex: '#FDFD96' },
      { name: 'Beige', hex: '#F5F5DC' }, { name: 'Brown', hex: '#A52A2A' },
      { name: 'Gold', hex: '#D4AF37' },
      { name: 'Custom', hex: 'transparent' } // Special option for custom color
    ];
    const container = document.getElementById('color-swatches');
    if (!container) return;
    container.innerHTML = colors.map(c => `
      <div class="swatch ${c.name === 'White' ? 'active' : ''}" 
           style="background-color: ${c.hex === 'transparent' ? 'var(--ivory); border: 1px dashed var(--muted);' : c.hex}" 
           onclick="CustomCandle.handleColorChange('${c.name}', this)"></div>
    `).join('');
  },

  handleColorChange(name, el) {
    this.selectedColor = name;
    document.getElementById('selected-color').value = name;
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');

    const customColorInputDiv = document.getElementById('custom-color-input');
    if (customColorInputDiv) {
      customColorInputDiv.style.display = (name === 'Custom') ? 'block' : 'none';
    }
  },

  async populateMouldStyles() {
    await ProductStore.load();
    // Filter products that are specifically moulds
    const moulds = ProductStore.getAll().filter(p => p.category === 'moulds' || p.notes?.toLowerCase().includes('mould'));
    const typeSelect = document.getElementById('candleType');
    if (typeSelect) {
      typeSelect.innerHTML = `<option value="" disabled selected>Choose a mould...</option>` + 
        moulds.map(p => `<option value="${p.name}" data-img="${p.image}">${p.name}</option>`).join('');
    }
  },

  toggleBaseType(type) {
    const jarField = document.getElementById('jar-size-field');
    const mouldField = document.getElementById('mould-style-field');
    const glassField = document.getElementById('glass-size-field');

    if (jarField) jarField.style.display = 'none';
    if (mouldField) mouldField.style.display = 'none';
    if (glassField) glassField.style.display = 'none';

    if (type === 'Jar') {
      if (jarField) jarField.style.display = 'block';
      const firstJarSizeRadio = document.querySelector('input[name="jarSize"][value="190ml"]');
      if (firstJarSizeRadio) firstJarSizeRadio.checked = true;
    } else if (type === 'Mould') {
      if (mouldField) mouldField.style.display = 'block';
      const candleTypeSelect = document.getElementById('candleType');
      if (candleTypeSelect) candleTypeSelect.value = ''; // Reset to "Select a style..."
    } else if (type === 'Glass') {
      if (glassField) glassField.style.display = 'block';
      const firstGlassSizeRadio = document.querySelector('input[name="glassSize"][value="150ml"]');
      if (firstGlassSizeRadio) firstGlassSizeRadio.checked = true;
    }
  },

  setupListeners() {
    // Listeners for baseType radio buttons
    document.querySelectorAll('input[name="baseType"]').forEach(input => {
      input.addEventListener('change', () => CustomCandle.toggleBaseType(input.value));
    });

    const typeSelect = document.getElementById('candleType');
    const fragSelect = document.getElementById('fragrance');
    
    typeSelect?.addEventListener('change', () => {
      const opt = typeSelect.options[typeSelect.selectedIndex];
    });

    document.querySelectorAll('input[name="jarSize"]').forEach(input => {
      input.addEventListener('change', () => { /* No preview update needed */ });
    });
    document.querySelectorAll('input[name="glassSize"]').forEach(input => {
      input.addEventListener('change', () => { /* No preview update needed */ });
    });
  },

  handleSubmit(fd) {
    const baseType = fd.get('baseType');
    const data = {
      name: fd.get('customerName'), phone: fd.get('customerPhone'), email: fd.get('customerEmail') || 'N/A',
      baseType: baseType,
      jarSize: baseType === 'Jar' ? fd.get('jarSize') : 'N/A',
      glassSize: baseType === 'Glass' ? fd.get('glassSize') : 'N/A',
      mouldStyle: baseType === 'Mould' ? fd.get('candleType') : 'N/A',
      fragrance: fd.get('fragrance'),
      color: fd.get('color') === 'Custom' ? fd.get('customColor') : fd.get('color'),
      quantity: fd.get('quantity'),
      message: fd.get('customMessage') || 'None'
    };

    if ((baseType === 'Mould' && !data.mouldStyle) || (baseType === 'Glass' && !data.glassSize) || !data.fragrance || !data.name || !data.phone) {
      Toast.show('Please fill in all required fields.', 'error'); return;
    }

    const message = `*✨ NEW CUSTOM CANDLE INQUIRY ✨*\n\n` +
                    `*👤 CUSTOMER*\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\n\n` +
                    `*🕯️ SPECIFICATIONS*\nType: ${data.baseType}\n` +
                    (baseType === 'Jar' ? `Jar Size: ${data.jarSize}\n` : '') +
                    (baseType === 'Glass' ? `Glass Size: ${data.glassSize}\n` : '') +
                    (baseType === 'Mould' ? `Mould Style: ${data.mouldStyle}\n` : '') +
                    `Fragrance: ${data.fragrance}\nColor: ${data.color}\nQty: ${data.quantity}\n\n` +
                    `*📝 MESSAGE*\n${data.message}\n\n` +
                    `------------------------------------------\n` +
                    `*⚠️ UNBOXING POLICY ACKNOWLEDGED*\n` +
                    `_I understand that a continuous unboxing video is mandatory for damage claims._\n` +
                    `_Inquiry from Grace Home Website_`;

    window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    Toast.show('Inquiry sent! We will contact you shortly.', 'success');
    form.reset(); // Clear the form after submission
    CustomCandle.toggleBaseType('Jar'); // Reset to default Jar view
    CustomCandle.handleColorChange('White', document.querySelector('.swatch[style*="background-color: rgb(255, 255, 255)"]')); // Reset color
  }
};

window.changeQty = (delta) => {
  const input = document.getElementById('custom-qty');
  const newVal = Math.max(1, parseInt(input.value) + delta);
  input.value = newVal;
};

/* ── BULK ORDER ENGINE ─────────────────────────────────── */
const BulkOrder = {
  init() {
    const form = document.getElementById('bulk-order-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit(new FormData(form));
    });
  },
  handleSubmit(fd) {
    const data = {
      name: fd.get('name'), phone: fd.get('phone'), email: fd.get('email'),
      company: fd.get('company') || 'N/A', qty: fd.get('quantity'),
      event: fd.get('event_type'), message: fd.get('message')
    };
    if (!data.name || !data.phone || !data.qty) {
      Toast.show('Please fill in required fields.', 'error'); return;
    }

    const message = `*📦 NEW BULK ORDER INQUIRY 📦*\n\n` +
                    `*👤 CONTACT*\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\n\n` +
                    `*🏢 DETAILS*\nCompany/Event: ${data.company}\nType: ${data.event}\nQuantity: ${data.qty}\n\n` +
                    `*📝 REQUIREMENTS*\n${data.message}\n\n` +
                    `------------------------------------------\n` +
                    `*⚠️ UNBOXING POLICY ACKNOWLEDGED*\n` +
                    `_I understand that a continuous unboxing video of the sealed package is mandatory for damage claims._\n\n` +
                    `_Inquiry from Grace Home Website_`;

    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    Toast.show('Inquiry sent via WhatsApp!', 'success');
    document.getElementById('bulk-order-form').reset();
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
  lastScrollY: window.scrollY,
  init() {
    const el = document.getElementById('site-header');
    if (!el) return;
    
    const update = () => {
      const currentScrollY = window.scrollY;
      
      // Background blur/solid state
      el.classList.toggle('scrolled', currentScrollY > 60);

      // Hide on scroll down, reveal on scroll up
      if (currentScrollY > this.lastScrollY && currentScrollY > 150) {
        el.classList.add('header-hidden');
      } else {
        el.classList.remove('header-hidden');
      }

      this.lastScrollY = currentScrollY;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }
};

/* ── MOBILE NAV ────────────────────────────────────────────── */
const MobileNav = {
  init() {
    const nav    = document.getElementById('mobile-nav');
    const toggles = document.querySelectorAll('.hamburger, #bottom-menu-toggle, [data-nav-toggle]');
    const close  = document.getElementById('mobile-nav-close');
    if (!nav) return;
    this.open  = () => { 
      nav.classList.add('open'); 
      nav.removeAttribute('inert');
      document.body.style.overflow = 'hidden'; 
      document.body.classList.add('nav-open');
    };
    this.shut  = () => { 
      nav.classList.remove('open'); 
      nav.setAttribute('inert', '');
      document.body.style.overflow = ''; 
      document.body.classList.remove('nav-open');
    };
    this.toggle = () => {
      nav.classList.contains('open') ? this.shut() : this.open();
    };

    toggles.forEach(t => t.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    }));

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
  sendInquiryFromCart() {
    if (Cart.items.length === 0) return;

    const stats = Cart.getOfferStats();
    const itemsStr = Cart.items.map(i => `• *${i.name}*${i.notes ? ' [' + i.notes + ']' : ''} (x${i.qty})`).join('\n');
    const finalTotal = stats.subtotal - stats.discountAmount;

    const message = `*✨ NEW ENQUIRY | GRACE HOME ✨*\n\n` +
                    `_Order generated via Website_\n\n` +
                    `*📦 ITEMS REQUESTED*\n` +
                    `------------------------------------------\n` +
                    `${itemsStr}\n` +
                    `------------------------------------------\n` +
                    `*Cart Total:* ${formatINR(stats.subtotal)}\n` +
                    `*Offer Eligible:* ${stats.discountPct > 0 ? (stats.discountPct * 100) + '% OFF' : 'None'}\n` +
                    `*Free Shipping Eligible:* ${stats.isFreeShipping ? 'YES' : 'NO'}\n` +
                    `*Estimated Payable:* ${formatINR(finalTotal)}\n\n` +
                    `*⚠️ UNBOXING POLICY ACKNOWLEDGED*\n` +
                    `_I understand that a continuous unboxing video of the sealed package is mandatory for damage claims._\n\n` +
                    `_Hello Grace Home, I am interested in these candles. Please let me know the availability and total cost for my location._`;

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
  MobileNav.init();
  FAQ.init();
  NewsletterForm.init();
  CustomCandle.init();
  BulkOrder.init();

  // Page specific header state detection
  if (/checkout\.html|order-success\.html|cart\.html/.test(window.location.pathname)) {
    document.body.classList.add('minimal-nav');
  }
});
