import AdminLayout from "@/components/admin/AdminLayout";
import { Edit, Image, MoreVertical, Plus, Search, Star, Trash2, Filter, Upload } from "lucide-react";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: number;
  rating: number;
  image: string;
}

// Sample data
const products: Product[] = [
  { 
    id: "PRD-001", 
    name: "Lọc gió động cơ Toyota Camry", 
    category: "Lọc gió động cơ", 
    price: 350000, 
    inStock: 45, 
    rating: 4.8,
    image: "/loc-gio-dieu-hoa.jpg"
  },
  { 
    id: "PRD-002", 
    name: "Lọc gió điều hòa Honda Civic", 
    category: "Lọc gió điều hòa", 
    price: 250000, 
    inStock: 32, 
    rating: 4.5,
    image: "/loc-gio-dieu-hoa.jpg"
  },
  { 
    id: "PRD-003", 
    name: "Lọc gió động cơ Mazda 3", 
    category: "Lọc gió động cơ", 
    price: 320000, 
    inStock: 18, 
    rating: 4.7,
    image: "/loc-gio-dieu-hoa.jpg"
  },
  { 
    id: "PRD-004", 
    name: "Lọc gió điều hòa Hyundai Accent", 
    category: "Lọc gió điều hòa", 
    price: 230000, 
    inStock: 26, 
    rating: 4.6,
    image: "/loc-gio-dieu-hoa.jpg"
  },
  { 
    id: "PRD-005", 
    name: "Lọc gió động cơ Ford Ranger", 
    category: "Lọc gió động cơ", 
    price: 380000, 
    inStock: 21, 
    rating: 4.9,
    image: "/loc-gio-dieu-hoa.jpg"
  },
  { 
    id: "PRD-006", 
    name: "Lọc gió điều hòa Kia Morning", 
    category: "Lọc gió điều hòa", 
    price: 210000, 
    inStock: 35, 
    rating: 4.4,
    image: "/loc-gio-dieu-hoa.jpg"
  },
  { 
    id: "PRD-007", 
    name: "Lọc gió động cơ Mitsubishi Xpander", 
    category: "Lọc gió động cơ", 
    price: 340000, 
    inStock: 29, 
    rating: 4.7,
    image: "/loc-gio-dieu-hoa.jpg"
  },
  { 
    id: "PRD-008", 
    name: "Lọc gió điều hòa Toyota Vios", 
    category: "Lọc gió điều hòa", 
    price: 240000, 
    inStock: 42, 
    rating: 4.6,
    image: "/loc-gio-dieu-hoa.jpg"
  },
];

// Category list derived from products
const categories = Array.from(new Set(products.map(product => product.category)));

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "Tất cả" || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
          <button className="bg-primary-600 text-white rounded-lg px-4 py-2 font-medium flex items-center gap-2 hover:bg-primary-700 transition-colors">
            <Plus size={18} />
            Thêm sản phẩm
          </button>
        </div>
        
        {/* Filters and view toggle */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex-grow max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên, mã..."
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
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="Tất cả">Tất cả danh mục</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2 border rounded-lg overflow-hidden">
              <button 
                className={`px-3 py-1.5 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-700' : 'bg-white text-gray-700'}`}
                onClick={() => setViewMode('grid')}
              >
                <div className="flex items-center justify-center w-5 h-5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </div>
              </button>
              <button 
                className={`px-3 py-1.5 ${viewMode === 'list' ? 'bg-primary-50 text-primary-700' : 'bg-white text-gray-700'}`}
                onClick={() => setViewMode('list')}
              >
                <div className="flex items-center justify-center w-5 h-5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </div>
              </button>
            </div>
            
          </div>
        </div>
        
        {/* Products Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative pt-[75%]">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                    <div className="flex items-center">
                      <Star className="text-yellow-400 w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm font-medium">{product.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">{product.name}</h3>
                    <span className="text-xs font-medium text-gray-500 ml-2">{product.id}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-primary-700 font-medium">{product.price.toLocaleString('vi-VN')}₫</span>
                    <span className="text-xs text-gray-500">Kho: {product.inStock}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">{product.category}</span>
                    <div className="flex space-x-1">
                      <button className="p-1 rounded-md text-blue-600 hover:bg-blue-50">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 rounded-md text-red-600 hover:bg-red-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-500">
                <Image className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-medium">Không tìm thấy sản phẩm nào</p>
                <p className="text-sm">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="pl-6 py-3 text-left">
                    
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hãng xe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kho</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="pl-6 py-4 whitespace-nowrap">
                      
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 rounded-md object-cover" src={product.image} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${product.inStock > 20 ? 'text-green-600' : product.inStock > 10 ? 'text-amber-600' : 'text-red-600'}`}>
                        {product.inStock}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">{product.price.toLocaleString('vi-VN')}₫</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex space-x-1 justify-end">
                        <button className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50">
                          <Edit size={16} />
                        </button>
                        <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Image className="w-16 h-16 mb-4 opacity-30" />
                        <p className="text-lg font-medium">Không tìm thấy sản phẩm nào</p>
                        <p className="text-sm">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center text-sm text-gray-500">
              Hiển thị <span className="font-medium mx-1">{filteredProducts.length}</span> / <span className="font-medium mx-1">{products.length}</span> sản phẩm
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50" disabled>
                Trước
              </button>
              <button className="px-3 py-1 bg-primary-50 border border-primary-500 rounded-md text-sm font-medium text-primary-600">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 