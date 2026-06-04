/* ============================================================
   GRACE HOME CANDLES — PRODUCT ENGINE v3
   Supabase-first. Variants + Bundles. Zero hardcoding.
   ============================================================ */
'use strict';

/* ── Fallback data (used ONLY when Supabase is not configured) ── */
const FALLBACK_PRODUCTS = [
  { id:'azure-bloom', name:'Azure Bloom', type:'single', category:'jars',
    notes:'Jar Candle', short_desc:'Stunning blue-tinted candle with artisan aesthetics.',
    original_price:899, sale_price:599, badges:['Best Seller'],
    image:'assets/azurebloom.jpg',
    is_active:true, is_featured:true, sort_order:1 },

  { id:'eternal-embrace', name:'Eternal Embrace', type:'single', category:'moulds',
    notes:'Mould Candle', short_desc:'Timeless sculptural piece for your home.',
    original_price:499, sale_price:299, badges:['Artistic'],
    image:'assets/eternalembrace.jpg',
    is_active:true, is_featured:true, sort_order:2 },

  { id:'ivory-rose', name:'Ivory Rose', type:'single', category:'moulds',
    notes:'Mould Candle', short_desc:'Elegant rose sculpture in pure soy-coconut wax.',
    original_price:599, sale_price:399, badges:['Hand-crafted'],
    image:'assets/ivoryrose.jpg',
    is_active:true, is_featured:true, sort_order:3 },

  { id:'rose-sculpture', name:'Rose Sculpture', type:'single', category:'moulds',
    notes:'Mould Candle', short_desc:'Intricate floral pillar candle.',
    original_price:549, sale_price:349, badges:['Trending'],
    image:'assets/rosesculpture.jpg',
    is_active:true, is_featured:true, sort_order:4 },

  { id:'strawberry-milk', name:'Strawberry Milk', type:'single', category:'jars',
    notes:'Jar Candle', short_desc:'A sweet, creamy blend of fresh strawberries and cold milk.',
    original_price:799, sale_price:599, badges:['New Arrival'],
    image:'assets/strawberrymilk.jpg',
    is_active:true, is_featured:true, sort_order:0 }
];

const FALLBACK_VARIANTS = {}; // No longer used for static catalog

/* ── ProductStore — single source of truth for the frontend ── */
const ProductStore = {
  products: [],
  variants:  {},   // { productId: [variant, ...] }
  loaded:    false,

  async load() {
    if (this.loaded) return;
    // Fallback
    this.products = FALLBACK_PRODUCTS;
    this.variants = {}; // No variants for static catalog
    this.loaded = true;
  },

  getAll()        { return this.products.filter(p => p.is_active); },
  getFeatured()   { return this.products.filter(p => p.is_active && p.is_featured); },
  getBestsellers(){ return this.products.filter(p => p.is_active && p.is_bestseller); },
  getSingles()    { return this.products.filter(p => p.is_active && p.type === 'single'); },
  getBundles()    { return this.products.filter(p => p.is_active && p.type === 'gift_set'); },
  getById(id)     { return this.products.find(p => p.id === id && p.is_active) || null; },
  getVariants(id) { return (this.variants[id] || []).sort((a,b) => a.sort_order - b.sort_order); },
  getDefaultVariant(id) {
    const vars = this.getVariants(id);
    return vars.find(v => v.is_default) || vars[0] || null;
  },

  /* Convenience: price display for a product (uses default variant) */
  getDisplayPrice(product) {
    const defVar = this.getDefaultVariant(product.id);
    if (defVar) return { sale: defVar.sale_price, original: defVar.original_price };
    return { sale: product.sale_price, original: product.original_price };
  }
};

/* ── Render: Product Card ────────────────────────────────── */
function renderProductCard(product, index = 0) {
  const price   = ProductStore.getDisplayPrice(product);
  const savings = price.original - price.sale;
  const pct     = Math.round((savings / price.original) * 100);
  const badges  = (product.badges || []).map(b =>
    `<span class="badge badge-${b.toLowerCase().replace(/\s+/g,'-')}">${b}</span>`
  ).join('');
  const hasVariants = (ProductStore.getVariants(product.id) || []).length > 1;
  const varLabel = hasVariants ? '<span style="font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);margin-left:6px">+ Options</span>' : '';

  // Detect if we are in a subfolder (like /pages/) to fix image path
  const isSubPage = window.location.pathname.includes('/pages/');
  const imagePath = isSubPage ? '../' + product.image : product.image;

  return `
    <article class="product-card reveal reveal-delay-${(index % 4) + 1}"
      data-product-id="${product.id}"
      style="cursor:pointer"
      onclick="if(!event.target.closest('button')) { 
        const url = window.location.pathname.includes('/pages/') ? 'product.html' : 'pages/product.html';
        window.location.href = url + '?id=${product.id}';
      }">
      <div class="product-image-wrap">
        <img src="${imagePath}" alt="${product.name}" loading="lazy"
          onerror="this.src='${isSubPage ? '../' : ''}assets/strawberrymilk.jpg'">
        <div class="product-badge">${badges}</div>
        ${product.type !== 'single' ? '' : `
        <div class="product-quick-add">
          <button class="btn btn-primary btn-sm btn-full"
            onclick="event.stopPropagation();ProductStore.quickAdd('${product.id}', event)">
            <span>Add to Inquiry</span>
          </button>
        </div>`}
      </div>
      <div class="product-body">
        <h3 class="product-name">${product.name}${varLabel}</h3>
        <p class="product-notes">${product.notes || ''}</p>
        <div class="product-meta">
          <span class="price-sale">₹${price.sale.toLocaleString('en-IN')}</span>
          ${price.original > price.sale ? `<span class="price-original">₹${price.original.toLocaleString('en-IN')}</span>` : ''}
          ${pct > 0 ? `<span class="price-savings">Save ${pct}%</span>` : ''}
        </div>
      </div>
    </article>`;
}

