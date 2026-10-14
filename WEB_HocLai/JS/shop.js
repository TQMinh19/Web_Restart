const ITEMS_PER_PAGE = 4;
const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 5000000;

let allProductItems = [];
let filteredItems = [];
let currentPage = 1;

const searchState = {
    keyword: '',
    category: '',
    brand: '',
    minPrice: DEFAULT_MIN_PRICE,
    maxPrice: DEFAULT_MAX_PRICE
};

document.addEventListener('DOMContentLoaded', function () {
    const cartLink = document.querySelector('.cart-link');

    // Cho phép khách truy cập trang giỏ hàng mà không ép đăng nhập.

    allProductItems = Array.from(document.querySelectorAll('.product-item')).filter(function (item) {
        if (!window.StaticStore) return true;
        const numericId = String(item.dataset.productId || '').replace(/\D/g, '');
        const productId = `SP${numericId.padStart(2, '0')}`;
        const product = StaticStore.getProducts().find(function (candidate) {
            return candidate.id === productId;
        });
        if (!product || product.status === 'hidden') {
            item.remove();
            return false;
        }
        return true;
    });
    if (!allProductItems.length) return;

    hydrateProductData(allProductItems);
    setupAdvancedControls();
    setupHeaderSearch();

    const savedQuery = localStorage.getItem('searchQuery');
    if (savedQuery) {
        const headerSearch = document.getElementById('searchInput');
        const advancedKeyword = document.getElementById('advancedKeyword');

        searchState.keyword = savedQuery.trim().toLowerCase();
        if (headerSearch) headerSearch.value = savedQuery;
        if (advancedKeyword) advancedKeyword.value = savedQuery;

        localStorage.removeItem('searchQuery');
    }

    const hasPageFromUrl = applyStateFromUrl();
    runSearch(!hasPageFromUrl);
});

function formatVnd(value) {
    return `${Number(value || 0).toLocaleString('vi-VN')}đ`;
}

function applyStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (!params.toString()) return false;

    const keywordFromUrl = (params.get('q') || '').trim();
    const categoryFromUrl = (params.get('category') || '').trim().toLowerCase();
    const brandFromUrl = (params.get('brand') || '').trim().toLowerCase();
    const minFromUrl = params.get('minPrice');
    const maxFromUrl = params.get('maxPrice');
    const pageFromUrl = Number(params.get('page') || '1');

    if (keywordFromUrl) {
        searchState.keyword = keywordFromUrl.toLowerCase();
    }

    if (['tops', 'bottoms', 'accessories', 'jacket', 'cap'].includes(categoryFromUrl)) {
        searchState.category = categoryFromUrl;
    }

    if (['stussy', 'other'].includes(brandFromUrl)) {
        searchState.brand = brandFromUrl;
    }

    if (minFromUrl !== null) {
        searchState.minPrice = sanitizeNumber(minFromUrl, DEFAULT_MIN_PRICE);
    }

    if (maxFromUrl !== null) {
        searchState.maxPrice = sanitizeNumber(maxFromUrl, DEFAULT_MAX_PRICE);
    }

    const normalized = normalizeMinMax(searchState.minPrice, searchState.maxPrice);
    searchState.minPrice = normalized.min;
    searchState.maxPrice = normalized.max;

    if (Number.isFinite(pageFromUrl) && pageFromUrl > 0) {
        currentPage = Math.floor(pageFromUrl);
    }

    syncControlsFromState();
    return Number.isFinite(pageFromUrl) && pageFromUrl > 1;
}

function syncControlsFromState() {
    const headerSearch = document.getElementById('searchInput');
    const keywordInput = document.getElementById('advancedKeyword');
    const categorySelect = document.getElementById('advancedCategory');
    const brandSelect = document.getElementById('advancedBrand');
    const minInput = document.getElementById('advancedMinPrice');
    const maxInput = document.getElementById('advancedMaxPrice');
    const minRange = document.getElementById('advancedMinRange');
    const maxRange = document.getElementById('advancedMaxRange');

    const keyword = searchState.keyword || '';
    if (headerSearch) headerSearch.value = keyword;
    if (keywordInput) keywordInput.value = keyword;
    if (categorySelect) categorySelect.value = searchState.category || '';
    if (brandSelect) brandSelect.value = searchState.brand || '';
    if (minInput) minInput.value = String(searchState.minPrice);
    if (maxInput) maxInput.value = String(searchState.maxPrice);
    if (minRange) minRange.value = String(searchState.minPrice);
    if (maxRange) maxRange.value = String(searchState.maxPrice);
}

function setupHeaderSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    if (!searchInput || !searchBtn) return;

    const submitHeaderSearch = function () {
        const value = searchInput.value.trim();
        searchState.keyword = value.toLowerCase();

        const advancedKeyword = document.getElementById('advancedKeyword');
        if (advancedKeyword) {
            advancedKeyword.value = value;
        }

        runSearch(true);
    };

    searchInput.addEventListener('input', function () {
        const value = searchInput.value.trim();
        searchState.keyword = value.toLowerCase();

        const advancedKeyword = document.getElementById('advancedKeyword');
        if (advancedKeyword && advancedKeyword.value !== value) {
            advancedKeyword.value = value;
        }

        if (value.length === 0 || value.length >= 2) {
            runSearch(true);
        }
    });

    searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        submitHeaderSearch();
    });

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitHeaderSearch();
        }
    });
}

function setupAdvancedControls() {
    const keywordInput = document.getElementById('advancedKeyword');
    const categorySelect = document.getElementById('advancedCategory');
    const brandSelect = document.getElementById('advancedBrand');
    const minInput = document.getElementById('advancedMinPrice');
    const maxInput = document.getElementById('advancedMaxPrice');
    const minRange = document.getElementById('advancedMinRange');
    const maxRange = document.getElementById('advancedMaxRange');
    const searchBtn = document.getElementById('advancedSearchBtn');

    if (!keywordInput || !categorySelect || !brandSelect || !minInput || !maxInput || !minRange || !maxRange || !searchBtn) {
        return;
    }

    const syncFromInputs = function () {
        const minValue = sanitizeNumber(minInput.value, DEFAULT_MIN_PRICE);
        const maxValue = sanitizeNumber(maxInput.value, DEFAULT_MAX_PRICE);
        const normalized = normalizeMinMax(minValue, maxValue);

        minInput.value = String(normalized.min);
        maxInput.value = String(normalized.max);
        minRange.value = String(normalized.min);
        maxRange.value = String(normalized.max);

        searchState.minPrice = normalized.min;
        searchState.maxPrice = normalized.max;
    };

    const syncFromRanges = function () {
        const minValue = sanitizeNumber(minRange.value, DEFAULT_MIN_PRICE);
        const maxValue = sanitizeNumber(maxRange.value, DEFAULT_MAX_PRICE);
        const normalized = normalizeMinMax(minValue, maxValue);

        minRange.value = String(normalized.min);
        maxRange.value = String(normalized.max);
        minInput.value = String(normalized.min);
        maxInput.value = String(normalized.max);

        searchState.minPrice = normalized.min;
        searchState.maxPrice = normalized.max;
    };

    const applyAdvancedSearch = function () {
        searchState.keyword = keywordInput.value.trim().toLowerCase();
        searchState.category = categorySelect.value;
        searchState.brand = brandSelect.value;
        syncFromInputs();

        const headerSearch = document.getElementById('searchInput');
        if (headerSearch) {
            headerSearch.value = keywordInput.value.trim();
        }

        runSearch(true);
    };

    keywordInput.addEventListener('input', function () {
        const value = keywordInput.value.trim();
        searchState.keyword = value.toLowerCase();

        const headerSearch = document.getElementById('searchInput');
        if (headerSearch && headerSearch.value !== value) {
            headerSearch.value = value;
        }

        if (value.length === 0 || value.length >= 2) {
            runSearch(true);
        }
    });

    keywordInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyAdvancedSearch();
        }
    });

    searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        applyAdvancedSearch();
    });

    categorySelect.addEventListener('change', function () {
        searchState.category = categorySelect.value;
        runSearch(true);
    });

    brandSelect.addEventListener('change', function () {
        searchState.brand = brandSelect.value;
        runSearch(true);
    });

    minInput.addEventListener('change', function () {
        syncFromInputs();
        runSearch(true);
    });

    maxInput.addEventListener('change', function () {
        syncFromInputs();
        runSearch(true);
    });

    minRange.addEventListener('input', function () {
        syncFromRanges();
        runSearch(true);
    });

    maxRange.addEventListener('input', function () {
        syncFromRanges();
        runSearch(true);
    });

    syncFromInputs();
}

function sanitizeNumber(value, fallback) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    if (parsed < DEFAULT_MIN_PRICE) return DEFAULT_MIN_PRICE;
    if (parsed > DEFAULT_MAX_PRICE) return DEFAULT_MAX_PRICE;
    return Math.round(parsed);
}

function normalizeMinMax(minValue, maxValue) {
    let min = minValue;
    let max = maxValue;

    if (min > max) {
        const temp = min;
        min = max;
        max = temp;
    }

    return { min: min, max: max };
}

function runSearch(resetPage) {
    if (!allProductItems.length) return;

    filteredItems = allProductItems.filter(function (item) {
        const text = item.dataset.searchText || '';
        const category = item.dataset.category || '';
        const brand = item.dataset.brand || '';
        const price = Number(item.dataset.price || '0');

        const passKeyword = !searchState.keyword || text.includes(searchState.keyword);
        const passCategory = !searchState.category || category === searchState.category;
        const passBrand = !searchState.brand || brand === searchState.brand;
        const passPrice = price >= searchState.minPrice && price <= searchState.maxPrice;

        return passKeyword && passCategory && passBrand && passPrice;
    });

    if (resetPage) {
        currentPage = 1;
    }

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    renderCurrentPage();
    renderPagination();
    renderSearchMeta();
}

