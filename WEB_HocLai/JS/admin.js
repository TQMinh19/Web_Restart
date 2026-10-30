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
        <button class="user-action-btn" type="button" data-user-view="${esc(u.email)}">Xem thông tin</button>
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
      if (e.target.dataset.viewingUser) return;
      if (users.some(user => user.email.toLowerCase() === email)) { alert('Email này đã tồn tại.'); return; }
      users.push({ id: 'U' + String(users.length + 1).padStart(2, '0'), name, email, phone, address, status: 'active' });
      StaticStore.saveUsers(users); e.target.reset(); renderUsers();
    });
    document.getElementById('userForm')?.addEventListener('reset', e => {
      delete e.target.dataset.viewingUser;
      ['userName', 'userEmail', 'userPhone', 'userAddress'].forEach(id => { document.getElementById(id).readOnly = false; });
      e.target.querySelector('button').disabled = false;
      e.target.querySelector('button').textContent = 'Thêm tài khoản';
    });
    document.getElementById('userSearchForm')?.addEventListener('submit', e => { e.preventDefault(); renderUsers(); });
    document.querySelector('.category-form')?.addEventListener('submit', e => {
      e.preventDefault();
      alert(e.target.dataset.editingId ? 'Đã sửa loại sản phẩm.' : 'Đã thêm loại sản phẩm.');
    });
    document.getElementById('productForm')?.addEventListener('submit', e => {
      e.preventDefault();
      alert(e.target.dataset.editingId ? 'Đã sửa sản phẩm.' : 'Đã thêm sản phẩm.');
    });
    document.getElementById('productPrice')?.addEventListener('input', e => {
      const digits = e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '');
      e.target.value = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    });
    document.getElementById('productReset')?.addEventListener('click', () => {
      document.getElementById('productForm').reset();
      productPreview.innerHTML = '';
      delete document.getElementById('productForm').dataset.editingId;
      document.getElementById('productForm').querySelector('button').textContent = 'Thêm sản phẩm';
    });
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
      const userView = e.target.closest('[data-user-view]');
      if (userView) {
        const user = StaticStore.getUsers().find(item => item.email === userView.dataset.userView);
        const form = document.getElementById('userForm');
        if (user && form) {
          document.getElementById('userName').value = user.name;
          document.getElementById('userEmail').value = user.email;
          document.getElementById('userPhone').value = user.phone || '';
          document.getElementById('userAddress').value = user.address || '';
          form.dataset.viewingUser = user.email;
          ['userName', 'userEmail', 'userPhone', 'userAddress'].forEach(id => { document.getElementById(id).readOnly = true; });
          form.querySelector('button').disabled = true;
          form.querySelector('button').textContent = 'Đang xem thông tin';
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      const toggle = e.target.closest('[data-user-toggle]');
      if (toggle) { const users = StaticStore.getUsers(); const u = users.find(x => x.email === toggle.dataset.userToggle); if (u) u.status = u.status === 'locked' ? 'active' : 'locked'; StaticStore.saveUsers(users); renderUsers(); }
      const categoryEdit = e.target.closest('[data-category-edit]');
      if (categoryEdit) {
        const category = StaticStore.getCategories().find(item => item.id === categoryEdit.dataset.categoryEdit);
        const form = document.querySelector('.category-form');
        if (category && form) {
          document.getElementById('catName').value = category.name;
          document.getElementById('catDesc').value = category.description || '';
          form.dataset.editingId = category.id;
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      if (e.target.closest('[data-category-save]')) alert('Đã sửa loại sản phẩm.');
      if (e.target.closest('[data-category-delete]') || e.target.closest('[data-category-remove]')) alert('Đã xóa loại sản phẩm.');
      const del = e.target.closest('[data-product-delete]');
      if (del) alert('Đã xóa sản phẩm.');
      const edit = e.target.closest('[data-product-edit]');
      if (edit) {
        const p = StaticStore.getProducts().find(x => x.id === edit.dataset.productEdit);
        if (p) {
          const form = document.getElementById('productForm');
          form.dataset.editingId = p.id;
          form.querySelector('button').textContent = 'Lưu thay đổi';
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
          productId.value = p.id; productName.value = p.name; productCategory.value = p.category;
          productUnit.value = p.unit || 'cái'; productStock.value = p.stock; productPrice.value = Number(p.price || 0).toLocaleString('vi-VN');
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
