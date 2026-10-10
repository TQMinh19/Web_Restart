(function () {
  const KEYS = {
    products: 'webstussy_products',
    users: 'webstussy_users',
    categories: 'webstussy_categories',
    orders: 'webstussy_orders',
    cart: 'webstussy_cart',
    adminSession: 'webstussy_admin_session'
  };

  const defaultProducts = [
    { id: 'SP01', name: 'VICTORIA TEE', category: 'tops', categoryName: 'Áo thun', brand: 'other', price: 1260000, stock: 20, image: '../Image/VICTORIA TEE.jpg', status: 'active', sold: 1 },
    { id: 'SP02', name: 'TEXTURED ZIP HOODED SWEATER', category: 'jacket', categoryName: 'Áo khoác', brand: 'other', price: 3750000, stock: 12, image: '../Image/TEXTURED ZIP HOODED SWEATER.jpg', status: 'active', sold: 0 },
    { id: 'SP03', name: 'BIG & MEATY TEE PIGMENT DYED', category: 'tops', categoryName: 'Áo thun', brand: 'other', price: 1260000, stock: 18, image: '../Image/BIG_MEATY_TEE_PIGMENT_DYED.jpg', status: 'active', sold: 0 },
    { id: 'SP04', name: 'TRUCKER JACKET DENIM', category: 'jacket', categoryName: 'Áo khoác', brand: 'other', price: 3540000, stock: 8, image: '../Image/TRUCKER JACKET DENIM.jpg', status: 'active', sold: 0 },
    { id: 'SP05', name: 'STUSSY WORLD TOUR TEE CAMO', category: 'tops', categoryName: 'Áo thun', brand: 'stussy', price: 2970000, stock: 15, image: '../Image/worldteecamo.png', status: 'active', sold: 2 },
    { id: 'SP06', name: 'STUSSY S MARK 7 BLACK TEE', category: 'tops', categoryName: 'Áo thun', brand: 'stussy', price: 3270000, stock: 10, image: '../Image/7blacktee.png', status: 'active', sold: 0 },
    { id: 'SP07', name: 'STUSSY SUNSET TEE FOG', category: 'tops', categoryName: 'Áo thun', brand: 'stussy', price: 3870000, stock: 9, image: '../Image/SunsetTeeFOG.png', status: 'active', sold: 0 },
    { id: 'SP08', name: 'STUSSY AMSTERDAM SWEATSHIRT', category: 'jacket', categoryName: 'Áo khoác', brand: 'stussy', price: 4170000, stock: 7, image: '../Image/StussyAmsterdamSweatshirt.png', status: 'active', sold: 0 },
    { id: 'SP09', name: 'STUSSY STOCK CUFF BEANIE', category: 'cap', categoryName: 'Mũ', brand: 'stussy', price: 990000, stock: 25, image: '../Image/Stussy Stock Cuff Beanie Black.png', status: 'active', sold: 0 },
    { id: 'SP10', name: 'STUSSY SHORTS BLACK', category: 'bottoms', categoryName: 'Quần', brand: 'stussy', price: 1890000, stock: 14, image: '../Image/Stussy Shorts Black.png', status: 'active', sold: 0 },
    { id: 'SP11', name: 'STUSSY POUCH BAG', category: 'accessories', categoryName: 'Phụ kiện', brand: 'stussy', price: 1590000, stock: 11, image: '../Image/pounchbag.png', status: 'active', sold: 0 },
    { id: 'SP12', name: 'STUSSY 8 BALL KEYCHAIN', category: 'accessories', categoryName: 'Phụ kiện', brand: 'stussy', price: 690000, stock: 30, image: '../Image/keychain8ball.png', status: 'active', sold: 0 }
  ];

  const defaultUsers = [
    { id: 'US01', name: 'Nguyễn Minh Anh', email: 'minhanh@example.com', password: '123456', phone: '0901234567', address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', status: 'active' },
    { id: 'US02', name: 'Trần Hoàng Nam', email: 'hoangnam@example.com', password: '123456', phone: '0912345678', address: '25 Lê Lợi, Quận 1, TP. Hồ Chí Minh', status: 'active' },
    { id: 'US03', name: 'Lê Khánh Linh', email: 'khanhlinh@example.com', password: '123456', phone: '0923456789', address: '88 Nguyễn Trãi, Quận Thanh Xuân, Hà Nội', status: 'active' },
    { id: 'US04', name: 'Phạm Gia Huy', email: 'giahuy@example.com', password: '123456', phone: '0934567890', address: '16 Trần Phú, Hải Châu, Đà Nẵng', status: 'active' },
    { id: 'US05', name: 'Võ Ngọc Anh', email: 'ngocanh@example.com', password: '123456', phone: '0945678901', address: '42 Phan Xích Long, Phú Nhuận, TP. Hồ Chí Minh', status: 'active' },
    { id: 'US06', name: 'Đỗ Minh Quân', email: 'minhquan@example.com', password: '123456', phone: '0956789012', address: '10 Cầu Giấy, Hà Nội', status: 'active' },
    { id: 'US07', name: 'Nguyễn Thảo Vy', email: 'thaovy@example.com', password: '123456', phone: '0967890123', address: '73 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh', status: 'locked' },
    { id: 'US08', name: 'Bùi Thanh Tâm', email: 'thanhtam@example.com', password: '123456', phone: '0978901234', address: '19 Điện Biên Phủ, Bình Thạnh, TP. Hồ Chí Minh', status: 'active' },
    { id: 'US09', name: 'Phan Quỳnh Mai', email: 'quynhmai@example.com', password: '123456', phone: '0989012345', address: '61 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội', status: 'active' },
    { id: 'US10', name: 'Hồ Đức Anh', email: 'ducanh@example.com', password: '123456', phone: '0990123456', address: '27 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', status: 'active' },
    { id: 'US11', name: 'Đặng Thu Hà', email: 'thuha@example.com', password: '123456', phone: '0902345678', address: '54 Lý Thường Kiệt, Nha Trang, Khánh Hòa', status: 'active' },
    { id: 'US12', name: 'Mai Quốc Bảo', email: 'quocbao@example.com', password: '123456', phone: '0913456789', address: '102 Lê Duẩn, Thành phố Huế', status: 'active' }
  ];

  const defaultCategories = [
    { id: 'CAT01', name: 'Áo thun', description: 'Sản phẩm áo thun', value: 'tops' },
    { id: 'CAT02', name: 'Áo khoác', description: 'Jacket, hoodie và sweater', value: 'jacket' },
    { id: 'CAT03', name: 'Quần', description: 'Quần thời trang', value: 'bottoms' },
    { id: 'CAT04', name: 'Phụ kiện', description: 'Túi, móc khóa và phụ kiện', value: 'accessories' },
    { id: 'CAT05', name: 'Mũ', description: 'Các loại mũ', value: 'cap' }
  ];

  const defaultOrders = [
    {
      id: 'ORD-2026-001',
      userEmail: 'minhanh@example.com',
      customerName: 'Nguyễn Minh Anh',
      phone: '0901234567',
      address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      payment: 'COD',
      status: 'delivered',
      createdAt: '2026-09-28T09:00:00.000Z',
      items: [{ name: 'VICTORIA TEE', price: 1260000, qty: 1, size: 'M', color: 'BLACK', image: '../Image/VICTORIA TEE.jpg' }],
      total: 1260000
    },
    {
      id: 'ORD-2026-002',
      userEmail: 'hoangnam@example.com',
      customerName: 'Trần Hoàng Nam',
      phone: '0912345678',
      address: '25 Lê Lợi, Quận 1, TP. Hồ Chí Minh',
      payment: 'COD',
      status: 'completed',
      createdAt: '2026-09-29T10:30:00.000Z',
      items: [{ name: 'TEXTURED ZIP HOODED SWEATER', price: 3750000, qty: 1, size: 'L', color: 'BLACK', image: '../Image/TEXTURED ZIP HOODED SWEATER.jpg' }],
      total: 3750000
    },
    {
      id: 'ORD-2026-003',
      userEmail: 'khanhlinh@example.com',
      customerName: 'Lê Khánh Linh',
      phone: '0923456789',
      address: '88 Nguyễn Trãi, Quận Thanh Xuân, Hà Nội',
      payment: 'BANK',
      status: 'delivered',
      createdAt: '2026-09-30T14:15:00.000Z',
      items: [{ name: 'STUSSY WORLD TOUR TEE CAMO', price: 2970000, qty: 1, size: 'M', color: 'CAMO', image: '../Image/worldteecamo.png' }],
      total: 2970000
    },
    {
      id: 'ORD-2026-004',
      userEmail: 'giahuy@example.com',
      customerName: 'Phạm Gia Huy',
      phone: '0934567890',
      address: '16 Trần Phú, Hải Châu, Đà Nẵng',
      payment: 'COD',
      status: 'confirmed',
      createdAt: '2026-10-01T08:45:00.000Z',
      items: [{ name: 'TRUCKER JACKET DENIM', price: 3540000, qty: 1, size: 'L', color: 'BLUE', image: '../Image/TRUCKER JACKET DENIM.jpg' }],
      total: 3540000
    },
    {
      id: 'ORD-2026-005',
      userEmail: 'ngocanh@example.com',
      customerName: 'Võ Ngọc Anh',
      phone: '0945678901',
      address: '42 Phan Xích Long, Phú Nhuận, TP. Hồ Chí Minh',
      payment: 'ONLINE',
      status: 'pending',
      createdAt: '2026-10-02T16:20:00.000Z',
      items: [{ name: 'STUSSY POUCH BAG', price: 1590000, qty: 1, size: 'ONE SIZE', color: 'BLACK', image: '../Image/pounchbag.png' }],
      total: 1590000
    },
    {
      id: 'ORD-2026-006',
      userEmail: 'thanhtam@example.com',
      customerName: 'Bùi Thanh Tâm',
      phone: '0978901234',
      address: '19 Điện Biên Phủ, Bình Thạnh, TP. Hồ Chí Minh',
      payment: 'COD',
      status: 'delivered',
      createdAt: '2026-10-03T09:10:00.000Z',
      items: [{ name: 'STUSSY S MARK 7 BLACK TEE', price: 3270000, qty: 1, size: 'M', color: 'BLACK', image: '../Image/7blacktee.png' }],
      total: 3270000
    },
    {
      id: 'ORD-2026-007',
      userEmail: 'quynhmai@example.com',
      customerName: 'Phan Quỳnh Mai',
      phone: '0989012345',
      address: '61 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
      payment: 'BANK',
      status: 'completed',
      createdAt: '2026-10-04T11:40:00.000Z',
      items: [{ name: 'STUSSY SUNSET TEE FOG', price: 3870000, qty: 1, size: 'S', color: 'FOG', image: '../Image/SunsetTeeFOG.png' }],
      total: 3870000
    },
    {
      id: 'ORD-2026-008',
      userEmail: 'ducanh@example.com',
      customerName: 'Hồ Đức Anh',
      phone: '0990123456',
      address: '27 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
      payment: 'COD',
      status: 'confirmed',
      createdAt: '2026-10-05T13:25:00.000Z',
      items: [{ name: 'STUSSY SHORTS BLACK', price: 1890000, qty: 1, size: 'L', color: 'BLACK', image: '../Image/Stussy Shorts Black.png' }],
      total: 1890000
    },
    {
      id: 'ORD-2026-009',
      userEmail: 'thuha@example.com',
      customerName: 'Đặng Thu Hà',
      phone: '0902345678',
      address: '54 Lý Thường Kiệt, Nha Trang, Khánh Hòa',
      payment: 'ONLINE',
      status: 'pending',
      createdAt: '2026-10-06T15:05:00.000Z',
      items: [{ name: 'STUSSY STOCK CUFF BEANIE', price: 990000, qty: 1, size: 'ONE SIZE', color: 'BLACK', image: '../Image/Stussy Stock Cuff Beanie Black.png' }],
      total: 990000
    },
    {
      id: 'ORD-2026-010',
      userEmail: 'quocbao@example.com',
      customerName: 'Mai Quốc Bảo',
      phone: '0913456789',
      address: '102 Lê Duẩn, Thành phố Huế',
      payment: 'COD',
      status: 'delivered',
      createdAt: '2026-10-07T17:30:00.000Z',
      items: [{ name: 'STUSSY AMSTERDAM SWEATSHIRT', price: 4170000, qty: 1, size: 'XL', color: 'GREY', image: '../Image/StussyAmsterdamSweatshirt.png' }],
      total: 4170000
    }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function read(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return Array.isArray(value) ? value : clone(fallback);
    } catch (error) {
      return clone(fallback);
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function seed() {
    if (!localStorage.getItem(KEYS.products)) write(KEYS.products, defaultProducts);
    if (!localStorage.getItem(KEYS.users)) {
      write(KEYS.users, defaultUsers);
    } else if (localStorage.getItem('webstussy_demo_users_seeded') !== 'v2') {
      const users = read(KEYS.users, defaultUsers);
      const existingEmails = new Set(users.map(user => user.email));
      const missingUsers = defaultUsers.filter(user => !existingEmails.has(user.email));
      if (missingUsers.length) write(KEYS.users, users.concat(missingUsers));
      localStorage.setItem('webstussy_demo_users_seeded', 'v2');
    }
    if (!localStorage.getItem(KEYS.categories)) write(KEYS.categories, defaultCategories);
    if (!localStorage.getItem(KEYS.orders)) {
      write(KEYS.orders, defaultOrders);
    } else if (localStorage.getItem('webstussy_demo_orders_seeded') !== 'v2') {
      const orders = read(KEYS.orders, defaultOrders);
      const existingIds = new Set(orders.map(order => order.id));
      const missingOrders = defaultOrders.filter(order => !existingIds.has(order.id));
      if (missingOrders.length) write(KEYS.orders, orders.concat(missingOrders));
      localStorage.setItem('webstussy_demo_orders_seeded', 'v2');
    }
  }

  function getProducts() { seed(); return read(KEYS.products, defaultProducts); }
  function getUsers() { seed(); return read(KEYS.users, defaultUsers); }
  function getCategories() { seed(); return read(KEYS.categories, defaultCategories); }
  function getOrders() { seed(); return read(KEYS.orders, defaultOrders); }
  function getCart() { return read(KEYS.cart, []); }
  function saveProducts(value) { write(KEYS.products, value); }
  function saveUsers(value) { write(KEYS.users, value); }
  function saveCategories(value) { write(KEYS.categories, value); }
  function saveOrders(value) { write(KEYS.orders, value); }
  function saveCart(value) { write(KEYS.cart, value); }
  function money(value) { return `${Number(value || 0).toLocaleString('vi-VN')}đ`; }

  seed();
  window.StaticStore = {
    KEYS,
    getProducts,
    getUsers,
    getCategories,
    getOrders,
    getCart,
    saveProducts,
    saveUsers,
    saveCategories,
    saveOrders,
    saveCart,
    money,
    clone
  };
}());
