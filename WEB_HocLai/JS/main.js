let currentSlide = 0;
let slides, dots, totalSlides;
const CART_STORAGE_KEY = 'webstussy_cart';

function readCartItems() {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function writeCartItems(items) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    updateCartBadges();
}

function cartTotalQuantity(items) {
    return items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

function updateCartBadges() {
    const badges = document.querySelectorAll('.cart-count');
    const count = cartTotalQuantity(readCartItems());
    badges.forEach((badge) => {
        badge.textContent = String(count);
    });
}

function parsePriceNumber(priceText) {
    if (!priceText) return 0;
    const text = String(priceText).trim();

    // Gia dang USD tren cac trang pr (vi du: $42) -> quy doi VND theo bang gia hien tai.
    if (text.includes('$')) {
        const usd = Number(text.replace(/[^\d.]/g, ''));
        return Number.isFinite(usd) ? Math.round(usd * 30000) : 0;
    }

    // Gia dang VND (vi du: 1.260.000d hoặc 1,260,000đ)
    const clean = text.replace(/[^\d]/g, '');
    return clean ? Number(clean) : 0;
}

function formatMoneyVnd(value) {
    return `${Number(value || 0).toLocaleString('vi-VN')}đ`;
}

function ensureSizeSelectionUI() {
    const sizeGroups = document.querySelectorAll('.size-options');
    sizeGroups.forEach((group) => {
        const buttons = group.querySelectorAll('button');
        if (!buttons.length) return;

        if (![...buttons].some((btn) => btn.classList.contains('active'))) {
            buttons[0].classList.add('active');
        }

        buttons.forEach((btn) => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                buttons.forEach((other) => other.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    });
}

function ensureColorSelectionUI() {
    const colorGroups = document.querySelectorAll('.color-options');

    colorGroups.forEach((group) => {
        const colorItems = group.querySelectorAll('.color-thumbnail');
        if (!colorItems.length) return;

        const colorLabel = group.closest('.product-color')?.querySelector('.color-label');
        const mainImage = document.querySelector('.main-image, .product-image img');

        const activateColor = function (item) {
            colorItems.forEach((node) => node.classList.remove('active'));
            item.classList.add('active');

            const colorName = (item.dataset.color || item.getAttribute('alt') || '').trim();
            if (colorLabel && colorName) {
                colorLabel.textContent = colorName.toUpperCase();
            }

            const src = item.getAttribute('src');
            if (mainImage && src) {
                mainImage.setAttribute('src', src);
            }
        };

        const defaultColor = group.querySelector('.color-thumbnail.active') || colorItems[0];
        if (defaultColor) {
            activateColor(defaultColor);
        }

        colorItems.forEach((item) => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                activateColor(item);
            });
        });
    });
}

function extractCurrentProduct() {
    const nameNode = document.querySelector('.product-name, .detail-right h1, h1.product-name');
    const priceNode = document.querySelector('.product-price, .detail-price');
    const imageNode = document.querySelector('.main-image, .product-image img, .detail-left img');
    const activeSizeNode = document.querySelector('.size-options button.active');
    const fallbackSizeNode = document.querySelector('.size-options button');
    const activeColorNode = document.querySelector('.color-options .color-thumbnail.active');
    const fallbackColorNode = document.querySelector('.color-options .color-thumbnail');
    const colorLabelNode = document.querySelector('.color-label');

    if (!nameNode || !priceNode) {
        return null;
    }

    const name = nameNode.textContent.trim();
    const price = parsePriceNumber(priceNode.textContent);
    const image = imageNode ? imageNode.getAttribute('src') || '' : '';
    const size = (activeSizeNode || fallbackSizeNode) ? (activeSizeNode || fallbackSizeNode).textContent.trim() : 'M';
    const colorNode = activeColorNode || fallbackColorNode;
    const color = (colorNode?.dataset.color || colorNode?.getAttribute('alt') || colorLabelNode?.textContent || 'BLACK').trim().toUpperCase();
    const id = `${name}__${color}__${size}`;
    const url = new URL(window.location.href);
    const productIdFromUrl = Number(url.searchParams.get('id') || window.currentProductId || 0);
    const productId = Number.isFinite(productIdFromUrl) && productIdFromUrl > 0
        ? Math.trunc(productIdFromUrl)
        : 0;

    return { id, productId, name, price, image, size, color };
}

async function addCurrentProductToCart() {
    const product = extractCurrentProduct();
    if (!product) {
        return { ok: false, reason: 'missing_product' };
    }

    const items = readCartItems();
    const existing = items.find((item) => item.id === product.id);
    if (existing) {
        existing.qty = Number(existing.qty || 0) + 1;
    } else {
        items.push({ ...product, qty: 1 });
    }
    writeCartItems(items);
    return { ok: true };
}

