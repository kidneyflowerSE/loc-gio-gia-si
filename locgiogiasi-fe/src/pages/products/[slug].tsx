import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/Layout";
import ProductCard, { Product } from "@/components/ProductCard";
import { ShoppingCart, Zap } from "lucide-react";

// Dummy products (will be replaced with real data later)
const products: Product[] = [
  {
    id: "1",
    name: "Lọc Gió Động Cơ",
    slug: "loc-gio-dong-co-toyota-vios-2019",
    image: "/loc-gio-dieu-hoa.jpg",
    price: 450000,
    brand: "Toyota",
    vehicle_type: "Camry, Vios",
    year: 2019,
    product_code: "17801-0L040"
  },
  {
    id: "2",
    name: "Lọc Gió Động Cơ",
    slug: "loc-gio-dong-co-honda-city-2020",
    image: "/loc-gio-dieu-hoa.jpg",
    price: 480000,
    brand: "Honda",
    vehicle_type: "Honda City",
    year: 2020,
    product_code: "17220-5R0-008"
  },
  {
    id: "3",
    name: "Lọc Gió Điều Hòa",
    slug: "loc-gio-dieu-hoa-ford-ranger-2021",
    image: "/loc-gio-dieu-hoa.jpg",
    price: 320000,
    brand: "Ford",
    vehicle_type: "Ranger",
    year: 2021,
    product_code: "AB39-19G244-AB"
  },
  {
    id: "4",
    name: "Lọc Gió Động Cơ",
    slug: "loc-gio-dong-co-mazda-3-2022",
    image: "/loc-gio-dieu-hoa.jpg",
    price: 550000,
    brand: "Mazda",
    vehicle_type: "Mazda 3",
    year: 2022,
    product_code: "PE07-13-Z40A"
  },
];

// Product details (additional info not in the card)
const productDetails = {
  description: "Lọc gió động cơ chính hãng, giúp lọc bụi bẩn và các tạp chất trong không khí trước khi vào động cơ, giúp động cơ hoạt động hiệu quả và kéo dài tuổi thọ.",
  specifications: [
    { name: "Thương hiệu", value: "OEM" },
    { name: "Xuất xứ", value: "Nhật Bản" },
    { name: "Chất liệu", value: "Giấy lọc cao cấp" },
    { name: "Kích thước", value: "278 x 168 x 34mm" },
    { name: "Mã sản phẩm", value: "17801-0P010" },
    { name: "Bảo hành", value: "12 tháng" },
  ],
  features: [
    "Lọc sạch bụi bẩn, tạp chất trong không khí",
    "Giúp động cơ hoạt động hiệu quả",
    "Tiết kiệm nhiên liệu",
    "Kéo dài tuổi thọ động cơ",
    "Dễ dàng thay thế",
  ],
  compatibleVehicles: [
    "Toyota Camry 2018-2022",
    "Toyota Vios 2019-2022",
    "Toyota Corolla Altis 2019-2022",
  ]
};

