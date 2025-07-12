import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary-800 text-white">
      

      {/* Copyright */}
      <div className="border-t border-secondary-700 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-secondary-400">
            © {new Date().getFullYear()} LọcGióGiáSỉ. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <img src="https://placehold.co/40x25/png" alt="Visa" className="h-6" />
            <img src="https://placehold.co/40x25/png" alt="Mastercard" className="h-6" />
            <img src="https://placehold.co/40x25/png" alt="PayPal" className="h-6" />
            <img src="https://placehold.co/40x25/png" alt="Momo" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
} 