# LocGioGiaSi Backend API

Backend API cho website bán locgiogiasi xe hơi.

## Tính năng chính

### 1. Quản lý sản phẩm locgiogiasi
- CRUD sản phẩm locgiogiasi ô tô
- Bộ lọc theo hãng xe, dòng xe, năm sản xuất, giá
- Tìm kiếm theo tên, mã lọc
- Upload hình ảnh sản phẩm lên Cloudinary
- Quản lý tồn kho

### 2. Quản lý blog
- CRUD blog posts
- Phân loại blog theo category
- Tag hệ thống
- Blog nổi bật

### 3. Quản lý đơn hàng
- Tạo đơn hàng trực tiếp từ danh sách sản phẩm
- Gửi email báo giá
- Quản lý trạng thái đơn hàng
- Thống kê đơn hàng

### 4. Hệ thống quản trị
- Đăng nhập admin
- Phân quyền người dùng
- Quản lý admin accounts

### 4. Liên hệ
- Form liên hệ
- Gửi email tự động
- Quản lý tin nhắn liên hệ

### 5. Thống kê
- Dashboard thống kê
- Báo cáo sản phẩm
- Báo cáo đơn hàng
- Báo cáo blog

## Cài đặt

### Yêu cầu hệ thống
- Node.js (>= 14.0.0)
- MongoDB (>= 4.0.0)
- NPM hoặc Yarn

### Cài đặt dependencies
```bash
npm install
```

### Cấu hình môi trường
1. Sao chép file `.env.example` thành `.env`
2. Cập nhật các thông tin cấu hình:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/locgiogiasi

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@locgiogiasi.com

# Server
PORT=3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Khởi chạy server
```bash
# Development
npm run dev

# Production
npm start
```

### Khởi tạo dữ liệu mẫu (Seed Data)

Hệ thống cung cấp script để khởi tạo dữ liệu mẫu:

```bash
# Khởi tạo tất cả dữ liệu mẫu (brands, products, blogs, settings)
npm run seed

# Khởi tạo chỉ brands
npm run seed:brands

# Khởi tạo chỉ products
npm run seed:products
```

### Migration (Di chuyển dữ liệu)

Nếu bạn đang nâng cấp từ phiên bản cũ có giỏ hàng, hãy chạy script migration:

```bash
# Xóa dữ liệu cart và cập nhật cấu trúc database
npm run migrate:remove-cart
```

**Script migration sẽ:**
- Xóa toàn bộ dữ liệu cart từ database
- Drop collection `carts`
- Loại bỏ reference đến cart trong orders
- Cập nhật cấu trúc database phù hợp với quy trình mới

**Dữ liệu mẫu bao gồm:**
- 6 hãng xe phổ biến: Toyota, Honda, Hyundai, Mazda, Kia, Ford
- Mỗi hãng có 5 dòng xe với các năm sản xuất
- 5 sản phẩm locgiogiasi mẫu với đầy đủ thông tin
- 2 blog posts mẫu
- Cấu hình website mặc định

⚠️ **Lưu ý**: Lệnh seed sẽ xóa toàn bộ dữ liệu cũ và tạo mới!

## Mô hình Database

Hệ thống sử dụng MongoDB với các collection chính sau:

### 📊 **Database Schema Diagram**

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     PRODUCTS    │       │     ORDERS      │       │      BLOGS      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ _id: ObjectId   │       │ _id: ObjectId   │       │ _id: ObjectId   │
│ name: String    │       │ orderNumber: String│     │ title: String   │
│ brand: String   │       │ customer: Object│       │ slug: String    │
│ model: String   │       │ items: [        │       │ content: String │
│ year: Number    │       │   product: ObjectId │ ◄─┤ excerpt: String │
│ price: Number   │       │   quantity: Number │     │ featuredImage: String│
│ description: String│     │   price: Number │       │ author: String  │
│ specifications: Obj│     │   totalPrice: Number│   │ category: String│
│ images: [String]│       │ ]               │       │ tags: [String]  │
│ featured: Boolean│      │ totalAmount: Number│    │ status: String  │
│ status: String  │       │ status: String  │       │ featured: Boolean│
│ createdAt: Date │       │ paymentMethod: String│  │ publishDate: Date│
│ updatedAt: Date │       │ orderDate: Date │       │ createdAt: Date │
└─────────────────┘       └─────────────────┘       │ updatedAt: Date │
                                                    └─────────────────┘
                                                                      
