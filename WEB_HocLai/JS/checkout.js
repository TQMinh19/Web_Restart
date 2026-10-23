(function () {
  const form = document.getElementById('checkout-form');
  const savedAddress = document.getElementById('saved-address');
  const addressFields = ['customer_name', 'customer_phone', 'street_address', 'ward', 'district', 'city'];

  savedAddress.addEventListener('change', function () {
    if (!savedAddress.value) return;

    const values = savedAddress.value.split('|');
    addressFields.forEach(function (name, index) {
      form.elements.namedItem(name).value = values[index] || '';
    });
  });

  // Trang mô phỏng: cho phép xác nhận cả khi chưa nhập thông tin.
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    window.location.href = form.getAttribute('action');
  });
}());
