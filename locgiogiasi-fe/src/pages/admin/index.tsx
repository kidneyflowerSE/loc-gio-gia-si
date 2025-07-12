import AdminLayout from "@/components/admin/AdminLayout";
import { 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Package, 
  Users, 
  DollarSign,
  ShoppingBag,
  PhoneCall,
  Mail,
  Calendar,
  CheckCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Sample data
const recentOrders = [
  { id: "#ORD-5412", customer: "Nguyễn Văn A", date: "20/06/2023", status: "Đã liên hệ", amount: 1250000, phone: "0901234567" },
  { id: "#ORD-5411", customer: "Trần Thị B", date: "19/06/2023", status: "Chưa liên hệ", amount: 890000, phone: "0907654321" },
  { id: "#ORD-5410", customer: "Lê Văn C", date: "18/06/2023", status: "Đã liên hệ", amount: 2340000, phone: "0903456789" },
  { id: "#ORD-5409", customer: "Phạm Thị D", date: "17/06/2023", status: "Chưa liên hệ", amount: 750000, phone: "0909876543" },
  { id: "#ORD-5408", customer: "Hoàng Văn E", date: "16/06/2023", status: "Đã liên hệ", amount: 1350000, phone: "0904567890" },
];

// Weekly data - last 4 weeks
const weeklyOrdersData = [42, 38, 55, 47];

// Monthly data - last 6 months
const monthlyOrdersData = [125, 98, 156, 142, 168, 150];

export default function AdminDashboard() {
  const [timeframe, setTimeframe] = useState<"week" | "month">("week");
  const router = useRouter();
  
  // Check if user is authenticated
  useEffect(() => {
    // This would typically check for a token or session
    const isAuthenticated = localStorage.getItem("admin_token");
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [router]);
  
  // Calculate statistics
  const totalOrders = 387;
  const totalContactedOrders = 215; // Đã liên hệ
  const totalNewOrders = totalOrders - totalContactedOrders; // Chưa liên hệ
  
  // Get chart data based on timeframe
  const chartData = timeframe === "week" ? weeklyOrdersData : monthlyOrdersData;
  const chartLabels = timeframe === "week" 
    ? ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"] 
    : ["T1", "T2", "T3", "T4", "T5", "T6"];
  
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h1>
        
        <div className="flex space-x-2">
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as "week" | "month")}
            className="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="week">Theo tuần</option>
            <option value="month">Theo tháng</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Tổng đơn hàng" 
          value={totalOrders} 
          change={8.5} 
          icon={ShoppingBag}
          color="bg-blue-500"
        />
        <StatCard 
          title="Đã liên hệ" 
          value={totalContactedOrders}
          change={12.4} 
          icon={PhoneCall}
          color="bg-green-500"
        />
        <StatCard 
          title="Chưa liên hệ" 
          value={totalNewOrders}
          change={-4.1} 
          icon={CheckCircle}
          color="bg-indigo-500"
        />
        {/* Bạn có thể thêm card khác nếu cần */}
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Orders Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              {timeframe === "week" ? "Đơn hàng theo tuần" : "Đơn hàng theo tháng"}
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
                  {chartData.map((value, index) => (
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
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                      order.status === 'Đã liên hệ' ? 'bg-green-100 text-green-800' : 
                      'bg-indigo-100 text-indigo-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                    {order.amount.toLocaleString('vi-VN')}₫
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