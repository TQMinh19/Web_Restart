document.addEventListener('DOMContentLoaded', function () {
  const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
  const userEmail = localStorage.getItem('userEmail');
  if (!loggedIn || !userEmail) {
    alert('Vui lòng đăng nhập trước khi đặt hàng.');
    window.location.href = 'dangnhap.html?redirect=giohang.html';
    return;
  }
  const list = document.getElementById('checkout-items');
  const totalEl = document.getElementById('checkout-total');
  const form = document.getElementById('checkout-form');
  if (!list || !totalEl) return;

  const user = (window.StaticStore ? StaticStore.getUsers() : [])
    .find(item => item.email === userEmail);
  if (user) {
    const setValue = (name, value) => {
      const field = form?.querySelector(`[name="${name}"]`);
      if (field && value) field.value = value;
    };
    const parts = String(user.address || '').split(',').map(part => part.trim());
    setValue('customer_name', user.name);
    setValue('customer_phone', user.phone);
    setValue('street_address', parts.shift() || user.address);
    setValue('ward', parts.shift());
    setValue('district', parts.shift());
    setValue('city', parts.join(', '));
  }

  let cart = window.StaticStore ? StaticStore.getCart() : [];
  if (!cart.length) {
    cart = [
      { id: 'victoria-tee', name: 'VICTORIA TEE', price: 1260000, image: '../Image/VICTORIA TEE.jpg', qty: 1 },
      { id: 'textured-sweater', name: 'TEXTURED ZIP HOODED SWEATER', price: 3750000, image: '../Image/TEXTURED ZIP HOODED SWEATER.jpg', qty: 1 },
      { id: 'world-tour-camo', name: 'STUSSY WORLD TOUR TEE CAMO', price: 2970000, image: '../Image/worldteecamo.png', qty: 2 }
    ];
    if (window.StaticStore) StaticStore.saveCart(cart);
  }
  const money = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;
  let total = 0;
  list.innerHTML = cart.map((item) => {
    const lineTotal = Number(item.price || 0) * Number(item.qty || 0);
    total += lineTotal;
    return `<tr><td>${item.name}</td><td>${item.qty}</td><td>${money(lineTotal)}</td></tr>`;
  }).join('') || '<tr><td colspan="3">Giỏ hàng trống.</td></tr>';
  totalEl.textContent = money(total);

  form?.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!cart.length) { alert('Giỏ hàng đang trống.'); return; }
    const data = new FormData(form);
    const orders = window.StaticStore ? StaticStore.getOrders() : [];
    const nextNumber = orders.reduce((max, item) => {
      const number = Number(String(item.id || '').match(/(\d+)$/)?.[1] || 0);
      return Math.max(max, number);
    }, 0) + 1;
    const order = {
      id: `ORD-2026-${String(nextNumber).padStart(3, '0')}`,
      userEmail,
      customerName: data.get('customer_name'),
      phone: data.get('customer_phone'),
      address: [data.get('street_address'), data.get('ward'), data.get('district'), data.get('city')].filter(Boolean).join(', '),
      payment: data.get('payment') || 'COD',
      status: 'pending',
      createdAt: new Date().toISOString(),
      items: cart,
      total
    };
    orders.push(order);
    if (window.StaticStore) {
      const products = StaticStore.getProducts();
      cart.forEach(item => {
        const itemId = String(item.id || '');
        const product = products.find(candidate =>
          candidate.id === itemId ||
          candidate.id === `SP${itemId.replace(/\D/g, '').padStart(2, '0')}` ||
          candidate.name === item.name
        );
        if (product) {
          const quantity = Number(item.qty || 0);
          product.sold = Number(product.sold || 0) + quantity;
          product.stock = Math.max(0, Number(product.stock || 0) - quantity);
        }
      });
      StaticStore.saveProducts(products);
      StaticStore.saveOrders(orders);
      StaticStore.saveCart([]);
    }
    alert('Đặt hàng thành công trên bản tĩnh.');
    window.location.href = 'thongtinkhachhang.html#history';
  });
});
