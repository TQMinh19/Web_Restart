document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const email = String(document.getElementById('username')?.value || '').trim().toLowerCase();
    const password = String(document.getElementById('password')?.value || '');
    const valid = email === 'admin@3bkshop.vn' && password === 'admin123';

    if (!valid) {
      let message = form.querySelector('.admin-login-error');
      if (!message) {
        message = document.createElement('p');
        message.className = 'admin-login-error';
        message.style.cssText = 'color:#c0392b;margin:12px 0;text-align:center;';
        form.insertBefore(message, form.querySelector('button'));
      }
      message.textContent = 'Email hoặc mật khẩu quản trị không đúng.';
      return;
    }

    localStorage.setItem('webstussy_admin_session', 'true');
    window.location.href = 'giaodienadmin.html#users';
  });
});
