// Chỉ hỗ trợ tương tác giao diện. Tất cả nội dung mẫu đã viết sẵn trong HTML.
(() => {
  'use strict';

  function notify(message) {
    const feedback = document.getElementById('feedback');
    if (!feedback) return;
    feedback.textContent = message;
    feedback.hidden = false;
    feedback.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[id^="productPrice"]').forEach(input => {
      const formatPrice = () => {
        const raw = input.value;
        const position = input.selectionStart ?? raw.length;
        const before = raw.slice(0, position).replace(/[^0-9]/g, '');
        const digits = raw.replace(/[^0-9]/g, '');
        const trimmed = digits.replace(/^0+(?=\d)/, '');
        const wanted = Math.max(0, before.length - (digits.length - trimmed.length));
        input.value = trimmed.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        if (document.activeElement === input) {
          let cursor = 0;
          let seen = 0;
          while (cursor < input.value.length && seen < wanted) {
            if (/[0-9]/.test(input.value[cursor])) seen += 1;
            cursor += 1;
          }
          input.setSelectionRange(cursor, cursor);
        }
      };
      input.addEventListener('beforeinput', event => {
        if (event.inputType === 'insertText' && event.data && /[^0-9]/.test(event.data)) {
          event.preventDefault();
        }
      });
      input.addEventListener('input', formatPrice);
      input.form?.addEventListener('reset', () => setTimeout(formatPrice, 0));
      formatPrice();
    });

    const login = document.getElementById('adminLoginForm');
    login?.addEventListener('submit', event => {
      event.preventDefault();
      window.location.href = 'giaodienadmin.html';
    });

    // Xem trước hình do người dùng chọn; ảnh mẫu gốc nằm ngay trong HTML.
    document.querySelectorAll('input[type="file"]').forEach(input => {
      const form = input.closest('form');
      const preview = form.querySelector('.image-preview');
      if (!preview) return;
      const original = preview.cloneNode(true);
      let objectUrl;
      function restore() {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        objectUrl = undefined;
        preview.replaceChildren(...Array.from(original.cloneNode(true).childNodes));
      }
      input.addEventListener('change', () => {
        restore();
        const file = input.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
          input.value = '';
          notify('Vui lòng chọn một tệp hình ảnh.');
          return;
        }
        objectUrl = URL.createObjectURL(file);
        const image = document.createElement('img');
        image.src = objectUrl;
        image.alt = 'Ảnh xem trước sản phẩm';
        preview.replaceChildren(image);
      });
      form.addEventListener('reset', restore);
    });

    document.querySelectorAll('.edit-form, #statsForm, #userSearchForm, #orderFilterForm, #productSearchForm').forEach(form => {
      form.noValidate = true;
      form.addEventListener('submit', event => {
        event.preventDefault();
      });
    });
  });
})();
