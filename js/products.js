/* ============================================================
   GRACE HOME CANDLES — PRODUCT ENGINE v3
   Supabase-first. Variants + Bundles. Zero hardcoding.
   ============================================================ */
'use strict';

/* ── Fallback data (used ONLY when Supabase is not configured) ── */
const FALLBACK_PRODUCTS = [
  { id:'azure-bloom', name:'Azure Bloom', type:'single', category:'jars',
    notes:'Jar Candle (350ml)', short_desc:'Stunning blue-tinted candle with artisan aesthetics.', family: 'Fresh',
    original_price:799, sale_price:599, badges:['Best Seller', 'Relaxing'],
    perfect_for: ['Bedroom', 'Self Care', 'Meditation'],
    image:'assets/azurebloom.jpg',
    is_active:true, is_featured:true, sort_order:5 },

  { id:'eternal-embrace', name:'Eternal Embrace', type:'single', category:'moulds',
    notes:'Mould Candle', short_desc:'Timeless sculptural piece for your home.', family: 'Unscented',
    original_price:599, sale_price:399, badges:['Home Decor', 'Artistic'],
    perfect_for: ['Living Room', 'Gifting', 'Anniversaries'],
    image:'assets/eternalembrace.jpg',
    is_active:true, is_featured:true, sort_order:6 },

  { id:'ivory-rose', name:'Ivory Rose', type:'single', category:'moulds',
    notes:'Mould Candle (1pc)', short_desc:'Elegant rose sculpture in pure soy-coconut wax.', family: 'Floral',
    original_price:699, sale_price:499, badges:['Romantic', 'Hand-crafted'],
    perfect_for: ['Bedroom', 'Valentine\'s Day', 'Proposal Gifts'],
    image:'assets/ivoryrose.jpg',
    is_active:true, is_featured:true, sort_order:7 },

  { id:'rose-sculpture', name:'Rose Sculpture', type:'single', category:'moulds',
    notes:'Mould Candle (1pc)', short_desc:'Intricate floral pillar candle.', family: 'Floral',
    original_price:599, sale_price:399, badges:['Great Gift', 'Trending'],
    perfect_for: ['Festivals', 'Living Room', 'Gifting'],
    image:'assets/rosesculpture.jpg',
    is_active:true, is_featured:true, sort_order:8 },

  { id:'strawberry-milk', name:'Strawberry Milk', type:'single', category:'jars',
    notes:'Jar Candle (Strawberry Scent)', short_desc:'A sweet, creamy blend of fresh strawberries and cold milk.', family: 'Sweet',
    original_price:799, sale_price:599, badges:['New Arrival', 'Great Gift'],
    perfect_for: ['Kitchen', 'Cozy Ambience', 'Birthdays'],
    image:'assets/strawberrymilk.jpg',
    is_active:true, is_featured:true, sort_order:0 },

  { id:'teddy-heart-jar', name:'Teddy Heart Jar Candle', type:'single', category:'jars',
    notes:'Luxury Jar Candle', short_desc:'Adorable teddy heart design for a cozy glow.', family: 'Sweet',
    original_price:899, sale_price:699, badges:['New Arrival'],
    image:'assets/teddyheartjarcandle.jpg',
    is_active:true, is_featured:true, sort_order:1 },

  { id:'wedding-couple', name:'Wedding Couple Rose Candle', type:'single', category:'moulds',
    notes:'Sculptural Rose Candle', short_desc:'The perfect gift for anniversaries and weddings.', family: 'Floral',
    original_price:699, sale_price:499, badges:['Great Gift', 'Romantic'],
    image:'assets/weddingcouplerosecandle.jpg',
    is_active:true, is_featured:true, sort_order:12 },

  { id:'coconut-blossom', name:'Coconut Blossom (Real Shell)', type:'single', category:'jars',
    notes:'Natural Shell · Coconut Scent', short_desc:'Tropical paradise in a candle.', family: 'Tropical',
    original_price:899, sale_price:599, badges:['New Arrival', 'Featured'],
    image:'assets/coconutblossom.jpg',
    is_active:true, is_featured:true, sort_order:13 },

  { id:'daisy-bloom', name:'Daisy Bloom Candle', type:'single', category:'moulds',
    notes:'Floral Aesthetic Candle', short_desc:'Delicate daisy design to brighten any space.', family: 'Floral',
    original_price:799, sale_price:599, badges:['Trending'],
    image:'assets/daisybloomcandle.jpg',
    is_active:true, is_featured:true, sort_order:14 },

  { id:'striped-candle', name:'Striped Pillar Candle', type:'single', category:'moulds',
    notes:'20cm Height · 4cm Diameter', short_desc:'Elegant striped pillar for modern decor.', family: 'Modern',
    original_price:899, sale_price:699, badges:['New'],
    image:'assets/stripedcandle.jpg',
    is_active:true, is_featured:true, sort_order:3 },

  { id:'teddy-bear', name:'Teddy Bear Candle', type:'single', category:'moulds',
    notes:'Cute Teddy Sculpture', short_desc:'Playful and aesthetic teddy bear mould.', family: 'Sweet',
    original_price:499, sale_price:299, badges:['New Arrival', 'Cute'],
    image:'assets/teddybear.jpg',
    is_active:true, is_featured:true, sort_order:15 },

  { id:'z-shape', name:'Z-Shape Aesthetic Candle', type:'single', category:'moulds',
    notes:'Geometric Design', short_desc:'Unique Z-shaped sculptural candle.', family: 'Modern',
    original_price:499, sale_price:299, badges:['Artistic'],
    image:'assets/aurawave.jpg', // Placeholder for zshape if image missing
    is_active:true, is_featured:true, sort_order:16 },

  { id:'aura-wave', name:'Aura Wave', type:'single', category:'moulds',
    notes:'Mould Candle', short_desc:'Rhythmic patterns of light and scent.', family: 'Fresh',
    original_price:499, sale_price:299, badges:['New Arrival'],
    perfect_for: ['Study Room', 'Modern Interiors'],
    image:'assets/aurawave.jpg',
    is_active:true, is_featured:true, sort_order:2 },

  { id:'blue-blossom', name:'Blue Blossom', type:'single', category:'jars',
    notes:'Jar Candle (350ml)', short_desc:'A vibrant floral escape in every burn.', family: 'Floral',
    original_price:799, sale_price:599, badges:['Featured'],
    perfect_for: ['Living Room', 'Guest Welcoming'],
    image:'assets/blueblossom.jpg',
    is_active:true, is_featured:true, sort_order:9 },

  { id:'bubble-pack', name:'Bubble Candle (Pack of 4)', type:'single', category:'moulds',
    notes:'Mould Candle (Scented & Non-Scented)', short_desc:'Modern aesthetic mini-bubble collection.', family: 'Unscented',
    original_price:649, sale_price:449, badges:['Bundle Deal'],
    perfect_for: ['Decor', 'Small Gifts'],
    image:'assets/bubble.jpg',
    is_active:true, is_featured:true, sort_order:10 },

  { id:'lavender-gradient', name:'Lavender Gradient', type:'single', category:'jars',
    notes:'Jar Candle (190ml)', short_desc:'Beautifully layered lavender scent experience.', family: 'Floral',
    original_price:599, sale_price:399, badges:['Relaxing'],
    perfect_for: ['Bedroom', 'Sleep Ritual'],
    image:'assets/lavendergradient.jpg',
    is_active:true, is_featured:true, sort_order:11 },

  { id:'lavender-mist', name:'Lavender Mist', type:'single', category:'jars',
    notes:'Jar Candle (220ml)', short_desc:'A refreshing mist of pure lavender.', family: 'Floral',
    original_price:699, sale_price:499, badges:['New'],
    perfect_for: ['Spa Day', 'Meditation'],
    image:'assets/lavendermist.jpg',
    is_active:true, is_featured:true, sort_order:4 }
];