/* Quick add — Redirects to product page to ensure customization lock workflow */
ProductStore.quickAdd = function(productId) {
  const product = this.getById(productId);
  if (!product) return;
  const isSubPage = window.location.pathname.includes('/pages/');
  const url = isSubPage ? 'product.html' : 'pages/product.html';
  window.location.href = `${url}?id=${product.id}`;
};

/* ── Variant Selector UI (used on product detail page) ────── */
function renderVariantSelector(product, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const variants = ProductStore.getVariants(product.id);
  
  // If no variants, just show the base price and add to cart logic
  if (!variants || variants.length === 0) {
    _renderBaseProduct(product, container);
    return;
  }

  let selectedId = (variants.find(v => v.is_default) || variants[0])?.id;

  function render() {
    const sel = variants.find(v => v.id === selectedId) || variants[0];
    container.innerHTML = `
      <div style="margin-bottom:24px">
        <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--muted);margin-bottom:14px">
          Select Option
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:8px" role="radiogroup" aria-label="Product variants">
          ${variants.map(v => `
            <button
              role="radio"
              aria-checked="${v.id === selectedId}"
              onclick="selectVariant('${v.id}')"
              style="
                padding:10px 16px;font-size:11px;letter-spacing:0.08em;
                border:1px solid ${v.id === selectedId ? 'var(--espresso)' : 'var(--border-dark)'};
                background:${v.id === selectedId ? 'var(--espresso)' : 'transparent'};
                color:${v.id === selectedId ? 'var(--ivory)' : 'var(--charcoal)'};
                cursor:pointer;transition:all 0.2s;font-family:var(--font-sans);
                display:flex;flex-direction:column;align-items:flex-start;gap:2px;
              ">
              <span>${v.variant_name}</span>
              <span style="font-size:10px;opacity:0.7">₹${v.sale_price.toLocaleString('en-IN')}</span>
            </button>`).join('')}
        </div>
        ${sel ? `
        <div style="margin-top:16px;padding:14px 16px;background:var(--cream);border:1px solid var(--border);font-size:12px;color:var(--muted)">
          <span style="color:var(--espresso);font-weight:400">
            ₹${sel.sale_price.toLocaleString('en-IN')}
          </span>
          ${sel.original_price > sel.sale_price ? `
            <s style="margin-left:8px;color:var(--sand)">₹${sel.original_price.toLocaleString('en-IN')}</s>
            <span style="margin-left:8px;color:var(--gold);font-size:10px;letter-spacing:0.08em">
              Save ₹${(sel.original_price - sel.sale_price).toLocaleString('en-IN')}
            </span>` : ''}
          ${sel.quantity > 1 ? `<span style="margin-left:8px;color:var(--muted)">· ${sel.quantity} candles</span>` : ''}
          ${sel.scent_type === 'unscented' ? `<span style="margin-left:8px;color:var(--muted)">· Unscented</span>` : ''}
        </div>` : ''}
      </div>`;

    // Update page price display
    if (sel) {
      const salePriceEl = document.getElementById('product-price-sale');
      const origPriceEl = document.getElementById('product-price-orig');
      if (salePriceEl) salePriceEl.textContent = `₹${sel.sale_price.toLocaleString('en-IN')}`;
      if (origPriceEl) origPriceEl.textContent  = sel.original_price > sel.sale_price
        ? `₹${sel.original_price.toLocaleString('en-IN')}` : '';

      // Update Add to Cart button
      const addBtn = document.getElementById('add-to-cart-btn');
      if (addBtn) {
        addBtn.onclick = () => {
          Cart.add({
            id:            `${product.id}__${sel.id}`,
            name:          product.name,
            notes:         sel.variant_name,
            price:         sel.sale_price,
            originalPrice: sel.original_price,
            image:         product.image || '',
            variantId:     sel.id
          });
        };
        addBtn.querySelector('span').textContent = `Add to Cart — ₹${sel.sale_price.toLocaleString('en-IN')}`;
      }
    }
  }

  window.selectVariant = function(id) {
    selectedId = id;
    render();
  };

  render();
}

function _renderBaseProduct(product, container) {
  container.innerHTML = `
    <div style="margin-bottom:24px">
      <div style="padding:14px 16px;background:var(--cream);border:1px solid var(--border);font-size:12px">
        <span style="color:var(--espresso);font-weight:500;font-size:18px">
          ₹${product.sale_price.toLocaleString('en-IN')}
        </span>
        ${product.original_price > product.sale_price ? `
          <s style="margin-left:10px;color:var(--sand)">₹${product.original_price.toLocaleString('en-IN')}</s>
        ` : ''}
      </div>
    </div>`;
    
  const addBtn = document.getElementById('add-to-cart-btn');
  if (addBtn) {
    addBtn.onclick = () => {
      Cart.add({
        id: product.id,
        name: product.name,
        price: product.sale_price,
        image: product.image
      });
    };
  }
}

/* Backwards-compat: PRODUCTS array (legacy reference) */
let PRODUCTS = FALLBACK_PRODUCTS;
ProductStore.load().then(() => { PRODUCTS = ProductStore.products; }).catch(() => {});
