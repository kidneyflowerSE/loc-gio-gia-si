# Validation Rules - Chi tiết quy tắc validate

## Product Model Validation

### Trường bắt buộc (Required)
```javascript
// Tên sản phẩm
name: {
  required: true,
  minLength: 3,
  maxLength: 200,
  trim: true
}

// Mã lọc
filterCode: {
  required: true,
  unique: true,
  pattern: /^[A-Z0-9-]{3,20}$/,
  upperCase: true
}

// Hãng xe
brand: {
  required: true,
  minLength: 2,
  maxLength: 50,
  allowedValues: ['Toyota', 'Honda', 'Hyundai', 'Ford', 'Mazda', 'Suzuki', 'Mitsubishi', 'Nissan', 'Kia', 'Volkswagen']
}

// Dòng xe
carModels: {
  required: true,
  minItems: 1,
  maxItems: 20,
  itemType: 'string'
}

// Năm sản xuất
year: {
  required: true,
  min: 1900,
  max: currentYear + 5,
  integer: true
}

// Giá bán
price: {
  required: true,
  min: 1000,
  max: 50000000,
  decimal: true
}

// Giá vốn
costPrice: {
  required: true,
  min: 0,
  max: 50000000,
  decimal: true,
  lessThan: 'price'
}

// Mô tả
description: {
  required: true,
  minLength: 10,
  maxLength: 5000
}

// Số lượng tồn
stock: {
  required: true,
  min: 0,
  max: 10000,
  integer: true
}
```

### Trường không bắt buộc (Optional)
```javascript
// Hình ảnh
images: {
  maxItems: 10,
  fileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxFileSize: '5MB'
}

// Danh mục
category: {
  default: 'Lọc gió',
  maxLength: 50
}

// Thông số kỹ thuật
specifications: {
  maxKeys: 20,
  keyMaxLength: 50,
  valueMaxLength: 200
}

// Tags
tags: {
  maxItems: 10,
  itemMaxLength: 30
}
```

## Cart Model Validation

```javascript
// Session ID
sessionId: {
  required: true,
  minLength: 10,
  maxLength: 100
}

// Fingerprint
fingerprint: {
  required: true,
  minLength: 10,
  maxLength: 500
}

// Items
items: {
  maxItems: 50,
  itemValidation: {
    product: { required: true, type: 'ObjectId' },
    quantity: { required: true, min: 1, max: 1000 },
    price: { required: true, min: 0 }
  }
}
```

## Order Model Validation

```javascript
// Mã đơn hàng
orderNumber: {
  required: true,
  unique: true,
  pattern: /^ORD\d{8}\d{3}$/
}

// Thông tin khách hàng
customer: {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  email: {
    required: true,
    format: 'email',
    maxLength: 100
  },
  phone: {
    required: true,
    pattern: /^[0-9]{10,11}$/
  },
  address: {
    required: true,
    minLength: 10,
    maxLength: 500
  }
}

// Trạng thái
status: {
  required: true,
  enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled']
}

// Phương thức thanh toán
paymentMethod: {
  required: true,
  enum: ['cash', 'bank_transfer', 'installment']
}
```

## Blog Model Validation

```javascript
// Tiêu đề
title: {
  required: true,
  minLength: 5,
  maxLength: 200
}

// Slug
slug: {
  required: true,
  unique: true,
  pattern: /^[a-z0-9-]+$/,
  minLength: 5,
  maxLength: 200
}

// Nội dung
content: {
  required: true,
  minLength: 100,
  maxLength: 50000
}

// Trạng thái
status: {
  required: true,
  enum: ['draft', 'published', 'archived']
}

// Excerpt
excerpt: {
  maxLength: 500
}
```

## Admin Model Validation

```javascript
// Username
username: {
  required: true,
  unique: true,
  minLength: 3,
  maxLength: 50,
  pattern: /^[a-zA-Z0-9_]+$/
}

// Email
email: {
  required: true,
  unique: true,
  format: 'email',
  maxLength: 100
}

// Password
password: {
  required: true,
  minLength: 6,
  maxLength: 100,
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
}

// Role
role: {
  required: true,
  enum: ['admin', 'manager', 'editor']
}

// Permissions
permissions: {
  required: true,
  items: {
    enum: ['products', 'orders', 'blogs', 'users', 'settings', 'statistics']
  }
}
```

