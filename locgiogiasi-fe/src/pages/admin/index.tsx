import AdminLayout from "@/components/admin/AdminLayout";
import { 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShoppingBag,
  PhoneCall,
  CheckCircle,
  Percent
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from '@/utils/api';

// No local sample data – everything comes from API

export default function AdminDashboard() {
  // Chart labels & data derived from API timeTrends
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const CACHE_KEY = 'admin_dashboard_stats';
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Check if user is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("admin_token");
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/statistics/orders');
        if (response.data.success) {
          setStats(response.data.data);
          // cache with timestamp
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ts: Date.now(), data: response.data.data}));
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching stats');
      } finally {
        setLoading(false);
      }
    };

    if (!localStorage.getItem('admin_token')) {
      router.push('/admin/login');
      return;
    }

    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.ts < CACHE_TTL) {
          setStats(parsed.data);
          setLoading(false);
          return;
        }
      } catch { /* ignore parse error */ }
    }
    fetchStats();
  }, [router]);
  
  // Skeleton cards
  if (loading) {
    return (
      <AdminLayout>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {[1,2,3,4].map(i=> (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 h-72 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-72 bg-gray-100 rounded-xl animate-pulse" />
        </div>
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </AdminLayout>
    );
  }
  if (error) return <AdminLayout><div className="p-6 text-red-600">Error: {error}</div></AdminLayout>;
  if (!stats) return null;

  const overview = stats.overview;
  const totalOrders = overview.totalOrders;
  const totalContactedOrders = overview.contactedOrders;
  const totalNewOrders = overview.notContactedOrders;
  const contactRate = parseFloat(overview.contactRate);
  
  // Get chart data based on timeframe
  const chartData = stats.timeTrends.data.map((item: any) => item.totalOrders);
  const chartLabels = stats.timeTrends.data.map((item: any) => `${item._id.month}/${item._id.year}`);
  
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Tổng đơn hàng" 
          value={totalOrders} 
          change={0} 
          icon={ShoppingBag}
          color="bg-blue-500"
        />
        <StatCard 
          title="Đã liên hệ" 
          value={totalContactedOrders}
          change={0} 
          icon={PhoneCall}
          color="bg-green-500"
        />
        <StatCard 
          title="Chưa liên hệ" 
          value={totalNewOrders}
          change={0} 
          icon={CheckCircle}
          color="bg-indigo-500"
        />
        <StatCard 
          title="Tỉ lệ liên hệ" 
          value={`${contactRate}%`}
          change={0}
          icon={BarChart3}
          color="bg-purple-500"
        />
        {/* Bạn có thể thêm card khác nếu cần */}
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Orders Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Đơn hàng theo tháng
            </h2>
            <div className="flex items-center space-x-2 text-sm">
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-primary-500 mr-1"></span>
                <span className="text-gray-600">Tổng đơn</span>
              </span>
            </div>
          </div>
          <div className="relative h-72 w-full">
            {/* Chart display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-48 relative">
                {/* Bar Chart */}
                <div className="flex justify-between items-end h-full">
                  {chartData.map((value: number, index: number) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-16 bg-primary-500/80 hover:bg-primary-600 transition-all rounded-t-md" 
                        style={{height: `${(value / Math.max(...chartData)) * 100}%`}}
                      ></div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 mt-2">{chartLabels[index]}</span>
                        <span className="text-sm font-medium text-gray-700">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Horizontal lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3].map((_, index) => (
                    <div key={index} className="border-t border-gray-100 w-full h-0"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Thống kê đơn hàng</h2>
          </div>
          
          <div className="space-y-6">
            {/* Orders By Status */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-4">Theo trạng thái</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">Đã liên hệ</span>
                    <span className="text-sm font-medium text-gray-900">{Math.round((totalContactedOrders / totalOrders) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(totalContactedOrders / totalOrders) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">Chưa liên hệ</span>
                    <span className="text-sm font-medium text-gray-900">{Math.round((totalNewOrders / totalOrders) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full" 
                      style={{ width: `${(totalNewOrders / totalOrders) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Growth */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Tăng trưởng đơn hàng</h3>
              <div className="flex items-center">
                <div className="text-2xl font-bold text-gray-900">+24.5%</div>
                <div className="ml-2 text-sm text-green-600 flex items-center">
                  <ArrowUpRight size={16} className="mr-1" />
                  <span>so với tháng trước</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Đơn hàng gần đây</h2>
          <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">Xem tất cả</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.recentOrders.map((order: any) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">{order.orderNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full ${order.status === 'contacted' ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'}`}>
                      {order.status === 'contacted' ? 'Đã liên hệ' : 'Chưa liên hệ'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                    {order.totalAmount ? order.totalAmount.toLocaleString('vi-VN') + '₫' : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow relative overflow-hidden">
      <div className="flex justify-between mb-4">
        <div className={`${color} bg-opacity-10 p-2 rounded-lg`}>
          <Icon className={color.replace('bg-', 'text-')} size={20} />
        </div>
        <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          <span className="font-semibold">{Math.abs(change)}%</span>
          {change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString('vi-VN') : value}</p>
      
      {/* Decorative element */}
      <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-gray-50 opacity-50"></div>
    </div>
  );
} 