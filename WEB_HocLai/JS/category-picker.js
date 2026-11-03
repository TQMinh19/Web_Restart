document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.category-picker').forEach(function (picker) {
    const select = picker.querySelector('select');
    const summary = picker.querySelector('summary');
    const label = picker.querySelector('.category-picker-label');
    const buttons = picker.querySelectorAll('[data-category-value]');
    function syncLabel() {
      label.textContent = select.options[select.selectedIndex].textContent;
      buttons.forEach(button => {
        button.classList.toggle('selected', button.dataset.categoryValue === select.value);
      });
    }
    buttons.forEach(button => button.addEventListener('click', function () {
      select.value = button.dataset.categoryValue;
      syncLabel();
      picker.open = false;
      summary.focus();
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }));
    select.addEventListener('change', syncLabel);
    picker.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { picker.open = false; summary.focus(); }
    });
    document.addEventListener('click', function (event) {
      if (!picker.contains(event.target)) picker.open = false;
    });
    syncLabel();
  });
});
