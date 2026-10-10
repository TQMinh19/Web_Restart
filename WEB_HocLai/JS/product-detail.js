const STATIC_PRODUCTS = {
  1: { name: 'VICTORIA TEE', price: 1260000, image: 'VICTORIA TEE.jpg', colors: [['BLACK', 'VICTORIA TEE.jpg'], ['BEIGE', 'VIC-BEIGE.jpg'], ['BLUE', 'VIC-BLUE.jpg'], ['WHITE', 'VICTORIA TEE2.jpg']], sizes: ['S', 'M', 'L', 'XL'], details: 'Áo thun cotton form rộng, thiết kế tối giản và dễ phối đồ.' },
  2: { name: 'TEXTURED ZIP HOODED SWEATER', price: 3750000, image: 'TEXTURED ZIP HOODED SWEATER.jpg', colors: [['BLACK', 'TEXTURED ZIP HOODED SWEATER.jpg']], sizes: ['S', 'M', 'L', 'XL'], details: 'Áo sweater có khóa kéo, chất liệu dày dặn và giữ ấm tốt.' },
  3: { name: 'BIG & MEATY TEE PIGMENT DYED', price: 1260000, image: 'BIG_MEATY_TEE_PIGMENT_DYED.jpg', colors: [['BLACK', 'BIG_MEATY_TEE_PIGMENT_DYED.jpg']], sizes: ['S', 'M', 'L', 'XL'], details: 'Áo thun pigment dyed với hình in nổi bật phía trước.' },
  4: { name: 'TRUCKER JACKET DENIM', price: 3540000, image: 'TRUCKER JACKET DENIM.jpg', colors: [['BLUE', 'TRUCKER JACKET DENIM.jpg']], sizes: ['S', 'M', 'L', 'XL'], details: 'Áo khoác denim dáng trucker, phù hợp mặc hằng ngày.' },
  5: { name: 'STUSSY WORLD TOUR TEE CAMO', price: 2970000, image: 'worldteecamo.png', colors: [['CAMO', 'worldteecamo.png']], sizes: ['S', 'M', 'L', 'XL'], details: 'Áo thun họa tiết camo thuộc bộ sưu tập World Tour.' },
  6: { name: 'STUSSY S MARK 7 BLACK TEE', price: 3270000, image: '7blacktee.png', colors: [['BLACK', '7blacktee.png']], sizes: ['S', 'M', 'L', 'XL'], details: 'Áo thun đen in logo S Mark đặc trưng.' },
  7: { name: 'STUSSY SUNSET TEE FOG', price: 3870000, image: 'SunsetTeeFOG.png', colors: [['FOG', 'SunsetTeeFOG.png']], sizes: ['S', 'M', 'L', 'XL'], details: 'Áo thun màu fog với họa tiết Sunset graphic.' },
  8: { name: 'STUSSY AMSTERDAM SWEATSHIRT', price: 4170000, image: 'StussyAmsterdamSweatshirt.png', colors: [['GREY', 'StussyAmsterdamSweatshirt.png']], sizes: ['S', 'M', 'L', 'XL'], details: 'Sweatshirt nỉ mềm, họa tiết Amsterdam ở mặt trước.' },
  9: { name: 'STUSSY STOCK CUFF BEANIE', price: 990000, image: 'Stussy Stock Cuff Beanie Black.png', colors: [['BLACK', 'Stussy Stock Cuff Beanie Black.png']], sizes: ['ONE SIZE'], details: 'Mũ len cuff beanie co giãn, phù hợp nhiều kích cỡ.' },
  10: { name: 'STUSSY SHORTS BLACK', price: 1890000, image: 'Stussy Shorts Black.png', colors: [['BLACK', 'Stussy Shorts Black.png']], sizes: ['S', 'M', 'L', 'XL'], details: 'Quần short màu đen, thiết kế thoải mới cho mùa hè.' },
  11: { name: 'STUSSY POUCH BAG', price: 1590000, image: 'pounchbag.png', colors: [['BLACK', 'pounchbag.png']], sizes: ['ONE SIZE'], details: 'Túi pouch nhỏ gọn để đựng các vật dụng cần thiết.' },
  12: { name: 'STUSSY 8 BALL KEYCHAIN', price: 690000, image: 'keychain8ball.png', colors: [['BLACK', 'keychain8ball.png']], sizes: ['ONE SIZE'], details: 'Móc khóa 8 Ball, phụ kiện nhỏ gọn cho túi hoặc chìa khóa.' }
};

