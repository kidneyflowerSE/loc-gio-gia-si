import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import { Mail, MapPin, PhoneCall, ShoppingCart } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/") return router.pathname === "/";
    return router.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-secondary-800 text-white shadow-md">
      {/* Top contact bar (desktop only) */}
      <div className="hidden lg:flex items-center justify-between px-6 py-2 text-sm bg-secondary-900">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4" /> 0909&nbsp;090&nbsp;909
          </span>
          <span className="flex items-center gap-2">
            <Mail className="w-4 h-4" /> locgiogiasi@gmail.com
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4" /> 123 Đường ABC, Quận XYZ, TP.HCM
          </span>
        </div>
        <Link href="/contact" className="hover:text-primary-400 font-medium">
          Liên hệ ngay
        </Link>
      </div>

      {/* Main header */}
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Mobile: burger */}
        <button
          className="lg:hidden p-2 mr-2 rounded hover:bg-secondary-700"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5" />
          </svg>
        </button>

        {/* Logo */}
        <Link href="/" aria-label="Lọc gió ô tô" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Lọc gió ô tô" width={120} height={120} className="object-contain" />
          <span className="text-2xl font-bold">TH Auto Parts</span>
        </Link>

        {/* Search (desktop) */}
        <div className="hidden md:block flex-1 max-w-md mx-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-4 pr-10 py-2 rounded bg-white text-gray-900 border border-secondary-600 focus:outline-none focus:border-primary-400"
            />
            <button className="absolute right-0 top-0 h-full px-3 bg-primary-500 rounded-r text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className={`${isActive("/") ? "text-primary-400 border-b-2 border-primary-400" : "hover:text-primary-400"} pb-1`}
          >
            TRANG CHỦ
          </Link>
          <Link
            href="/about"
            className={`${isActive("/about") ? "text-primary-400 border-b-2 border-primary-400" : "hover:text-primary-400"} pb-1`}
          >
            VỀ CHÚNG TÔI
          </Link>
          <Link
            href="/contact"
            className={`${isActive("/contact") ? "text-primary-400 border-b-2 border-primary-400" : "hover:text-primary-400"} pb-1`}
          >
            LIÊN HỆ BÁO GIÁ
          </Link>
          <Link
            href="/blog"
            className={`${isActive("/blog") ? "text-primary-400 border-b-2 border-primary-400" : "hover:text-primary-400"} pb-1`}
          >
            BLOG
          </Link>
        </nav>

        {/* Cart icon */}
        <Link href="/cart" className="relative flex items-center hover:text-primary-300">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-3 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
        </Link>
      </div>

      {/* Removed separate desktop navigation bar */}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-secondary-900 border-t border-secondary-800">
          <div className="px-4 py-3">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-4 pr-10 py-2 rounded bg-secondary-800 border border-secondary-700 focus:outline-none focus:border-primary-500"
            />
          </div>
          <nav className="flex flex-col text-sm font-medium">
            <Link href="/" className="py-3 px-4 border-b border-secondary-800 hover:bg-secondary-800">TRANG CHỦ</Link>
            <Link href="/about" className="py-3 px-4 border-b border-secondary-800 hover:bg-secondary-800">VỀ CHÚNG TÔI</Link>
            <Link href="/contact" className="py-3 px-4 border-b border-secondary-800 hover:bg-secondary-800">LIÊN HỆ BÁO GIÁ</Link>
            <Link href="/blog" className="py-3 px-4 hover:bg-secondary-800">BLOG</Link>
            {/* Contact info */}
            <div className="py-4 px-4 border-t border-secondary-800 text-sm space-y-2 text-secondary-200">
              <span className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4" /> 0909&nbsp;090&nbsp;909
              </span>
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> locgiogiasi@gmail.com
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> 123 Đường ABC, Quận XYZ, TP.HCM
              </span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
} 