function setupAddToCartButtons() {
    ensureSizeSelectionUI();
    ensureColorSelectionUI();

    document.querySelectorAll('.add-to-bag-btn').forEach((button) => {
        button.addEventListener('click', async function (event) {
            event.preventDefault();
            const result = await addCurrentProductToCart();
            if (result.ok) {
                alert('Đã thêm sản phẩm vào giỏ hàng.');
                window.location.href = 'cart.html';
            }
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.dot');
    totalSlides = slides.length;

    // Auto-change slide every 5 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlide();
    }, 5000);

    setupAddToCartButtons();
    setupHeaderDropdownMenus();
    updateCartBadges();

    // Search functionality
    document.querySelectorAll('.search-box').forEach((box) => {
        const searchInput = box.querySelector('input');
        const searchBtn = box.querySelector('button');
        if (!searchInput || !searchBtn) return;
        const submitSearch = function (event) {
            const query = searchInput.value.trim();
            if (!query) return;
            event.preventDefault();
            window.location.href = `timkiem.html?q=${encodeURIComponent(query)}`;
        };
        searchBtn.addEventListener('click', submitSearch);
        searchInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') submitSearch(event);
        });
    });

});

function setupHeaderDropdownMenus() {
    const navTopLists = document.querySelectorAll('.header-nav .nav-top ul');
    if (!navTopLists.length) return;

    ensureHeaderDropdownStyles();

    const menuConfig = {
        SHOP: [
            { label: 'TOPS', href: 'shop.html?category=tops&page=1' },
            { label: 'BOTTOMS', href: 'shop.html?category=bottoms&page=1' },
            { label: 'ACCESSORIES', href: 'shop.html?category=accessories&page=1' }
        ],
        THEROLLINGSTONES: [
            { label: 'CAPS', href: 'shop.html?category=cap&page=1' },
            { label: 'JACKETS/HOODIE', href: 'shop.html?category=jacket&page=1' }
        ]
    };

    navTopLists.forEach((list) => {
        const items = list.querySelectorAll(':scope > li');

        items.forEach((item) => {
            if (item.dataset.dropdownReady === 'true') return;

            const link = item.querySelector(':scope > a');
            if (!link) return;

            const key = link.textContent.trim().toUpperCase().replace(/[^A-Z]/g, '');
            const options = menuConfig[key];
            if (!options) return;

            const dropdown = document.createElement('div');
            dropdown.className = 'nav-dropdown-menu';

            options.forEach((entry) => {
                const option = document.createElement('a');
                if (typeof entry === 'string') {
                    option.href = '#';
                    option.textContent = entry;
                } else {
                    option.href = entry.href || '#';
                    option.textContent = entry.label || '';
                }
                dropdown.appendChild(option);
            });

            item.classList.add('nav-item-with-dropdown');
            item.appendChild(dropdown);
            item.dataset.dropdownReady = 'true';
        });
    });
}

function ensureHeaderDropdownStyles() {
    if (document.getElementById('navDropdownStyles')) return;

    const style = document.createElement('style');
    style.id = 'navDropdownStyles';
    style.textContent = `
        .header-nav .nav-top,
        .header-nav .nav-top ul,
        .header-nav .nav-top li {
            overflow: visible;
        }

        .header-nav .nav-top li {
            position: relative;
        }

        .header-nav .nav-top li.nav-item-with-dropdown > .nav-dropdown-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            min-width: 220px;
            background: rgba(0, 0, 0, 0.74);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(5px);
            box-shadow: 0 14px 30px rgba(0, 0, 0, 0.34);
            z-index: 1250;
        }

        .header-nav .nav-top li.nav-item-with-dropdown:hover > .nav-dropdown-menu {
            display: block;
        }

        .header-nav .nav-top li.nav-item-with-dropdown > .nav-dropdown-menu a {
            display: block;
            color: #ffffff;
            text-decoration: none;
            font-size: 15px;
            font-weight: 700;
            line-height: 1.2;
            padding: 12px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
            text-transform: uppercase;
            letter-spacing: 0.04em;
            white-space: nowrap;
        }

        .header-nav .nav-top li.nav-item-with-dropdown > .nav-dropdown-menu a:last-child {
            border-bottom: none;
        }

        .header-nav .nav-top li.nav-item-with-dropdown > .nav-dropdown-menu a:hover {
            background: rgba(255, 255, 255, 0.12);
        }
    `;

    document.head.appendChild(style);
}

function ensureUserMenuStyles() {
    if (document.getElementById('userMenuStyles')) return;

    const style = document.createElement('style');
    style.id = 'userMenuStyles';
    style.textContent = `
        .user-menu-container {
            position: relative;
            display: flex;
            align-items: center;
        }

        .user-menu-container .user-link,
        .user-menu-container .user-icon {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: inherit;
        }

        .user-dropdown-menu {
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            min-width: 190px;
            background: rgba(0, 0, 0, 0.78);
            border: 1px solid rgba(255, 255, 255, 0.22);
            border-radius: 10px;
            box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
            backdrop-filter: blur(6px);
            overflow: hidden;
            z-index: 1100;
        }

        .user-menu-container.active .user-dropdown-menu {
            display: block;
        }

        .user-menu-container.logged-in:hover .user-dropdown-menu {
            display: block;
        }

        .user-dropdown-menu .menu-item {
            display: block;
            padding: 11px 14px;
            color: #fff;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
        }

        .user-dropdown-menu .menu-item:hover {
            background: rgba(255, 255, 255, 0.14);
        }

        .user-menu-container:not(.logged-in) .user-dropdown-menu {
            display: none !important;
        }
    `;

    document.head.appendChild(style);
}

// Manual slide change
function changeSlide(index) {
    currentSlide = index;
    updateSlide();
}

// Update slide display
function updateSlide() {
    if (!slides || !dots) return;

    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Add active class to current slide and dot
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}
