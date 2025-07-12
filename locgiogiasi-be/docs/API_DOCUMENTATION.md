# Tài liệu API - LocGioGiaSi Backend

## Tổng quan

API RESTful cho hệ thống quản lý cửa hàng lọc gió ô tô LocGioGiaSi. API được xây dựng với Node.js, Express.js và MongoDB, cung cấp các endpoint cho frontend, admin panel và mobile app.

**Base URL:** `http://localhost:3000/api`

**API Version:** 1.0.0

## Authentication

### JWT Token Authentication

Hệ thống sử dụng JWT (JSON Web Token) để xác thực admin.

**Header format:**
```
Authorization: Bearer <jwt_token>
```

**Token expiry:** 7 days (configurable via `JWT_EXPIRES_IN`)

### Protected Routes
Các route admin yêu cầu authentication:
- Tất cả `/admin/*` routes (trừ login)
- POST, PUT, DELETE operations trên products, blogs, brands
- Statistics endpoints

## API Endpoints

### 1. Admin Management (`/api/admin`)

#### POST `/api/admin/login`
**Mục đích:** Đăng nhập admin

**Request Body:**
```json
{
  "username": "admin",  // username hoặc email
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "64a7b8c9d1e2f3g4h5i6j7k8",
      "username": "admin",
      "email": "admin@example.com"
    }
  }
}
```

#### GET `/api/admin/profile` 🔒
**Mục đích:** Lấy thông tin profile admin hiện tại

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "64a7b8c9d1e2f3g4h5i6j7k8",
    "username": "admin", 
    "email": "admin@example.com",
    "lastLogin": "2024-07-12T10:30:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT `/api/admin/profile` 🔒
**Mục đích:** Cập nhật thông tin profile

**Request Body:**
```json
{
  "email": "newemail@example.com"
}
```

#### PUT `/api/admin/change-password` 🔒
**Mục đích:** Đổi mật khẩu admin

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

#### GET `/api/admin` 🔒
**Mục đích:** Lấy danh sách tất cả admin (super admin)

#### POST `/api/admin` 🔒
**Mục đích:** Tạo admin mới (super admin)

**Request Body:**
```json
{
  "username": "newadmin",
  "email": "newadmin@example.com", 
  "password": "password123"
}
```

### 2. Product Management (`/api/products`)

#### GET `/api/products`
**Mục đích:** Lấy danh sách sản phẩm (public)

**Query Parameters:**
- `page` (number): Trang hiện tại (default: 1)
- `limit` (number): Số sản phẩm mỗi trang (default: 10)
- `search` (string): Tìm kiếm theo tên, mã, mô tả
- `brand` (string): Filter theo brand (ObjectId hoặc tên)
- `minPrice` (number): Giá tối thiểu
- `maxPrice` (number): Giá tối đa
- `year` (string): Năm sản xuất
- `carModel` (string): Dòng xe

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64a7b8c9d1e2f3g4h5i6j7k8",
      "name": "Lọc gió Toyota Camry",
      "code": "TY001",
      "brand": {
        "_id": "64a7b8c9d1e2f3g4h5i6j7k9",
        "name": "Toyota"
      },
      "price": 450000,
      "description": "Lọc gió chính hãng cho Toyota Camry",
      "images": [
        {
          "public_id": "products/sample1",
          "url": "https://res.cloudinary.com/demo/image/upload/v1234567890/products/sample1.jpg",
          "alt": "Lọc gió Toyota Camry"
        }
      ],
      "compatibleModels": [
        {
          "carModelId": "64a7b8c9d1e2f3g4h5i6j7k0",
          "carModelName": "Camry",
          "years": ["2018", "2019", "2020"]
        }
      ],
      "stock": 50,
      "origin": "Japan",
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

#### GET `/api/products/:id`
**Mục đích:** Lấy chi tiết sản phẩm

#### GET `/api/products/search/:code`
**Mục đích:** Tìm sản phẩm theo mã

#### GET `/api/products/brand/:brand`
**Mục đích:** Lấy sản phẩm theo hãng

#### GET `/api/products/car-model/:carModel`
**Mục đích:** Lấy sản phẩm theo dòng xe

#### POST `/api/products` 🔒
**Mục đích:** Tạo sản phẩm mới

**Content-Type:** `multipart/form-data`

**Request Body:**
```json
{
  "name": "Lọc gió Toyota Camry",
  "code": "TY001",
  "brand": "64a7b8c9d1e2f3g4h5i6j7k9",
  "compatibleModels": "[{\"carModelId\":\"64a7b8c9d1e2f3g4h5i6j7k0\",\"carModelName\":\"Camry\",\"years\":[\"2018\",\"2019\"]}]",
  "price": 450000,
  "description": "Lọc gió chính hãng",
  "stock": 50,
  "origin": "Japan",
  "material": "Paper filter",
  "dimensions": "30x20x5 cm",
  "warranty": "12 months",
  "images": [File, File] // Upload files
}
```

