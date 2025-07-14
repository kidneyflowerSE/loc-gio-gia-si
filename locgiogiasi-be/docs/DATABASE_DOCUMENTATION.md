# Tài liệu Database - LocGioGiaSi Backend

## Tổng quan

Hệ thống sử dụng **MongoDB** làm cơ sở dữ liệu với **Mongoose** làm ODM (Object Document Mapper). Database được thiết kế để quản lý một cửa hàng bán lọc gió ô tô với các tính năng quản lý sản phẩm, đơn hàng, blog, và quản trị.

## Kết nối Database

**File:** `config/database.js`

```javascript
const connectDatabase = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/locgiogiasi', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
```

**Cấu hình:**
- **Database Name:** `locgiogiasi`
- **Default URI:** `mongodb://localhost:27017/locgiogiasi`
- **Production URI:** Từ biến môi trường `MONGODB_URI`

## Các Collection (Models)

### 1. Admin Model (`models/admin.model.js`)

**Mục đích:** Quản lý tài khoản quản trị viên

**Schema:**
```javascript
{
  username: String (required, unique, 3-50 chars),
  email: String (required, unique, lowercase),
  password: String (required, min 6 chars, hashed),
  lastLogin: Date,
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

**Tính năng:**
- Mã hóa mật khẩu tự động với bcrypt (salt: 10)
- Ẩn password khi chuyển đổi sang JSON
- Method `comparePassword()` để xác thực
- Tự động cập nhật `updatedAt` khi save

**Index:** Tự động tạo unique index cho `username` và `email`

### 2. Product Model (`models/product.model.js`)

**Mục đích:** Quản lý sản phẩm lọc gió ô tô

**Schema:**
```javascript
{
  name: String (required),
  code: String (required, unique),
  brand: ObjectId (ref: 'Brand', required),
  compatibleModels: [{
    carModelId: ObjectId (required),
    carModelName: String (required),
    years: [String] (required)
  }],
  price: Number (required, min: 0),
  description: String (required),
  images: [{
    public_id: String (required),
    url: String (required),
    width: Number (default: 0),
    height: Number (default: 0),
    alt: String (default: '')
  }],
  stock: Number (required, min: 0, default: 0),
  origin: String (default: ''),
  material: String (default: ''),
  dimensions: String (default: ''),
  warranty: String (default: ''),
  isActive: Boolean (default: true),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

**Index:**
- Text search: `name`, `description`, `code`
- Single field: `brand`, `price`, `isActive`
- Nested field: `compatibleModels.carModelName`, `compatibleModels.years`, `compatibleModels.carModelId`

**Tính năng:**
- Tự động cập nhật `updatedAt`
- Hỗ trợ tìm kiếm full-text
- Quản lý hình ảnh với Cloudinary

### 3. Brand Model (`models/brand.model.js`)

**Mục đích:** Quản lý hãng xe và dòng xe

**Schema:**
```javascript
{
  name: String (required, unique),
  carModels: [{
    _id: ObjectId (auto-generated),
    name: String (required),
    years: [String] (required),
    isActive: Boolean (default: true),
    createdAt: Date (default: now)
  }],
  isActive: Boolean (default: true),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

**Index:**
- Text search: `name`
- Single field: `isActive`
- Nested field: `carModels.name`, `carModels.isActive`

**Tính năng:**
- Nested schema cho car models
- Tự động tạo ObjectId cho car models
- Hỗ trợ quản lý trạng thái active/inactive

### 4. Order Model (`models/order.model.js`)

**Mục đích:** Quản lý đơn hàng từ khách hàng

**Schema:**
```javascript
{
  orderNumber: String (required, unique),
  customer: {
    name: String (required),
    email: String (required, lowercase),
    phone: String (required),
    address: String (required),
    city: String (required),
    district: String,
    ward: String
  },
  items: [{
    product: ObjectId (ref: 'Product', required),
    quantity: Number (required, min: 1, default: 1),
    price: Number (required, min: 0)
  }],
  status: String (enum: ['contacted', 'not contacted'], default: 'not contacted'),
  notes: String,
  orderDate: Date (default: now),
  updatedAt: Date (default: now)
}
```

**Virtual Fields:**
- `totalAmount`: Tổng giá trị đơn hàng (computed từ items)
- `totalItems`: Tổng số lượng sản phẩm (computed từ items)

**Tính năng:**
- **Auto Order Number**: Tự động tạo mã đơn hàng unique với format `ORD-YYYYMMDD-XXXX`
- **Duplicate Prevention**: Retry logic để tránh trùng lặp orderNumber  
- **Virtual Fields**: Được serialize trong JSON response
- **Auto Timestamps**: Tự động cập nhật `updatedAt` khi save
- **Email Integration**: Tự động gửi email xác nhận khi tạo đơn hàng mới

**Order Number Generation Logic:**
```javascript
// Format: ORD-YYYYMMDD-XXXX
// Ví dụ: ORD-20240712-1234
const dateString = date.toISOString().slice(0, 10).replace(/-/g, '');
const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
orderNumber = `ORD-${dateString}-${random}`;
```

### 5. Blog Model (`models/blog.model.js`)

**Mục đích:** Quản lý bài viết blog

**Schema:**
```javascript
{
  title: String (required),
  slug: String (required, unique, lowercase),
  content: String (required),
  featuredImage: String (required),
  author: String (required),
  category: String (required),
  tags: [String],
  status: String (enum: ['hidden', 'published'], default: 'hidden'),
  featured: Boolean (default: false),
  publishDate: Date (default: now),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

**Index:**
- Text search: `title`, `content` (full-text search)
- Compound: `category + status` (efficient filtering)

**Tính năng:**
- **Auto Slug Generation**: Tự động tạo slug từ title
  ```javascript
  slug = title.toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')  // Remove special chars
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens
    .trim('-');                   // Remove leading/trailing hyphens
  ```
- **Full-text Search**: Hỗ trợ tìm kiếm trong title và content
- **Status Management**: Quản lý trạng thái publish/hidden
- **Featured Posts**: Đánh dấu bài viết nổi bật
- **Auto Timestamps**: Tự động cập nhật `updatedAt`
- **Tag System**: Hỗ trợ nhiều tag cho mỗi bài viết

### 6. Contact Model (`models/contact.model.js`)

**Mục đích:** Lưu trữ thông tin liên hệ

**Schema:**
```javascript
{
  name: String (required),
  email: String (required, lowercase),
  phone: String,
  subject: String (required),
  message: String (required),
  createdAt: Date (default: now)
}
```

**Lưu ý quan trọng:** 
- Model này được định nghĩa nhưng **hiện tại hệ thống KHÔNG lưu thông tin liên hệ vào database**
- Contact form chỉ gửi email thông báo đến admin qua nodemailer
- Nếu muốn lưu trữ liên hệ vào DB, cần modify controller để save vào collection

### 7. Settings Model (`models/settings.model.js`)

**Mục đích:** Cài đặt thông tin cửa hàng

**Schema:**
```javascript
{
  storeName: String (required),
  address: String (required),
  phone: String (required),
  email: String (required, lowercase),
  logo: String,
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

**Tính năng:**
- Singleton pattern (chỉ có 1 document)
- Tự động tạo cài đặt mặc định nếu chưa có
- Tự động cập nhật `updatedAt`

## Mối quan hệ giữa các Collection

### Quan hệ chính:

1. **Product → Brand** (Many-to-One)
   - `Product.brand` references `Brand._id`

2. **Product → Brand.carModels** (Many-to-Many)
   - `Product.compatibleModels.carModelId` references `Brand.carModels._id`

3. **Order → Product** (Many-to-Many)
   - `Order.items.product` references `Product._id`

### Biểu đồ mối quan hệ:

```
Brand (1) -----> (n) Product
  |                    |
  |                    |
  v                    v
carModels (n) <-> (n) compatibleModels
                       |
                       v
                   Order.items (n)
```

## Chiến lược Index

### Performance Index:
- **Text Search:** Tối ưu cho tìm kiếm sản phẩm và blog
- **Filter Index:** Tối ưu cho lọc theo brand, price, status
- **Compound Index:** Tối ưu cho query phức tạp

### Đề xuất bổ sung:
```javascript
// Product collection
db.products.createIndex({ "compatibleModels.carModelId": 1, "isActive": 1 })
db.products.createIndex({ "price": 1, "brand": 1 })

// Order collection  
db.orders.createIndex({ "orderDate": -1, "status": 1 })
db.orders.createIndex({ "customer.email": 1 })

// Blog collection
db.blogs.createIndex({ "status": 1, "publishDate": -1 })
db.blogs.createIndex({ "category": 1, "featured": 1 })
```

## Validation Rules

### Ở tầng Schema:
- Required fields validation
- Data type validation  
- Min/Max length validation
- Enum validation
- Custom validation

### Ở tầng Application:
- `express-validator` cho request validation
- Business logic validation trong controllers

## Backup và Migration

### Backup Strategy:
```bash
# Daily backup
mongodump --uri="mongodb://localhost:27017/locgiogiasi" --out="/backup/$(date +%Y%m%d)"

# Restore
mongorestore --uri="mongodb://localhost:27017/locgiogiasi" /backup/20241201
```

### Migration Scripts:
- `scripts/remove-cart-migration.js` 
- `scripts/remove-contact-migration.js`

## Environment Configuration

### Required Environment Variables:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/locgiogiasi
DB_NAME=locgiogiasi

# JWT Authentication  
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Cloudinary (File Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@locgiogiasi.com  # Optional, defaults to EMAIL_USER

# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001  # Frontend URL
```

### Development vs Production:

#### Development:
- **Database:** Local MongoDB instance
- **File Storage:** Cloudinary (same as production)
- **Email:** Gmail SMTP with app password
- **CORS:** Specific frontend URL allowed

#### Production:
- **Database:** MongoDB Atlas hoặc dedicated MongoDB server
- **File Storage:** Cloudinary production account
- **Email:** Production email service
- **CORS:** Production frontend domain
- **Security:** Strong JWT secret, environment-specific configs

### Default Data Initialization:

#### createDefaultAdmin()
- Tự động tạo admin mặc định nếu collection admin trống
- Username: từ biến môi trường hoặc 'admin' default
- Password: từ biến môi trường hoặc 'admin123' default

#### createUploadsDirectory()
- Tạo thư mục `/uploads/` và các subdirectory cần thiết
- `/uploads/temp/` cho temporary files
- `/uploads/avatars/`, `/uploads/products/`, `/uploads/blogs/`

### Connection Pooling:
```javascript
// Mongoose default configuration đã tối ưu
useNewUrlParser: true,
useUnifiedTopology: true
// Mongoose tự động quản lý connection pool
```

## Monitoring và Performance

### Logging:
- Database connection status
- Query performance monitoring
- Error tracking

### Recommended Tools:
- **MongoDB Compass** cho GUI management
- **MongoDB Atlas** cho cloud hosting
- **Mongoose Debug** cho development

## Best Practices áp dụng

1. **Schema Design:**
   - Embedded documents cho nested data
   - References cho large collections
   - Virtual fields cho computed values

2. **Performance:**
   - Proper indexing strategy
   - Query optimization
   - Connection pooling

3. **Security:**
   - Password hashing
   - Input validation
   - Environment variables for secrets

4. **Maintenance:**
   - Auto-generated timestamps
   - Soft delete patterns (isActive fields)
   - Migration scripts

## Middleware và Validation

### Authentication Middleware (`middleware/auth.middleware.js`)

**Mục đích:** Xác thực JWT token cho các protected routes

**Sử dụng:**
```javascript
router.get('/protected-route', authMiddleware, controller.method);
```

**Flow:**
1. Kiểm tra `Authorization` header với format `Bearer <token>`
2. Verify JWT token với secret key
3. Attach admin info vào `req.user`
4. Cho phép truy cập hoặc trả về 401 Unauthorized

### Order Validation Middleware (`middleware/order.middleware.js`)

#### validateCustomerInfo
**Mục đích:** Validate thông tin khách hàng trong order

**Validation rules:**
- Các field bắt buộc: `name`, `email`, `phone`, `address`, `city`
- Email format validation
- Phone number format validation (basic)

#### validateOrderItems  
**Mục đích:** Validate và enrich thông tin items trong order

**Process:**
1. Kiểm tra items array không rỗng
2. Validate từng item có `productId` và `quantity`
3. Lookup product từ database
4. Kiểm tra product availability (`isActive: true`)
5. Attach product price vào validated items
6. Set `req.validatedItems` cho controller sử dụng

### Upload Middleware (`middleware/upload.middleware.js`)

#### uploadMultiple
**Mục đích:** Upload multiple files cho products

**Configuration:**
- Max files: 10
- Max file size: 10MB per file
- Allowed types: JPG, JPEG, PNG, WebP
- Temp storage: `/uploads/temp/`

#### uploadSingle
**Mục đích:** Upload single file cho blogs

#### handleUploadError & cleanupTempFiles
**Mục đích:** Error handling và cleanup temporary files

### Express Validator Integration

**Tất cả routes đều sử dụng express-validator để validation:**

#### Product Validation:
```javascript
body('name').notEmpty().withMessage('Tên sản phẩm là bắt buộc')
body('code').notEmpty().withMessage('Mã lọc là bắt buộc')
body('brand').isMongoId().withMessage('Brand ID không hợp lệ')
body('price').isFloat({ min: 0 }).withMessage('Giá bán phải là số dương')
body('compatibleModels').custom(validateCompatibleModels)
```

#### Blog Validation:
```javascript
body('title').notEmpty().withMessage('Blog title is required')
body('content').notEmpty().withMessage('Blog content is required')
body('excerpt').isLength({ max: 500 }).withMessage('Excerpt must be less than 500 characters')
```

#### Admin Validation:
```javascript
body('username').isLength({ min: 3, max: 50 })
body('email').isEmail()
body('password').isLength({ min: 6 })
```
