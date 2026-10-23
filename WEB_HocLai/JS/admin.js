(function () {
  const statusLabels = {
    pending: 'Chưa xác nhận',
    confirmed: 'Đã xác nhận',
    delivered: 'Đã giao thành công',
    completed: 'Hoàn tất',
    cancelled: 'Hủy đơn'
  };
  const statusFlow = ['pending', 'confirmed', 'delivered', 'completed'];
  const money = value => StaticStore.money(Number(value) || 0);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function allowedStatuses(current) {
    const index = statusFlow.indexOf(current);
    if (current === 'cancelled') return ['cancelled'];
    if (current === 'completed') return ['completed'];
    return statusFlow.slice(Math.max(0, index), index + 2).concat('cancelled');
  }

  function showOrderDetail(orderId) {
    const panel = document.getElementById('order-detail-panel');
    const content = document.getElementById('orderDetailContent');
    const order = StaticStore.getOrders().find(item => item.id === orderId);
    if (!panel || !content || !order) return;
    const items = (order.items || []).map(item =>
      `<li>${esc(item.name)} × ${Number(item.qty || 1)} — ${money(Number(item.price || 0) * Number(item.qty || 1))}</li>`
    ).join('');
    content.innerHTML = `<p><strong>Mã đơn:</strong> ${esc(order.id)}</p>
      <p><strong>Khách hàng:</strong> ${esc(order.customerName || order.userEmail)}</p>
      <p><strong>Số điện thoại:</strong> ${esc(order.phone)}</p>
      <p><strong>Địa chỉ:</strong> ${esc(order.address)}</p>
      <p><strong>Ngày đặt:</strong> ${new Date(order.createdAt).toLocaleString('vi-VN')}</p>
      <p><strong>Thanh toán:</strong> ${esc(order.payment || 'COD')}</p>
      <p><strong>Sản phẩm:</strong></p><ul>${items || '<li>Không có sản phẩm</li>'}</ul>
      <p><strong>Tổng tiền:</strong> ${money(order.total)}</p>`;
    panel.hidden = false;
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderUsers() {
    const body = document.getElementById('usersBody');
    if (!body) return;
    const query = (document.getElementById('userSearch')?.value || '').toLowerCase();
    body.innerHTML = StaticStore.getUsers().filter(u => `${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(query)).map((u, i) => `
      <tr><td>${esc(u.id || String(i + 1).padStart(2, '0'))}</td><td>${esc(u.name)}</td><td>${esc(u.email)}</td>
      <td>${esc(u.phone)}</td><td>${esc(u.address)}</td><td>${u.status === 'locked' ? 'Đã khóa' : 'Đang hoạt động'}</td>
      <td class="user-actions"><div class="user-action-buttons">
        <button class="user-action-btn" type="button" data-user-edit="${esc(u.email)}">Sửa</button>
        <button class="user-action-btn user-toggle-btn" type="button" data-user-toggle="${esc(u.email)}">${u.status === 'locked' ? 'Mở khóa' : 'Khóa'}</button>
      </div></td></tr>`).join('');
  }

  function renderProducts() {
    const body = document.getElementById('productsBody');
    if (!body) return;
    body.innerHTML = StaticStore.getProducts().map(p => `
      <tr><td>${esc(p.id)}</td><td class="product-cell"><img class="admin-product-thumb" src="${esc(p.image || '../Image/logo.jpg')}" alt=""><span>${esc(p.name)}</span></td><td>${esc(p.categoryName || p.category)}</td><td>${money(p.price)}</td>
      <td>${p.status === 'hidden' ? 'Đang ẩn' : 'Đang bán'}</td>
      <td class="product-actions"><div class="product-action-buttons">
        <button class="product-action-btn product-edit-btn" type="button" data-product-edit="${esc(p.id)}"><span aria-hidden="true">✎</span>Sửa</button>
        <button class="product-action-btn product-delete-btn" type="button" data-product-delete="${esc(p.id)}"><span aria-hidden="true">×</span>Xóa</button>
      </div></td></tr>`).join('');
  }

  function renderCategories() {
    const body = document.getElementById('categoriesBody');
    if (!body) return;
    body.innerHTML = StaticStore.getCategories().map(category => `
      <tr><td>${esc(category.id)}</td><td>${esc(category.name)}</td><td>${esc(category.description)}</td>
      <td class="category-actions"><div class="category-action-buttons">
        <button class="category-action-btn category-edit-btn" type="button" data-category-edit="${esc(category.id)}"><span aria-hidden="true">✎</span>Sửa</button>
        <button class="category-action-btn category-delete-btn" type="button" data-category-delete="${esc(category.id)}"><span aria-hidden="true">×</span>Xóa</button>
      </div></td></tr>`).join('');
  }


  function renderOrders() {
    const body = document.getElementById('ordersBody');
    if (!body) return;
    const from = document.getElementById('orderFrom')?.value;
    const to = document.getElementById('orderTo')?.value;
    if (from && to && from > to) { alert('Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.'); return; }
    const status = document.getElementById('orderStatus')?.value;
    const location = (document.getElementById('orderLocation')?.value || '').toLowerCase();
    const orders = StaticStore.getOrders().filter(o => {
      const date = String(o.createdAt || '').slice(0, 10);
      return (!from || date >= from) && (!to || date <= to) &&
        (!status || o.status === status) && (!location || String(o.address).toLowerCase().includes(location));
    });
    body.innerHTML = orders.map(o => `<tr><td>${esc(o.id)}</td><td>${esc(o.customerName || o.userEmail)}</td>
      <td>${new Date(o.createdAt).toLocaleDateString('vi-VN')}</td><td>${money(o.total)}</td>
      <td><select data-order-status="${esc(o.id)}">${Object.keys(statusLabels).map(s => `<option value="${s}" ${s === o.status ? 'selected' : ''} ${allowedStatuses(o.status).includes(s) ? '' : 'disabled'}>${statusLabels[s]}</option>`).join('')}</select></td>
      <td><a href="#order-detail-panel" data-order-detail="${esc(o.id)}">Xem chi tiết</a></td></tr>`).join('');
  }

  function renderStats() {
    const body = document.getElementById('statsBody');
    if (!body) return;
    const from = document.getElementById('statsFrom')?.value;
    const to = document.getElementById('statsTo')?.value;
    if (from && to && from > to) { alert('Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.'); return; }
    const totals = Object.create(null);
    StaticStore.getOrders().filter(o => {
      const date = String(o.createdAt || '').slice(0, 10);
      return (!from || date >= from) && (!to || date <= to) && o.status !== 'cancelled';
    }).forEach(o => { totals[o.userEmail] = (totals[o.userEmail] || 0) + Number(o.total || 0); });
    const ranking = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 5);
    body.innerHTML = ranking.map(([email, total], i) => {
      const customerOrders = StaticStore.getOrders().filter(order =>
        order.userEmail === email && order.status !== 'cancelled' &&
        (!from || String(order.createdAt).slice(0, 10) >= from) &&
        (!to || String(order.createdAt).slice(0, 10) <= to)
      );
      const customer = StaticStore.getUsers().find(user => user.email === email);
      return `<div class="stat-customer"><strong>#${i + 1} ${esc(customer?.name || email)}</strong><small>${esc(email)}</small><span>Tổng mua: ${money(total)}</span>
        <details><summary>Xem ${customerOrders.length} đơn hàng</summary>
        ${customerOrders.map(order => `<p><a href="#order-detail-panel" class="order-detail-link" data-order-detail="${esc(order.id)}">${esc(order.id)}</a> — ${money(order.total)}</p>`).join('')}
        </details></div>`;
    }).join('') || '<p>Chưa có dữ liệu trong khoảng thời gian này.</p>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderUsers(); renderProducts(); renderCategories(); renderOrders(); renderStats();
    document.getElementById('userForm')?.addEventListener('submit', e => {
      e.preventDefault();
      const users = StaticStore.getUsers();
      const name = document.getElementById('userName').value.trim();
      const email = document.getElementById('userEmail').value.trim().toLowerCase();
      const phone = document.getElementById('userPhone').value.trim();
      const address = document.getElementById('userAddress').value.trim();
      const editingEmail = e.target.dataset.editingEmail;
      if (users.some(user => user.email.toLowerCase() === email && user.email !== editingEmail)) {
        alert('Email này đã tồn tại.'); return;
      }
      if (editingEmail) {
        const user = users.find(item => item.email === editingEmail);
        if (user) {
          Object.assign(user, { name, email, phone, address });
          const orders = StaticStore.getOrders();
          orders.forEach(order => { if (order.userEmail === editingEmail) order.userEmail = email; });
          StaticStore.saveOrders(orders);
        }
        delete e.target.dataset.editingEmail;
        e.target.querySelector('button').textContent = 'Thêm tài khoản';
      } else {
        if (users.some(user => user.email === email)) {
          alert('Email này đã tồn tại.');
          return;
        }
        users.push({ id: `U${String(users.length + 1).padStart(2, '0')}`, name, email, phone, address, status: 'active' });
      }
      StaticStore.saveUsers(users); e.target.reset(); renderUsers();
    });
    document.getElementById('userForm')?.addEventListener('reset', e => {
      delete e.target.dataset.editingEmail;
      e.target.querySelector('button').textContent = 'Thêm tài khoản';
    });
    document.getElementById('userSearchForm')?.addEventListener('submit', e => { e.preventDefault(); renderUsers(); });
    document.querySelector('.category-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const categories = StaticStore.getCategories();
      const editingId = e.target.dataset.editingId;
      const category = {
        id: editingId || `CAT${String(categories.length + 1).padStart(2, '0')}`,
        name: document.getElementById('catName').value.trim(),
        description: document.getElementById('catDesc').value.trim(),
        value: document.getElementById('catName').value.trim().toLowerCase().replace(/\s+/g, '-')
      };
      const index = categories.findIndex(item => item.id === category.id);
      if (index >= 0) categories[index] = category; else categories.push(category);
      StaticStore.saveCategories(categories);
      delete e.target.dataset.editingId;
      e.target.reset();
      e.target.querySelector('.cat-btn-add').textContent = 'Thêm';
      renderCategories();
    });
    document.getElementById('productForm')?.addEventListener('submit', e => {
      e.preventDefault();
      const products = StaticStore.getProducts();
      const existing = products.find(p => p.id === productId.value.trim());
      const category = StaticStore.getCategories().find(item => item.value === productCategory.value);
      const product = { id: productId.value.trim(), name: productName.value.trim(), category: productCategory.value, categoryName: category?.name || productCategory.value, unit: productUnit.value.trim(), stock: Number(productStock.value), sold: Number(existing?.sold || 0), price: Number(productPrice.value), status: productStatus.value, description: productDescription.value.trim(), image: existing?.image || '' };
      const index = products.findIndex(p => p.id === product.id);
      if (index >= 0) products[index] = product; else products.push(product);
      const file = productImage.files[0];
      const save = image => { product.image = image || product.image; StaticStore.saveProducts(products); e.target.reset(); productPreview.innerHTML = ''; renderProducts(); };
      if (file) { const reader = new FileReader(); reader.onload = () => save(reader.result); reader.readAsDataURL(file); } else save(product.image);
    });
    document.getElementById('productReset')?.addEventListener('click', () => document.getElementById('productForm').reset());
    document.getElementById('productImage')?.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) { productPreview.innerHTML = ''; return; }
      const reader = new FileReader();
      reader.onload = () => { productPreview.innerHTML = `<img src="${reader.result}" alt="Xem trước ảnh sản phẩm">`; };
      reader.readAsDataURL(file);
    });
    document.getElementById('orderFilterForm')?.addEventListener('submit', e => { e.preventDefault(); renderOrders(); });
    document.getElementById('statsForm')?.addEventListener('submit', e => { e.preventDefault(); renderStats(); });
    document.addEventListener('click', e => {
      const userEdit = e.target.closest('[data-user-edit]');
      if (userEdit) {
        const user = StaticStore.getUsers().find(item => item.email === userEdit.dataset.userEdit);
        const form = document.getElementById('userForm');
        if (user && form) {
          document.getElementById('userName').value = user.name;
          document.getElementById('userEmail').value = user.email;
          document.getElementById('userPhone').value = user.phone || '';
          document.getElementById('userAddress').value = user.address || '';
          form.dataset.editingEmail = user.email;
          form.querySelector('button').textContent = 'Lưu thay đổi';
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      const toggle = e.target.closest('[data-user-toggle]');
      if (toggle) { const users = StaticStore.getUsers(); const u = users.find(x => x.email === toggle.dataset.userToggle); if (u) u.status = u.status === 'locked' ? 'active' : 'locked'; StaticStore.saveUsers(users); renderUsers(); }
      const categoryEdit = e.target.closest('[data-category-edit]');
        if (categoryEdit) {
          const category = StaticStore.getCategories().find(item => item.id === categoryEdit.dataset.categoryEdit);
          if (category) {
            document.getElementById('catName').value = category.name;
            document.getElementById('catDesc').value = category.description;
            document.querySelector('.category-form').dataset.editingId = category.id;
            document.querySelector('.cat-btn-add').textContent = 'Lưu thay đổi';
          }
        }
        const categoryDelete = e.target.closest('[data-category-delete]');
        if (categoryDelete && confirm('Bạn có chắc muốn xóa loại sản phẩm này không?')) {
          StaticStore.saveCategories(StaticStore.getCategories().filter(item => item.id !== categoryDelete.dataset.categoryDelete));
          renderCategories();
        }
      const del = e.target.closest('[data-product-delete]');
      if (del) {
        const products = StaticStore.getProducts();
        const product = products.find(item => item.id === del.dataset.productDelete);
        if (!product) return;
        const wasSold = Number(product.sold || 0) > 0 || StaticStore.getOrders().some(order =>
          order.status !== 'cancelled' && (order.items || []).some(item =>
            item.productId === product.id || item.id === product.id || item.name === product.name
          )
        );
        if (wasSold) {
          product.status = 'hidden';
          StaticStore.saveProducts(products);
          alert('Sản phẩm đã từng bán nên được chuyển sang trạng thái ẩn.');
        } else if (confirm(`Bạn có chắc muốn xóa sản phẩm ${product.name}?`)) {
          StaticStore.saveProducts(products.filter(item => item.id !== product.id));
        }
        renderProducts();
      }
      const edit = e.target.closest('[data-product-edit]');
      if (edit) {
        const p = StaticStore.getProducts().find(x => x.id === edit.dataset.productEdit);
        if (p) {
          productId.value = p.id; productName.value = p.name; productCategory.value = p.category;
          productUnit.value = p.unit || 'cái'; productStock.value = p.stock; productPrice.value = p.price;
          productStatus.value = p.status; productDescription.value = p.description || '';
          productPreview.innerHTML = p.image ? `<img src="${esc(p.image)}" alt="Ảnh hiện tại của sản phẩm">` : '';
        }
      }
      const detail = e.target.closest('[data-order-detail]');
      if (detail) {
        e.preventDefault();
        showOrderDetail(detail.dataset.orderDetail);
      }
      if (e.target.closest('[data-order-detail-close]')) {
        document.getElementById('order-detail-panel').hidden = true;
      }
    });
    document.addEventListener('change', e => {
      const select = e.target.closest('[data-order-status]');
      if (!select) return;
      const orders = StaticStore.getOrders();
      const order = orders.find(item => item.id === select.dataset.orderStatus);
      const next = select.value;
      if (order && allowedStatuses(order.status).includes(next) && next !== order.status) {
        order.status = next;
        StaticStore.saveOrders(orders);
      }
      renderOrders();
    });
  });
})();