┌─────────────────┐       ┌─────────────────┐                      
│     ADMINS      │       │    BRANDS       │                      
├─────────────────┤       ├─────────────────┤                      
│ _id: ObjectId   │       │ _id: ObjectId   │                      
│ username: String│       │ name: String    │                      
│ email: String   │       │ logo: String    │                      
│ password: String│       │ description: String│                   
│ lastLogin: Date │       │ isActive: Boolean│                     
│ createdAt: Date │       │ createdAt: Date │                      
│ updatedAt: Date │       │ updatedAt: Date │                      
│ createdAt: Date │                                                
│ updatedAt: Date │                                                
└─────────────────┘        
```

### 📋 **Collection Details**

#### **1. Products Collection**
```javascript
{
  _id: ObjectId,
  name: String,              // Tên sản phẩm
  code: String,              // Mã lọc (unique)
  brand: String,             // Hãng xe
  carModels: [String],       // Các dòng xe phù hợp
  year: Number,              // Năm sản xuất
  price: Number,             // Giá bán
  description: String,       // Mô tả
  images: [{
    public_id: String,       // Cloudinary public ID
    url: String,             // URL hình ảnh
    width: Number,           // Chiều rộng
    height: Number,          // Chiều cao
    alt: String              // Alt text
  }],
  stock: Number,             // Số lượng tồn kho
  category: String,          // Danh mục (default: 'LocGioGiaSi')
  specifications: Map,       // Thông số kỹ thuật
  tags: [String],            // Tag cho SEO
  isActive: Boolean,         // Trạng thái kích hoạt
  createdAt: Date,
  updatedAt: Date
}
```

#### **2. Orders Collection**
```javascript
{
  _id: ObjectId,
  orderNumber: String,       // Mã đơn hàng (ORD20250710XXXX)
  customer: {
    name: String,            // Tên khách hàng
    email: String,           // Email
    phone: String,           // Số điện thoại
    address: String,         // Địa chỉ
    city: String,            // Thành phố
    district: String,        // Quận/huyện
    ward: String            // Phường/xã
  },
  items: [{
    product: ObjectId,       // Tham chiếu đến Products
    quantity: Number,        // Số lượng đặt
    price: Number,           // Giá tại thời điểm đặt
    totalPrice: Number       // Tổng giá
  }],
  totalAmount: Number,       // Tổng tiền đơn hàng
  status: String,            // pending/confirmed/processing/completed/cancelled
  notes: String,             // Ghi chú của khách hàng
  paymentMethod: String,     // cash/bank_transfer
  orderDate: Date,           // Ngày đặt hàng
  updatedAt: Date
}
```

#### **3. Blogs Collection**
```javascript
{
  _id: ObjectId,
  title: String,             // Tiêu đề bài viết
  slug: String,              // URL-friendly version of title
  content: String,           // Nội dung HTML
  excerpt: String,           // Tóm tắt (≤ 500 ký tự)
  featuredImage: String,     // URL hình đại diện
  author: String,            // Tác giả
  category: String,          // Danh mục
  tags: [String],            // Tags
  status: String,            // draft/published/archived
  featured: Boolean,         // Bài viết nổi bật
  publishDate: Date,         // Ngày xuất bản
  createdAt: Date,
  updatedAt: Date
}
```

#### **4. Admins Collection**
```javascript
{
  _id: ObjectId,
  username: String,          // Tên đăng nhập (unique)
  email: String,             // Email (unique)
  password: String,          // Mật khẩu đã hash
  lastLogin: Date,           // Lần đăng nhập cuối
  createdAt: Date,
  updatedAt: Date
}
```

### 🔗 **Relationships (Mối quan hệ)**

1. **Products ↔ Orders**: Một sản phẩm có thể có trong nhiều đơn hàng
2. **Brands ↔ Products**: Một thương hiệu có thể có nhiều sản phẩm
3. **Admins → Blogs**: Admin tạo và quản lý blog posts

### 📈 **Indexes (Chỉ mục)**

```javascript
// Products
db.products.createIndex({ "name": "text", "description": "text", "tags": "text", "code": "text" })
db.products.createIndex({ "category": 1 })
db.products.createIndex({ "brand": 1 })
db.products.createIndex({ "price": 1 })
db.products.createIndex({ "isActive": 1 })
db.products.createIndex({ "code": 1 })
db.products.createIndex({ "carModels": 1 })
db.products.createIndex({ "year": 1 })

// Orders
db.orders.createIndex({ "orderNumber": 1 })
db.orders.createIndex({ "customer.email": 1 })
db.orders.createIndex({ "orderDate": -1 })
db.orders.createIndex({ "status": 1 })

// Blogs
db.blogs.createIndex({ "slug": 1 })
db.blogs.createIndex({ "title": "text", "content": "text" })
db.blogs.createIndex({ "category": 1, "status": 1 })
db.blogs.createIndex({ "publishDate": -1 })

// Admins
db.admins.createIndex({ "username": 1 })
db.admins.createIndex({ "email": 1 })

