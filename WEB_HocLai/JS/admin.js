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
    const login = document.getElementById('adminLoginForm');
    login?.addEventListener('submit', event => {
      event.preventDefault();
      window.location.href = 'giaodienadmin.html';
    });

    // Bộ lọc chỉ ẩn/hiện các hàng đã có sẵn, không tạo dữ liệu bằng JavaScript.
    function bindFilter(formId, bodyId, keywordId, categoryId) {
      const form = document.getElementById(formId);
      const body = document.getElementById(bodyId);
      if (!form || !body) return;
      const result = document.createElement('p');
      result.className = 'empty';
      result.textContent = 'Không tìm thấy dữ liệu phù hợp.';
      result.hidden = true;
      result.setAttribute('role', 'status');
      body.closest('.table-wrap').after(result);

      function filter() {
        const keyword = (document.getElementById(keywordId)?.value || '').trim().toLocaleLowerCase('vi');
        const category = document.getElementById(categoryId)?.value || '';
        const from = document.getElementById('orderFrom')?.value || '';
        const to = document.getElementById('orderTo')?.value || '';
        const status = document.getElementById('orderStatus')?.value || '';
        if (from && to && from > to) {
          notify('Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.');
          return;
        }
        let visible = 0;
        body.querySelectorAll('tr').forEach(row => {
          const text = row.textContent.toLocaleLowerCase('vi');
          row.hidden = !text.includes(keyword) ||
            (category && row.dataset.category !== category) ||
            (status && row.dataset.status !== status) ||
            (from && row.dataset.date < from) ||
            (to && row.dataset.date > to);
          if (!row.hidden) visible += 1;
        });
        result.hidden = visible > 0;
      }
      form.addEventListener('submit', event => {
        event.preventDefault();
        filter();
      });
      form.addEventListener('reset', () => setTimeout(filter, 0));
    }
    bindFilter('userSearchForm', 'usersBody', 'userSearch');
    bindFilter('productSearchForm', 'productsBody', 'productSearch', 'filterCategory');
    bindFilter('orderFilterForm', 'ordersBody', 'orderLocation');

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

    document.querySelectorAll('.edit-form, #statsForm').forEach(form => {
      form.noValidate = true;
      form.addEventListener('submit', event => {
        event.preventDefault();
      });
    });
  });
})();