const SCENT_OPTIONS = ['Lavender', 'Jasmine', 'Rose', 'Vanilla', 'Chocolate', 'Coffee', 'Sandalwood', 'Oud', 'Amber'];

const FALLBACK_VARIANTS = {
  'azure-bloom': [{id:'v1', variant_name:'Scented', sale_price:599, original_price:799, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:549, original_price:749}],
  'eternal-embrace': [{id:'v1', variant_name:'Scented', sale_price:399, original_price:599, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:349, original_price:549}],
  'ivory-rose': [{id:'v1', variant_name:'Scented', sale_price:499, original_price:699, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:399, original_price:599}],
  'rose-sculpture': [{id:'v1', variant_name:'Scented', sale_price:399, original_price:599, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:349, original_price:549}],
  'blue-blossom': [{id:'v1', variant_name:'Scented', sale_price:599, original_price:799, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:549, original_price:749}],
  'teddy-heart-jar': [{id:'v1', variant_name:'Scented', sale_price:699, original_price:899, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:649, original_price:849}],
  'wedding-couple': [{id:'v1', variant_name:'Scented', sale_price:499, original_price:699, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:399, original_price:599}],
  'daisy-bloom': [{id:'v1', variant_name:'Scented', sale_price:599, original_price:799, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:499, original_price:699}],
  'striped-candle': [{id:'v1', variant_name:'Scented', sale_price:699, original_price:899, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:649, original_price:849}],
  'teddy-bear': [{id:'v1', variant_name:'Scented', sale_price:299, original_price:499, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:249, original_price:449}],
  'z-shape': [{id:'v1', variant_name:'Scented', sale_price:299, original_price:499, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:249, original_price:449}],
  'bubble-pack': [{id:'v1', variant_name:'Scented', sale_price:449, original_price:649, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:349, original_price:549}],
  'lavender-gradient': [{id:'v1', variant_name:'Scented', sale_price:399, original_price:599, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:349, original_price:549}],
  'lavender-mist': [{id:'v1', variant_name:'Scented', sale_price:499, original_price:699, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:449, original_price:649}],
  'coconut-blossom': [{id:'v1', variant_name:'Scented', sale_price:599, original_price:899, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:549, original_price:849}]
};

