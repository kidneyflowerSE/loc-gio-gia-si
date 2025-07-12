import Link from "next/link";
import Image from "next/image";

export default function Hero() {
    return (
        <div className="relative h-[500px] md:h-[600px] overflow-hidden w-full">
          <Image
            src="/hero.jpg"
            alt="Hero"
            fill
            priority
            className="object-cover overflow-hidden"
          />
          <div className="absolute inset-0 bg-secondary-900/70"></div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center text-center">
            <div className="max-w-4xl">
              <p
                className="mb-4 text-primary-400 font-semibold tracking-wider uppercase opacity-0 animate-fade-in-up"
                style={{ animationDelay: '0.1s' }}
              >
                Đối Tác Tin Cậy Cho Lọc Gió Ô Tô
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 tracking-tight opacity-0 animate-fade-in-up"
                style={{ animationDelay: '0.2s' }}
              >
                Giải pháp lọc gió toàn diện, giá sỉ tốt nhất
              </h1>
              <p
                className="text-white/80 mb-10 text-lg md:text-xl max-w-2xl mx-auto opacity-0 animate-fade-in-up"
                style={{ animationDelay: '0.3s' }}
              >
                Chuyên cung cấp lọc gió động cơ và điều hoà chính hãng cho hàng ngàn garage và đại lý trên toàn quốc.
              </p>
              <div
                className="flex flex-wrap justify-center gap-4 opacity-0 animate-fade-in-up"
                style={{ animationDelay: '0.4s' }}
              >
                <Link
                  href="/products"
                  className="inline-block bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors shadow-lg transform hover:scale-105"
                >
                  Xem Sản Phẩm
                </Link>
                <Link
                  href="/contact"
                  className="inline-block bg-white/10 backdrop-blur text-white border border-white/20 px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors transform hover:scale-105"
                >
                  Liên Hệ Báo Giá
                </Link>
              </div>
            </div>
          </div>
        </div>      
    )
}