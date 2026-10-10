const INITIAL_CART_ITEMS = [
  { id: 'victoria-tee', name: 'VICTORIA TEE', price: 1260000, image: '../Image/VICTORIA TEE.jpg', qty: 1 },
  { id: 'textured-sweater', name: 'TEXTURED ZIP HOODED SWEATER', price: 3750000, image: '../Image/TEXTURED ZIP HOODED SWEATER.jpg', qty: 1 },
  { id: 'world-tour-camo', name: 'STUSSY WORLD TOUR TEE CAMO', price: 2970000, image: '../Image/worldteecamo.png', qty: 2 }
];

function formatStaticMoney(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')}đ`;
}

function readCartItems() {
  const items = window.StaticStore ? StaticStore.getCart() : [];
  if (items.length) return items;
  const seeded = INITIAL_CART_ITEMS.map((item) => ({ ...item }));
  if (window.StaticStore) StaticStore.saveCart(seeded);
  return seeded;
}

function writeCartItems(items) {
  if (window.StaticStore) StaticStore.saveCart(items);
}

document.addEventListener('DOMContentLoaded', function () {
  const cartMain = document.querySelector('main');
  const selectAll = document.getElementById('select-all');
  const totalEl = document.getElementById('total');
  const countEl = document.getElementById('count');
  const selectedCountEl = document.getElementById('select-count');
  const checkoutCountEl = document.getElementById('ttcount');
  const summaryEl = document.getElementById('thanhtoan-list');
  let items = readCartItems();

  function updateSummary() {
    const checks = [...document.querySelectorAll('.item-check')];
    const selected = items.filter((item) => checks.some((check) => check.checked && check.closest('.cart-item')?.dataset.id === item.id));
    const total = selected.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0);
    if (countEl) countEl.textContent = `(${items.length})`;
    if (selectedCountEl) selectedCountEl.textContent = `Đã chọn (${selected.length})`;
    if (checkoutCountEl) checkoutCountEl.textContent = `(${selected.length})`;
    if (totalEl) totalEl.textContent = formatStaticMoney(total);
    if (summaryEl) summaryEl.innerHTML = selected.map((item) => `<div>${item.name} x${item.qty}</div>`).join('');
    if (selectAll) selectAll.checked = checks.length > 0 && checks.every((check) => check.checked);
    document.querySelectorAll('.cart-count').forEach((badge) => {
      badge.textContent = String(items.reduce((sum, item) => sum + Number(item.qty || 0), 0));
    });
  }

  function render() {
    if (!cartMain) return;
    cartMain.querySelectorAll('.cart-item, .cart-empty').forEach((node) => node.remove());
    if (!items.length) {
      const empty = document.createElement('div');
      empty.className = 'cart-empty';
      empty.textContent = 'Giỏ hàng đang trống.';
      cartMain.appendChild(empty);
    }
    items.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.dataset.id = item.id;
      row.innerHTML = `<div class="col-sanpham item-info"><input class="item-check" type="checkbox" checked><img src="${item.image || '../Image/logo.jpg'}" alt="${item.name}" class="item-thumb"><div class="item-details"><div class="product-name">${item.name}</div><div class="product-price">${formatStaticMoney(item.price)}</div></div></div><div class="col-soluong"><div class="qty-control"><button type="button" class="qty-minus">-</button><input value="${item.qty}" readonly><button type="button" class="qty-plus">+</button></div></div><div class="col-sotien price-total">${formatStaticMoney(item.price * item.qty)}</div><div class="col-thaotac"><button type="button" class="btn-delete">Xóa</button></div>`;
      cartMain.appendChild(row);
    });
    updateSummary();
  }

  cartMain?.addEventListener('change', updateSummary);
  cartMain?.addEventListener('click', function (event) {
    const row = event.target.closest('.cart-item');
    if (!row) return;
    const index = items.findIndex((item) => item.id === row.dataset.id);
    if (index < 0) return;
    if (event.target.closest('.qty-plus')) items[index].qty += 1;
    if (event.target.closest('.qty-minus')) items[index].qty = Math.max(1, items[index].qty - 1);
    if (event.target.closest('.btn-delete')) items.splice(index, 1);
    writeCartItems(items);
    render();
  });
  selectAll?.addEventListener('change', function () {
    document.querySelectorAll('.item-check').forEach((check) => { check.checked = selectAll.checked; });
    updateSummary();
  });
  document.getElementById('clear')?.addEventListener('click', function () {
    items = [];
    writeCartItems(items);
    render();
  });
  render();
});