## Contact Model Validation

```javascript
// Tên
name: {
  required: true,
  minLength: 2,
  maxLength: 100
}

// Email
email: {
  required: true,
  format: 'email',
  maxLength: 100
}

// Số điện thoại
phone: {
  pattern: /^[0-9]{10,11}$/,
  maxLength: 15
}

// Chủ đề
subject: {
  required: true,
  minLength: 5,
  maxLength: 200
}

// Tin nhắn
message: {
  required: true,
  minLength: 10,
  maxLength: 5000
}

// Trạng thái
status: {
  required: true,
  enum: ['new', 'read', 'replied', 'closed']
}
```

## Validation Messages (Tiếng Việt)

```javascript
const validationMessages = {
  required: 'Trường này là bắt buộc',
  minLength: 'Tối thiểu {min} ký tự',
  maxLength: 'Tối đa {max} ký tự',
  min: 'Giá trị tối thiểu là {min}',
  max: 'Giá trị tối đa là {max}',
  email: 'Email không hợp lệ',
  unique: 'Giá trị này đã tồn tại',
  enum: 'Giá trị phải là một trong: {values}',
  pattern: 'Định dạng không hợp lệ',
  integer: 'Phải là số nguyên',
  decimal: 'Phải là số thập phân',
  fileType: 'Định dạng file không được hỗ trợ',
  fileSize: 'Kích thước file quá lớn (tối đa {max})',
  
  // Custom messages
  phone: 'Số điện thoại phải có 10-11 chữ số',
  filterCode: 'Mã lọc chỉ chứa chữ cái viết hoa, số và dấu gạch ngang',
  password: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
  costPriceLessThanPrice: 'Giá vốn phải nhỏ hơn giá bán'
};
```

## Custom Validation Functions

```javascript
// Kiểm tra mã lọc hợp lệ
const validateFilterCode = (value) => {
  const pattern = /^[A-Z0-9-]{3,20}$/;
  return pattern.test(value);
};

// Kiểm tra năm hợp lệ
const validateYear = (value) => {
  const currentYear = new Date().getFullYear();
  return value >= 1900 && value <= currentYear + 5;
};

// Kiểm tra giá vốn < giá bán
const validateCostPrice = (costPrice, price) => {
  return costPrice < price;
};

// Kiểm tra số điện thoại Việt Nam
const validatePhoneVN = (phone) => {
  const patterns = [
    /^0[3|5|7|8|9]\d{8}$/,  // Mobile
    /^0[2]\d{9}$/           // Landline
  ];
  return patterns.some(pattern => pattern.test(phone));
};

// Kiểm tra định dạng email
const validateEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};
```

## Validation Middleware Example

```javascript
const { body, validationResult } = require('express-validator');

// Product validation middleware
const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Tên sản phẩm phải từ 3-200 ký tự'),
  
  body('filterCode')
    .trim()
    .toUpperCase()
    .matches(/^[A-Z0-9-]{3,20}$/)
    .withMessage('Mã lọc chỉ chứa chữ cái viết hoa, số và dấu gạch ngang (3-20 ký tự)'),
  
  body('brand')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Hãng xe phải từ 2-50 ký tự'),
  
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
    .withMessage('Năm sản xuất không hợp lệ'),
  
  body('price')
    .isFloat({ min: 1000, max: 50000000 })
    .withMessage('Giá bán phải từ 1,000 - 50,000,000 VNĐ'),
  
  body('costPrice')
    .isFloat({ min: 0, max: 50000000 })
    .withMessage('Giá vốn phải từ 0 - 50,000,000 VNĐ')
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error('Giá vốn phải nhỏ hơn giá bán');
      }
      return true;
    }),
  
  body('stock')
    .isInt({ min: 0, max: 10000 })
    .withMessage('Số lượng tồn phải từ 0-10,000')
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errors.array()
    });
  }
  next();
};
```

Tài liệu này cung cấp chi tiết về tất cả các quy tắc validation cho từng model, giúp đảm bảo tính toàn vẹn dữ liệu và trải nghiệm người dùng tốt hơn.