export default function ProductDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  
  // Find the product based on the slug
  const product = products.find(p => p.slug === slug);
  
  // Related products (excluding current product)
  const relatedProducts = products.filter(p => p.slug !== slug).slice(0, 4);
  
  // If product not found or page is still loading
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h1 className="text-xl font-semibold text-secondary-900 mb-2">
          {router.isFallback ? "Đang tải..." : "Không tìm thấy sản phẩm"}
        </h1>
        <p className="text-secondary-600 mb-6 text-sm">
          {router.isFallback 
            ? "Vui lòng đợi trong giây lát" 
            : "Sản phẩm bạn đang tìm không tồn tại hoặc đã bị xóa"}
        </p>
        <Link 
          href="/products" 
          className="inline-block bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Xem sản phẩm khác
        </Link>
      </div>
    );
  }

  const fullProductName = `${product.name} ${product.vehicle_type} ${product.year} (${product.product_code})`;

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-secondary-50 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-secondary-600">
            <Link href="/" className="hover:text-primary-600">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-primary-600">Sản phẩm</Link>
            <span className="mx-2">/</span>
            <span className="text-secondary-900">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Images */}
          <div className="w-full lg:w-1/2">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl overflow-hidden border border-secondary-200/60">
                <div className="relative aspect-square">
                  <Image
                    src={product.image}
                    alt={fullProductName}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[1, 2, 3, 4].map((i) => (
                  <button 
                    key={i} 
                    className="relative aspect-square bg-secondary-100 rounded-lg overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-primary-500 transition-all"
                  >
                    <Image
                      src={product.image}
                      alt={`${fullProductName} - Ảnh ${i}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="w-full lg:w-1/2">
            <div className="mb-2">
              <span className="inline-block px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium">
                {product.brand}
              </span>
            </div>

            <h1 className="text-2xl font-semibold text-secondary-900 mb-4">
              {fullProductName}
            </h1>
            
            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-secondary-900 tabular-nums">
                  {product.price.toLocaleString("vi-VN")}
                  <span className="ml-1 text-xl">₫</span>
                </span>
              </div>
            </div>
            
            {/* Short Description */}
            <div className="mb-6">
              <p className="text-base text-secondary-600 leading-relaxed">
                {productDetails.description}
              </p>
            </div>
            
            {/* Compatibility */}
            <div className="mb-6 p-4 bg-secondary-50 rounded-xl">
              <h3 className="font-medium text-secondary-900 mb-3 text-base">Tương thích với:</h3>
              <ul className="space-y-2">
                {productDetails.compatibleVehicles.map((vehicle, index) => (
                  <li key={index} className="text-base text-secondary-600 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></span>
                    {vehicle}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Add to Cart */}
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="flex items-center border border-secondary-200 rounded-lg overflow-hidden mr-3">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-secondary-50 text-secondary-600 transition-colors text-base"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-none text-base focus:outline-none focus:ring-0"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-secondary-50 text-secondary-600 transition-colors text-base"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-secondary-600">Còn hàng</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <button className="flex-1 bg-white border-2 border-primary-500 text-primary-600 py-3 px-6 rounded-xl hover:bg-primary-50 transition-colors flex items-center justify-center gap-2 text-base font-medium">
                  <ShoppingCart className="h-5 w-5" />
                  Thêm vào giỏ hàng
                </button>
                <button className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 text-base font-medium shadow-lg shadow-primary-500/20">
                  <Zap className="h-5 w-5" />
                  Mua ngay
                </button>
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="border-t border-secondary-200 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-base text-secondary-600">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                  </div>
                  <span>Miễn phí giao hàng</span>
                </div>
                <div className="flex items-center gap-2 text-base text-secondary-600">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Bảo hành chính hãng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="mt-12">
          <div className="border-b border-secondary-200">
            <div className="flex flex-wrap -mb-px">
              <button
                onClick={() => setActiveTab("description")}
                className={`inline-block py-3 px-5 text-base font-medium border-b-2 ${
                  activeTab === "description"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-secondary-600 hover:text-secondary-900 hover:border-secondary-300"
                }`}
              >
                Mô tả
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`inline-block py-3 px-5 text-base font-medium border-b-2 ${
                  activeTab === "specifications"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-secondary-600 hover:text-secondary-900 hover:border-secondary-300"
                }`}
              >
                Thông số kỹ thuật
              </button>
            </div>
          </div>
          
          <div className="py-6">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-base text-secondary-600 leading-relaxed">
                  {productDetails.description}
                </p>
                <h3 className="text-lg font-medium text-secondary-900 mt-6 mb-3">
                  Tính năng nổi bật:
                </h3>
                <ul className="space-y-2">
                  {productDetails.features.map((feature, index) => (
                    <li key={index} className="text-base text-secondary-600 flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2 mt-1.5"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === "specifications" && (
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <tbody>
                    {productDetails.specifications.map((spec, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-secondary-50" : ""}>
                        <th className="py-3 px-4 font-medium text-secondary-900 w-1/3 text-left">
                          {spec.name}
                        </th>
                        <td className="py-3 px-4 text-secondary-600">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">
              Sản phẩm liên quan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 