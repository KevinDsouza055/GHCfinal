/* ============================================================
   GRACE HOME CANDLES — PRODUCT ENGINE v3
   Supabase-first. Variants + Bundles. Zero hardcoding.
   ============================================================ */
'use strict';

/* ── Fallback data (used ONLY when Supabase is not configured) ── */
const FALLBACK_PRODUCTS = [
  { id:'velvet-vanilla', name:'Velvet Vanilla', type:'single', category:'scented',
    notes:'Tahitian Vanilla · Warm Musk · Amber', short_desc:'Enveloping and intimate, like cashmere on skin.',
    description:'A luxurious depth of pure Tahitian vanilla harmonises with warm amber and whispered musk.',
    fragrance_top:'Madagascar Vanilla', fragrance_mid:'Warm Amber', fragrance_base:'White Musk & Sandalwood',
    burn_time:'60–70 hours', size:'300g', wax:'Coconut-Soy Blend', wick:'Cotton Braided',
    original_price:1499, sale_price:1199, badges:['Bestseller'],
    image:'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=800&q=85',
    images:['https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=800&q=85'],
    is_active:true, is_featured:true, is_bestseller:true, sort_order:1 },

  { id:'midnight-oud', name:'Midnight Oud', type:'single', category:'scented',
    notes:'Aged Oud · Dark Rose · Patchouli', short_desc:'The scent of velvet dusk and ancient wood.',
    description:'Rare aged oud meets the shadow of dark rose petals, grounded in deep patchouli and cedarwood.',
    fragrance_top:'Saffron & Black Pepper', fragrance_mid:'Dark Rose & Oud', fragrance_base:'Patchouli & Cedarwood',
    burn_time:'65–75 hours', size:'300g', wax:'Coconut-Soy Blend', wick:'Cotton Braided',
    original_price:1799, sale_price:1499, badges:['Bestseller','New'],
    image:'https://images.unsplash.com/photo-1608181831718-6b9c7e1bda9f?w=800&q=85',
    images:['https://images.unsplash.com/photo-1608181831718-6b9c7e1bda9f?w=800&q=85'],
    is_active:true, is_featured:true, is_bestseller:true, sort_order:2 },

  { id:'cashmere-rose', name:'Cashmere Rose', type:'single', category:'scented',
    notes:'Centifolia Rose · Cashmere Wood · Peony', short_desc:'Infinitely feminine. Quietly powerful.',
    description:'A bouquet of centifolia rose at full bloom, softened by cashmere wood and the tender blush of peony.',
    fragrance_top:'Pink Peony & Bergamot', fragrance_mid:'Centifolia Rose', fragrance_base:'Cashmere Wood & Vanilla',
    burn_time:'60–70 hours', size:'300g', wax:'Coconut-Soy Blend', wick:'Cotton Braided',
    original_price:1699, sale_price:1349, badges:['New'],
    image:'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=85',
    images:['https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=85'],
    is_active:true, is_featured:true, is_bestseller:false, sort_order:3 },

  { id:'amber-sandalwood', name:'Amber Sandalwood', type:'single', category:'scented',
    notes:'Mysore Sandalwood · Golden Amber · Vetiver', short_desc:'Sun-warmed skin and sacred wood.',
    description:'The richness of Mysore sandalwood married with golden amber resin and earthy vetiver.',
    fragrance_top:'Bergamot & Cardamom', fragrance_mid:'Mysore Sandalwood & Amber', fragrance_base:'Vetiver & Tonka Bean',
    burn_time:'70–80 hours', size:'300g', wax:'Coconut-Soy Blend', wick:'Cotton Braided',
    original_price:1699, sale_price:1299, badges:['Bestseller'],
    image:'https://images.unsplash.com/photo-1543342384-1f1350e27861?w=800&q=85',
    images:['https://images.unsplash.com/photo-1543342384-1f1350e27861?w=800&q=85'],
    is_active:true, is_featured:false, is_bestseller:true, sort_order:4 },

  { id:'lavender-silk', name:'Lavender Silk', type:'single', category:'scented',
    notes:'Provençal Lavender · White Tea · Musk', short_desc:'The art of doing nothing, beautifully.',
    description:'Fields of Provençal lavender drift over delicate white tea and a barely-there silk musk.',
    fragrance_top:'Lavender & Eucalyptus', fragrance_mid:'White Tea & Iris', fragrance_base:'Silk Musk & Cedarwood',
    burn_time:'55–65 hours', size:'300g', wax:'Coconut-Soy Blend', wick:'Cotton Braided',
    original_price:1499, sale_price:1149, badges:['New'],
    image:'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=85',
    images:['https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=85'],
    is_active:true, is_featured:false, is_bestseller:false, sort_order:5 },

  { id:'gift-duo', name:'The Signature Duo', type:'gift_set', category:'both',
    notes:'Velvet Vanilla + Cashmere Rose', short_desc:'Two bestsellers in one luxury box.',
    description:'Two bestselling Grace Home candles in our signature gift box.',
    burn_time:'60–70 hours each', original_price:2698, sale_price:2199, badges:['Gift Set'],
    image:'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=800&q=85',
    images:['https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=800&q=85'],
    is_active:true, is_featured:true, sort_order:10 },

  { id:'gift-complete', name:'The Complete Set', type:'gift_set', category:'both',
    notes:'All 5 Signature Fragrances', short_desc:'The ultimate Grace Home experience.',
    description:'All five signature candles in one grand presentation box.',
    burn_time:'55–80 hours each', original_price:6745, sale_price:5499, badges:['Gift Set','Most Gifted'],
    image:'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=800&q=85',
    images:['https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=800&q=85'],
    is_active:true, is_featured:true, sort_order:11 },

  { id:'gift-evening', name:'The Evening Ritual', type:'gift_set', category:'scented',
    notes:'Midnight Oud + Lavender Silk', short_desc:'From dusk to sleep.',
    description:'Two candles curated for the evening — bold Midnight Oud then calming Lavender Silk.',
    burn_time:'55–75 hours each', original_price:3298, sale_price:2899, badges:['Gift Set','New'],
    image:'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=85',
    images:['https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=85'],
    is_active:true, is_featured:false, sort_order:12 }
];

