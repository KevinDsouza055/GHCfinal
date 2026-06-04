/* ============================================================
   GRACE HOME CANDLES — ADMIN PRODUCT MANAGER
   Full CRUD for products + variants + bundles
   Injected into admin.html via <script src>
   ============================================================ */
'use strict';

/* ── Product Manager (extends Admin object) ──────────────── */
Object.assign(Admin, {

  /* ── Render Products Page ── */
  renderProducts() {
    const products = this.allProducts.length ? this.allProducts : [];
    const tbody = document.getElementById('products-body');
    if (!tbody) return;

    const fixPath = (p) => (p && !p.startsWith('http') && !p.startsWith('../')) ? '../' + p : p;

    if (!products.length) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--muted)">
        No products yet. <button onclick="Admin.openProductModal()" style="color:var(--gold);background:none;border:none;cursor:pointer;font-size:13px;text-decoration:underline">Add your first product →</button>
      </td></tr>`;
      return;
    }

    tbody.innerHTML = products.map(p => `
      <tr>
        <td><img src="${fixPath(p.image||'')}" class="product-row-img" alt="${esc(p.name)}"
          onerror="this.style.background='var(--cashmere)'" loading="lazy"></td>
        <td>
          <strong style="font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:400">${esc(p.name)}</strong>
          <div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap">
            <span style="font-size:9px;padding:2px 6px;background:var(--cream);border:1px solid var(--border);letter-spacing:0.08em;text-transform:uppercase">${esc(p.type||'single')}</span>
            <span style="font-size:9px;padding:2px 6px;background:var(--cream);border:1px solid var(--border);letter-spacing:0.08em;text-transform:uppercase">${esc(p.category||'scented')}</span>
          </div>
        </td>
        <td style="font-size:11px;color:var(--muted);max-width:180px">${esc(p.notes||'—')}</td>
        <td style="font-weight:500">${fmtINR(p.sale_price)}</td>
        <td><s style="color:var(--sand);font-size:12px">${fmtINR(p.original_price)}</s></td>
        <td style="font-size:11px">${esc(p.burn_time||'—')}</td>
        <td>${(p.badges||[]).map(b=>`<span style="font-size:9px;letter-spacing:0.08em;text-transform:uppercase;padding:2px 6px;background:var(--cream);border:1px solid var(--border);margin-right:3px">${esc(b)}</span>`).join('')||'—'}</td>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="display:flex;align-items:center;gap:5px;font-size:11px;color:${p.is_active?'var(--green)':'var(--red)'}">
              <span style="width:7px;height:7px;border-radius:50%;background:${p.is_active?'var(--green)':'var(--red)'}"></span>
              ${p.is_active?'Active':'Off'}
            </span>
            <button onclick="Admin.openProductModal('${esc(p.id)}')"
              style="background:none;border:1px solid var(--border-dark);padding:4px 10px;font-size:9px;cursor:pointer;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted)">
              Edit
            </button>
          </div>
        </td>
      </tr>`).join('');
  },

  /* ── Open Product Modal (add or edit) ── */
  async openProductModal(productId = null) {
    const isEdit = Boolean(productId);
    const p = isEdit ? this.allProducts.find(x => x.id === productId) : null;
    const variants = isEdit ? await this.fetchVariantsFor(productId) : [];

    document.getElementById('modal-title').textContent = isEdit ? `Edit — ${p.name}` : 'Add New Product';

    const typeOpts = ['single','bundle','gift_set'].map(t =>
      `<option value="${t}"${p?.type===t?' selected':''}>${{single:'Single Candle',bundle:'Bundle',gift_set:'Gift Set'}[t]}</option>`).join('');
    const categoryOpts = ['scented','unscented','both'].map(c =>
      `<option value="${c}"${p?.category===c?' selected':''}>${c.charAt(0).toUpperCase()+c.slice(1)}</option>`).join('');

    document.getElementById('modal-body').innerHTML = `
      <style>
        .pm-tabs{display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:24px}
        .pm-tab{padding:10px 18px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;
          color:var(--muted);border-bottom:2px solid transparent;background:none;border-top:none;border-left:none;border-right:none;
          transition:color 0.2s;font-family:inherit}
        .pm-tab.active{color:var(--espresso);border-bottom-color:var(--gold)}
        .pm-panel{display:none}.pm-panel.active{display:block}
        .pm-field{margin-bottom:16px}
        .pm-label{display:block;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:var(--muted);margin-bottom:6px}
        .pm-input,.pm-select,.pm-textarea{width:100%;padding:10px 12px;border:1px solid var(--border-dark);
          background:transparent;font-size:13px;color:var(--espresso);outline:none;font-family:inherit;
          transition:border-color 0.2s}
        .pm-input:focus,.pm-select:focus,.pm-textarea:focus{border-color:var(--gold)}
        .pm-textarea{resize:vertical;min-height:80px}
        .pm-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .pm-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
        .pm-check{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--muted);cursor:pointer}
        .pm-check input{cursor:pointer;accent-color:var(--gold)}
        .variant-row{display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto;gap:8px;align-items:center;
          padding:10px 0;border-bottom:1px solid var(--border)}
        .variant-row:last-child{border:none}
        .var-input{padding:7px 10px;border:1px solid var(--border-dark);font-size:12px;outline:none;
          font-family:inherit;width:100%;background:transparent;color:var(--espresso)}
        .var-input:focus{border-color:var(--gold)}
        .del-var{background:none;border:1px solid var(--border-dark);padding:4px 8px;cursor:pointer;
          font-size:16px;color:var(--red);transition:background 0.15s}
        .del-var:hover{background:var(--red);color:white}
        .add-var-btn{background:none;border:1px dashed var(--sand);padding:8px 16px;width:100%;
          font-size:11px;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;color:var(--muted);
          margin-top:10px;transition:all 0.2s;font-family:inherit}
        .add-var-btn:hover{border-color:var(--gold);color:var(--gold)}
        .pm-save-row{display:flex;gap:10px;margin-top:24px;padding-top:20px;border-top:1px solid var(--border)}
      </style>

      <!-- Tabs -->
      <div class="pm-tabs">
        <button class="pm-tab active" onclick="pmTab('info')">Product Info</button>
        <button class="pm-tab" onclick="pmTab('pricing')">Pricing & Variants</button>
        <button class="pm-tab" onclick="pmTab('media')">Media & SEO</button>
        ${isEdit ? `<button class="pm-tab" onclick="pmTab('danger')" style="color:var(--red)">Danger Zone</button>` : ''}
      </div>

      <!-- Tab: Info -->
      <div class="pm-panel active" id="pm-info">
        <div class="pm-row">
          <div class="pm-field">
            <label class="pm-label">Product ID *</label>
            <input class="pm-input" id="pm-id" placeholder="velvet-vanilla" value="${esc(p?.id||'')}" ${isEdit?'readonly':''}>
            ${!isEdit?'<small style="font-size:10px;color:var(--muted)">Lowercase, hyphens only. Cannot change after saving.</small>':''}
          </div>
          <div class="pm-field">
            <label class="pm-label">Product Name *</label>
            <input class="pm-input" id="pm-name" placeholder="Velvet Vanilla" value="${esc(p?.name||'')}">
          </div>
        </div>
        <div class="pm-row">
          <div class="pm-field">
            <label class="pm-label">Type</label>
            <select class="pm-select" id="pm-type">${typeOpts}</select>
          </div>
          <div class="pm-field">
            <label class="pm-label">Category</label>
            <select class="pm-select" id="pm-category">${categoryOpts}</select>
          </div>
        </div>
        <div class="pm-field">
          <label class="pm-label">Fragrance Notes (short)</label>
          <input class="pm-input" id="pm-notes" placeholder="Tahitian Vanilla · Warm Musk · Amber" value="${esc(p?.notes||'')}">
        </div>
        <div class="pm-field">
          <label class="pm-label">Short Description</label>
          <input class="pm-input" id="pm-short-desc" placeholder="One-line tagline" value="${esc(p?.short_desc||'')}">
        </div>
        <div class="pm-field">
          <label class="pm-label">Full Description</label>
          <textarea class="pm-textarea" id="pm-description" rows="4" placeholder="Full product description...">${esc(p?.description||'')}</textarea>
        </div>
        <div class="pm-row-3">
          <div class="pm-field">
            <label class="pm-label">Top Notes</label>
            <input class="pm-input" id="pm-frag-top" value="${esc(p?.fragrance_top||'')}">
          </div>
          <div class="pm-field">
            <label class="pm-label">Heart Notes</label>
            <input class="pm-input" id="pm-frag-mid" value="${esc(p?.fragrance_mid||'')}">
          </div>
          <div class="pm-field">
            <label class="pm-label">Base Notes</label>
            <input class="pm-input" id="pm-frag-base" value="${esc(p?.fragrance_base||'')}">
          </div>
        </div>
        <div class="pm-row-3">
          <div class="pm-field">
            <label class="pm-label">Burn Time</label>
            <input class="pm-input" id="pm-burn" value="${esc(p?.burn_time||'60–70 hours')}">
          </div>
          <div class="pm-field">
            <label class="pm-label">Size (wt)</label>
            <input class="pm-input" id="pm-size" value="${esc(p?.size||'300g')}">
          </div>
          <div class="pm-field">
            <label class="pm-label">Sort Order</label>
            <input class="pm-input" type="number" id="pm-sort" value="${p?.sort_order||99}" min="0">
          </div>
        </div>
        <div class="pm-field">
          <label class="pm-label">Badges (comma separated)</label>
          <input class="pm-input" id="pm-badges" placeholder="Bestseller, New" value="${esc((p?.badges||[]).join(', '))}">
        </div>
        <div style="display:flex;gap:20px;flex-wrap:wrap;margin-top:8px">
          <label class="pm-check"><input type="checkbox" id="pm-active" ${p?.is_active!==false?'checked':''}> Active (visible on store)</label>
          <label class="pm-check"><input type="checkbox" id="pm-featured" ${p?.is_featured?'checked':''}> Featured on Homepage</label>
          <label class="pm-check"><input type="checkbox" id="pm-bestseller" ${p?.is_bestseller?'checked':''}> Bestseller</label>
        </div>
      </div>

      <!-- Tab: Pricing & Variants -->
      <div class="pm-panel" id="pm-pricing">
        <div class="pm-row" style="margin-bottom:20px">
          <div class="pm-field">
            <label class="pm-label">Base Original Price (₹) *</label>
            <input class="pm-input" type="number" id="pm-orig-price" placeholder="1499" value="${p?.original_price||''}" min="0">
          </div>
          <div class="pm-field">
            <label class="pm-label">Base Sale Price (₹) *</label>
            <input class="pm-input" type="number" id="pm-sale-price" placeholder="1199" value="${p?.sale_price||''}" min="0">
          </div>
        </div>

        <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:var(--muted);margin-bottom:14px">
          Variants (e.g. Set of 2, Unscented, different sizes)
        </p>
        <div style="font-size:10px;color:var(--muted);display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto;gap:8px;padding-bottom:6px;border-bottom:1px solid var(--border)">
          <span>Variant Name</span><span>Qty</span><span>Original ₹</span><span>Sale ₹</span><span></span>
        </div>
        <div id="pm-variants-list">
          ${variants.length ? variants.map((v,i) => pmVariantRow(v, i)).join('') : ''}
        </div>
        <button class="add-var-btn" onclick="pmAddVariant()">+ Add Variant</button>
        <p style="font-size:11px;color:var(--muted);margin-top:14px;line-height:1.6">
          💡 Examples: "Scented · Single", "Scented · Set of 2", "Unscented · Single", "Gift Wrapped".
          Leave empty if this product has no options.
        </p>
      </div>

      <!-- Tab: Media & SEO -->
      <div class="pm-panel" id="pm-media">
        <div class="pm-field">
          <label class="pm-label">Primary Image URL *</label>
          <input class="pm-input" id="pm-image" placeholder="https://..." value="${esc(p?.image||'')}">
          <div id="pm-img-preview" style="margin-top:8px">
            ${p?.image ? `<img src="${esc(p.image)}" style="width:120px;height:150px;object-fit:cover;background:var(--cashmere)">` : ''}
          </div>
        </div>
        <div class="pm-field">
          <label class="pm-label">Additional Images (one URL per line)</label>
          <textarea class="pm-textarea" id="pm-images" rows="3" placeholder="https://image2.jpg&#10;https://image3.jpg">${esc((p?.images||[]).join('\n'))}</textarea>
        </div>
        <div class="pm-field" style="margin-top:16px">
          <label class="pm-label">SEO Title</label>
          <input class="pm-input" id="pm-meta-title" placeholder="Velvet Vanilla Candle — Grace Home" value="${esc(p?.meta_title||'')}">
        </div>
        <div class="pm-field">
          <label class="pm-label">SEO Description</label>
          <textarea class="pm-textarea" id="pm-meta-desc" rows="2" placeholder="Meta description for Google...">${esc(p?.meta_desc||'')}</textarea>
        </div>
        <button onclick="document.getElementById('pm-img-preview').innerHTML=document.getElementById('pm-image').value?'<img src=\\''+document.getElementById('pm-image').value+'\\' style=\\'width:120px;height:150px;object-fit:cover;background:var(--cashmere)\\'>':''"
          style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;padding:8px 16px;border:1px solid var(--border-dark);background:transparent;cursor:pointer;color:var(--muted);font-family:inherit">
          Preview Image
        </button>
      </div>

      ${isEdit ? `
      <!-- Tab: Danger -->
      <div class="pm-panel" id="pm-danger">
        <div style="background:#FFF0EE;border:1px solid #F5C6CB;padding:24px;margin-bottom:20px">
          <p style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--red);margin-bottom:12px">Delete Product</p>
          <p style="font-size:13px;color:var(--muted);line-height:1.7;margin-bottom:16px">
            This will permanently delete <strong>${esc(p?.name)}</strong> and all its variants from the database.
            This cannot be undone. Consider setting the product to <strong>Inactive</strong> instead.
          </p>
          <button onclick="Admin.deleteProduct('${esc(productId)}')"
            style="padding:10px 20px;background:var(--red);color:white;border:none;cursor:pointer;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-family:inherit">
            Delete "${esc(p?.name)}" Permanently
          </button>
        </div>
        <div style="background:var(--cream);border:1px solid var(--border);padding:20px">
          <p style="font-size:13px;color:var(--muted);margin-bottom:12px">Toggle visibility without deleting:</p>
          <button onclick="Admin.toggleProductActive('${esc(productId)}',${!p?.is_active})"
            style="padding:10px 20px;background:var(--espresso);color:var(--ivory);border:none;cursor:pointer;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-family:inherit">
            ${p?.is_active ? 'Set to Inactive (hide from store)' : 'Set to Active (show on store)'}
          </button>
        </div>
      </div>` : ''}

      <!-- Save Row -->
      <div class="pm-save-row">
        <button onclick="Admin.saveProduct(${isEdit?`'${esc(productId)}'`:null})"
          style="padding:12px 28px;background:var(--espresso);color:var(--ivory);border:none;cursor:pointer;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-family:inherit;transition:background 0.2s"
          onmouseover="this.style.background='var(--gold)'" onmouseout="this.style.background='var(--espresso)'">
          ${isEdit ? 'Save Changes' : 'Create Product'}
        </button>
        <button onclick="Admin.closeModal()"
          style="padding:12px 20px;background:transparent;border:1px solid var(--border-dark);cursor:pointer;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-family:inherit;color:var(--muted)">
          Cancel
        </button>
        ${isEdit ? `<span id="pm-save-status" style="font-size:12px;color:var(--muted);margin-left:auto;align-self:center"></span>` : ''}
      </div>`;

    document.getElementById('order-modal').classList.add('open');

    // Tab switching
    window.pmTab = function(tab) {
      document.querySelectorAll('.pm-tab').forEach((t,i) => {
        const tabs = ['info','pricing','media','danger'];
        t.classList.toggle('active', tabs[i] === tab);
      });
      document.querySelectorAll('.pm-panel').forEach(p => p.classList.remove('active'));
      const el = document.getElementById(`pm-${tab}`);
      if (el) el.classList.add('active');
    };

    // Image preview on blur
    const imgInput = document.getElementById('pm-image');
    if (imgInput) {
      imgInput.addEventListener('blur', () => {
        const prev = document.getElementById('pm-img-preview');
        if (prev && imgInput.value) prev.innerHTML = `<img src="${imgInput.value}" style="width:120px;height:150px;object-fit:cover;background:var(--cashmere)">`;
      });
    }

    window._pmVarCount = variants.length;
  },

  async fetchVariantsFor(productId) {
    try {
      const rows = await DB.get(`product_variants?product_id=eq.${encodeURIComponent(productId)}&order=sort_order.asc`);
      return rows || [];
    } catch { return []; }
  },

  /* ── Save Product ── */
  async saveProduct(productId) {
    const statusEl = document.getElementById('pm-save-status');
    if (statusEl) statusEl.textContent = 'Saving...';

    const id   = document.getElementById('pm-id').value.trim().toLowerCase().replace(/[^a-z0-9-]/g,'-');
    const name = document.getElementById('pm-name').value.trim();
    if (!id || !name) { toast('Product ID and Name are required.', 'error'); return; }

    const origPrice = parseFloat(document.getElementById('pm-orig-price').value)||0;
    const salePrice = parseFloat(document.getElementById('pm-sale-price').value)||0;
    if (salePrice <= 0 || origPrice <= 0) { toast('Prices must be greater than 0.', 'error'); return; }

    const imageUrl  = document.getElementById('pm-image').value.trim();
    const extraImgs = document.getElementById('pm-images').value.trim()
      .split('\n').map(u=>u.trim()).filter(Boolean);

    const payload = {
      id,
      name,
      type:          document.getElementById('pm-type').value,
      category:      document.getElementById('pm-category').value,
      notes:         document.getElementById('pm-notes').value.trim(),
      short_desc:    document.getElementById('pm-short-desc').value.trim(),
      description:   document.getElementById('pm-description').value.trim(),
      fragrance_top: document.getElementById('pm-frag-top').value.trim(),
      fragrance_mid: document.getElementById('pm-frag-mid').value.trim(),
      fragrance_base:document.getElementById('pm-frag-base').value.trim(),
      burn_time:     document.getElementById('pm-burn').value.trim(),
      size:          document.getElementById('pm-size').value.trim(),
      original_price:origPrice,
      sale_price:    salePrice,
      image:         imageUrl,
      images:        imageUrl ? [imageUrl, ...extraImgs] : extraImgs,
      badges:        document.getElementById('pm-badges').value.split(',').map(b=>b.trim()).filter(Boolean),
      is_active:     document.getElementById('pm-active').checked,
      is_featured:   document.getElementById('pm-featured').checked,
      is_bestseller: document.getElementById('pm-bestseller').checked,
      sort_order:    parseInt(document.getElementById('pm-sort').value)||99,
      meta_title:    document.getElementById('pm-meta-title')?.value.trim()||'',
      meta_desc:     document.getElementById('pm-meta-desc')?.value.trim()||'',
      updated_at:    new Date().toISOString()
    };

    try {
      // Update local allProducts
      const existing = this.allProducts.findIndex(p => p.id === id);
      if (existing >= 0) this.allProducts[existing] = { ...this.allProducts[existing], ...payload };
      else this.allProducts.unshift(payload);

      this.renderProducts();
      this.closeModal();
      toast(`Product "${name}" saved successfully!`, 'success');
    } catch (e) {
      if (statusEl) statusEl.textContent = 'Error — check Supabase config';
      toast('Save failed: ' + e.message, 'error');
    }
  },

  collectVariants(productId) {
    const rows = document.querySelectorAll('#pm-variants-list .variant-row');
    return Array.from(rows).map(row => ({
      id:            row.dataset.variantId || ('new-' + Math.random()),
      product_id:    productId,
      variant_name:  row.querySelector('.var-name').value.trim(),
      variant_type:  row.querySelector('.var-type')?.value || 'custom',
      quantity:      parseInt(row.querySelector('.var-qty').value)||1,
      scent_type:    row.querySelector('.var-scent')?.value || 'scented',
      original_price:parseFloat(row.querySelector('.var-orig').value)||0,
      sale_price:    parseFloat(row.querySelector('.var-sale').value)||0,
      is_default:    row.querySelector('.var-default')?.checked || false,
      sort_order:    parseInt(row.dataset.sortOrder)||0,
      is_active:     true,
      _delete:       row.dataset.deleted === 'true'
    })).filter(v => v.variant_name);
  },

  async deleteProduct(productId) {
    if (!confirm(`Delete product "${productId}"? This cannot be undone.`)) return;
    try {
      this.allProducts = this.allProducts.filter(p => p.id !== productId);
      this.renderProducts();
      this.closeModal();
      toast('Product deleted', 'success');
    } catch(e) { toast('Delete failed: ' + e.message, 'error'); }
  },

  async toggleProductActive(productId, newState) {
    try {
      const p = this.allProducts.find(x => x.id === productId);
      if (p) p.is_active = newState;
      this.renderProducts();
      this.closeModal();
      toast(`Product ${newState ? 'activated' : 'deactivated'}`, 'success');
    } catch(e) { toast('Toggle failed: ' + e.message, 'error'); }
  }
});

/* ── DB helpers for admin ─────────────────────────────────── */
/* DB operations are now stubbed out in admin.html for static mode */

/* ── Variant row HTML ─────────────────────────────────────── */
function pmVariantRow(v, idx) {
  return `
    <div class="variant-row" data-variant-id="${esc(v.id||'')}" data-sort-order="${idx}" data-deleted="false">
      <div style="display:flex;flex-direction:column;gap:4px">
        <input class="var-input var-name" placeholder="e.g. Scented · Set of 2" value="${esc(v.variant_name||'')}">
        <div style="display:flex;gap:6px;align-items:center">
          <select class="var-input var-scent" style="font-size:10px;padding:4px 6px">
            <option value="scented"   ${v.scent_type==='scented'   ?'selected':''}>Scented</option>
            <option value="unscented" ${v.scent_type==='unscented' ?'selected':''}>Unscented</option>
          </select>
          <label style="font-size:10px;color:var(--muted);cursor:pointer;display:flex;align-items:center;gap:4px">
            <input type="checkbox" class="var-default" ${v.is_default?'checked':''} style="accent-color:var(--gold)"> Default
          </label>
        </div>
      </div>
      <input class="var-input var-qty" type="number" min="1" placeholder="Qty" value="${v.quantity||1}" style="width:60px">
      <input class="var-input var-orig" type="number" min="0" placeholder="₹ Orig" value="${v.original_price||''}">
      <input class="var-input var-sale" type="number" min="0" placeholder="₹ Sale" value="${v.sale_price||''}">
      <button class="del-var" onclick="this.closest('.variant-row').dataset.deleted='true';this.closest('.variant-row').style.opacity='0.3'" title="Remove variant">×</button>
    </div>`;
}

/* Global add variant */
window.pmAddVariant = function() {
  const list = document.getElementById('pm-variants-list');
  if (!list) return;
  const idx = list.querySelectorAll('.variant-row').length;
  const div = document.createElement('div');
  div.innerHTML = pmVariantRow({ id: 'new-'+Date.now(), variant_name:'', quantity:1, scent_type:'scented', original_price:'', sale_price:'', is_default:false }, idx);
  list.appendChild(div.firstElementChild);
};

/* Add button to products table header */
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('#page-products .table-header .table-controls');
  if (addBtn) {
    const btn = document.createElement('button');
    btn.className = 'export-btn';
    btn.style.background = 'var(--gold)';
    btn.textContent = '+ Add Product';
    btn.onclick = () => Admin.openProductModal();
    addBtn.prepend(btn);
  }
});
