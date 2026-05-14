/* ============================================================
product-page.js  –  KitClash product page logic
Handles: gallery, lightbox, size select, qty, add-to-cart
============================================================ */

/* ---------- GALLERY ---------- */
var galleryImages = [];
var currentIndex  = 0;

(function buildGallery() {
  var thumbs = document.querySelectorAll('.gallery-thumb img');
  thumbs.forEach(function(img) { galleryImages.push(img.src); });
})();

function myFunction(img) {
  currentIndex = galleryImages.indexOf(img.src);
  openLightbox(img.src);
}

/* ---------- LIGHTBOX ---------- */
function openLightbox(src) {
  var lb    = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  lbImg.src = src;
  lb.style.display = 'flex';
}

function closeLightbox(e) {
  if (e.target === document.getElementById('lightbox')) {
    document.getElementById('lightbox').style.display = 'none';
  }
}

function closeLightboxDirect() {
  document.getElementById('lightbox').style.display = 'none';
}

function shiftImage(dir) {
  currentIndex = (currentIndex + dir + galleryImages.length) % galleryImages.length;
  document.getElementById('lb-img').src = galleryImages[currentIndex];
}

/* ---------- SIZE BUTTON STYLES (injected so they always override) ---------- */
(function injectSizeStyles() {
  var style = document.createElement('style');
  style.textContent =
  '.size-btn { border: 2px solid #0F1129; background: #fff; color: #0F1129; transition: background .15s, color .25s}' +
  '.size-btn:hover { background: #e8e9f0; color: #0F1129; }' +
  '.size-btn.selected { background: #0F1129; color: #fff; border-color: #0F1129; }';
  document.head.appendChild(style);
})();

/* ---------- SIZE SELECTION ---------- */
function selectSize(btn) {
  document.querySelectorAll('.size-btn').forEach(function(b) {
    b.classList.remove('selected');
  });
  btn.classList.add('selected');
}

/* ---------- QUANTITY ---------- */
function changeQty(delta) {
  var input = document.getElementById('qty');
  var val   = parseInt(input.value) + delta;
  if (val >= 1 && val <= 9) input.value = val;
}

/* ---------- ADD TO CART ---------- */
document.addEventListener('DOMContentLoaded', function() {
  var addBtn = document.querySelector('.btn-cart');
  if (!addBtn) return;
  
  addBtn.addEventListener('click', function() {
    
    /* Validate size */
    var selectedSize = document.querySelector('.size-btn.selected');
    if (!selectedSize) {
      showToast('Please select a size first.', 'error');
      return;
    }
    
    /* Gather product data from the page */
    var productName  = document.querySelector('.product-title')
    ? document.querySelector('.product-title').innerText.trim()
    : 'Unknown Product';
    var productPrice = document.querySelector('.product-price')
    ? document.querySelector('.product-price').innerText.replace(/[^0-9.]/g, '')
    : '0';
    var productImage = document.querySelector('.gallery-thumb img')
    ? document.querySelector('.gallery-thumb img').src
    : '';
    var productSize  = selectedSize.innerText.trim();
    var productQty   = parseInt(document.getElementById('qty').value) || 1;
    
    /* Build cart item */
    var item = {
      id       : productName + '-' + productSize,
      name     : productName,
      price    : parseFloat(productPrice),
      image    : productImage,
      size     : productSize,
      qty      : productQty
    };
    
    /* Load existing cart, merge or add */
    var cart = JSON.parse(localStorage.getItem('kitclash_cart') || '[]');
    var existing = cart.findIndex(function(c) { return c.id === item.id; });
    
    if (existing > -1) {
      cart[existing].qty = Math.min(9, cart[existing].qty + item.qty);
    } else {
      cart.push(item);
    }
    
    localStorage.setItem('kitclash_cart', JSON.stringify(cart));
    showToast('Added to cart!', 'success');
  });
});

/* ---------- TOAST NOTIFICATION ---------- */
function showToast(msg, type) {
  var old = document.getElementById('kc-toast');
  if (old) old.remove();
  
  var toast = document.createElement('div');
  toast.id = 'kc-toast';
  toast.innerText = msg;
  Object.assign(toast.style, {
    position    : 'fixed',
    bottom      : '30px',
    right       : '30px',
    background  : type === 'success' ? '#0F1129' : '#e63946',
    color       : '#fff',
    padding     : '14px 24px',
    borderRadius: '8px',
    fontSize    : '16px',
    fontWeight  : '600',
    zIndex      : '9999',
    boxShadow   : '0 4px 15px rgba(0,0,0,0.25)',
    transition  : 'opacity 0.4s ease',
    opacity     : '1'
  });
  
  document.body.appendChild(toast);
  
  setTimeout(function() {
    toast.style.opacity = '0';
    setTimeout(function() { toast.remove(); }, 400);
  }, 2500);
}