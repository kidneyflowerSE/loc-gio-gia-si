import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Zap } from "lucide-react";
import { useState } from "react";

export interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  brand: string;
  vehicle_type: string;
  year: number;
  product_code: string;
}

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [imageLoading, setImageLoading] = useState(true);
  const fullProductName = `${product.name} ${product.vehicle_type} ${product.year} (${product.product_code})`;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-secondary-200 bg-white transition-all duration-300 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1">
      <Link 
        href={`/products/${product.slug}`} 
        className="relative aspect-[4/3] bg-secondary-50 overflow-hidden"
        aria-label={`Xem chi tiết ${fullProductName}`}
      >
        <div className={`
          absolute inset-0 bg-secondary-100 animate-pulse
          ${imageLoading ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-300
        `} />
        <Image
          src={product.image}
          alt={fullProductName}
          fill
          unoptimized
          className={`
            object-cover transition-all duration-500
            ${imageLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0'}
            group-hover:scale-105
          `}
          onLoadingComplete={() => setImageLoading(false)}
        />
      </Link>
      
      <div className="flex flex-1 flex-col p-3 md:p-4">
        <div className="mb-1.5 hidden lg:inline-flex absolute top-3 left-3">
          <span className="rounded-lg bg-primary-50 px-4 py-1 text-xs font-medium text-primary-600">
            {product.brand}
          </span>
        </div>
        
        <Link 
          href={`/products/${product.slug}`}
          className="flex-1 group/title"
          aria-label={`Xem chi tiết ${fullProductName}`}
        >
          <h3 className="mb-2 text-sm font-medium text-secondary-900 line-clamp-2 leading-snug transition-colors group-hover/title:text-primary-600">
            {fullProductName}
          </h3>
        </Link>
        
        <p className="mb-3 text-base font-bold text-secondary-900 tabular-nums">
          {product.price.toLocaleString("vi-VN")}
          <span className="ml-1 text-sm">₫</span>
        </p>
        
        <div className="mt-auto grid grid-cols-1 lg:grid-cols-2 gap-2">
          <button 
            className="group/cart inline-flex items-center justify-center gap-1.5 rounded-lg border border-primary-500 bg-white px-3 py-3 text-xs font-medium text-primary-600 transition-all hover:bg-primary-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            aria-label="Thêm vào giỏ hàng"
          >
            <ShoppingCart className="h-3.5 w-3.5 transition-transform group-hover/cart:scale-110" />
            {/* <span>Thêm vào giỏ</span> */}
          </button>
          <button 
            className="group/buy hidden lg:inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary-600 px-3 py-3 text-xs font-medium text-white shadow-md shadow-primary-500/20 transition-all hover:bg-primary-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            aria-label="Mua ngay"
          >
            {/* <Zap className="h-3.5 w-3.5 transition-transform group-hover/buy:scale-110" /> */}
            <span>Mua ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
} 