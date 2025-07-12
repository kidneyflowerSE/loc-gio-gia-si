# Tài liệu mô tả Model và Trường dữ liệu

## Mục lục
1. [Product Model](#product-model)
2. [Cart Model](#cart-model)
3. [Order Model](#order-model)
4. [Blog Model](#blog-model)
5. [Admin Model](#admin-model)
6. [Contact Model](#contact-model)
7. [Settings Model](#settings-model)

---

## Product Model

Model này lưu trữ thông tin chi tiết về sản phẩm lọc gió ô tô.

### Trường dữ liệu cơ bản

| Trường | Loại dữ liệu | Bắt buộc | Mô tả |
|--------|--------------|----------|-------|
| `_id` | ObjectId | Tự động | ID duy nhất của sản phẩm do MongoDB tự tạo |
| `name` | String | ✓ | Tên sản phẩm (VD: "Lọc gió Toyota Camry 2015-2020") |
| `code` | String | ✓ | Mã lọc duy nhất để nhận diện sản phẩm (VD: "TYC-2015-CAM") |
| `brand` | String | ✓ | Hãng xe mà sản phẩm phù hợp (VD: "Toyota", "Honda", "Hyundai") |
| `carModels` | Array[String] | ✓ | Danh sách các dòng xe phù hợp (VD: ["Camry", "Camry Hybrid"]) |
| `year` | String | ✓ | Năm sản xuất của xe (VD: "2015-2020") |
| `price` | Number | ✓ | Giá bán cho khách hàng (VNĐ) |
| `costPrice` | Number | ✓ | Giá vốn để tính lợi nhuận (VNĐ) |
| `description` | String | ✓ | Mô tả chi tiết sản phẩm, tính năng, chất lượng |
| `stock` | Number | ✓ | Số lượng tồn kho hiện tại (mặc định: 0) |
| `isActive` | Boolean | ✓ | Trạng thái sản phẩm (true: hiển thị, false: ẩn) |

### Trường dữ liệu nâng cao

| Trường | Loại dữ liệu | Bắt buộc | Mô tả |
|--------|--------------|----------|-------|
| `images` | Array[Object] | ✗ | Danh sách hình ảnh của sản phẩm |
| `images.public_id` | String | ✓ | ID duy nhất của ảnh trên Cloudinary |
| `images.url` | String | ✓ | URL truy cập ảnh |
| `images.width` | Number | ✗ | Chiều rộng ảnh (px) |
| `images.height` | Number | ✗ | Chiều cao ảnh (px) |
| `images.alt` | String | ✗ | Mô tả ảnh cho SEO và accessibility |
| `specifications` | Map | ✗ | Thông số kỹ thuật (VD: {"material": "Giấy lọc", "size": "245x180mm"}) |
| `tags` | Array[String] | ✗ | Từ khóa SEO (VD: ["toyota", "camry", "loc-gio"]) |
| `createdAt` | Date | Tự động | Thời gian tạo sản phẩm |
| `updatedAt` | Date | Tự động | Thời gian cập nhật cuối cùng |

### Công dụng chi tiết

- **code**: Giúp nhân viên và khách hàng dễ dàng tìm kiếm sản phẩm chính xác
- **carModels**: Cho phép một sản phẩm phù hợp với nhiều dòng xe khác nhau
- **year**: Hỗ trợ năm sản xuất dạng chuỗi cho các trường hợp năm sản xuất không cụ thể
- **costPrice**: Giúp tính toán lợi nhuận và quản lý tài chính
- **images**: Lưu trữ trên Cloudinary với tối ưu hóa tự động
- **specifications**: Linh hoạt lưu trữ các thông số kỹ thuật khác nhau
- **tags**: Cải thiện SEO và khả năng tìm kiếm

---

## Cart Model

Model này quản lý giỏ hàng ảo cho từng thiết bị người dùng.

### Trường dữ liệu nhận diện

| Trường | Loại dữ liệu | Bắt buộc | Mô tả |
|--------|--------------|----------|-------|
| `_id` | ObjectId | Tự động | ID duy nhất của giỏ hàng |
| `sessionId` | String | ✓ | ID phiên làm việc của trình duyệt |
| `fingerprint` | String | ✓ | Dấu vân tay thiết bị (từ thông tin trình duyệt, IP, v.v.) |
| `userAgent` | String | ✗ | Thông tin trình duyệt để phân tích |
| `ipAddress` | String | ✗ | Địa chỉ IP để theo dõi vị trí |

### Trường dữ liệu sản phẩm

| Trường | Loại dữ liệu | Bắt buộc | Mô tả |
|--------|--------------|----------|-------|
| `items` | Array[Object] | ✓ | Danh sách sản phẩm trong giỏ hàng |
| `items.product` | ObjectId | ✓ | Tham chiếu đến sản phẩm |
| `items.quantity` | Number | ✓ | Số lượng sản phẩm |
| `items.price` | Number | ✓ | Giá tại thời điểm thêm vào giỏ |
| `items.addedAt` | Date | ✓ | Thời gian thêm vào giỏ |

### Trường dữ liệu thống kê

| Trường | Loại dữ liệu | Bắt buộc | Mô tả |
|--------|--------------|----------|-------|
| `status` | String | ✓ | Trạng thái (active/abandoned/converted) |
| `lastActivity` | Date | ✓ | Thời gian hoạt động cuối cùng |
| `expiresAt` | Date | ✓ | Thời gian hết hạn (30 ngày) |

### Công dụng chi tiết

- **sessionId + fingerprint**: Nhận diện duy nhất từng thiết bị
- **items.price**: Lưu giá tại thời điểm thêm vào để tránh thay đổi giá ảnh hưởng
- **status**: Theo dõi trạng thái giỏ hàng cho phân tích marketing
- **expiresAt**: Tự động dọn dẹp giỏ hàng cũ tiết kiệm dung lượng

---

## Order Model

Model này lưu trữ thông tin đơn hàng từ khách hàng.

### Trường dữ liệu đơn hàng

| Trường | Loại dữ liệu | Bắt buộc | Mô tả |
|--------|--------------|----------|-------|
| `_id` | ObjectId | Tự động | ID duy nhất của đơn hàng |
| `orderNumber` | String | ✓ | Mã đơn hàng (VD: "ORD20250710001") |
| `status` | String | ✓ | Trạng thái đơn hàng |
| `paymentMethod` | String | ✓ | Phương thức thanh toán |
| `totalAmount` | Number | ✓ | Tổng tiền đơn hàng |
| `notes` | String | ✗ | Ghi chú từ khách hàng |
| `orderDate` | Date | ✓ | Ngày đặt hàng |
| `updatedAt` | Date | Tự động | Lần cập nhật cuối |

### Trường dữ liệu khách hàng

| Trường | Loại dữ liệu | Bắt buộc | Mô tả |
|--------|--------------|----------|-------|
| `customer` | Object | ✓ | Thông tin khách hàng |
| `customer.name` | String | ✓ | Tên khách hàng |
| `customer.email` | String | ✓ | Email liên hệ |
| `customer.phone` | String | ✓ | Số điện thoại |
| `customer.address` | String | ✓ | Địa chỉ giao hàng |
| `customer.city` | String | ✓ | Thành phố |
| `customer.district` | String | ✗ | Quận/huyện |
| `customer.ward` | String | ✗ | Phường/xã |

### Trường dữ liệu sản phẩm

| Trường | Loại dữ liệu | Bắt buộc | Mô tả |
|--------|--------------|----------|-------|
| `items` | Array[Object] | ✓ | Danh sách sản phẩm đã đặt |
| `items.product` | ObjectId | ✓ | Tham chiếu đến sản phẩm |
| `items.quantity` | Number | ✓ | Số lượng đặt |
| `items.price` | Number | ✓ | Giá tại thời điểm đặt hàng |

### Trạng thái đơn hàng

| Trạng thái | Mô tả |
|------------|-------|
| `pending` | Chờ xử lý |
| `confirmed` | Đã xác nhận |
| `processing` | Đang xử lý |
| `completed` | Hoàn thành |
| `cancelled` | Đã hủy |

### Phương thức thanh toán

| Phương thức | Mô tả |
|-------------|-------|
| `cash` | Tiền mặt |
| `bank_transfer` | Chuyển khoản |

---

## Blog Model

Model này quản lý nội dung blog/tin tức của website.

### Trường dữ liệu cơ bản

| Trường | Loại dữ liệu | Bắt buộc | Mô tả |
|--------|--------------|----------|-------|
| `_id` | ObjectId | Tự động | ID duy nhất của bài viết |
| `title` | String | ✓ | Tiêu đề bài viết |
| `slug` | String | ✓ | URL thân thiện (VD: "cach-chon-loc-gio-oto") |
| `content` | String | ✓ | Nội dung HTML của bài viết |
| `author` | String | ✓ | Tên tác giả |
| `status` | String | ✓ | Trạng thái bài viết |
| `publishDate` | Date | ✓ | Ngày xuất bản |

### Trường dữ liệu phân loại

| Trường | Loại dữ liệu | Bắt buộc | Mô tả |
|--------|--------------|----------|-------|
| `category` | String | ✓ | Danh mục bài viết (VD: "Hướng dẫn", "Tin tức") |
| `tags` | Array[String] | ✗ | Thẻ từ khóa (VD: ["bảo dưỡng", "lọc gió"]) |
| `featuredImage` | String | ✗ | URL ảnh đại diện |
| `featured` | Boolean | ✓ | Bài viết nổi bật |

### Trạng thái bài viết

| Trạng thái | Mô tả |
|------------|-------|
| `hidden` | Ẩn |
| `published` | Hiện |

### Công dụng chi tiết

- **slug**: Tạo URL thân thiện SEO và dễ nhớ
- **featured**: Hiển thị ưu tiên trên trang chủ

---

## Admin Model

Model này quản lý tài khoản quản trị viên hệ thống.

### Trường dữ liệu xác thực

| Trường | Loại dữ liệu | Bắt buộc | Mô tả |
|--------|--------------|----------|-------|
| `_id` | ObjectId | Tự động | ID duy nhất của admin |
| `username` | String | ✓ | Tên đăng nhập (duy nhất) |
| `email` | String | ✓ | Email (duy nhất) |
| `password` | String | ✓ | Mật khẩu đã mã hóa bằng bcrypt |
| `fullName` | String | ✓ | Họ tên đầy đủ |
| `isActive` | Boolean | ✓ | Trạng thái tài khoản |
| `lastLogin` | Date | ✗ | Lần đăng nhập cuối cùng |
| `avatar` | String | ✗ | URL ảnh đại diện |

---

## Contact Model

Model này lưu trữ tin nhắn liên hệ từ khách hàng.

### Trường dữ liệu liên hệ

| Trường | Loại dữ liệu | Bắt buộc | Mô tả |
|--------|--------------|----------|-------|
| `_id` | ObjectId | Tự động | ID duy nhất của tin nhắn |
| `name` | String | ✓ | Tên người gửi |
| `email` | String | ✓ | Email liên hệ |
| `phone` | String | ✗ | Số điện thoại |
| `subject` | String | ✓ | Chủ đề tin nhắn |
| `message` | String | ✓ | Nội dung tin nhắn |
| `createdAt` | Date | Tự động | Thời gian gửi |

---

## Settings Model

Model này lưu trữ thông số chung của hệ thống.

### Trường dữ liệu cơ bản

| Trường | Loại dữ liệu | Bắt buộc | Mô tả |
|--------|--------------|----------|-------|
| `_id` | ObjectId | Tự động | ID duy nhất của cài đặt |
| `storeName` | String | ✓ | Tên cửa hàng |
| `address` | String | ✓ | Địa chỉ cửa hàng |
| `phone` | String | ✓ | Số điện thoại liên hệ |
| `email` | String | ✓ | Email liên hệ |
| `logo` | String | ✗ | URL logo cửa hàng |
| `createdAt` | Date | Tự động | Thời gian tạo |
| `updatedAt` | Date | Tự động | Thời gian cập nhật cuối |

### Công dụng chi tiết

- **storeName**: Tên hiển thị trên website và các tài liệu
- **address**: Địa chỉ cửa hàng để khách hàng tìm đến
- **phone**: Số điện thoại chính để khách hàng liên hệ
- **email**: Email chính để nhận liên hệ từ khách hàng
- **logo**: Logo hiển thị trên website và tài liệu

---

## Tổng kết

### Nguyên tắc thiết kế Model

1. **Tính nhất quán**: Tất cả model đều có `createdAt` và `updatedAt`
2. **Tính linh hoạt**: Sử dụng Map/Object cho dữ liệu không cố định
3. **Tính bảo mật**: Mã hóa mật khẩu, validate dữ liệu đầu vào
4. **Tính tối ưu**: Index các trường thường xuyên tìm kiếm
5. **Tính mở rộng**: Dễ dàng thêm trường mới khi cần thiết

### Mối quan hệ giữa các Model

- **Product** ↔ **Cart**: N-N (một sản phẩm có thể ở nhiều giỏ hàng)
- **Product** ↔ **Order**: N-N (một sản phẩm có thể ở nhiều đơn hàng)
- **Cart** → **Order**: 1-1 (giỏ hàng chuyển thành đơn hàng)
- **Admin** → **Blog**: 1-N (admin viết nhiều blog)
- **Settings**: 1 (chỉ có một bản ghi cài đặt hệ thống)

Tài liệu này giúp developers hiểu rõ mục đích và cách sử dụng từng trường dữ liệu, đảm bảo tính nhất quán trong phát triển và bảo trì hệ thống.
