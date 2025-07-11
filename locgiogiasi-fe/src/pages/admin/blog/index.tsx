import AdminLayout from "@/components/admin/AdminLayout";
import { CalendarIcon, Edit, FileText, MoreVertical, Plus, Search, Tag, Trash2, Filter, User } from "lucide-react";
import { useState } from "react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  status: "published" | "draft";
  image?: string;
  readTime: number;
}

// Sample data
const blogPosts: BlogPost[] = [
  {
    id: "post-001",
    title: "Tầm quan trọng của việc thay lọc gió động cơ định kỳ",
    excerpt: "Bài viết phân tích tầm quan trọng của việc thay lọc gió động cơ định kỳ giúp động cơ hoạt động hiệu quả và bền bỉ hơn.",
    category: "Bảo dưỡng",
    author: "Nguyễn Văn A",
    date: "20/06/2023",
    status: "published",
    image: "/loc-gio-dieu-hoa.jpg",
    readTime: 5,
  },
  {
    id: "post-002",
    title: "Cách chọn lọc gió điều hòa phù hợp với xe của bạn",
    excerpt: "Hướng dẫn cách chọn lọc gió điều hòa phù hợp với từng loại xe để đảm bảo không khí trong xe luôn sạch sẽ và an toàn.",
    category: "Hướng dẫn",
    author: "Trần Thị B",
    date: "15/06/2023",
    status: "published",
    image: "/loc-gio-dieu-hoa.jpg",
    readTime: 7,
  },
  {
    id: "post-003",
    title: "Dấu hiệu nhận biết lọc gió động cơ cần thay thế",
    excerpt: "Những dấu hiệu quan trọng giúp bạn nhận biết khi nào lọc gió động cơ cần được thay thế để đảm bảo hiệu suất cho xe.",
    category: "Bảo dưỡng",
    author: "Lê Văn C",
    date: "10/06/2023",
    status: "published",
    image: "/loc-gio-dieu-hoa.jpg",
    readTime: 4,
  },
  {
    id: "post-004",
    title: "So sánh các loại lọc gió điều hòa trên thị trường",
    excerpt: "Phân tích ưu nhược điểm của các loại lọc gió điều hòa hiện có trên thị trường để giúp bạn lựa chọn sản phẩm phù hợp nhất.",
    category: "Đánh giá",
    author: "Phạm Thị D",
    date: "05/06/2023",
    status: "draft",
    image: "/loc-gio-dieu-hoa.jpg",
    readTime: 8,
  },
  {
    id: "post-005",
    title: "Lợi ích của việc sử dụng lọc gió chất lượng cao",
    excerpt: "Những lợi ích không ngờ khi đầu tư vào lọc gió chất lượng cao cho xe của bạn thay vì sử dụng sản phẩm giá rẻ.",
    category: "Tư vấn",
    author: "Nguyễn Văn A",
    date: "01/06/2023",
    status: "published",
    readTime: 6,
  },
];

// Category list derived from posts
const categories = Array.from(new Set(blogPosts.map(post => post.category)));

export default function BlogManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  
  // Filter posts based on search term, category and status
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "Tất cả" || post.category === categoryFilter;
    const matchesStatus = statusFilter === "Tất cả" || 
                          (statusFilter === "Đã đăng" && post.status === "published") || 
                          (statusFilter === "Bản nháp" && post.status === "draft");
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý bài viết</h1>
          <button className="bg-primary-600 text-white rounded-lg px-4 py-2 font-medium flex items-center gap-2 hover:bg-primary-700 transition-colors">
            <Plus size={18} />
            Thêm bài viết
          </button>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex-grow max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết theo tiêu đề, nội dung, tác giả..."
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
                <option value="Tất cả">Tất cả chủ đề</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="Tất cả">Tất cả trạng thái</option>
                <option value="Đã đăng">Đã đăng</option>
                <option value="Bản nháp">Bản nháp</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Blog Posts Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bài viết
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chủ đề
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tác giả
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đăng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {post.image ? (
                          <div className="flex-shrink-0 h-12 w-12 rounded-md bg-gray-200 overflow-hidden">
                            <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-primary-600" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">{post.title}</div>
                          <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{post.excerpt}</div>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <span className="flex items-center">
                              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {post.readTime} phút đọc
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 mr-2">
                          {post.author.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-700">{post.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                        {post.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.status === "published" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Đã đăng
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Bản nháp
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 size={16} />
                        </button>
                        <button className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredPosts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FileText className="w-16 h-16 mb-4 opacity-30" />
                        <p className="text-lg font-medium">Không tìm thấy bài viết nào</p>
                        <p className="text-sm">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredPosts.length > 0 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                Hiển thị <span className="font-medium mx-1">1-{filteredPosts.length}</span> trong <span className="font-medium mx-1">{blogPosts.length}</span> bài viết
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
      </div>
    </AdminLayout>
  );
} 