function formatDetailPrice(value) {
  return `${Number(value).toLocaleString('vi-VN')}đ`;
}

document.addEventListener('DOMContentLoaded', function () {
  const productId = Number(new URLSearchParams(window.location.search).get('id') || 1);
  const storedProduct = window.StaticStore && StaticStore.getProducts().find(item =>
    item.id === `SP${String(productId).padStart(2, '0')}`
  );
  if (!storedProduct || storedProduct.status === 'hidden') {
    window.location.href = 'shop.html';
    return;
  }
  const product = STATIC_PRODUCTS[productId] || STATIC_PRODUCTS[1];
  const section = document.querySelector('.product-section');
  const mainImage = document.querySelector('.main-image');
  const name = document.querySelector('.product-name');
  const price = document.querySelector('.product-price');
  const colorLabel = document.querySelector('.color-label');
  const colorOptions = document.querySelector('.color-options');
  const sizeOptions = document.querySelector('.size-options');
  const shipping = document.querySelector('.shipping-info');
  const detailsList = document.querySelector('.details-dropdown .details-content ul');
  const sizeGuide = document.querySelector('.size-guide-table');

  if (section) section.dataset.productId = String(productId);
  if (name) name.textContent = product.name;
  if (price) price.textContent = formatDetailPrice(product.price);
  if (shipping) shipping.textContent = 'Miễn phí vận chuyển cho đơn hàng từ 2.000.000đ.';
  document.title = `${product.name} | 3BK SHOP QUẦN ÁO`;

  if (detailsList) {
    detailsList.innerHTML = `<li>${product.details}</li><li>Chất liệu cao cấp, đường may chắc chắn.</li><li>Kiểm tra sản phẩm trước khi nhận hàng.</li>`;
  }

  if (mainImage) {
    mainImage.src = `../Image/${product.image}`;
    mainImage.alt = product.name;
  }

  if (colorOptions) {
    colorOptions.innerHTML = product.colors.map(([color, image], index) => `<img src="../Image/${image}" alt="${color}" data-color="${color}" class="color-thumbnail${index === 0 ? ' active' : ''}">`).join('');
    colorLabel.textContent = product.colors[0][0];
    colorOptions.querySelectorAll('.color-thumbnail').forEach((thumbnail) => {
      thumbnail.addEventListener('click', function () {
        colorOptions.querySelectorAll('.color-thumbnail').forEach((item) => item.classList.remove('active'));
        thumbnail.classList.add('active');
        colorLabel.textContent = thumbnail.dataset.color;
        mainImage.src = thumbnail.src;
      });
    });
  }

  if (sizeOptions) {
    sizeOptions.innerHTML = product.sizes.map((size, index) => `<button type="button" class="size-btn${index === 0 ? ' active' : ''}">${size}</button>`).join('');
    sizeOptions.querySelectorAll('.size-btn').forEach((button) => {
      button.addEventListener('click', function () {
        sizeOptions.querySelectorAll('.size-btn').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
      });
    });
  }

  if (sizeGuide) {
    sizeGuide.innerHTML = '<thead><tr><th>Size</th><th>Gợi ý</th></tr></thead><tbody>' + product.sizes.map((size) => `<tr><td>${size}</td><td>${size === 'ONE SIZE' ? 'Phù hợp mọi người' : 'Tham khảo bảng size'}</td></tr>`).join('') + '</tbody>';
  }
});
