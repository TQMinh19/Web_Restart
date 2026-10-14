document.addEventListener('DOMContentLoaded', function () {
  const products = StaticStore.getProducts().filter(product => product.status !== 'hidden');
  const result = document.getElementById('searchResult');
  const container = document.getElementById('searchProducts');
  const keyword = document.getElementById('searchKeyword');
  const minPrice = document.getElementById('minPrice');
  const maxPrice = document.getElementById('maxPrice');
  const category = document.getElementById('searchCategory');
  const brand = document.getElementById('searchBrand');
  const minRange = document.getElementById('minRange');
  const maxRange = document.getElementById('maxRange');

  function readPrice(input, fallback) {
    const value = Number(String(input.value).replace(/\./g, '').replace(/[^\d]/g, ''));
    return Number.isFinite(value) ? Math.min(5000000, Math.max(0, value)) : fallback;
  }

  function formatPrice(value) {
    return Number(value || 0).toLocaleString('vi-VN');
  }

  function render() {
    const query = keyword.value.trim().toLowerCase();
    const min = readPrice(minPrice, 0);
    const max = readPrice(maxPrice, Number.MAX_SAFE_INTEGER);
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query) &&
      (!category.value || product.category === category.value) &&
      (!brand.value || product.brand === brand.value) &&
      product.price >= min && product.price <= max
    );
    result.textContent = `TRANG TÌM KIẾM - ${filtered.length} sản phẩm`;
    container.innerHTML = filtered.map(product => `<a class="product-item" href="chitietsanpham.html?id=${String(product.id).replace('SP', '')}"><div class="product-image"><img src="${product.image}" alt="${product.name}"></div><div class="product-info"><h3 class="product-name">${product.name}</h3><p class="product-price">${StaticStore.money(product.price)}</p></div></a>`).join('') || '<p>Không tìm thấy sản phẩm phù hợp.</p>';
  }
  const params = new URLSearchParams(window.location.search);
  keyword.value = params.get('q') || '';
  document.getElementById('searchInput').value = keyword.value;
  document.getElementById('applySearch').addEventListener('click', render);
  function syncPrices(source) {
    if (source === minRange) minPrice.value = formatPrice(minRange.value);
    if (source === maxRange) maxPrice.value = formatPrice(maxRange.value);
    if (source === minPrice) minRange.value = readPrice(minPrice, 0);
    if (source === maxPrice) maxRange.value = readPrice(maxPrice, 5000000);
    if (readPrice(minPrice, 0) > readPrice(maxPrice, 5000000)) {
      const value = minPrice.value;
      minPrice.value = maxPrice.value;
      maxPrice.value = value;
    }
    minRange.value = readPrice(minPrice, 0);
    maxRange.value = readPrice(maxPrice, 5000000);
    minPrice.value = formatPrice(minRange.value);
    maxPrice.value = formatPrice(maxRange.value);
  }
  [minPrice, maxPrice].forEach(input => input.addEventListener('input', () => {
    const digits = input.value.replace(/[^\d]/g, '');
    input.value = digits ? Number(digits).toLocaleString('vi-VN') : '';
  }));
  [minPrice, maxPrice].forEach(input => input.addEventListener('change', () => syncPrices(input)));
  [minRange, maxRange].forEach(input => input.addEventListener('input', () => syncPrices(input)));
  [category, brand].forEach(input => input.addEventListener('change', render));
  syncPrices(minPrice);
  render();
});