#### PUT `/api/products/:id` 🔒
**Mục đích:** Cập nhật sản phẩm

#### DELETE `/api/products/:id` 🔒
**Mục đích:** Xóa sản phẩm

#### PATCH `/api/products/:id/status` 🔒
**Mục đích:** Cập nhật trạng thái sản phẩm

### 3. Brand Management (`/api/brands`)

#### GET `/api/brands`
**Mục đích:** Lấy danh sách hãng xe

**Query Parameters:**
- `page`, `limit`: Pagination
- `search`: Tìm kiếm theo tên
- `isActive`: Filter theo trạng thái
- `sortBy`, `sortOrder`: Sắp xếp

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64a7b8c9d1e2f3g4h5i6j7k9",
      "name": "Toyota",
      "carModels": [
        {
          "_id": "64a7b8c9d1e2f3g4h5i6j7k0",
          "name": "Camry",
          "years": ["2018", "2019", "2020", "2021"],
          "isActive": true,
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET `/api/brands/:id`
**Mục đích:** Lấy chi tiết hãng xe

#### GET `/api/brands/:id/car-models`
**Mục đích:** Lấy danh sách dòng xe của hãng

#### POST `/api/brands` 🔒
**Mục đích:** Tạo hãng xe mới

**Request Body:**
```json
{
  "name": "Toyota",
  "isActive": true
}
```

#### PUT `/api/brands/:id` 🔒
**Mục đích:** Cập nhật thông tin hãng

#### DELETE `/api/brands/:id` 🔒
**Mục đích:** Xóa hãng xe

#### POST `/api/brands/:brandId/car-models` 🔒
**Mục đích:** Thêm dòng xe mới cho hãng

**Request Body:**
```json
{
  "name": "Camry",
  "years": ["2018", "2019", "2020"],
  "isActive": true
}
```

#### PUT `/api/brands/:brandId/car-models/:carModelId` 🔒
**Mục đích:** Cập nhật thông tin dòng xe

#### DELETE `/api/brands/:brandId/car-models/:carModelId` 🔒
**Mục đích:** Xóa dòng xe

### 4. Order Management (`/api/orders`)

#### POST `/api/orders`
**Mục đích:** Tạo đơn hàng mới (public)

**Request Body:**
```json
{
  "customer": {
    "name": "Nguyễn Văn A",
    "email": "customer@example.com",
    "phone": "0123456789",
    "address": "123 Đường ABC",
    "city": "Hồ Chí Minh",
    "district": "Quận 1",
    "ward": "Phường Bến Nghé"
  },
  "items": [
    {
      "productId": "64a7b8c9d1e2f3g4h5i6j7k8",
      "quantity": 2
    }
  ],
  "notes": "Ghi chú đặc biệt",
  "paymentMethod": "cash"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully. We will contact you soon for quotation.",
  "data": {
    "orderNumber": "ORD-20240712-1234",
    "order": {
      "_id": "64a7b8c9d1e2f3g4h5i6j7k8",
      "orderNumber": "ORD-20240712-1234",
      "customer": { /* customer info */ },
      "items": [ /* order items */ ],
      "status": "not contacted",
      "totalAmount": 900000,
      "totalItems": 2,
      "orderDate": "2024-07-12T10:30:00.000Z"
    }
  }
}
```

#### GET `/api/orders/track/:orderNumber`
**Mục đích:** Tra cứu đơn hàng bằng số đơn (public)

#### GET `/api/orders` 🔒
**Mục đích:** Lấy danh sách đơn hàng (admin)

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter theo trạng thái
- `fromDate`, `toDate`: Filter theo thời gian
- `customerEmail`: Filter theo email khách hàng

#### GET `/api/orders/:id` 🔒
**Mục đích:** Lấy chi tiết đơn hàng

#### PUT `/api/orders/:id/status` 🔒
**Mục đích:** Cập nhật trạng thái đơn hàng

**Request Body:**
```json
{
  "status": "contacted"
}
```

#### DELETE `/api/orders/:id` 🔒
**Mục đích:** Xóa đơn hàng

### 5. Blog Management (`/api/blogs`)

#### GET `/api/blogs`
**Mục đích:** Lấy danh sách blog (published only)

**Query Parameters:**
- `page`, `limit`: Pagination
- `category`: Filter theo danh mục
- `tag`: Filter theo tag
- `search`: Tìm kiếm full-text

**Response:**
```json
{
  "success": true,
  "data": {
    "blogs": [
      {
        "_id": "64a7b8c9d1e2f3g4h5i6j7k8",
        "title": "Cách chọn lọc gió ô tô phù hợp",
        "slug": "cach-chon-loc-gio-o-to-phu-hop",
        "featuredImage": "https://res.cloudinary.com/demo/image/upload/blogs/blog1.jpg",
        "author": "Admin",
        "category": "Hướng dẫn",
        "tags": ["lọc gió", "bảo dưỡng"],
        "publishDate": "2024-07-10T00:00:00.000Z",
        "featured": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalBlogs": 47,
      "limit": 10
    }
  }
}
```

#### GET `/api/blogs/featured`
**Mục đích:** Lấy blog nổi bật

#### GET `/api/blogs/categories`
**Mục đích:** Lấy danh sách categories

#### GET `/api/blogs/tags`
**Mục đích:** Lấy danh sách tags

#### GET `/api/blogs/recent`
**Mục đích:** Lấy blog mới nhất

#### GET `/api/blogs/:slug`
**Mục đích:** Lấy blog theo slug

#### GET `/api/blogs/admin/all` 🔒
**Mục đích:** Lấy tất cả blog cho admin (bao gồm hidden)

#### GET `/api/blogs/admin/:id` 🔒
**Mục đích:** Lấy chi tiết blog cho admin

#### POST `/api/blogs` 🔒
**Mục đích:** Tạo blog mới

**Content-Type:** `multipart/form-data`

**Request Body:**
```json
{
  "title": "Tiêu đề blog",
  "content": "Nội dung chi tiết...",
  "author": "Tác giả",
  "category": "Hướng dẫn",
  "tags": "lọc gió,bảo dưỡng",
  "status": "published",
  "featured": false,
  "featuredImage": File // Upload file
}
```

#### PUT `/api/blogs/:id` 🔒
**Mục đích:** Cập nhật blog

#### DELETE `/api/blogs/:id` 🔒
**Mục đích:** Xóa blog

### 6. Contact (`/api/contacts`)

#### POST `/api/contacts`
**Mục đích:** Gửi tin nhắn liên hệ (public)

**Request Body:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "customer@example.com",
  "phone": "0123456789",
  "subject": "Hỏi về sản phẩm",
  "message": "Tôi muốn hỏi về lọc gió cho xe Toyota Camry 2020"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.",
  "data": {
    "name": "Nguyễn Văn A",
    "email": "customer@example.com", 
    "subject": "Hỏi về sản phẩm",
    "sentAt": "2024-07-12T10:30:00.000Z"
  }
}
```

### 7. Settings (`/api/settings`)

#### GET `/api/settings`
**Mục đích:** Lấy thông tin cài đặt cửa hàng (public)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64a7b8c9d1e2f3g4h5i6j7k8",
    "storeName": "LocGioGiaSi",
    "address": "123 Đường ABC, Quận 1, TP.HCM",
    "phone": "0123456789",
    "email": "info@locgiogiasi.com",
    "logo": "https://res.cloudinary.com/demo/image/upload/logo.png"
  }
}
```

#### PUT `/api/settings` 🔒
**Mục đích:** Cập nhật thông tin cài đặt

**Request Body:**
```json
{
  "storeName": "LocGioGiaSi - Chuyên lọc gió ô tô",
  "address": "456 Đường XYZ, Quận 2, TP.HCM", 
  "phone": "0987654321",
  "email": "contact@locgiogiasi.com",
  "logo": "https://new-logo-url.com"
}
```

### 8. Statistics (`/api/statistics`) 🔒

#### GET `/api/statistics/dashboard`
**Mục đích:** Lấy thống kê tổng quan dashboard

**Response:**
```json
{
  "success": true,
  "data": {
    "products": {
      "total": 150,
      "active": 145,
      "inactive": 5,
      "lowStock": 8
    },
    "orders": {
      "total": 1250,
      "thisMonth": 89,
      "contacted": 1100,
      "notContacted": 150
    },
    "revenue": {
      "total": 125000000,
      "thisMonth": 8500000,
      "lastMonth": 7200000,
      "growth": 18.1
    },
    "recentOrders": [ /* 5 đơn hàng gần nhất */ ]
  }
}
```

#### GET `/api/statistics/products`
**Mục đích:** Thống kê sản phẩm

#### GET `/api/statistics/orders`
**Mục đích:** Thống kê đơn hàng

#### GET `/api/statistics/contacts`
**Mục đích:** Thống kê liên hệ

### 9. Health Check

#### GET `/api/health`
**Mục đích:** Kiểm tra tình trạng API

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-07-12T10:30:00.000Z"
}
```

#### GET `/api`
**Mục đích:** API documentation overview

**Response:**
```json
{
  "success": true,
  "message": "Welcome to API",
  "version": "1.0.0",
  "endpoints": {
    "products": "/api/products",
    "orders": "/api/orders",
    "blogs": "/api/blogs",
    "admin": "/api/admin",
    "contacts": "/api/contacts", 
    "statistics": "/api/statistics",
    "settings": "/api/settings",
    "brands": "/api/brands"
  }
}
```

## Error Handling

### Standard Error Response Format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message", // optional
  "errors": [ /* validation errors */ ] // optional
}
```

