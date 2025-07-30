import Link from "next/link";
import Image from "next/image";

// Component Slogan 1
function SloganOne() {
  return (
    <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
      <div className="mb-3">
        <svg className="w-8 h-8 mx-auto text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Lọc Sạch Từng Hơi Thở</h3>
      <p className="text-white/80 text-sm">Bảo vệ sức khỏe cả hành trình</p>
    </div>
  );
}

// Component Slogan 2
function SloganTwo() {
  return (
    <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
      <div className="mb-3">
        <svg className="w-8 h-8 mx-auto text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Đi Xe Mát, Thở Không Khí Sạch</h3>
      <p className="text-white/80 text-sm">Chọn đúng lọc điều hòa, xe bạn như mới</p>
    </div>
  );
}

// Component Slogan 3
function SloganThree() {
  return (
    <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
      <div className="mb-3">
        <svg className="w-8 h-8 mx-auto text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">10 Năm Kinh Nghiệm Chọn Lọc</h3>
      <p className="text-white/80 text-sm">Chỉ bán loại lọc điều hòa đáng đồng tiền</p>
    </div>
  );
}

export default function Hero() {
  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden w-full">
      <Image
        src="/banner.jpg"
        alt="Hero"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-secondary-900/60 via-secondary-900/70 to-secondary-900/80"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        {/* Main Content */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white   mb-6 tracking-tight opacity-0 animate-fade-in-up leading-tight"
            style={{ animationDelay: '0.1s' }}
          >
            AutoFilter Pro
          </h1>
            <p
              className="text-white/90 mb-4 text-xl md:text-2xl max-w-4xl mx-auto opacity-0 animate-fade-in-up font-light"
              style={{ animationDelay: '0.2s' }}
            >
              Chuyên cung cấp lọc gió động cơ và điều hoà chính hãng cho hàng ngàn garage và đại lý trên toàn quốc. 
            </p>
        </div>

        {/* 3 Slogan Components - Horizontal Layout */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 opacity-0 animate-fade-in-up px-4"
          style={{ animationDelay: '0.3s' }}
        >
          <SloganOne />
          <SloganTwo />
          <SloganThree />
        </div>

        {/* Call to Action Buttons */}
        <div
          className="flex flex-wrap justify-center gap-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          <Link
            href="/products"
            className="inline-flex items-center bg-primary-500 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-primary-600 transition-all duration-300 shadow-xl transform hover:scale-105 hover:shadow-2xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Xem Sản Phẩm
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center bg-white/15 backdrop-blur-sm text-white border-2 border-white/30 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white/25 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Liên Hệ Báo Giá
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/5 to-transparent"></div>
      <div className="absolute top-10 right-10 w-20 h-20 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  );
} 