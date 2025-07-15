import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-600 text-white">
      

      {/* Copyright */}
      <div className="py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-white">
            © {new Date().getFullYear()} Lọc Gió Giá Sỉ. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
} 