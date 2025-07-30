import AdminLayout from "@/components/admin/AdminLayout";
import { Edit, Image as ImgIcon, MoreVertical, Plus, Search, Star, Trash2, Filter, Upload, X, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import Image from "next/image";
interface Product {
  _id: string;
  name: string;
  code: string;
  price: number;
  stock: number;
  images: { url: string }[];
  tags?: string[]; // optional because backend currently không trả trường này
  description?: string;
  origin?: string;
  material?: string;
  dimensions?: string;
  warranty?: string;
  compatibleModels?: { carModelId: string; carModelName: string; years: string[] }[];
  brand?: { _id: string, name: string };
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 12 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const CACHE_KEY = 'admin_products_cache';
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [brandOptions, setBrandOptions] = useState<{_id:string,name:string}[]>([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    code: '',
    brandId: '',
    price: '',
    description: '',
    origin: '',
    material: '',
    dimensions: '',
    warranty: '',
    stock: '',
    images: [] as File[]
  });

  // Danh sách car models của brand hiện tại và các dòng xe được chọn
  const [brandCarModels, setBrandCarModels] = useState<{_id:string,name:string,years:string[]}[]>([]);
  const [compatibleEntries, setCompatibleEntries] = useState<{carModelId:string, years:string}[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Update image previews when form images change
  useEffect(() => {
    if (!createForm.images || createForm.images.length === 0) {
      setImagePreviews([]);
      return;
    }
    const objectUrls = createForm.images.map(file => URL.createObjectURL(file));
    setImagePreviews(objectUrls);

    // Free memory when component unmounts or images change
    return () => {
      objectUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [createForm.images]);

  // Lấy danh sách dòng xe của brand mỗi khi brandId thay đổi
  useEffect(()=>{
    const fetchCarModels = async () => {
      if(!createForm.brandId){
        setBrandCarModels([]);
        return;
      }
      try {
        const res = await api.get(`/products/brand/${createForm.brandId}/car-models`);
        if(res.data.success){
          setBrandCarModels(res.data.data.carModels || []);
        }
      } catch { /* ignore */ }
    };
    fetchCarModels();
  }, [createForm.brandId]);


  // Helper to navigate between pages
  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > pagination.pages || pageNumber === pagination.page) return;
    fetchProducts(pageNumber);
  };

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const params: any = { page, limit: pagination.limit };
      if (searchTerm) params.search = searchTerm;
      const res = await api.get('/products', { params });
      if (res.data.success) {
        setProducts(res.data.data);
        setPagination(res.data.pagination);
        // derive categories from tags
        const cats = new Set<string>();
        res.data.data.forEach((p: Product) => {
          if (p.tags && p.tags.length) p.tags.forEach((t:string)=>cats.add(t));
        });
        setCategories(Array.from(cats));
        if(!searchTerm && page===1){
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ts: Date.now(), data: res.data.data, pagination: res.data.pagination}));
        }
      }
    } catch (e:any) { setError(e.response?.data?.message||'Lỗi tải sản phẩm'); }
    finally { setLoading(false); }
  };

  useEffect(()=>{
    const cached = sessionStorage.getItem(CACHE_KEY);
    if(cached){
      try{
        const parsed = JSON.parse(cached);
        if(Date.now()-parsed.ts < CACHE_TTL){
          setProducts(parsed.data);
          setPagination(parsed.pagination);
          // derive categories
          const cats = new Set<string>();
          parsed.data.forEach((p: Product)=>{ if(p.tags) p.tags.forEach((t:string)=>cats.add(t));});
          setCategories(Array.from(cats));
          setLoading(false);
          return;
        }
      }catch{/* ignore */}
    }
    fetchProducts(1);
    /* eslint-disable-next-line */
  },[]);

  // Hybrid search:
  // 1. Immediately filter current page client-side for responsiveness.
  // 2. After a short debounce, fetch from server so that searching spans all pages/products.

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Whenever searchTerm changes, restart list from page 1 using server filtering
      fetchProducts(1);
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Client-side filter on the already-fetched products so the UI updates instantly
  const normalizedSearch = searchTerm.toLowerCase();
  const displayedProducts = products
    .filter(prod =>
      !searchTerm ||
      prod.name.toLowerCase().includes(normalizedSearch) ||
      prod.code.toLowerCase().includes(normalizedSearch)
    )
    .filter(prod => categoryFilter === 'Tất cả' || (prod.tags && prod.tags.includes(categoryFilter)));

  // Fetch brands for dropdown
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await api.get('/brands', { params: { isActive: true } });
        if (res.data.success) setBrandOptions(res.data.brands || res.data.data || res.data);
      } catch { /* ignore */ }
    };
    fetchBrands();
  }, []);

  const openCreateModal = () => {
    setEditProduct(null);
    setCreateForm({name:'',code:'',brandId:'',price:'',description:'',origin:'',material:'',dimensions:'',warranty:'',stock:'',images:[]});
    setCompatibleEntries([]);
    setShowCreateModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditProduct(product);
    setCreateForm({
      name: product.name || '',
      code: product.code || '',
      brandId: (product as any).brand?._id || '',
      price: String(product.price || ''),
      description: (product as any).description || '',
      origin: (product as any).origin || '',
      material: (product as any).material || '',
      dimensions: (product as any).dimensions || '',
      warranty: (product as any).warranty || '',
      stock: String(product.stock || ''),
      images: []
    });

    // map compatibleModels sang UI entries
    const mapped = (product.compatibleModels || []).map(cm=>({
      carModelId: (cm as any).carModelId,
      years: (cm as any).years?.join(', ') || ''
    }));
    setCompatibleEntries(mapped);
    setShowCreateModal(true);
  };

  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if(!productToDelete) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/products/${productToDelete._id}`);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts(1);
    } catch(e:any){ alert(e.response?.data?.message || 'Lỗi xoá sản phẩm'); }
    finally { setDeleteLoading(false); }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setCreateForm(prevForm => ({
        ...prevForm,
        images: [...prevForm.images, ...newFiles]
      }));
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setCreateForm(prevForm => ({
      ...prevForm,
      images: prevForm.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  if(loading && products.length===0){
    return (
      <AdminLayout title="Quản lý sản phẩm | AutoFilter Pro">
        <div className="mb-6 h-8 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({length:8}).map((_,i)=>(<div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse"/>))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Quản lý sản phẩm | AutoFilter Pro">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
          <button className="bg-primary-600 text-white rounded-lg px-4 py-2 font-medium flex items-center gap-2 hover:bg-primary-700 transition-colors" onClick={openCreateModal}>
            <Plus size={18} />
            Thêm sản phẩm
          </button>
        </div>
        
        {/* Filters and view toggle */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
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
              <Filter size={18} className="text-gray-500 sm:block hidden" />
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
            {displayedProducts.map(product => {
              const firstModel = product.compatibleModels?.[0];
              const fullProductName = `${product.name} ${firstModel?.carModelName || ''} ${firstModel?.years?.[0] || ''} (${product.code})`.replace(/\s+/g, ' ').trim();
              return (
                <div key={product._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                  <div className="relative pt-[75%] flex-shrink-0">
                    <Image 
                      src={product.images[0]?.url || "/logo.png"} 
                      alt={product.name}
                      width={1000}
                      height={1000}
                      className="absolute inset-0 w-full h-full object-cover"
                      unoptimized
                    />
                    <div className="absolute top-2 right-2">
                      
                    </div>
                    {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                    <div className="flex items-center">
                      <Star className="text-yellow-400 w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm font-medium">{product.stock}</span>
                    </div>
                  </div> */}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2 flex-1">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">{fullProductName}</h3>
                    {/* <span className="text-xs font-medium text-gray-500 ml-2">{product.code}</span> */}
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-md text-black font-medium">{product.price.toLocaleString('vi-VN')}₫</span>
                    <span className="text-sm bg-red-500 font-medium p-2 rounded-md text-white">Kho: {product.stock}</span>
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">{product.brand?.name || 'Không rõ'}</span>
                    <div className="flex space-x-1">
                      <button className="p-1 rounded-md text-blue-600 hover:bg-blue-50" onClick={()=>openEditModal(product)}>
                        <Edit size={16} />
                      </button>
                      <button className="p-1 rounded-md text-red-600 hover:bg-red-50" onClick={()=>openDeleteModal(product)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
            
            {displayedProducts.length === 0 && (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-500">
                <ImgIcon className="w-16 h-16 mb-4 opacity-30" />
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
                 
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:block hidden">Hãng xe</th>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kho</th>
                  <th className="px-2 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider md:block hidden">Giá</th>
                  <th className="px-2 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedProducts.map(product => {
                  const firstModel = product.compatibleModels?.[0];
                  const fullProductName = `${product.name} ${firstModel?.carModelName || ''} ${firstModel?.years?.[0] || ''}`.replace(/\s+/g, ' ').trim();
                  return (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      
                      <td className="px-2 md:px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <Image className="h-10 w-10 rounded-md object-cover" src={product.images[0]?.url || "/logo.png"} alt="" width={1000} height={1000} unoptimized />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-2">{fullProductName}</div>
                            {/* <div className="text-xs text-gray-500">{product.code}</div> */}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 md:block hidden">{product.brand?.name || 'Không rõ'}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${product.stock > 20 ? 'text-green-600' : product.stock > 10 ? 'text-amber-600' : 'text-red-600'}`}>
                          {product.stock}
                        </span>
                      </td>
                      
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-right font-medium md:block hidden">{product.price.toLocaleString('vi-VN')}₫</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex space-x-1 justify-end">
                          <button className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50" onClick={()=>openEditModal(product)}>
                            <Edit size={16} />
                          </button>
                          <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50" onClick={()=>openDeleteModal(product)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                
                {displayedProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <ImgIcon className="w-16 h-16 mb-4 opacity-30" />
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
        {pagination.pages > 1 && displayedProducts.length > 0 && (
          <div className="flex items-center justify-between flex-wrap gap-4 mt-6 py-3 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              <p>
                Trang <span className="font-medium">{pagination.page}</span> / <span className="font-medium">{pagination.pages}</span> (Tổng: <span className="font-medium">{pagination.total}</span> sản phẩm)
              </p>
            </div>
            
            <nav>
              <ul className="inline-flex items-center -space-x-px text-sm">
                <li>
                  <button
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                  >
                    Trước
                  </button>
                </li>
                
                {((): React.ReactNode => {
                    const pageNumbers = [];
                    const { page, pages } = pagination;
                    const maxPagesToShow = 5;
                    const ellipsis = <li key="ellipsis..."><span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300">...</span></li>;

                    if (pages <= maxPagesToShow + 2) {
                      for (let i = 1; i <= pages; i++) {
                        pageNumbers.push(i);
                      }
                    } else {
                      if (page <= maxPagesToShow - 1) {
                        pageNumbers.push(1, 2, 3, 4, 5, 'ellipsis', pages);
                      } else if (page >= pages - (maxPagesToShow - 2)) {
                        pageNumbers.push(1, 'ellipsis', pages - 4, pages - 3, pages - 2, pages - 1, pages);
                      } else {
                        pageNumbers.push(1, 'ellipsis', page - 1, page, page + 1, 'ellipsis_end', pages);
                      }
                    }

                    return pageNumbers.map((p, index) => {
                      if (p === 'ellipsis' || p === 'ellipsis_end') return ellipsis;
                      const pageNum = p as number;
                      return (
                        <li key={index}>
                          <button
                            onClick={() => goToPage(pageNum)}
                            className={`flex items-center justify-center px-3 h-8 leading-tight border ${
                              pageNum === page
                                ? 'text-primary-600 bg-primary-50 border-primary-500'
                                : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    });
                })()}
                
                <li>
                  <button
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2">
          <div className="bg-white rounded-xl w-full max-w-2xl p-4 md:p-6 relative overflow-y-auto max-h-[90vh]">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={() => setShowCreateModal(false)}>
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{editProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
            <div className="space-y-4 text-sm">
              <input type="text" placeholder="Tên sản phẩm" className="w-full border rounded-lg px-3 py-2" value={createForm.name} onChange={e=>setCreateForm({...createForm,name:e.target.value})} />
              <input type="text" placeholder="Mã sản phẩm" className="w-full border rounded-lg px-3 py-2" value={createForm.code} onChange={e=>setCreateForm({...createForm,code:e.target.value})} />
              <select className="w-full border rounded-lg px-3 py-2" value={createForm.brandId} onChange={e=>setCreateForm({...createForm,brandId:e.target.value})}>
                <option value="">Chọn hãng xe</option>
                {brandOptions.map(b=> <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="number" placeholder="Giá" className="w-full border rounded-lg px-3 py-2" value={createForm.price} onChange={e=>setCreateForm({...createForm,price:e.target.value})} />
                <input type="number" placeholder="Số lượng kho" className="w-full border rounded-lg px-3 py-2" value={createForm.stock} onChange={e=>setCreateForm({...createForm,stock:e.target.value})} />
              </div>
              <textarea placeholder="Mô tả" className="w-full border rounded-lg px-3 py-2" rows={3} value={createForm.description} onChange={e=>setCreateForm({...createForm,description:e.target.value})} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" placeholder="Xuất xứ" className="w-full border rounded-lg px-3 py-2" value={createForm.origin} onChange={e=>setCreateForm({...createForm,origin:e.target.value})} />
                <input type="text" placeholder="Chất liệu" className="w-full border rounded-lg px-3 py-2" value={createForm.material} onChange={e=>setCreateForm({...createForm,material:e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" placeholder="Kích thước" className="w-full border rounded-lg px-3 py-2" value={createForm.dimensions} onChange={e=>setCreateForm({...createForm,dimensions:e.target.value})} />
                <input type="text" placeholder="Bảo hành" className="w-full border rounded-lg px-3 py-2" value={createForm.warranty} onChange={e=>setCreateForm({...createForm,warranty:e.target.value})} />
              </div>
              {/* Compatible models builder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dòng xe tương thích</label>
                {compatibleEntries.map((entry, idx)=> (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <select className="flex-1 border rounded-lg px-3 py-2" value={entry.carModelId} onChange={e=>{
                      const val=e.target.value;
                      setCompatibleEntries(arr=> arr.map((en,i)=> i===idx? {...en,carModelId:val}:en));
                    }}>
                      <option value="">Chọn dòng xe</option>
                      {brandCarModels.map(cm=> <option key={cm._id} value={cm._id}>{cm.name}</option>)}
                    </select>
                    <input type="text" placeholder="Năm (vd: 2018,2019)" className="w-40 border rounded-lg px-3 py-2" value={entry.years} onChange={e=>{
                      const val=e.target.value;
                      setCompatibleEntries(arr=> arr.map((en,i)=> i===idx? {...en,years:val}:en));
                    }} />
                    <button type="button" className="p-2 text-red-600 hover:bg-red-50 rounded-lg" onClick={()=> setCompatibleEntries(arr=> arr.filter((_,i)=> i!==idx))}><Trash2 size={14}/></button>
                  </div>
                ))}
                <button type="button" className="mt-1 text-sm text-primary-600 hover:underline" onClick={()=> setCompatibleEntries(arr=> [...arr,{carModelId:'',years:''}])}>+ Thêm dòng xe</button>
              </div>
              {/* specifications field removed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh sản phẩm</label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <ImgIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500">
                        <span>Tải ảnh lên</span>
                        <input id="file-upload" name="file-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleImageChange} />
                      </label>
                      <p className="pl-1">hoặc kéo và thả</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF</p>
                  </div>
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {imagePreviews.map((previewUrl, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-100">
                        <img src={previewUrl} alt={`Preview ${index + 1}`} className="h-full w-full object-cover object-center" />
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="Remove image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={()=>setShowCreateModal(false)} className="px-4 py-2 rounded-lg border text-sm">Huỷ</button>
              <button disabled={createLoading} onClick={async ()=>{
                try {
                  setCreateLoading(true);
                  const fd = new FormData();
                  fd.append('name', createForm.name);
                  fd.append('code', createForm.code);
                  if(createForm.brandId) fd.append('brand', createForm.brandId);
                  if(createForm.price) fd.append('price', createForm.price);
                  if(createForm.description) fd.append('description', createForm.description);
                  if(createForm.origin) fd.append('origin', createForm.origin);
                  if(createForm.material) fd.append('material', createForm.material);
                  if(createForm.dimensions) fd.append('dimensions', createForm.dimensions);
                  if(createForm.warranty) fd.append('warranty', createForm.warranty);
                  if(createForm.stock) fd.append('stock', createForm.stock);
                  if(createForm.images.length) createForm.images.forEach(file=> fd.append('images', file));

                  // Build compatibleModels JSON từ UI entries
                  if(compatibleEntries.length){
                    const cmPayload = compatibleEntries.filter(en=>en.carModelId && en.years.trim()!=='' ).map(en=>{
                      const found = brandCarModels.find(c=>c._id===en.carModelId);
                      return {
                        carModelId: en.carModelId,
                        carModelName: found?.name || '',
                        years: en.years.split(',').map(y=>y.trim()).filter(Boolean)
                      };
                    });
                    if(cmPayload.length) fd.append('compatibleModels', JSON.stringify(cmPayload));
                  }

                  if(editProduct){
                    await api.put(`/products/${editProduct._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                  } else {
                    await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                  }
                  setShowCreateModal(false);
                  setEditProduct(null);
                  setCreateForm({name:'',code:'',brandId:'',price:'',description:'',origin:'',material:'',dimensions:'',warranty:'',stock:'',images:[]});
                  setCompatibleEntries([]);
                  fetchProducts(1);
                } catch(e:any){ alert(e.response?.data?.message || 'Lỗi lưu sản phẩm'); }
                finally { setCreateLoading(false); }
              }} className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm disabled:opacity-50">
                {createLoading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 relative">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={()=>setDeleteModalOpen(false)}>
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-800">Xác nhận xoá</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">Bạn có chắc muốn xoá sản phẩm <span className="font-medium text-gray-900">"{productToDelete.name}"</span> không? Thao tác này không thể hoàn tác.</p>
            <div className="flex justify-end gap-3">
              <button onClick={()=>setDeleteModalOpen(false)} className="px-4 py-2 rounded-lg border text-sm">Huỷ</button>
              <button disabled={deleteLoading} onClick={handleDeleteConfirmed} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm disabled:opacity-50">
                {deleteLoading ? 'Đang xoá...' : 'Xoá'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 