function renderCurrentPage() {
    const productsContainer = document.querySelector('.products-container');
    if (!productsContainer) return;

    allProductItems.forEach(function (item) {
        item.style.display = 'none';
    });

    let noResultsMsg = document.getElementById('noResultsMsg');

    if (!filteredItems.length) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'noResultsMsg';
            noResultsMsg.style.cssText = 'text-align:center;padding:40px;font-size:18px;color:#666;';
            productsContainer.parentElement.insertBefore(noResultsMsg, productsContainer.nextSibling);
        }
        noResultsMsg.textContent = 'Không tìm thấy sản phẩm phù hợp';
        return;
    }

    if (noResultsMsg) {
        noResultsMsg.remove();
    }

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    filteredItems.forEach(function (item, index) {
        if (index >= start && index < end) {
            item.style.display = 'block';
        }
    });
}

function renderPagination() {
    const pagination = document.getElementById('searchPagination');
    const productsContainer = document.querySelector('.products-container');
    if (!pagination || !productsContainer) return;

    pagination.innerHTML = '';

    if (filteredItems.length === 0) {
        return;
    }

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));

    pagination.appendChild(createPaginationButton('Trước', currentPage === 1, function () {
        if (currentPage > 1) {
            currentPage -= 1;
            renderCurrentPage();
            renderPagination();
            scrollToProducts(productsContainer);
        }
    }));

    for (let i = 1; i <= totalPages; i += 1) {
        const btn = createPaginationButton(String(i), false, function () {
            currentPage = i;
            renderCurrentPage();
            renderPagination();
            scrollToProducts(productsContainer);
        });

        if (i === currentPage) {
            btn.classList.add('active');
        }

        pagination.appendChild(btn);
    }

    pagination.appendChild(createPaginationButton('Sau', currentPage === totalPages, function () {
        if (currentPage < totalPages) {
            currentPage += 1;
            renderCurrentPage();
            renderPagination();
            scrollToProducts(productsContainer);
        }
    }));
}

function renderSearchMeta() {
    const meta = document.getElementById('searchMeta');
    if (!meta) return;

    const total = filteredItems.length;
    const hasFilters = Boolean(
        searchState.keyword ||
        searchState.category ||
        searchState.brand ||
        searchState.minPrice > DEFAULT_MIN_PRICE ||
        searchState.maxPrice < DEFAULT_MAX_PRICE
    );

    meta.textContent = hasFilters
        ? `Tìm thấy ${total} sản phẩm phù hợp`
        : `${total} sản phẩm đang hiển thị`;
}

function createPaginationButton(label, disabled, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'page-btn';
    btn.textContent = label;

    if (disabled) {
        btn.disabled = true;
        btn.style.opacity = '0.45';
        btn.style.cursor = 'not-allowed';
    } else {
        btn.addEventListener('click', onClick);
    }

    return btn;
}

function hydrateProductData(items) {
    items.forEach(function (item) {
        const nameElement = item.querySelector('.product-name');
        const priceElement = item.querySelector('.product-price');

        const name = nameElement ? nameElement.textContent.trim() : '';
        const priceText = priceElement ? priceElement.textContent.trim() : '';

        item.dataset.searchText = name.toLowerCase();
        item.dataset.price = String(parsePriceToVnd(priceText));
        item.dataset.category = inferCategory(name);
        item.dataset.brand = inferBrand(name);
    });
}

function parsePriceToVnd(priceText) {
    if (!priceText) return 0;

    const isDollar = priceText.includes('$');
    const numeric = Number(priceText.replace(/[^\d]/g, ''));

    if (!Number.isFinite(numeric)) return 0;

    // Gia tien duoc xu ly theo dinh dang VND de dong bo voi bo loc gia tren trang.
    if (isDollar) {
        return numeric * 1000;
    }

    return numeric;
}

function inferCategory(name) {
    const normalized = (name || '').toLowerCase();

    if (normalized.includes('beanie') || normalized.includes('cap') || normalized.includes('mũ')) {
        return 'cap';
    }

    if (
        normalized.includes('jacket') ||
        normalized.includes('hoodie') ||
        normalized.includes('sweater') ||
        normalized.includes('sweatshirt')
    ) {
        return 'jacket';
    }

    if (normalized.includes('short')) {
        return 'bottoms';
    }

    if (
        normalized.includes('bag') ||
        normalized.includes('pouch') ||
        normalized.includes('keychain')
    ) {
        return 'accessories';
    }

    if (normalized.includes('tee')) {
        return 'tops';
    }

    return 'tops';
}

function inferBrand(name) {
    const normalized = (name || '').toLowerCase();
    return normalized.includes('stussy') ? 'stussy' : 'other';
}