const FALLBACK_VARIANTS = {
  'velvet-vanilla':   _defaultVariants(1499, 1199),
  'midnight-oud':     _defaultVariants(1799, 1499),
  'cashmere-rose':    _defaultVariants(1699, 1349),
  'amber-sandalwood': _defaultVariants(1699, 1299),
  'lavender-silk':    _defaultVariants(1499, 1149)
};

function _defaultVariants(orig, sale) {
  return [
    { id:'v1', variant_name:'Scented · Single',    variant_type:'scent_type', quantity:1, scent_type:'scented',   original_price:orig,                          sale_price:sale,                         is_default:true,  sort_order:1 },
    { id:'v2', variant_name:'Scented · Set of 2',  variant_type:'quantity',   quantity:2, scent_type:'scented',   original_price:Math.round(orig*1.85/10)*10,   sale_price:Math.round(sale*1.85/10)*10,  is_default:false, sort_order:2 },
    { id:'v3', variant_name:'Scented · Set of 4',  variant_type:'quantity',   quantity:4, scent_type:'scented',   original_price:Math.round(orig*3.5/10)*10,    sale_price:Math.round(sale*3.5/10)*10,   is_default:false, sort_order:3 },
    { id:'v4', variant_name:'Unscented · Single',  variant_type:'scent_type', quantity:1, scent_type:'unscented', original_price:Math.round(orig*0.9/10)*10,    sale_price:Math.round(sale*0.9/10)*10,   is_default:false, sort_order:4 },
    { id:'v5', variant_name:'Unscented · Set of 2',variant_type:'quantity',   quantity:2, scent_type:'unscented', original_price:Math.round(orig*1.65/10)*10,   sale_price:Math.round(sale*1.65/10)*10,  is_default:false, sort_order:5 }
  ];
}

