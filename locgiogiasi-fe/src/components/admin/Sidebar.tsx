import Link from "next/link";
import { useRouter } from "next/router";
import { BarChart2, ShoppingBag, Package, Book, LogOut, Settings, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  children?: {
    href: string;
    label: string;
  }[];
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Thống kê", icon: BarChart2 },
  { 
    href: "/admin/orders", 
    label: "Đơn hàng", 
    icon: ShoppingBag
  },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/blog", label: "Blog", icon: Book },

];

export default function Sidebar() {
  const router = useRouter();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
  // Check if the current route matches a nav item
  const isActive = (href: string) => {
    if (href === '/admin') return router.pathname === '/admin';
    return router.pathname.startsWith(href);
  };
  const isChildActive = (href: string) => router.asPath === href;
  
  const toggleExpand = (href: string) => {
    setExpandedItem(expandedItem === href ? null : href);
  };

  return (
    <aside className="h-screen sticky top-0 w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center overflow-hidden">
            <Image src="/logo.png" width={30} height={30} alt="Logo" className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-lg text-gray-800">Admin Panel</p>
            <p className="text-xs text-gray-500">Lọc Gió Giá Sỉ</p>
          </div>
        </Link>
      </div>
      
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1.5">
          {navItems.map(({ href, label, icon: Icon, children }) => {
            const active = isActive(href);
            const expanded = expandedItem === href;
            
            return (
              <li key={href}>
                {children ? (
                  <div>
                    <button
                      onClick={() => toggleExpand(href)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        active 
                          ? 'bg-primary-50 text-primary-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${active ? 'text-primary-600' : 'text-gray-500'}`} />
                        <span>{label}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expanded && (
                      <ul className="mt-1 ml-7 pl-3 border-l border-gray-200 space-y-1">
                        {children.map((child) => {
                          const childActive = isChildActive(child.href);
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={`block py-2 px-3 text-sm rounded-lg ${
                                  childActive
                                    ? 'text-primary-700 bg-primary-50 font-medium'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                              >
                                {child.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      active 
                        ? 'bg-primary-50 text-primary-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-primary-600' : 'text-gray-500'}`} />
                    <span>{label}</span>
                    {active && (
                      <div className="ml-auto w-1.5 h-5 bg-primary-600 rounded-full"></div>
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Footer */}
      <div className="mt-auto border-t border-gray-200 p-4">
        <Link href="/" className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <span>Về trang chủ</span>
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">WEBSITE</span>
        </Link>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('admin_token');
            }
            router.push('/admin/login');
          }}
          className="w-full mt-2 flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </div>
        </button>
      </div>
    </aside>
  );
} 