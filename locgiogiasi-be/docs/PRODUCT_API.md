# API Documentation - Products

## Tạo sản phẩm mới (POST /api/products)

### Headers
```
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>
```

### Body (form-data)
```
name: "Lọc gió Toyota Camry 2015-2020"
filterCode: "TYC-2015-CAM"
brand: "Toyota"
carModels: ["Camry", "Camry Hybrid"]
year: 2015
price: 250000
costPrice: 180000
description: "Lọc gió chính hãng cho Toyota Camry 2015-2020"
category: "Lọc gió"
stock: 50
specifications: {"material": "Giấy lọc chuyên dụng", "dimension": "245x180x35mm"}
tags: ["toyota", "camry", "loc-gio", "2015"]
images: [file1.jpg, file2.jpg] // Upload files
```

### Response
```json
{
  "success": true,
  "message": "Tạo sản phẩm thành công",
  "data": {
    "_id": "...",
    "name": "Lọc gió Toyota Camry 2015-2020",
    "filterCode": "TYC-2015-CAM",
    "brand": "Toyota",
    "carModels": ["Camry", "Camry Hybrid"],
    "year": 2015,
    "price": 250000,
    "costPrice": 180000,
    "description": "Lọc gió chính hãng cho Toyota Camry 2015-2020",
    "images": [
      {
        "public_id": "loc-gio-gia-si/products/abc123",
        "url": "https://res.cloudinary.com/...",
        "width": 800,
        "height": 600,
        "alt": "Lọc gió Toyota Camry 2015-2020"
      }
    ],
    "stock": 50,
    "category": "Lọc gió",
    "specifications": {
      "material": "Giấy lọc chuyên dụng",
      "dimension": "245x180x35mm"
    },
    "tags": ["toyota", "camry", "loc-gio", "2015"],
    "isActive": true,
    "createdAt": "2025-01-10T...",
    "updatedAt": "2025-01-10T..."
  }
}
```

## Lấy danh sách sản phẩm (GET /api/products)

### Query Parameters
- `page` (number): Trang hiện tại (default: 1)
- `limit` (number): Số sản phẩm mỗi trang (default: 10)
- `search` (string): Tìm kiếm theo tên, mô tả
- `category` (string): Lọc theo danh mục
- `brand` (string): Lọc theo hãng xe
- `minPrice` (number): Giá tối thiểu
- `maxPrice` (number): Giá tối đa
- `year` (number): Năm sản xuất
- `carModel` (string): Lọc theo dòng xe

### Example
```
GET /api/products?brand=Toyota&year=2015&page=1&limit=10
```

### Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

## Cập nhật sản phẩm (PUT /api/products/:id)

### Headers
```
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>
```

### Body (form-data)
```
name: "Lọc gió Toyota Camry 2015-2020 (Cập nhật)"
removeImages: ["public_id_1", "public_id_2"] // Xóa ảnh cũ
images: [newFile1.jpg, newFile2.jpg] // Thêm ảnh mới
```

## Xóa sản phẩm (DELETE /api/products/:id)

### Headers
```
Authorization: Bearer <jwt_token>
```

### Response
```json
{
  "success": true,
  "message": "Xóa sản phẩm thành công"
}
```

## Tìm kiếm theo mã lọc (GET /api/products/search/:filterCode)

### Example
```
GET /api/products/search/TYC-2015-CAM
```

### Response
```json
{
  "success": true,
  "data": { ... }
}
```

## Lấy sản phẩm theo hãng xe (GET /api/products/brand/:brand)

### Example
```
GET /api/products/brand/Toyota?page=1&limit=10
```

## Lấy sản phẩm theo dòng xe (GET /api/products/car-model/:carModel)

### Example
```
GET /api/products/car-model/Camry?page=1&limit=10
```

## Cập nhật trạng thái sản phẩm (PATCH /api/products/:id/status)

### Headers
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

### Body
```json
{
  "isActive": false
}
```

### Response
```json
{
  "success": true,
  "message": "Cập nhật trạng thái sản phẩm thành công",
  "data": { ... }
}
```

## Lưu ý

1. **Cloudinary**: Tất cả hình ảnh được upload lên Cloudinary và tự động tối ưu hóa
2. **Validation**: Các trường bắt buộc sẽ được validate
3. **Authentication**: Các API tạo/sửa/xóa cần JWT token
4. **File Upload**: Hỗ trợ nhiều định dạng: JPEG, PNG, GIF, WEBP (tối đa 5MB/file, 10 files)
5. **Auto Cleanup**: File tạm thời sẽ được xóa tự động sau khi upload lên Cloudinary