### HTTP Status Codes:

- **200**: Success
- **201**: Created successfully
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **404**: Not Found
- **500**: Internal Server Error

### Common Error Types:

1. **Validation Error (400)**:
```json
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

2. **Authentication Error (401)**:
```json
{
  "success": false,
  "message": "No token provided, authorization denied"
}
```

3. **Not Found Error (404)**:
```json
{
  "success": false,
  "message": "Product not found"
}
```

4. **Database Error (500)**:
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Database connection failed"
}
```

## File Upload

### Supported endpoints:
- `POST /api/products` - Multiple images
- `PUT /api/products/:id` - Multiple images  
- `POST /api/blogs` - Single featured image
- `PUT /api/blogs/:id` - Single featured image

### Configuration:
- **Storage**: Cloudinary
- **Max file size**: 10MB
- **Allowed formats**: JPG, JPEG, PNG, WebP
- **Temp upload**: Files temporarily stored in `/uploads/temp/`

### Request format:
```javascript
Content-Type: multipart/form-data

// Multiple files
images: [File, File, File]

// Single file  
featuredImage: File
```

### Response format:
```json
{
  "public_id": "products/sample1_xyz123",
  "url": "https://res.cloudinary.com/demo/image/upload/v1234567890/products/sample1_xyz123.jpg",
  "width": 1200,
  "height": 800,
  "alt": "Product image"
}
```