/* ── ProductStore — single source of truth for the frontend ── */
const ProductStore = {
  products: [],
  variants:  {},   // { productId: [variant, ...] }
  loaded:    false,

  async load() {
    if (this.loaded) return;
    try {
      // Try Supabase
      const [prods, vars] = await Promise.all([
        SupabaseClient.getProducts(),
        SupabaseClient.getAllVariants()
      ]);
      if (prods && prods.length > 0) {
        this.products = prods;
        // Group variants by product_id
        this.variants = {};
        (vars || []).forEach(v => {
          if (!this.variants[v.product_id]) this.variants[v.product_id] = [];
          this.variants[v.product_id].push(v);
        });
        this.loaded = true;
        return;
      }
    } catch (e) {
      console.warn('ProductStore: Supabase unavailable, using fallback data');
    }
    // Fallback
    this.products = FALLBACK_PRODUCTS;
    this.variants = FALLBACK_VARIANTS;
    this.loaded = true;
  },

  getAll()        { return this.products.filter(p => p.is_active); },
  getFeatured()   { return this.products.filter(p => p.is_active && p.is_featured); },
  getBestsellers(){ return this.products.filter(p => p.is_active && p.is_bestseller); },
  getSingles()    { return this.products.filter(p => p.is_active && p.type === 'single'); },
  getBundles()    { return this.products.filter(p => p.is_active && (p.type === 'bundle' || p.type === 'gift_set')); },
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

  return `
    <article class="product-card reveal reveal-delay-${(index % 4) + 1}"
      data-product-id="${product.id}"
      style="cursor:pointer"
      onclick="if(!event.target.closest('button'))window.location.href=getProductPageUrl('${product.id}')">
      <div class="product-image-wrap">
        <img src="${product.image || ''}" alt="${product.name}" loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=400&q=60'">
        <div class="product-badge">${badges}</div>
        ${product.category === 'both' || product.type !== 'single' ? '' : `
        <div class="product-quick-add">
          <button class="btn btn-primary btn-sm btn-full"
            onclick="event.stopPropagation();ProductStore.quickAdd('${product.id}')">
            <span>${hasVariants ? 'Select Options' : 'Add to Cart'}</span>
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

/* Quick add — for products without variants, add directly; else go to product page */
ProductStore.quickAdd = function(productId) {
  const product = this.getById(productId);
  if (!product) return;
  const vars = this.getVariants(productId);
  if (vars.length <= 1) {
    // Single variant or no variants — add directly
    const v = vars[0];
    Cart.add({
      id:            v ? `${product.id}__${v.id}` : product.id,
      name:          product.name,
      notes:         v ? v.variant_name : (product.notes || ''),
      price:         v ? v.sale_price   : product.sale_price,
      originalPrice: v ? v.original_price : product.original_price,
      image:         product.image || '',
      variantId:     v ? v.id : null
    });
  } else {
    // Multiple variants — go to product page to choose
    window.location.href = getProductPageUrl(productId);
  }
};

function getProductPageUrl(productId) {
  const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
  return `${prefix}product.html?id=${encodeURIComponent(productId)}`;
}

/* ── Variant Selector UI (used on product detail page) ────── */
function renderVariantSelector(product, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const variants = ProductStore.getVariants(product.id);
  if (!variants.length) { container.innerHTML = ''; return; }

  let selectedId = (variants.find(v => v.is_default) || variants[0]).id;

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

/* ── Extend SupabaseClient for variants ─────────────────── */
if (typeof SupabaseClient !== 'undefined') {
  SupabaseClient.getAllVariants = async function() {
    return this.request('product_variants?select=*&is_active=eq.true&order=product_id.asc,sort_order.asc');
  };
  SupabaseClient.getVariants = async function(productId) {
    return this.request(`product_variants?product_id=eq.${encodeURIComponent(productId)}&is_active=eq.true&order=sort_order.asc`);
  };
  SupabaseClient.upsertProduct = async function(data) {
    return this.request('products', 'POST', data, { 'Prefer': 'resolution=merge-duplicates,return=representation' });
  };
  SupabaseClient.updateProduct = async function(id, data) {
    return this.request(`products?id=eq.${encodeURIComponent(id)}`, 'PATCH', data, { 'Prefer': 'return=representation' });
  };
  SupabaseClient.deleteProduct = async function(id) {
    return this.request(`products?id=eq.${encodeURIComponent(id)}`, 'DELETE');
  };
  SupabaseClient.upsertVariant = async function(data) {
    return this.request('product_variants', 'POST', data, { 'Prefer': 'resolution=merge-duplicates,return=representation' });
  };
  SupabaseClient.updateVariant = async function(id, data) {
    return this.request(`product_variants?id=eq.${encodeURIComponent(id)}`, 'PATCH', data, { 'Prefer': 'return=representation' });
  };
  SupabaseClient.deleteVariant = async function(id) {
    return this.request(`product_variants?id=eq.${encodeURIComponent(id)}`, 'DELETE');
  };
}

/* Backwards-compat: PRODUCTS array (legacy reference) */
let PRODUCTS = FALLBACK_PRODUCTS;
ProductStore.load().then(() => { PRODUCTS = ProductStore.products; }).catch(() => {});