/* ── ProductStore — single source of truth for the frontend ── */
const ProductStore = {
  products: [],
  variants:  {},   // { productId: [variant, ...] }
  loaded:    false,

  async load() {
    if (this.loaded) return;
    // Fallback
    this.products = FALLBACK_PRODUCTS;
    this.variants = FALLBACK_VARIANTS;
    this.loaded = true;
    
    // Display collection count at the top if element exists
    const countEl = document.getElementById('collection-count');
    if (countEl) {
      const total = this.getAll().length;
      const newArrivals = this.getNewArrivals().length;
      countEl.innerHTML = `
        <div style="font-size: 14px; letter-spacing: 0.1em; color: var(--gold); margin-bottom: 4px;">NEW ARRIVALS NOW LIVE</div>
        <div>${total} Candles in Collection | ${newArrivals} New Arrivals</div>
      `;
    }
  },

  getAll()        { return this.products.filter(p => p.is_active).sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)); },
  getFeatured()   { return this.products.filter(p => p.is_active && p.is_featured).sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)); },
  getBestsellers() { return this.products.filter(p => p.is_active && p.is_bestseller).sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)); },
  getNewArrivals(){ 
    return this.products.filter(p => {
      if (!p.is_active || p.id === 'z-shape') return false;
      const name = p.name.toLowerCase();
      // Filter for specific categories requested: Coconut, Teddy, and Pillar candles
      const matchesRequest = name.includes('coconut') || name.includes('teddy') || name.includes('pillar');
      return matchesRequest;
    }).sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)); 
  },
  getSingles()    { return this.products.filter(p => p.is_active && p.type === 'single').sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)); },
  getBundles()    { return this.products.filter(p => p.is_active && p.type === 'gift_set').sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)); },
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
  let selectedScent = "";

  function render() {
    const sel = variants.find(v => v.id === selectedId) || variants[0];
    const isScented = sel.variant_name.toLowerCase().includes('scented') && !sel.variant_name.toLowerCase().includes('non-scented');

    let scentHtml = '';
    if (isScented) {
      scentHtml = `
        <div style="margin-top:20px; margin-bottom: 24px;">
          <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--muted);margin-bottom:12px">
            Choose Fragrance
          </p>
          <select id="scent-choice" class="form-control" style="width:100%" onchange="window.updateScentChoice(this.value)">
            <option value="" disabled ${!selectedScent ? 'selected' : ''}>-- Select Fragrance --</option>
            ${SCENT_OPTIONS.map(s => `<option value="${s}" ${selectedScent === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
      `;
    }

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
        ${scentHtml}
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
          if (isScented && !selectedScent) {
            if (typeof toast === 'function') toast('Please select a fragrance first', 'error');
            else alert('Please select a fragrance first');
            return;
          }

          Cart.add({
            id:            `${product.id}__${sel.id}${isScented ? '__' + selectedScent.toLowerCase().replace(/\s+/g, '-') : ''}`,
            name:          product.name,
            notes:         isScented ? `${sel.variant_name} (${selectedScent})` : sel.variant_name,
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
    selectedScent = ""; // Reset scent when variant changes
    render();
  };

  window.updateScentChoice = function(val) {
    selectedScent = val;
    render();
  }

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
        notes: product.notes || '',
        price: product.sale_price,
        image: product.image
      });
    };
  }
}

/* Backwards-compat: PRODUCTS array (legacy reference) */
let PRODUCTS = FALLBACK_PRODUCTS;
ProductStore.load().then(() => { PRODUCTS = ProductStore.products; }).catch(() => {});
