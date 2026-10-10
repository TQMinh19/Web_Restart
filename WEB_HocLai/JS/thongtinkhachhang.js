document.addEventListener('DOMContentLoaded', function () {
    const profileForm = document.querySelector('.customer-form');
    profileForm?.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = localStorage.getItem('userEmail');
        const data = new FormData(profileForm);
        const users = StaticStore.getUsers();
        const user = users.find(item => item.email === email);
        if (user) {
            user.name = String(data.get('full_name') || '').trim();
            user.phone = String(data.get('phone') || '').trim();
            user.address = String(data.get('address') || '').trim();
            StaticStore.saveUsers(users);
            alert('Đã lưu thông tin cá nhân.');
        }
    });

    const history = document.getElementById('order-history');
    if (history && window.StaticStore) {
        const email = localStorage.getItem('userEmail') || 'minhanh@example.com';
        const orders = StaticStore.getOrders().filter(order => !order.userEmail || order.userEmail === email);
        const labels = { pending: 'Chưa xác nhận', confirmed: 'Đã xác nhận', delivered: 'Đã giao', completed: 'Hoàn tất', cancelled: 'Đã hủy' };
        history.innerHTML = orders.map(order => `
            <div class="order-item">
              <div class="order-header"><div class="order-info">
                <span class="order-id">#${order.id}</span>
                <span class="order-date">${new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                <span class="order-status ${order.status}">${labels[order.status] || order.status}</span>
              </div><div class="order-total">${StaticStore.money(order.total)}</div></div>
              <div class="order-products">${(order.items || []).map(item => `
                <div class="product-item"><img src="${item.image || '../Image/logo.jpg'}" alt="${item.name}">
                <div class="product-details"><h4>${item.name}</h4><p>Số lượng: ${item.qty || 1}</p></div>
                <div class="product-price">${StaticStore.money((item.price || 0) * (item.qty || 1))}</div></div>`).join('')}</div>
            </div>`).join('') || '<p>Chưa có đơn hàng nào.</p>';
    }

    if (window.StaticStore) {
        const email = localStorage.getItem('userEmail');
        const user = StaticStore.getUsers().find(item => item.email === email);
        if (user) {
            const setValue = (name, value) => {
                const field = document.querySelector(`[name="${name}"]`);
                if (field && value) field.value = value;
            };
            setValue('full_name', user.name);
            setValue('phone', user.phone);
            setValue('address', user.address);
        }
    }

    const navLinks = document.querySelectorAll('.customer-nav a');
    const contentSections = document.querySelectorAll('.content-section');
    const navItems = document.querySelectorAll('.customer-nav li');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Get the target section id from href
            const targetId = this.getAttribute('href').substring(1);

            // Remove active class from all nav items
            navItems.forEach(item => item.classList.remove('active'));

            // Add active class to the clicked nav item
            this.parentElement.classList.add('active');

            // Hide all content sections
            contentSections.forEach(section => {
                section.classList.remove('active');
            });

            // Show the target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
});
