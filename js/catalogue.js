'use strict';

const CATALOGUE_PRODUCTS = [
  { id: 'azure-bloom', name: 'Azure Bloom', description: 'Stunning blue-tinted artisan jar candle.', category: 'jar', tag: 'Jar', image: 'assets/azurebloom.jpg', bg: '#eef2f3' },
  { id: 'eternal-embrace', name: 'Eternal Embrace', description: 'Timeless sculptural piece for your home.', category: 'mould', tag: 'Mould', image: 'assets/eternalembrace.jpg', bg: '#f5f5f5' },
  { id: 'ivory-rose', name: 'Ivory Rose', description: 'Elegant rose sculpture in pure soy-coconut wax.', category: 'mould', tag: 'Mould', image: 'assets/ivoryrose.jpg', bg: '#fff0f3' },
  { id: 'rose-sculpture', name: 'Rose Sculpture', description: 'Intricate floral pillar candle.', category: 'mould', tag: 'Mould', image: 'assets/rosesculpture.jpg', bg: '#f9f9f9' },
  { id: 'strawberry-milk', name: 'Strawberry Milk', description: 'Sweet, creamy blend of fresh strawberries.', category: 'jar', tag: 'Jar', image: 'assets/strawberrymilk.jpg', bg: '#fff0f3' },
  { id: 'teddy-heart-jar', name: 'Teddy Heart Jar', description: 'Adorable teddy heart design for a cozy glow.', category: 'jar', tag: 'Jar', image: 'assets/teddyheartjarcandle.jpg', bg: '#fcfcfc' },
  { id: 'wedding-couple', name: 'Wedding Couple', description: 'The perfect gift for anniversaries and weddings.', category: 'mould', tag: 'Mould', image: 'assets/weddingcouplerosecandle.jpg', bg: '#f5f5f5' },
  { id: 'coconut-blossom', name: 'Coconut Blossom', description: 'Tropical paradise in a real coconut shell.', category: 'jar', tag: 'Jar', image: 'assets/coconutblossom.jpg', bg: '#e8f5e9' },
  { id: 'daisy-bloom', name: 'Daisy Bloom', description: 'Delicate daisy design to brighten any space.', category: 'mould', tag: 'Mould', image: 'assets/daisybloomcandle.jpg', bg: '#fff0f3' },
  { id: 'striped-candle', name: 'Striped Pillar', description: 'Elegant striped pillar for modern decor.', category: 'pillar', tag: 'Pillar', image: 'assets/stripedcandle.jpg', bg: '#ffffff' },
  { id: 'teddy-bear', name: 'Teddy Bear', description: 'Playful and aesthetic teddy bear mould.', category: 'mould', tag: 'Mould', image: 'assets/teddybear.jpg', bg: '#f9f9f9' },
  { id: 'aura-wave', name: 'Aura Wave', description: 'Rhythmic patterns of light and scent.', category: 'mould', tag: 'Mould', image: 'assets/aurawave.jpg', bg: '#f5f5f5' },
  { id: 'blue-blossom', name: 'Blue Blossom', description: 'A vibrant floral escape in every burn.', category: 'jar', tag: 'Jar', image: 'assets/blueblossom.jpg', bg: '#eef2f3' },
  { id: 'bubble-pack', name: 'Bubble Candle (Pack of 4)', description: 'Modern aesthetic mini-bubble collection.', category: 'mould', tag: 'Mould', image: 'assets/bubble.jpg', bg: '#ffffff' },
  { id: 'lavender-gradient', name: 'Lavender Gradient', description: 'Beautifully layered lavender scent experience.', category: 'jar', tag: 'Jar', image: 'assets/lavendergradient.jpg', bg: '#f3e5f5' },
  { id: 'lavender-mist', name: 'Lavender Mist', description: 'A refreshing mist of pure lavender.', category: 'jar', tag: 'Jar', image: 'assets/lavendermist.jpg', bg: '#f3e5f5' }
];

const CATALOGUE_CONFIG = {
  WHATSAPP_NUMBER: '917900187209'
};

function renderCatalogue() {
  const grid = document.getElementById('catalogue-grid');
  if (!grid) return;

  grid.innerHTML = CATALOGUE_PRODUCTS.map(p => `
    <article class="product-card">
      <div class="product-image-wrap" style="background-color: ${p.bg}">
        <img src="${p.image}" alt="${p.name}" onerror="this.style.opacity='0'" loading="lazy">
        <div class="product-badge"><span class="badge">${p.tag}</span></div>
      </div>
      <div class="product-body">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-notes" style="height: auto; margin-bottom: 8px;">${p.description}</p>
        <button class="btn btn-primary btn-sm btn-full" style="margin-top: 20px;" onclick="openEnquiryModal('${p.id}')">
          <span>Enquire Now</span>
        </button>
      </div>
    </article>
  `).join('');
}

/* --- Modal Logic --- */
let currentProduct = null;
const modal = document.getElementById('enquiry-modal');

window.openEnquiryModal = function(productId) {
  currentProduct = CATALOGUE_PRODUCTS.find(p => p.id === productId);
  if (!currentProduct) return;

  document.getElementById('modal-product-title').textContent = `Enquiry for: ${currentProduct.name}`;
  document.getElementById('enq-message').value = `Hi, I'm interested in placing a bulk/large order for ${currentProduct.name}. Please get in touch with me.`;
  
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

function closeEnquiryModal() {
  modal.style.display = 'none';
  document.body.style.overflow = '';
  document.getElementById('enquiry-form').reset();
}

document.getElementById('close-enquiry')?.addEventListener('click', closeEnquiryModal);
modal?.addEventListener('click', (e) => { if (e.target === modal) closeEnquiryModal(); });

document.getElementById('send-whatsapp')?.addEventListener('click', () => {
  const name = document.getElementById('enq-name').value.trim();
  const phone = document.getElementById('enq-phone').value.trim();
  const messageText = document.getElementById('enq-message').value.trim();

  if (!name || !phone) {
    alert('Please fill in your name and phone number.');
    return;
  }

  const whatsappMsg = `Hi Grace Home Candles! I'm ${name}. I'm interested in a bulk order for ${currentProduct.name}. Please contact me on ${phone}.`;
  
  const url = `https://wa.me/${CATALOGUE_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`;
  window.open(url, '_blank');
  closeEnquiryModal();
});

document.addEventListener('DOMContentLoaded', () => renderCatalogue());