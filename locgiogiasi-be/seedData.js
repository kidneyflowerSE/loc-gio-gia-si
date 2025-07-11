const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Brand = require('./models/brand.model');
const Product = require('./models/product.model');
const Blog = require('./models/blog.model');
const Settings = require('./models/settings.model');
const Order = require('./models/order.model');

// Sample Brands Data
const sampleBrands = [
    {
        name: 'Toyota',
        carModels: [
            {
                name: 'Camry',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Corolla',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Vios',
                years: ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Fortuner',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Innova',
                years: ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
            }
        ]
    },
    {
        name: 'Honda',
        carModels: [
            {
                name: 'Accord',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Civic',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'City',
                years: ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'CR-V',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'HR-V',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            }
        ]
    },
    {
        name: 'Hyundai',
        carModels: [
            {
                name: 'Elantra',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Accent',
                years: ['2018', '2019', '2020', '2021', '2022', '2023']
            },
            {
                name: 'Tucson',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Santa Fe',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Kona',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            }
        ]
    },
    {
        name: 'Mazda',
        carModels: [
            {
                name: 'Mazda3',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Mazda6',
                years: ['2018', '2019', '2020', '2021', '2022']
            },
            {
                name: 'CX-5',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'CX-8',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'CX-30',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ]
    },
    {
        name: 'Kia',
        carModels: [
            {
                name: 'Cerato',
                years: ['2019', '2020', '2021', '2022', '2023']
            },
            {
                name: 'Soluto',
                years: ['2019', '2020', '2021', '2022', '2023']
            },
            {
                name: 'Seltos',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Sorento',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Carnival',
                years: ['2021', '2022', '2023', '2024']
            }
        ]
    },
    {
        name: 'Ford',
        carModels: [
            {
                name: 'Focus',
                years: ['2018', '2019', '2020', '2021', '2022']
            },
            {
                name: 'EcoSport',
                years: ['2018', '2019', '2020', '2021', '2022']
            },
            {
                name: 'Explorer',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Everest',
                years: ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Ranger',
                years: ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
            }
        ]
    }
];

// Sample Products Data
const sampleProductsData = [
    {
        name: 'LocGioGiaSi động cơ Toyota Camry',
        code: 'TOY-CAM-001',
        brandName: 'Toyota',
        compatibleModels: [
            {
                carModelName: 'Camry',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                carModelName: 'Vios',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 350000,
        description: 'LocGioGiaSi động cơ chính hãng Toyota dành cho dòng xe Camry. Đảm bảo không khí sạch cho động cơ, tăng hiệu suất hoạt động.',
        images: [
            {
                public_id: 'toyota-camry-air-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/toyota-camry-air-filter.jpg',
                width: 800,
                height: 600,
                alt: 'LocGioGiaSi động cơ Toyota Camry'
            }
        ],
        stock: 25,
        specifications: {
            dimensions: '245 x 185 x 45 mm',
            material: 'Giấy lọc cao cấp',
            efficiency: '99.5%'
        },
        tags: ['Toyota', 'Camry', 'locgiogiasi', 'động cơ']
    },
    {
        name: 'Lọc dầu Honda Civic',
        code: 'HON-CIV-002',
        brandName: 'Honda',
        compatibleModels: [
            {
                carModelName: 'Civic',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                carModelName: 'City',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 280000,
        description: 'Lọc dầu chính hãng Honda cho dòng xe Civic. Lọc sạch tạp chất trong dầu động cơ, bảo vệ động cơ tối ưu.',
        images: [
            {
                public_id: 'honda-civic-oil-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/honda-civic-oil-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc dầu Honda Civic'
            }
        ],
        stock: 30,
        specifications: {
            thread: 'M12 x 1.25',
            gasket: 'Cao su NBR',
            capacity: '3.5L'
        },
        tags: ['Honda', 'Civic', 'lọc dầu', 'động cơ']
    },
    {
        name: 'Lọc nhiên liệu Hyundai Elantra',
        code: 'HYU-ELA-003',
        brandName: 'Hyundai',
        compatibleModels: [
            {
                carModelName: 'Elantra',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                carModelName: 'Accent',
                years: ['2020', '2021', '2022', '2023']
            }
        ],
        price: 450000,
        description: 'Lọc nhiên liệu chính hãng Hyundai cho dòng xe Elantra và Accent. Lọc sạch tạp chất trong nhiên liệu, bảo vệ hệ thống phun xăng.',
        images: [
            {
                public_id: 'hyundai-elantra-fuel-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/hyundai-elantra-fuel-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc nhiên liệu Hyundai Elantra'
            }
        ],
        stock: 18,
        specifications: {
            micron: '5 micron',
            flow_rate: '100 L/h',
            pressure: '4 bar'
        },
        tags: ['Hyundai', 'Elantra', 'Accent', 'lọc nhiên liệu']
    },
    {
        name: 'LocGioGiaSi cabin Ford Focus',
        code: 'FOR-FOC-004',
        brandName: 'Ford',
        compatibleModels: [
            {
                carModelName: 'Focus',
                years: ['2018', '2019', '2020', '2021', '2022']
            },
            {
                carModelName: 'EcoSport',
                years: ['2018', '2019', '2020', '2021', '2022']
            }
        ],
        price: 380000,
        description: 'LocGioGiaSi cabin chính hãng Ford cho Focus và EcoSport. Lọc bụi, vi khuẩn và mùi hôi, đảm bảo không khí sạch trong xe.',
        images: [
            {
                public_id: 'ford-focus-cabin-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/ford-focus-cabin-filter.jpg',
                width: 800,
                height: 600,
                alt: 'LocGioGiaSi cabin Ford Focus'
            }
        ],
        stock: 22,
        specifications: {
            type: 'Activated Carbon',
            dimensions: '200 x 180 x 30 mm',
            filtration: '98.5%'
        },
        tags: ['Ford', 'Focus', 'EcoSport', 'locgiogiasi cabin']
    },
    {
        name: 'LocGioGiaSi động cơ Mazda CX-5',
        code: 'MAZ-CX5-005',
        brandName: 'Mazda',
        compatibleModels: [
            {
                carModelName: 'CX-5',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                carModelName: 'Mazda3',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 320000,
        description: 'LocGioGiaSi động cơ chính hãng Mazda cho dòng xe CX-5. Giữ cho động cơ hoạt động hiệu quả và tiết kiệm nhiên liệu.',
        images: [
            {
                public_id: 'mazda-cx5-air-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/mazda-cx5-air-filter.jpg',
                width: 800,
                height: 600,
                alt: 'LocGioGiaSi động cơ Mazda CX-5'
            }
        ],
        stock: 28,
        specifications: {
            dimensions: '230 x 180 x 40 mm',
            material: 'Giấy lọc chuyên dụng',
            efficiency: '99.2%'
        },
        tags: ['Mazda', 'CX-5', 'locgiogiasi', 'động cơ']
    }
];

// Sample Blog Data
const sampleBlogs = [
    {
        title: 'Cách bảo dưỡng locgiogiasi động cơ ô tô',
        slug: 'cach-bao-duong-locgiogiasi-dong-co-o-to',
        content: 'LocGioGiaSi động cơ đóng vai trò quan trọng trong việc bảo vệ động cơ xe ô tô. Bài viết này sẽ hướng dẫn bạn cách bảo dưỡng locgiogiasi động cơ đúng cách để đảm bảo xe luôn hoạt động hiệu quả.',
        featuredImage: 'https://res.cloudinary.com/demo/image/upload/v1234567890/blog-air-filter-maintenance.jpg',
        author: 'Admin',
        category: 'Bảo dưỡng',
        tags: ['bảo dưỡng', 'locgiogiasi', 'động cơ'],
        status: 'published',
        featured: true
    },
    {
        title: 'Tầm quan trọng của lọc dầu trong hệ thống bôi trơn',
        slug: 'tam-quan-trong-cua-loc-dau-trong-he-thong-boi-tron',
        content: 'Lọc dầu là một bộ phận không thể thiếu trong hệ thống bôi trơn của động cơ. Hãy cùng tìm hiểu về vai trò quan trọng của lọc dầu và cách chọn lọc dầu phù hợp cho xe của bạn.',
        featuredImage: 'https://res.cloudinary.com/demo/image/upload/v1234567890/blog-oil-filter-importance.jpg',
        author: 'Admin',
        category: 'Kiến thức',
        tags: ['lọc dầu', 'bôi trơn', 'động cơ'],
        status: 'published',
        featured: false
    }
];

// Default Settings Data
const defaultSettings = {
    storeName: 'LocGioGiaSi',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    phone: '0123456789',
    email: 'info@locgiogiasi.com',
    logo: ''
};

// Clear all data function
async function clearAllData() {
    try {
        console.log('🗑️  Clearing all existing data...');
        
        // Delete all collections in order (to handle foreign key constraints)
        await Order.deleteMany({});
        console.log('✓ Cleared orders');
        
        await Product.deleteMany({});
        console.log('✓ Cleared products');
        
        await Brand.deleteMany({});
        console.log('✓ Cleared brands');
        
        await Blog.deleteMany({});
        console.log('✓ Cleared blogs');
        
        await Settings.deleteMany({});
        console.log('✓ Cleared settings');
        
        console.log('🎯 All existing data cleared successfully!');
    } catch (error) {
        console.error('❌ Error clearing data:', error);
        throw error;
    }
}

// Seed Functions
async function seedBrands() {
    try {
        console.log('Seeding brands...');
        // Note: Data clearing is now handled by clearAllData() function
        const createdBrands = await Brand.insertMany(sampleBrands);
        console.log(`✓ Created ${createdBrands.length} brands`);
        return createdBrands;
    } catch (error) {
        console.error('Error seeding brands:', error);
        throw error;
    }
}

async function seedProducts() {
    try {
        console.log('Seeding products...');
        // Note: Data clearing is now handled by clearAllData() function
        
        let createdCount = 0;
        for (const productData of sampleProductsData) {
            // Find brand
            const brand = await Brand.findOne({ name: productData.brandName });
            if (!brand) {
                console.log(`Brand not found: ${productData.brandName}`);
                continue;
            }
            
            // Create compatible models with carModelId
            const compatibleModels = [];
            for (const compatibleModel of productData.compatibleModels) {
                const carModel = brand.carModels.find(model => 
                    model.name === compatibleModel.carModelName
                );
                
                if (carModel) {
                    compatibleModels.push({
                        carModelId: carModel._id,
                        carModelName: carModel.name,
                        years: compatibleModel.years
                    });
                }
            }
            
            // Create product
            const product = new Product({
                name: productData.name,
                code: productData.code,
                brand: brand._id,
                compatibleModels: compatibleModels,
                price: productData.price,
                description: productData.description,
                images: productData.images,
                stock: productData.stock,
                specifications: productData.specifications,
                tags: productData.tags,
                isActive: true
            });
            
            await product.save();
            createdCount++;
        }
        
        console.log(`✓ Created ${createdCount} products`);
    } catch (error) {
        console.error('Error seeding products:', error);
        throw error;
    }
}

async function seedBlogs() {
    try {
        console.log('Seeding blogs...');
        // Note: Data clearing is now handled by clearAllData() function
        const createdBlogs = await Blog.insertMany(sampleBlogs);
        console.log(`✓ Created ${createdBlogs.length} blogs`);
    } catch (error) {
        console.error('Error seeding blogs:', error);
        throw error;
    }
}

async function seedSettings() {
    try {
        console.log('Seeding settings...');
        // Note: Data clearing is now handled by clearAllData() function
        const settings = new Settings(defaultSettings);
        await settings.save();
        console.log('✓ Created default settings');
    } catch (error) {
        console.error('Error seeding settings:', error);
        throw error;
    }
}

// Main seed function
async function seedAll() {
    try {
        console.log('🌱 Starting database seeding...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/locgiogiasi');
        console.log('✓ Connected to MongoDB');
        
        // Clear existing data
        await clearAllData();
        
        // Seed in order (brands first, then products)
        await seedBrands();
        await seedProducts();
        await seedBlogs();
        await seedSettings();
        
        console.log('🎉 Database seeding completed successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('✓ Database connection closed');
    }
}

// Individual seed functions for specific data types
async function seedBrandsOnly() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/locgiogiasi');
        await seedBrands();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

async function seedProductsOnly() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/locgiogiasi');
        await seedProducts();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

// Run seeding if this file is executed directly
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--brands')) {
        seedBrandsOnly();
    } else if (args.includes('--products')) {
        seedProductsOnly();
    } else {
        seedAll();
    }
}

module.exports = {
    seedAll,
    clearAllData,
    seedBrands,
    seedProducts,
    seedBlogs,
    seedSettings,
    sampleBrands,
    sampleProductsData
};
