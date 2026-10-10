const USERS_STORAGE_KEY = 'webstussy_users';

function readStaticUsers() {
  if (window.StaticStore) return StaticStore.getUsers();
  try {
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    return Array.isArray(users) ? users : [];
  } catch (error) {
    return [];
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const error = document.querySelector('.error-msg');
  const showError = (message) => { if (error) error.textContent = message; else alert(message); };
  const redirectAfterLogin = new URLSearchParams(window.location.search).get('redirect');
  const goAfterLogin = () => {
    window.location.href = redirectAfterLogin || 'thongtinkhachhang.html';
  };

  registerForm?.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new FormData(registerForm);
    const users = readStaticUsers();
    const email = String(data.get('email') || '').trim().toLowerCase();
    const password = String(data.get('password') || '');
    if (password.length < 6 || password !== String(data.get('confirmPassword') || '')) {
      showError('Mật khẩu phải từ 6 ký tự và khớp xác nhận.');
      return;
    }
    if (users.some((user) => user.email === email)) {
      showError('Email đã được đăng ký.');
      return;
    }
    users.push({ id: `US${String(users.length + 1).padStart(2, '0')}`, name: data.get('name') || email.split('@')[0], email, password, phone: data.get('phone'), address: data.get('address'), status: 'active' });
    if (window.StaticStore) StaticStore.saveUsers(users);
    else localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    goAfterLogin();
  });

  loginForm?.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new FormData(loginForm);
    const enteredEmail = String(data.get('email') || '').trim().toLowerCase();
    const email = enteredEmail || 'minhanh@example.com';
    const user = readStaticUsers().find((item) => item.email === email && item.status !== 'locked');
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userEmail', user?.email || 'minhanh@example.com');
    goAfterLogin();
  });
});
