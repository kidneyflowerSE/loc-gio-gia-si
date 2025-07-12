import AdminLayout from "@/components/admin/AdminLayout";
import { Search, Filter, MoreVertical, Download, Plus, CheckCircle, PhoneCall } from "lucide-react";
import { useState } from "react";

type OrderStatus = "Đã liên hệ" | "Chưa liên hệ";

// Status badges component
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const statusStyles: Record<OrderStatus, string> = {
    "Đã liên hệ": "bg-green-100 text-green-800",
    "Chưa liên hệ": "bg-indigo-100 text-indigo-800",
  };

  const statusIcons: Record<OrderStatus, JSX.Element> = {
    "Đã liên hệ": <CheckCircle className="w-3.5 h-3.5" />,
    "Chưa liên hệ": <PhoneCall className="w-3.5 h-3.5" />,
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}
    >
      {statusIcons[status]}
      {status}
    </span>
  );
};

interface Order {
  id: string;
  customer: string;
  date: string;
  status: OrderStatus;
  amount: number;
  address: string;
}

// Sample data
const orders: Order[] = [
  { id: "#ORD-5412", customer: "Nguyễn Văn A", date: "20/06/2023", status: "Đã liên hệ", amount: 1250000, address: "123 Đường ABC, Quận 1, TP HCM" },
  { id: "#ORD-5411", customer: "Trần Thị B", date: "19/06/2023", status: "Chưa liên hệ", amount: 890000, address: "456 Đường XYZ, Quận 2, TP HCM" },
  { id: "#ORD-5410", customer: "Lê Văn C", date: "18/06/2023", status: "Đã liên hệ", amount: 2340000, address: "789 Đường KLM, Quận 3, TP HCM" },
  { id: "#ORD-5409", customer: "Phạm Thị D", date: "17/06/2023", status: "Chưa liên hệ", amount: 750000, address: "101 Đường NOP, Quận 4, TP HCM" },
  { id: "#ORD-5408", customer: "Vũ Văn E", date: "16/06/2023", status: "Chưa liên hệ", amount: 1560000, address: "202 Đường QRS, Quận 5, TP HCM" },
  { id: "#ORD-5407", customer: "Đặng Thị F", date: "15/06/2023", status: "Đã liên hệ", amount: 1860000, address: "303 Đường TUV, Quận 6, TP HCM" },
  { id: "#ORD-5406", customer: "Hoàng Văn G", date: "14/06/2023", status: "Đã liên hệ", amount: 950000, address: "404 Đường WXY, Quận 7, TP HCM" },
  { id: "#ORD-5405", customer: "Mai Thị H", date: "13/06/2023", status: "Chưa liên hệ", amount: 650000, address: "505 Đường Z, Quận 8, TP HCM" },
  { id: "#ORD-5404", customer: "Trịnh Văn I", date: "12/06/2023", status: "Đã liên hệ", amount: 1750000, address: "606 Đường 123, Quận 9, TP HCM" },
  { id: "#ORD-5403", customer: "Lý Thị J", date: "11/06/2023", status: "Chưa liên hệ", amount: 450000, address: "707 Đường 456, Quận 10, TP HCM" },
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Tất cả" | OrderStatus>("Tất cả");
  // Đã loại bỏ logic chọn ô tick

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "Tất cả" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
          <button className="bg-primary-600 text-white rounded-lg px-4 py-2 font-medium flex items-center gap-2 hover:bg-primary-700 transition-colors">
            <Plus size={18} />
            Tạo đơn hàng
          </button>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex-grow max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng, khách hàng, địa chỉ..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "Tất cả" | OrderStatus)}
              >
                <option value="Tất cả">Tất cả trạng thái</option>
                <option value="Đã liên hệ">Đã liên hệ</option>
                <option value="Chưa liên hệ">Chưa liên hệ</option>
              </select>
            </div>
            
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Xuất Excel</span>
            </button>
          </div>
        </div>
        
        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-gray-200 flex-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
              
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    {/* Removed checkbox cell */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-primary-600">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-800">{order.customer}</div>
                      <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">{order.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {order.amount.toLocaleString('vi-VN')}₫
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Không tìm thấy đơn hàng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              Hiển thị <span className="font-medium mx-1">{filteredOrders.length}</span> / <span className="font-medium mx-1">{orders.length}</span> đơn hàng
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50" disabled>
                Trước
              </button>
              <button className="px-3 py-1 bg-primary-50 border border-primary-500 rounded-md text-sm font-medium text-primary-600">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 