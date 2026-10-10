# 3BK SHOP

## Website bán hàng thời trang tĩnh

3BK SHOP là đồ án Web 1 xây dựng website bán hàng thời trang theo mô hình
web tĩnh HTML, CSS và JavaScript. Website có đầy đủ hai khu vực:

- **End-user:** khách hàng xem sản phẩm, thêm giỏ hàng và đặt hàng.
- **Web-admin:** quản trị viên quản lý người dùng, loại sản phẩm, sản phẩm,
  đơn hàng và thống kê.

Giao diện sử dụng phong cách tối giản đen - trắng, tập trung vào hình ảnh sản
phẩm, thông tin rõ ràng và các nút thao tác dễ nhận biết.

> Website chạy trực tiếp bằng file HTML, không cần cài đặt backend hoặc khởi
> động máy chủ. Dữ liệu mô phỏng được lưu bằng `localStorage` để vẫn giữ lại
> sau khi tải lại trang bằng F5.

## Cách mở và trình bày

1. Mở thư mục dự án.
2. Mở file [index.html](WEB_HocLai/HTML/index.html) bằng Google Chrome.
3. Có thể nhấn F5 để kiểm tra dữ liệu giỏ hàng và đơn hàng vẫn được lưu.
4. Để vào khu vực quản trị, mở
   [dangnhapadmin.html](WEB_HocLai/HTML/dangnhapadmin.html).

### Tài khoản quản trị mẫu

| Thông tin | Giá trị |
|---|---|
| Email | `admin@3bkshop.vn` |
| Mật khẩu | `admin123` |

## Giao diện người dùng

### Trang chủ

Trang [index.html](WEB_HocLai/HTML/index.html) là trang bắt đầu của website,
bao gồm:

- Logo và menu điều hướng.
- Banner giới thiệu thương hiệu.
- Liên kết nhanh đến Shop, Contact và About Us.
- Khu vực giới thiệu sản phẩm nổi bật.
- Bộ đếm thời gian cho chương trình khuyến mãi.
- Biểu tượng tài khoản, giỏ hàng và chuyển đổi ngôn ngữ.

### Shop và chi tiết sản phẩm

Tại [shop.html](WEB_HocLai/HTML/shop.html), khách hàng có thể:

- Xem danh sách sản phẩm đang được bán.
- Tìm kiếm theo tên hoặc mã sản phẩm.
- Lọc sản phẩm theo loại.
- Sắp xếp và phân trang danh sách.
- Mở trang chi tiết sản phẩm.
- Xem hình ảnh, giá, mô tả, tồn kho và số lượng đã bán.

Sản phẩm bị ẩn trong Admin sẽ không xuất hiện trên Shop và không thể truy cập
trực tiếp từ trang chi tiết.

### Đăng nhập và thông tin cá nhân

Website có các trang:

- Đăng nhập và đăng ký tài khoản.
- Quên mật khẩu.
- Thông tin cá nhân.
- Địa chỉ giao hàng.
- Cài đặt tài khoản.
- Lịch sử mua hàng.

Luồng đăng nhập được mô phỏng bằng `localStorage`, phù hợp với phạm vi web
tĩnh của đồ án.

### Giỏ hàng và thanh toán

Tại [cart.html](WEB_HocLai/HTML/cart.html), khách hàng có thể:

- Thêm sản phẩm vào giỏ.
- Tăng hoặc giảm số lượng.
- Xóa từng sản phẩm.
- Xem tổng số lượng và tổng tiền.
- Giữ nguyên dữ liệu sau khi nhấn F5.

Tại [thanhtoan.html](WEB_HocLai/HTML/thanhtoan.html), khách hàng có thể:

- Kiểm tra lại sản phẩm và tổng tiền.
- Nhập hoặc sử dụng thông tin giao hàng.
- Chọn phương thức thanh toán.
- Xác nhận đặt hàng.

Sau khi đặt hàng thành công:

- Đơn hàng được lưu vào `localStorage`.
- Giỏ hàng được xóa.
- Số lượng `sold` của sản phẩm được cập nhật.
- Số lượng `stock` được giảm tương ứng.
- Đơn hàng xuất hiện trong lịch sử mua hàng.

## Giao diện quản trị

Trang quản trị nằm tại
[giaodienadmin.html](WEB_HocLai/HTML/giaodienadmin.html), gồm các khu vực
sau:

### Quản lý người dùng

- Xem danh sách khách hàng.
- Tìm kiếm tài khoản.
- Thêm tài khoản mới.
- Sửa thông tin khách hàng.
- Xóa tài khoản.
- Khóa hoặc mở khóa tài khoản.
- Hiển thị nhiều dữ liệu khách hàng mẫu để kiểm tra và thống kê.

### Quản lý loại sản phẩm

- Thêm loại sản phẩm.
- Sửa tên loại sản phẩm.
- Xóa loại sản phẩm.
- Hiển thị nút thao tác đồng nhất với các khu vực khác.

### Quản lý sản phẩm

- Xem mã, hình ảnh, tên, loại, đơn vị tính, giá và tồn kho.
- Thêm sản phẩm mới.
- Tải lên và xem trước hình ảnh sản phẩm.
- Sửa thông tin sản phẩm.
- Xóa sản phẩm chưa phát sinh giao dịch.
- Ẩn sản phẩm đã từng được bán để bảo toàn lịch sử đơn hàng.
- Phân biệt sản phẩm đang bán và sản phẩm bị ẩn.