// Brands
db.brands.createIndex({ "name": 1 })
db.brands.createIndex({ "isActive": 1 })
```

## API Endpoints

### Sản phẩm
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `GET /api/products/search/:code` - Tìm kiếm theo mã lọc
- `GET /api/products/brand/:brand` - Lấy sản phẩm theo hãng xe
- `GET /api/products/car-model/:carModel` - Lấy sản phẩm theo dòng xe
- `POST /api/products` - Tạo sản phẩm mới (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)
- `PATCH /api/products/:id/status` - Cập nhật trạng thái sản phẩm (Admin)

### Đơn hàng
- `POST /api/orders/` - Tạo đơn hàng từ danh sách sản phẩm
- `GET /api/orders/track/:orderNumber` - Tra cứu đơn hàng bằng mã
- `GET /api/orders` - Lấy danh sách đơn hàng (Admin)
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng (Admin)
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng (Admin)
- `DELETE /api/orders/:id` - Xóa đơn hàng (Admin)

### Blog
- `GET /api/blogs` - Lấy danh sách blog
- `GET /api/blogs/:slug` - Lấy chi tiết blog
- `GET /api/blogs/featured` - Lấy blog nổi bật
- `POST /api/blogs` - Tạo blog mới (Admin)
- `PUT /api/blogs/:id` - Cập nhật blog (Admin)
- `DELETE /api/blogs/:id` - Xóa blog (Admin)

### Quản trị
- `POST /api/admin/login` - Đăng nhập admin
- `GET /api/admin/profile` - Lấy thông tin admin
- `PUT /api/admin/profile` - Cập nhật thông tin admin
- `PUT /api/admin/change-password` - Đổi mật khẩu

### Liên hệ
- `POST /api/contacts` - Gửi email liên hệ (không lưu database)

### Thống kê
- `GET /api/statistics/dashboard` - Thống kê dashboard tổng quan (Admin)
- `GET /api/statistics/products` - Thống kê sản phẩm (Admin)
- `GET /api/statistics/orders` - Thống kê đơn hàng và trạng thái liên hệ (Admin)
- `GET /api/statistics/contacts` - Thống kê liên hệ theo thời gian (Admin)

## Cấu trúc dự án

```
locgiogiasi-be/
├── config/
│   ├── database.js          # Cấu hình database
│   └── email.js             # Cấu hình email
├── controller/
│   ├── admin.controller.js
│   ├── blog.controller.js
│   ├── contact.controller.js
│   ├── order.controller.js
│   ├── product.controller.js
│   └── statistics.controller.js
├── middleware/
│   ├── auth.middleware.js   # Xác thực và phân quyền
│   ├── error.middleware.js  # Xử lý lỗi
│   ├── order.middleware.js  # Validation đơn hàng
│   └── upload.middleware.js # Upload file
├── models/
│   ├── admin.model.js
│   ├── blog.model.js
│   ├── brand.model.js
│   ├── order.model.js
│   ├── product.model.js
│   └── settings.model.js
├── routes/
│   ├── admin.routes.js
│   ├── blog.routes.js
│   ├── cart.routes.js
│   ├── contact.routes.js
│   ├── order.routes.js
│   ├── product.routes.js
│   ├── statistics.routes.js
│   └── index.js
├── utils/
│   ├── createDefaultAdmin.js
│   ├── createDirectories.js
│   ├── helpers.js
│   └── validation.js
├── uploads/                 # Thư mục lưu file upload
├── .env.example            # Template file môi trường
├── .gitignore
├── index.js                # File chính
├── package.json
└── README.md
```

## Tài khoản admin mặc định

Khi chạy lần đầu, hệ thống sẽ tự động tạo tài khoản admin:
- **Username**: admin
- **Password**: 123456
- **Email**: admin@locgiogiasi.com

⚠️ **Lưu ý**: Hãy đổi mật khẩu sau khi đăng nhập lần đầu!

## Tính năng bảo mật

- JWT Authentication
- Password hashing với bcrypt
- Input validation
- File upload security
- CORS configuration
- Rate limiting (recommended for production)

## Deployment

### Sử dụng PM2 (khuyến nghị)
```bash
npm install -g pm2
pm2 start index.js --name "locgiogiasi-api"
pm2 startup
pm2 save
```

### Sử dụng Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

## Đóng góp

1. Fork dự án
2. Tạo branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Liên hệ

- Email: info@locgiogiasi.com
- Phone: 0123.456.789

## Tài liệu chi tiết

### 📖 Documentation
- [📋 Data Model Specification](./docs/DATA_MODEL_SPECIFICATION.md) - Chi tiết về các model và trường dữ liệu
- [✅ Validation Rules](./docs/VALIDATION_RULES.md) - Quy tắc validate cho từng trường
- [🔌 API Usage Guide](./docs/API_USAGE_GUIDE.md) - Hướng dẫn sử dụng API endpoints
- [🛠️ Product API](./docs/PRODUCT_API.md) - Chi tiết API sản phẩm

### 🎯 Quick Links
- [Mô hình Database](#mô-hình-database) - Schema và relationships
- [API Endpoints](#api-endpoints) - Danh sách tất cả endpoints
- [Cấu trúc dự án](#cấu-trúc-dự-án) - Tổ chức file và folder
