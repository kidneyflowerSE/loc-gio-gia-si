import AdminLayout from "@/components/admin/AdminLayout";
import { CalendarIcon, Edit, FileText, MoreVertical, Plus, Search, Tag, Trash2, Filter, User, X, AlertTriangle } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import api from "@/utils/api";
import { useState } from "react";

interface BlogPost {
  _id: string;
  title: string;
  excerpt?: string;
  category: string;
  author: string;
  publishDate?: string;
  status: "published" | "draft";
  featuredImage?: string;
  readTime?: number;
  content?: string;
  tags?: string[];
}

// Helper initial states
const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  author: "",
  category: "",
  status: "draft" as "published" | "draft",
  tags: "",
  featured: false,
  featuredImage: null as File | null,
};

export default function BlogManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost|null>(null);
  const [form, setForm] = useState({...emptyForm});

  const [deleteModal, setDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost|null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();
  const CACHE_KEY = 'admin_blog_cache';
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blogs/admin/all');
      if(res.data.success){
        const blogsArray = Array.isArray(res.data.blogs)
          ? res.data.blogs
          : Array.isArray(res.data.data?.blogs)
            ? res.data.data.blogs
            : Array.isArray(res.data.data)
              ? res.data.data
              : [];
        setPosts(blogsArray);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ts: Date.now(), blogs: blogsArray}));
      }
    } catch(e:any){ setError(e.response?.data?.message || 'Lỗi tải bài viết'); }
    finally{ setLoading(false); }
  };

  useEffect(()=>{
    const cached = sessionStorage.getItem(CACHE_KEY);
    if(cached){
      try{
        const parsed = JSON.parse(cached);
        if(Date.now()-parsed.ts < CACHE_TTL && Array.isArray(parsed.blogs)){
          setPosts(parsed.blogs);
          setLoading(false);
          return;
        }
      }catch{/* ignore */}
    }
    fetchPosts();
  },[]);

  // Categories derived
  const categories = Array.from(new Set(posts.map(p=>p.category).filter(Boolean)));

  if(loading && posts.length===0){
    return (
      <AdminLayout>
        <div className="mb-6 h-8 w-56 bg-gray-100 rounded animate-pulse" />
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {Array.from({length:8}).map((_,i)=>(<div key={i} className="h-20 bg-gray-50 animate-pulse"/>))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Filter posts based on search term, category and status
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (post.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "Tất cả" || post.category === categoryFilter;
    const matchesStatus = statusFilter === "Tất cả" ||
                          (statusFilter === "Đã đăng" && post.status === "published") ||
                          (statusFilter === "Bản nháp" && post.status === "draft");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handlers
  const openCreateModal = () => {
    setEditPost(null);
    setForm({...emptyForm});
    setShowModal(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditPost(post);
    setForm({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      author: post.author || '',
      category: post.category || '',
      status: post.status,
      tags: post.tags ? post.tags.join(', ') : '',
      featured: false,
      featuredImage: null,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('content', form.content);
      fd.append('excerpt', form.excerpt);
      fd.append('author', form.author);
      fd.append('category', form.category);
      fd.append('status', form.status);
      if(form.tags) fd.append('tags', JSON.stringify(form.tags.split(',').map(t=>t.trim()).filter(Boolean)));
      if(form.featuredImage) fd.append('featuredImage', form.featuredImage);

      if(editPost){
        await api.put(`/blogs/${editPost._id}`, fd, { headers:{'Content-Type':'multipart/form-data'} });
      } else {
        await api.post('/blogs', fd, { headers:{'Content-Type':'multipart/form-data'} });
      }
      setShowModal(false);
      setEditPost(null);
      fetchPosts();
    } catch(e:any){ alert(e.response?.data?.message || 'Lỗi lưu bài viết'); }
  };

  const openDeleteModal = (post: BlogPost) => { setPostToDelete(post); setDeleteModal(true); };
  const handleDelete = async () => {
    if(!postToDelete) return;
    try{
      setDeleteLoading(true);
      await api.delete(`/blogs/${postToDelete._id}`);
      setDeleteModal(false); setPostToDelete(null);
      fetchPosts();
    }catch(e:any){ alert(e.response?.data?.message || 'Lỗi xoá bài viết'); }
    finally{ setDeleteLoading(false);}
  };

  return (
    <AdminLayout>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý bài viết</h1>
          <button className="bg-primary-600 text-white rounded-lg px-4 py-2 font-medium flex items-center gap-2 hover:bg-primary-700 transition-colors" onClick={openCreateModal}>
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
                  <tr key={post._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={()=>router.push(`/admin/blog/${post._id}`)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {post.featuredImage ? (
                          <div className="flex-shrink-0 h-12 w-12 rounded-md bg-gray-200 overflow-hidden">
                            <img src={post.featuredImage} alt={post.title} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-primary-600" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">{post.title}</div>
                          <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{post.excerpt || ''}</div>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <span className="flex items-center">
                              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {post.readTime || 0} phút đọc
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
                        {post.publishDate || 'N/A'}
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
                        <button className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" onClick={(e)=>{e.stopPropagation();openEditModal(post);}}>
                          <Edit size={16} />
                        </button>
                        <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors" onClick={(e)=>{e.stopPropagation();openDeleteModal(post);}}>
                          <Trash2 size={16} />
                        </button>
                        <button className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" onClick={(e)=>e.stopPropagation()}>
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
                Hiển thị <span className="font-medium mx-1">1-{filteredPosts.length}</span> trong <span className="font-medium mx-1">{posts.length}</span> bài viết
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

        {/* Create / Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
              <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={()=>setShowModal(false)}><X size={20} /></button>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">{editPost ? 'Sửa bài viết' : 'Thêm bài viết'}</h2>
              <div className="space-y-4 text-sm">
                <input type="text" placeholder="Tiêu đề" className="w-full border rounded-lg px-3 py-2" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
                <textarea placeholder="Tóm tắt (Excerpt <= 500 ký tự)" rows={3} className="w-full border rounded-lg px-3 py-2" value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})} />
                <textarea placeholder="Nội dung" rows={6} className="w-full border rounded-lg px-3 py-2" value={form.content} onChange={e=>setForm({...form,content:e.target.value})} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Tác giả" className="w-full border rounded-lg px-3 py-2" value={form.author} onChange={e=>setForm({...form,author:e.target.value})} />
                  <input type="text" placeholder="Danh mục" className="w-full border rounded-lg px-3 py-2" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select className="w-full border rounded-lg px-3 py-2" value={form.status} onChange={e=>setForm({...form,status:e.target.value as 'draft'|'published'})}>
                    <option value="draft">Bản nháp</option>
                    <option value="published">Đã đăng</option>
                  </select>
                  <input type="text" placeholder="Tags (phân tách bằng dấu phẩy)" className="w-full border rounded-lg px-3 py-2" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} />
                </div>
                <input type="file" accept="image/*" className="w-full" onChange={e=>setForm({...form,featuredImage:e.target.files?e.target.files[0]:null})} />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button className="px-4 py-2 rounded-lg border text-sm" onClick={()=>setShowModal(false)}>Huỷ</button>
                <button className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm" onClick={handleSave}>Lưu</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal && postToDelete && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-sm p-6 relative">
              <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={()=>setDeleteModal(false)}><X size={20} /></button>
              <div className="flex items-center gap-3 mb-4"><AlertTriangle className="w-6 h-6 text-red-600"/><h3 className="text-lg font-semibold text-gray-800">Xác nhận xoá</h3></div>
              <p className="text-sm text-gray-600 mb-6">Bạn có chắc muốn xoá bài viết <span className="font-medium text-gray-900">"{postToDelete.title}"</span> không?</p>
              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 rounded-lg border text-sm" onClick={()=>setDeleteModal(false)}>Huỷ</button>
                <button disabled={deleteLoading} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm disabled:opacity-50" onClick={handleDelete}>{deleteLoading?'Đang xoá...':'Xoá'}</button>
              </div>
            </div>
          </div>
        )}
    </AdminLayout>
  );
} 