Sản phẩm ở trạng thái **Đang bán** được phép hiển thị trên Shop. Sản phẩm ở
trạng thái **Ẩn** chỉ được giữ lại trong Admin và không hiển thị cho khách
hàng.

### Quản lý đơn hàng

- Xem danh sách đơn hàng.
- Lọc theo trạng thái, ngày đặt và địa điểm.
- Cập nhật trạng thái theo đúng thứ tự:
  `Chưa xác nhận → Đã xác nhận → Đã giao → Hoàn tất`.
- Không cho phép cập nhật ngược trạng thái.
- Không cho hủy đơn đã hoàn tất.
- Xem chi tiết đơn hàng trong panel riêng.
- Xem mã đơn, khách hàng, số điện thoại, địa chỉ, sản phẩm, thanh toán và
  tổng tiền.

### Thống kê

Khu vực thống kê hỗ trợ:

- Lọc dữ liệu theo khoảng thời gian.
- Tính tổng tiền mua của từng khách hàng.
- Sắp xếp khách hàng theo tổng tiền giảm dần.
- Hiển thị Top 5 khách hàng.
- Xem danh sách đơn hàng riêng của từng khách.
- Hiển thị thông báo khi khoảng thời gian không có dữ liệu.

## Đối chiếu yêu cầu đồ án

| Nhóm yêu cầu | Chức năng đã thực hiện |
|---|---|
| End-user | Trang chủ, Shop, tìm kiếm, lọc sản phẩm, chi tiết sản phẩm |
| End-user | Đăng nhập, đăng ký, thông tin cá nhân và lịch sử mua hàng |
| End-user | Giỏ hàng, cập nhật số lượng, xóa sản phẩm và tính tổng tiền |
| End-user | Thanh toán, tạo đơn hàng và lưu dữ liệu sau khi tải lại |
| Web-admin | Đăng nhập quản trị riêng |
| Web-admin | CRUD người dùng và khóa/mở khóa tài khoản |
| Web-admin | CRUD loại sản phẩm |
| Web-admin | CRUD sản phẩm, hình ảnh và trạng thái hiển thị |
| Web-admin | Quản lý, lọc, cập nhật và xem chi tiết đơn hàng |
| Web-admin | Thống kê Top 5 khách hàng theo tổng tiền mua |
| Dữ liệu | Có dữ liệu mẫu khách hàng, sản phẩm và đơn hàng để trình diễn |
| Giao diện | Thiết kế đen - trắng, nút Sửa/Xóa/Đóng đồng nhất |
| Tính ổn định | Chạy trực tiếp bằng `index.html`, dữ liệu giữ qua F5 |

## Công nghệ sử dụng

- HTML5.
- CSS3.
- JavaScript thuần.
- `localStorage` để mô phỏng dữ liệu và phiên đăng nhập.
- Google Fonts có fallback về font hệ thống như `Segoe UI`.

## Cấu trúc thư mục chính

```text
WEB_HocLai/
├── HTML/       # Các trang giao diện người dùng và Admin
├── CSS/        # CSS giao diện Shop, checkout và Admin
└── JS/         # Logic giỏ hàng, sản phẩm, đơn hàng, Admin và dữ liệu
```

Một số file quan trọng:

- [static-data.js](WEB_HocLai/JS/static-data.js): dữ liệu dùng chung và
  `localStorage`.
- [shop.js](WEB_HocLai/JS/shop.js): tìm kiếm, lọc và hiển thị sản phẩm.
- [cart.js](WEB_HocLai/JS/cart.js): xử lý giỏ hàng.
- [giohang.js](WEB_HocLai/JS/giohang.js): thanh toán và tạo đơn.
- [admin.js](WEB_HocLai/JS/admin.js): toàn bộ chức năng quản trị.
- [giaodienadmin.css](WEB_HocLai/CSS/giaodienadmin.css): giao diện Admin.

## Kịch bản demo đề xuất

1. Mở trang chủ từ `index.html`.
2. Vào Shop và mở một sản phẩm.
3. Thêm sản phẩm vào giỏ, tăng số lượng rồi nhấn F5.
4. Vào thanh toán và đặt hàng.
5. Mở lịch sử mua hàng để kiểm tra đơn vừa tạo.
6. Mở trang đăng nhập Admin bằng tài khoản mẫu.
7. Kiểm tra bảng người dùng, loại sản phẩm và sản phẩm.
8. Mở phần đơn hàng, xem chi tiết và thử bộ lọc.
9. Mở phần thống kê, chọn khoảng ngày có dữ liệu và trình bày Top 5.

## Phạm vi triển khai

Đây là phiên bản web tĩnh phục vụ mục đích học tập và trình diễn đồ án.
Website chưa sử dụng máy chủ, API hoặc cơ sở dữ liệu thật. Vì vậy dữ liệu chỉ
tồn tại trong trình duyệt hiện tại thông qua `localStorage`; khi xóa dữ liệu
trình duyệt hoặc đổi trình duyệt, dữ liệu có thể được tạo lại từ dữ liệu mẫu.
