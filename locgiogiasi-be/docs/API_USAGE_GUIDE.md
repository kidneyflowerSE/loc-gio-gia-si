# API Usage Guide - Hướng dẫn sử dụng API

## Mục lục
1. [Tổng quan](#tổng-quan)
2. [Authentication](#authentication)
3. [Products API](#products-api)
4. [Cart API](#cart-api)
5. [Orders API](#orders-api)
6. [Blog API](#blog-api)
7. [Admin API](#admin-api)
8. [Contact API](#contact-api)
9. [Statistics API](#statistics-api)
10. [Error Handling](#error-handling)

---

## Tổng quan

### Base URL
```
http://localhost:3000/api
```

### Content Types
- **GET requests**: `application/json`
- **POST/PUT requests**: `application/json` hoặc `multipart/form-data` (khi có file)
- **File uploads**: `multipart/form-data`

### Response Format
```json
{
  "success": boolean,
  "message": string,
  "data": object | array,
  "pagination": object (optional),
  "errors": array (optional)
}
```

---

## Authentication

### Admin Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "123456"
}
```

### Response
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "...",
      "username": "admin",
      "fullName": "Administrator",
      "role": "admin"
    }
  }
}
```

### Sử dụng Token
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Products API

### 1. Lấy danh sách sản phẩm
```http
GET /api/products?page=1&limit=10&brand=Toyota&year=2020
```

**Query Parameters:**
- `page`: Trang hiện tại (default: 1)
- `limit`: Số sản phẩm mỗi trang (default: 10)
- `search`: Tìm kiếm theo tên, mô tả
- `brand`: Lọc theo hãng xe
- `carModel`: Lọc theo dòng xe
- `year`: Lọc theo năm
- `minPrice`: Giá tối thiểu
- `maxPrice`: Giá tối đa

### 2. Tạo sản phẩm mới
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: multipart/form-data

name=Lọc gió Toyota Camry 2020
filterCode=TYC-2020-CAM
brand=Toyota
carModels=Camry
carModels=Camry Hybrid
year=2020
price=250000
costPrice=180000
description=Lọc gió chính hãng cho Toyota Camry 2020
stock=50
images=<file1.jpg>
images=<file2.jpg>
```

### 3. Cập nhật sản phẩm
```http
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

name=Lọc gió Toyota Camry 2020 (Cập nhật)
price=280000
removeImages=["public_id_1", "public_id_2"]
images=<new_file.jpg>
```

### 4. Tìm kiếm theo mã lọc
```http
GET /api/products/search/TYC-2020-CAM
```

### 5. Lấy sản phẩm theo hãng xe
```http
GET /api/products/brand/Toyota?page=1&limit=10
```

### 6. Lấy sản phẩm theo dòng xe
```http
GET /api/products/car-model/Camry?page=1&limit=10
```

---

## Cart API

### 1. Lấy thông tin giỏ hàng
```http
GET /api/cart
Cookie: sessionId=abc123; fingerprint=def456
```

### 2. Thêm sản phẩm vào giỏ hàng
```http
POST /api/cart/add
Content-Type: application/json

{
  "productId": "64f7b1a2c3d4e5f6a7b8c9d0",
  "quantity": 2
}
```

### 3. Cập nhật số lượng
```http
PUT /api/cart/update
Content-Type: application/json

{
  "productId": "64f7b1a2c3d4e5f6a7b8c9d0",
  "quantity": 3
}
```

### 4. Xóa sản phẩm khỏi giỏ hàng
```http
DELETE /api/cart/remove/64f7b1a2c3d4e5f6a7b8c9d0
```

### 5. Xóa toàn bộ giỏ hàng
```http
DELETE /api/cart/clear
```

---

## Orders API

### 1. Tạo đơn hàng từ giỏ hàng
```http
POST /api/orders/from-cart
Content-Type: application/json

{
  "customer": {
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@email.com",
    "phone": "0123456789",
    "address": "123 Đường ABC",
    "city": "Hồ Chí Minh",
    "district": "Quận 1",
    "ward": "Phường 1"
  },
  "paymentMethod": "cash",
  "notes": "Giao hàng vào buổi sáng"
}
```

### 2. Theo dõi đơn hàng
```http
GET /api/orders/track/ORD20250710001
```

### 3. Lấy danh sách đơn hàng (Admin)
```http
GET /api/orders?page=1&limit=10&status=pending
Authorization: Bearer <token>
```

### 4. Cập nhật trạng thái đơn hàng (Admin)
```http
PUT /api/orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

---

## Blog API

### 1. Lấy danh sách blog
```http
GET /api/blogs?page=1&limit=10&category=Hướng dẫn
```

### 2. Lấy chi tiết blog
```http
GET /api/blogs/cach-chon-loc-gio-oto
```

### 3. Tạo blog mới (Admin)
```http
POST /api/blogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Cách chọn lọc gió ô tô phù hợp",
  "slug": "cach-chon-loc-gio-oto",
  "content": "<h1>Hướng dẫn chọn lọc gió...</h1>",
  "excerpt": "Bài viết hướng dẫn cách chọn lọc gió ô tô phù hợp...",
  "category": "Hướng dẫn",
  "tags": ["lọc gió", "bảo dưỡng", "ô tô"],
  "status": "published"
}
```

---

## Admin API

### 1. Lấy thông tin profile
```http
GET /api/admin/profile
Authorization: Bearer <token>
```

### 2. Cập nhật profile
```http
PUT /api/admin/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Nguyễn Văn Admin",
  "email": "admin@locgiogiasi.com"
}
```

### 3. Đổi mật khẩu
```http
PUT /api/admin/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "123456",
  "newPassword": "newpassword123"
}
```

---

## Contact API

### 1. Gửi tin nhắn liên hệ
```http
POST /api/contacts
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@email.com",
  "phone": "0123456789",
  "subject": "Hỏi về sản phẩm",
  "message": "Tôi muốn hỏi về lọc gió Toyota Camry 2020..."
}
```

### 2. Lấy danh sách tin nhắn (Admin)
```http
GET /api/contacts?page=1&limit=10&status=new
Authorization: Bearer <token>
```

### 3. Trả lời tin nhắn (Admin)
```http
POST /api/contacts/:id/reply
Authorization: Bearer <token>
Content-Type: application/json

{
  "reply": "Cảm ơn bạn đã liên hệ. Về sản phẩm lọc gió Toyota Camry 2020..."
}
```

---

## Statistics API

### 1. Dashboard thống kê (Admin)
```http
GET /api/statistics/dashboard
Authorization: Bearer <token>
```

### Response
```json
{
  "success": true,
  "data": {
    "totalProducts": 150,
    "totalOrders": 45,
    "totalRevenue": 12500000,
    "recentOrders": [...],
    "topProducts": [...],
    "monthlyStats": [...]
  }
}
```

### 2. Thống kê sản phẩm (Admin)
```http
GET /api/statistics/products?period=month
Authorization: Bearer <token>
```

### 3. Thống kê đơn hàng (Admin)
```http
GET /api/statistics/orders?period=week
Authorization: Bearer <token>
```

---

## Error Handling

### Lỗi Validation
```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    {
      "field": "name",
      "message": "Tên sản phẩm là bắt buộc"
    },
    {
      "field": "price",
      "message": "Giá phải là số dương"
    }
  ]
}
```

### Lỗi Authentication
```json
{
  "success": false,
  "message": "Token không hợp lệ"
}
```

### Lỗi Not Found
```json
{
  "success": false,
  "message": "Không tìm thấy sản phẩm"
}
```

### Lỗi Server
```json
{
  "success": false,
  "message": "Lỗi server nội bộ",
  "error": "Error details..."
}
```

---

## Common HTTP Status Codes

| Status Code | Mô tả |
|-------------|-------|
| 200 | OK - Thành công |
| 201 | Created - Tạo mới thành công |
| 400 | Bad Request - Dữ liệu không hợp lệ |
| 401 | Unauthorized - Chưa xác thực |
| 403 | Forbidden - Không có quyền truy cập |
| 404 | Not Found - Không tìm thấy tài nguyên |
| 500 | Internal Server Error - Lỗi server |

---

## Postman Collection

Để test API dễ dàng hơn, bạn có thể import collection này vào Postman:

```json
{
  "info": {
    "name": "Lốc Gio Gia Sĩ API",
    "description": "API collection for testing"
  },
  "item": [
    {
      "name": "Admin Login",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/admin/login",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"admin\",\n  \"password\": \"123456\"\n}"
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000"
    }
  ]
}
```

---

## Tips & Best Practices

### 1. Sử dụng Pagination
- Luôn sử dụng `page` và `limit` cho các API trả về danh sách
- Kiểm tra `total` và `pages` trong response để điều hướng

### 2. File Upload
- Sử dụng `multipart/form-data` cho upload file
- Kiểm tra định dạng và kích thước file trước khi upload
- Xử lý `removeImages` khi cập nhật sản phẩm

### 3. Error Handling
- Luôn kiểm tra `success` field trong response
- Xử lý các lỗi validation một cách thân thiện với người dùng
- Implement retry logic cho các lỗi server

### 4. Security
- Luôn gửi JWT token trong header `Authorization`
- Không lưu trữ password trong plaintext
- Validate tất cả input từ client

### 5. Performance
- Sử dụng cache cho các API thường xuyên gọi
- Implement debounce cho search API
- Tối ưu hóa query với appropriate indexes

Tài liệu này cung cấp hướng dẫn chi tiết về cách sử dụng tất cả các API endpoints trong hệ thống, giúp developers và testers làm việc hiệu quả hơn.