## Email Integration

### Features:
- Order confirmation emails
- Contact form notifications
- Admin notifications

### Configuration:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Email Templates:
1. **Order Confirmation** - Sent to customer and admin
2. **Contact Form** - Sent to admin
3. **Password Reset** - Future feature

## Pagination

### Standard pagination format:

**Request:**
```
GET /api/products?page=2&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## Search & Filtering

### Text Search:
- **Products**: name, code, description, compatible models
- **Blogs**: title, content (MongoDB text index)

### Filters:
- **Products**: brand, price range, year, car model, active status
- **Orders**: status, date range, customer email
- **Blogs**: category, tags, status

### Example:
```
GET /api/products?search=toyota&brand=64a7b8c9d1e2f3g4h5i6j7k9&minPrice=100000&maxPrice=500000&year=2020
```

## Rate Limiting

### Future Implementation:
- **Public endpoints**: 100 requests/hour per IP
- **Admin endpoints**: 1000 requests/hour per token
- **Contact form**: 5 submissions/hour per IP

## API Versioning

### Current: v1.0.0
- **Strategy**: URL path versioning (future: `/api/v2/`)
- **Backward compatibility**: Maintained for major versions
- **Deprecation policy**: 6 months notice

## Webhooks (Future)

### Planned events:
- `order.created`
- `order.status_updated`
- `product.out_of_stock`
- `contact.received`

## Development Tools

### Testing API:
- **Postman Collection**: Available in `/docs/postman/`
- **curl examples**: Available in this documentation
- **Swagger UI**: Future implementation

### Environment:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/locgiogiasi
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CORS_ORIGIN=http://localhost:3001
```

### Postman Examples:

#### Login Admin:
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

#### Get Products:
```bash
curl -X GET "http://localhost:3000/api/products?page=1&limit=10&search=toyota"
```

#### Create Order:
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Nguyễn Văn A",
      "email": "customer@example.com",
      "phone": "0123456789",
      "address": "123 Đường ABC",
      "city": "Hồ Chí Minh"
    },
    "items": [
      {
        "productId": "64a7b8c9d1e2f3g4h5i6j7k8",
        "quantity": 2
      }
    ]
  }'
```

## Best Practices

### API Design:
- RESTful conventions
- Consistent response format
- Proper HTTP status codes
- Meaningful error messages

### Security:
- JWT authentication
- Input validation
- File upload restrictions
- CORS configuration

### Performance:
- Database indexing
- Query optimization
- Response compression
- Caching (future)

### Monitoring:
- Request logging
- Error tracking
- Performance metrics
- Health checks
