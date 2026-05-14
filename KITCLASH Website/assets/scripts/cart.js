document.addEventListener('DOMContentLoaded', function () {
  renderCart();
});

function renderCart() {
  var cart       = getCart();
  var tbody      = document.getElementById('cart-items');
  var totalEl    = document.getElementById('cart-total');
  var emptyState = document.getElementById('empty-state');
  var cartTable  = document.getElementById('cart-table-wrap');

  if (!tbody) return;
  tbody.innerHTML = '';

  if (cart.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (cartTable)  cartTable.style.display  = 'none';
    if (totalEl)    totalEl.innerText = '€0.00';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (cartTable)  cartTable.style.display  = 'block';

  var total = 0;

  cart.forEach(function (item) {
    var lineTotal = item.price * item.qty;
    total += lineTotal;

    var tr = document.createElement('tr');
    tr.setAttribute('data-id', item.id);
    tr.innerHTML =
      '<td>' +
        '<div style="display:flex;align-items:center;gap:16px;">' +
          '<img src="' + escHtml(item.image) + '" alt="' + escHtml(item.name) + '" ' +
               'onerror="this.src=\'assets/images/placeholder.png\'" ' +
               'style="width:80px;height:80px;object-fit:cover;border-radius:6px;background:#f3f3f5;">' +
          '<div>' +
            '<p style="margin:0;font-weight:700;color:#0F1129;">' + escHtml(item.name) + '</p>' +
            '<p style="margin:4px 0 0;font-size:.85rem;color:#666;">Size: ' + escHtml(item.size) + '</p>' +
            '<p style="margin:4px 0 0;font-size:.85rem;color:#888;">€' + item.price.toFixed(2) + ' each</p>' +
          '</div>' +
        '</div>' +
      '</td>' +
      '<td>' +
        '<div style="display:flex;align-items:center;gap:10px;">' +
          '<button class="qty-btn" onclick="changeQty(\'' + escHtml(item.id) + '\', -1)">−</button>' +
          '<span style="font-weight:700;min-width:20px;text-align:center;">' + item.qty + '</span>' +
          '<button class="qty-btn" onclick="changeQty(\'' + escHtml(item.id) + '\', 1)">+</button>' +
        '</div>' +
      '</td>' +
      '<td>' +
        '<span style="font-weight:700;color:#0F1129;">€' + lineTotal.toFixed(2) + '</span><br>' +
        '<button onclick="removeItem(\'' + escHtml(item.id) + '\')" ' +
                'style="background:none;border:none;color:#aaa;font-size:.8rem;cursor:pointer;text-decoration:underline;">Remove</button>' +
      '</td>';

    tbody.appendChild(tr);
  });

  if (totalEl) totalEl.innerText = '€' + total.toFixed(2);
}

function changeQty(id, delta) {
  var cart = getCart();
  var idx  = cart.findIndex(function (c) { return c.id === id; });
  if (idx === -1) return;
  cart[idx].qty = Math.max(1, Math.min(9, cart[idx].qty + delta));
  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  saveCart(getCart().filter(function (c) { return c.id !== id; }));
  renderCart();
}

function getCart()      { return JSON.parse(localStorage.getItem('kitclash_cart') || '[]'); }
function saveCart(cart) { localStorage.setItem('kitclash_cart', JSON.stringify(cart)); }

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}