import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard, { Product } from "@/components/ProductCard";
import ProductSection from "@/components/ProductSection";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";

// Dummy products (will be replaced with real data later)
const products: Product[] = [
  {
    id: "1",
    name: "Lọc Gió Động Cơ Toyota Camry Vios 2019",
    slug: "loc-gio-dong-co-toyota-vios-2019",
    image: "/loc-gio-dieu-hoa.jpg",
    price: 450000,
    brand: "Toyota",
    vehicle_type: "Sedan",
    year: 2019,
    product_code: "PRD001",
  },
  {
    id: "2",
    name: "Lọc Gió Động Cơ Honda City 2020",
    slug: "loc-gio-dong-co-honda-city-2020",
    image: "/loc-gio-dieu-hoa.jpg",
    price: 480000,
    brand: "Honda",
    vehicle_type: "Sedan",
    year: 2020,
    product_code: "PRD002",
  },
  {
    id: "3",
    name: "Lọc Gió Điều Hòa Ford Ranger 2021",
    slug: "loc-gio-dieu-hoa-ford-ranger-2021",
    image: "/loc-gio-dieu-hoa.jpg",
    price: 320000,
    brand: "Ford",
    vehicle_type: "Pickup",
    year: 2021,
    product_code: "PRD003",
  },
  {
    id: "4",
    name: "Lọc Gió Động Cơ Mazda 3 2022",
    slug: "loc-gio-dong-co-mazda-3-2022",
    image: "/loc-gio-dieu-hoa.jpg",
    price: 550000,
    brand: "Mazda",
    vehicle_type: "Sedan",
    year: 2022,
    product_code: "PRD004",
  },
  {
    id: "5",
    name: "Lọc Gió Điều Hòa Hyundai Accent 2018",
    slug: "loc-gio-dieu-hoa-hyundai-accent-2018",
    image: "/loc-gio-dieu-hoa.jpg",
    price: 300000,
    brand: "Hyundai",
    vehicle_type: "Sedan",
    year: 2018,
    product_code: "PRD005",
  },
  {
    id: "6",
    name: "Lọc Gió Động Cơ Mitsubishi Xpander 2021",
    slug: "loc-gio-dong-co-mitsubishi-xpander-2021",
    image: "/loc-gio-dieu-hoa.jpg",
    price: 520000,
    brand: "Mitsubishi",
    vehicle_type: "MPV",
    year: 2021,
    product_code: "PRD006",
  },
  {
    id: "7",
    name: "Lọc Gió Điều Hòa Kia Morning 2019",
    slug: "loc-gio-dieu-hoa-kia-morning-2019",
    image: "/loc-gio-dieu-hoa.jpg",
    price: 290000,
    brand: "Kia",
    vehicle_type: "Hatchback",
    year: 2019,
    product_code: "PRD007",
  },
  {
    id: "8",
    name: "Lọc Gió Động Cơ Ford Everest 2020",
    slug: "loc-gio-dong-co-ford-everest-2020",
    image: "/loc-gio-dieu-hoa.jpg",
    price: 600000,
    brand: "Ford",
    vehicle_type: "SUV",
    year: 2020,
    product_code: "PRD008",
  },
  {
    id: "9",
    name: "Lọc Gió Điều Hòa Toyota Fortuner 2021",
    slug: "loc-gio-dieu-hoa-toyota-fortuner-2021",
    image: "/loc-gio-dieu-hoa.jpg",
    price: 350000,
    brand: "Toyota",
    vehicle_type: "SUV",
    year: 2021,
    product_code: "PRD009",
  },
  {
    id: "10",
    name: "Lọc Gió Động Cơ Nissan Navara 2017",
    slug: "loc-gio-dong-co-nissan-navara-2017",
    image: "/loc-gio-dieu-hoa.jpg",
    price: 510000,
    brand: "Nissan",
    vehicle_type: "Pickup",
    year: 2017,
    product_code: "PRD010",
  },
];

// Blog posts data
const blogPosts = [
  {
    id: 1,
    title: "Tầm quan trọng của việc thay lọc gió định kỳ",
    slug: "tam-quan-trong-cua-viec-thay-loc-gio-dinh-ky",
    excerpt: "Lọc gió là một phần quan trọng trong hệ thống động cơ ô tô. Việc thay thế định kỳ giúp động cơ hoạt động hiệu quả và kéo dài tuổi thọ xe.",
    image: "/loc-gio-dieu-hoa.jpg",
    date: "15/06/2023",
    category: "Bảo dưỡng",
    author: "Kỹ thuật viên Minh"
  },
  {
    id: 2,
    title: "Cách phân biệt lọc gió chính hãng và hàng giả",
    slug: "cach-phan-biet-loc-gio-chinh-hang-va-hang-gia",
    excerpt: "Thị trường phụ tùng ô tô có nhiều sản phẩm kém chất lượng. Bài viết này giúp bạn nhận biết lọc gió chính hãng để tránh mua phải hàng giả.",
    image: "/loc-gio-dieu-hoa.jpg",
    date: "22/07/2023",
    category: "Kiến thức",
    author: "Chuyên gia Hùng"
  },
  {
    id: 3,
    title: "5 dấu hiệu cho thấy lọc gió ô tô cần được thay thế",
    slug: "5-dau-hieu-cho-thay-loc-gio-o-to-can-duoc-thay-the",
    excerpt: "Lọc gió bẩn có thể gây ra nhiều vấn đề cho xe. Hãy tìm hiểu những dấu hiệu để biết khi nào cần thay lọc gió mới cho xe của bạn.",
    image: "/loc-gio-dieu-hoa.jpg",
    date: "05/08/2023",
    category: "Bảo dưỡng",
    author: "Kỹ sư Thành"
  },
];

const brands = ["Toyota", "Honda", "Ford", "Mazda", "Hyundai", "Kia"];

export default function HomePage() {
  return (
      <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative -mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
       <Hero />

        {/* Car Finder Form */}
        <SearchBar />
      </section>

      {/* Products by Category */}
      <ProductSection 
        title="Lọc gió Toyota" 
        products={products} 
        viewMoreLink="/products?brand=toyota"
        viewMoreText="Xem thêm"
      />
      {/* <ProductSection 
        title="Lọc gió Honda" 
        products={products} 
        viewMoreLink="/products?brand=honda"
        viewMoreText="Xem thêm"
      />
      <ProductSection 
        title="Lọc gió Ford" 
        products={products} 
        viewMoreLink="/products?brand=ford"
        viewMoreText="Xem thêm"
      />
      <ProductSection
        title="Lọc gió Mazda" 
        products={products} 
        viewMoreLink="/products?brand=mazda"
        viewMoreText="Xem thêm"
      /> */}

      {/* Blog Posts */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-primary-600 w-1 h-6 mr-3"></div>
            <h2 className="text-2xl font-bold text-secondary-900">Bài viết mới nhất</h2>
          </div>
          <Link href="/blog" className="text-primary-600 hover:text-primary-700 font-medium">
            Xem tất cả
          </Link>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3 my-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-all">
              <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/9] bg-secondary-100">
          <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </Link>
              <div className="p-6">
                <div className="flex items-center text-xs text-secondary-500 mb-2">
                  <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded mr-2">
                    {post.category}
                  </span>
                  <span>{post.date}</span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="font-bold text-lg text-secondary-900 mb-2 hover:text-primary-600 transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-secondary-600 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-secondary-200 flex items-center justify-center text-secondary-700 font-medium mr-2">
                      {post.author.charAt(0)}
                    </div>
                    <span className="text-xs text-secondary-700">{post.author}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                    Đọc tiếp
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}
