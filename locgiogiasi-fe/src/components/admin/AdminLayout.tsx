import Sidebar from "./Sidebar";
import { ReactNode } from "react";
import { useRouter } from 'next/router';
import { LogOut } from 'lucide-react';

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
} 