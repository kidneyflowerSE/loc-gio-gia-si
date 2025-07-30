import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ProductCard, { Product } from "@/components/ProductCard";
import api from "@/utils/api";
import { GetServerSideProps } from "next";
import { ChevronDown, Filter, X } from "lucide-react";
import Seo from "@/components/Seo";

// Component for loading skeleton
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-card overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-secondary-200"></div>
    <div className="p-4">
      <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-secondary-200 rounded w-1/2 mb-4"></div>
      <div className="h-6 bg-secondary-200 rounded w-1/3"></div>
    </div>
  </div>
);

// Price ranges for filtering
const priceRanges = [
  { label: "Tất cả", value: "" },
  { label: "Dưới 300.000đ", value: "0-300000" },
  { label: "300.000đ - 500.000đ", value: "300000-500000" },
  { label: "500.000đ - 800.000đ", value: "500000-800000" },
  { label: "Trên 800.000đ", value: "800000-Infinity" },
];

const sortOptions = [
  { label: "Mới nhất", value: "newest" },
  { label: "Giá: Thấp đến cao", value: "price-asc" },
  { label: "Giá: Cao đến thấp", value: "price-desc" },
  { label: "Tên: A-Z", value: "name-asc" },
  { label: "Tên: Z-A", value: "name-desc" },
];

interface CarModel {
  _id: string;
  name: string;
}
interface Brand {
  _id: string;
  name: string;
  carModels: CarModel[];
}
interface ProductsPageProps {
  products: Product[];
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
  brands: Brand[];
}

// Filter Group component for styling
const FilterGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="py-5 border-b border-secondary-200">
    <h3 className="font-semibold text-secondary-900 mb-3">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const FilterSelect = ({ value, onChange, children }: { value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode }) => (
  <div className="relative">
    <select
      className="w-full border border-secondary-300 rounded-lg md:px-3 px-2 md:py-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-300 appearance-none bg-white"
      value={value}
      onChange={onChange}
    >
      {children}
    </select>
    <ChevronDown className="w-4 h-4 text-secondary-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
  </div>
);


export default function ProductsPage({ products, pagination, brands }: ProductsPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) => url !== router.asPath && setLoading(true);
    const handleComplete = (url: string) => url === router.asPath && setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);
  
  const handleFilterChange = (filterType: string, value: string | number) => {
    const query: Record<string, any> = { ...router.query };

    if (value) {
      query[filterType] = String(value);
    } else {
      delete query[filterType];
    }
    
    // Reset page to 1 when filters change
    delete query.page;

    // Reset carModel if brand is changed
    if (filterType === 'brand') {
      delete query.carModel;
    }
    
    router.push({ pathname: '/products', query });
  };
  
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > pagination.pages) return;
    const query = { ...router.query, page: String(pageNumber) };
    router.push({ pathname: '/products', query });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const currentFilters = {
    search: (router.query.search as string) || "",
    brand: (router.query.brand as string) || "",
    carModel: (router.query.carModel as string) || "",
    year: (router.query.year as string) || "",
    price: (router.query.price as string) || "",
    sort: (router.query.sort as string) || "newest",
  };

  const selectedBrand = brands.find(b => b._id === currentFilters.brand);
  
  const FilterSidebar = () => (
     <div className="bg-white rounded-lg shadow-card p-5">
        <FilterGroup title="Hãng xe">
          <FilterSelect value={currentFilters.brand} onChange={e => handleFilterChange("brand", e.target.value)}>
            <option value="">Tất cả hãng xe</option>
            {brands.map(brand => <option key={brand._id} value={brand._id}>{brand.name}</option>)}
          </FilterSelect>
        </FilterGroup>

        {currentFilters.brand && (
          <FilterGroup title="Dòng xe">
            <FilterSelect value={currentFilters.carModel} onChange={e => handleFilterChange("carModel", e.target.value)}>
              <option value="">Tất cả dòng xe</option>
              {selectedBrand?.carModels.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
            </FilterSelect>
          </FilterGroup>
        )}
        
        <FilterGroup title="Năm sản xuất">
          <FilterSelect value={currentFilters.year} onChange={e => handleFilterChange("year", e.target.value)}>
            <option value="">Tất cả các năm</option>
            {Array.from({ length: 11 }, (_, i) => 2025 - i).map(y => <option key={y} value={y}>{y}</option>)}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup title="Giá">
          {priceRanges.map((range) => (
            <div key={range.value} className="flex items-center">
              <input type="radio" id={`price-${range.value}`} name="price" className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                checked={currentFilters.price === range.value} onChange={() => handleFilterChange("price", range.value)} />
              <label htmlFor={`price-${range.value}`} className="ml-2 text-secondary-700">{range.label}</label>
            </div>
          ))}
        </FilterGroup>

        <div className="pt-5">
          <button 
            onClick={() => {
              setFilterOpen(false);
              router.push('/products');
            }}
            className="w-full text-center px-4 py-2 border border-secondary-300 rounded-lg text-sm text-secondary-700 hover:bg-secondary-100 transition-colors"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      </div>
  );


  return (
    <>
      <Seo 
        title="Sản phẩm lọc gió ô tô - AutoFilter Pro"
        description="Xem danh sách sản phẩm lọc gió ô tô chính hãng giá sỉ, được phân loại theo hãng xe và dòng xe."
        url="https://locgiogiasi.com/products"
        image="/logo.png"
      />
    <div>
      <div className="bg-white">
        {/* Page Header */}
        <div className="bg-secondary-50 py-4 lg:py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-secondary-900 mb-2 hidden lg:block">Sản phẩm lọc gió ô tô</h1>
            <div className="flex items-center text-base text-secondary-600">
              <Link href="/" className="hover:text-primary-600 underline">Trang chủ</Link>
              <span className="mx-2">/</span>
              <span className="underline">Sản phẩm</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-full lg:w-1/4 xl:w-1/5 sticky top-24 self-start">
               <FilterSidebar />
            </aside>
            
            {/* Mobile Filter Panel */}
            <div
              className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ease-in-out ${
                isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-modal="true"
              onClick={() => setFilterOpen(false)}
            >
              <div className="fixed inset-0 bg-black/40" aria-hidden="true"></div>
              <div
                className={`relative z-10 flex flex-col w-full max-w-xs h-full bg-secondary-50 shadow-xl transition-transform duration-300 ease-in-out ${
                  isFilterOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
                     <h3 className="text-lg font-semibold">Bộ lọc</h3>
                    <button
                      type="button"
                      className="-m-2 p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
                      onClick={() => setFilterOpen(false)}
                    >
                      <span className="sr-only">Đóng</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="overflow-y-auto">
                    <FilterSidebar />
                  </div>
              </div>
            </div>


            {/* Products Grid */}
            <main className="w-full lg:w-3/4 xl:w-4/5">
              {/* Toolbar */}
              <div className="bg-white rounded-lg border border-secondary-200 md:p-4 p-2 mb-6 flex md:grid md:grid-cols-[1fr_auto_auto] items-center justify-between md:justify-start gap-4">
                  {/* Col 1: Filter Button / Count */}
                  <div className="flex items-center gap-4">
                    <button className="md:hidden flex items-center gap-2 px-4 py-2 border rounded-lg" onClick={() => setFilterOpen(true)}>
                      <Filter className="w-5 h-5" />
                      <span className="md:font-medium text-sm md:text-base">Bộ lọc</span>
                    </button>
                    <p className="text-secondary-600 text-sm hidden md:block">
                      Hiển thị <span className="font-semibold text-secondary-900">{(pagination.page - 1) * pagination.limit + 1}-{(pagination.page - 1) * pagination.limit + products.length}</span> trên <span className="font-semibold text-secondary-900">{pagination.total}</span> sản phẩm
                    </p>
                  </div>

                  {/* Col 2: Sort Label (Desktop) */}
                  <span className="hidden md:block text-secondary-600 text-sm justify-self-end">Sắp xếp:</span>
                  
                  {/* Col 3: Sort Select */}
                  <div className="flex items-center gap-2">
                      <span className="md:hidden text-secondary-600 text-sm">Sắp xếp:</span>
                      <div className=" md:w-48">
                        <FilterSelect
                          value={currentFilters.sort}
                          onChange={(e) => handleFilterChange("sort", e.target.value)}
                        >
                          {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </FilterSelect>
                      </div>
                  </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {loading 
                  ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
                  : products.length > 0
                    ? products.map((product) => <ProductCard key={product.id} product={product} />)
                    : (
                      <div className="col-span-full text-center py-16 bg-white rounded-lg shadow-card">
                        <h3 className="text-xl font-semibold text-secondary-900">Không tìm thấy sản phẩm</h3>
                        <p className="text-secondary-600 mt-2">Vui lòng thử lại với bộ lọc khác.</p>
                      </div>
                    )
                }
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-1 sm:space-x-2">
                    <button 
                      onClick={() => handlePageChange(pagination.page - 1)} 
                      disabled={pagination.page === 1}
                      className="px-3 py-2 leading-tight text-secondary-500 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-100 hover:text-secondary-700 disabled:opacity-50"
                    >
                      Trước
                    </button>
                    
                    {((): React.ReactNode => {
                      const pageNumbers: (number | string)[] = [];
                      const { page, pages } = pagination;
                      
                      if (pages <= 7) {
                        for (let i = 1; i <= pages; i++) {
                          pageNumbers.push(i);
                        }
                      } else {
                        if (page <= 4) {
                          pageNumbers.push(1, 2, 3, 4, 5, 'ellipsis', pages);
                        } else if (page > pages - 4) {
                          pageNumbers.push(1, 'ellipsis', pages - 4, pages - 3, pages - 2, pages - 1, pages);
                        } else {
                          pageNumbers.push(1, 'ellipsis', page - 1, page, page + 1, 'ellipsis_end', pages);
                        }
                      }

                      return pageNumbers.map((p, index) => {
                        if (typeof p === 'string') {
                          return (
                            <span key={`${p}-${index}`} className="px-4 py-2 leading-tight border rounded-lg text-secondary-500 bg-white border-secondary-300 hidden sm:inline-block">
                              ...
                            </span>
                          );
                        }
                        return (
                          <button 
                            key={p} 
                            onClick={() => handlePageChange(p)}
                            className={`w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 leading-tight border rounded-lg hidden sm:flex items-center justify-center ${pagination.page === p ? 'bg-primary-600 text-white border-primary-600' : 'text-secondary-500 bg-white border-secondary-300 hover:bg-secondary-100 hover:text-secondary-700'}`}
                          >
                            {p}
                          </button>
                        );
                      });
                    })()}

                    <button 
                      onClick={() => handlePageChange(pagination.page + 1)} 
                      disabled={pagination.page === pagination.pages}
                      className="px-3 py-2 leading-tight text-secondary-500 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-100 hover:text-secondary-700 disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </nav>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const params: any = {
      page: query.page || 1,
      limit: 12,
      search: query.search || '',
      brand: query.brand || '',
      carModel: query.carModel || '',
      year: query.year || '',
    };

    const sort = (query.sort as string) || 'newest';
    const sortMap: { [key: string]: { sortBy: string; sortOrder: string } } = {
      newest: { sortBy: 'createdAt', sortOrder: 'desc' },
      'price-asc': { sortBy: 'price', sortOrder: 'asc' },
      'price-desc': { sortBy: 'price', sortOrder: 'desc' },
      'name-asc': { sortBy: 'name', sortOrder: 'asc' },
      'name-desc': { sortBy: 'name', sortOrder: 'desc' },
    };
    const { sortBy, sortOrder } = sortMap[sort] || sortMap.newest;
    params.sortBy = sortBy;
    params.sortOrder = sortOrder;

    if (query.price) {
      const [min, max] = (query.price as string).split('-');
      if(min) params.minPrice = min;
      if(max && max !== 'Infinity') params.maxPrice = max;
    }

    const [productRes, brandRes] = await Promise.all([
      api.get('/products', { params }),
      api.get('/brands?limit=1000') // Fetch all brands with car models
    ]);

    const products: Product[] = productRes.data.data.map((p: any) => ({
      id: p._id,
      name: p.name,
      slug: p._id,
      image: p.images?.[0]?.url || "/logo.png",
      price: p.price,
      brand: p.brand?.name || "N/A",
      vehicle_type: p.compatibleModels?.[0]?.carModelName || "",
      year: parseInt(p.compatibleModels?.[0]?.years?.[0] || new Date().getFullYear().toString()),
      product_code: p.code || "",
    }));

    const pagination = {
      ...productRes.data.pagination,
      limit: params.limit
    };
    
    const brands = brandRes.data.success ? (brandRes.data.data || brandRes.data.brands) : [];

    return {
      props: {
        products,
        pagination,
        brands
      }
    };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return {
      props: {
        products: [],
        pagination: { page: 1, pages: 1, total: 0, limit: 12 },
        brands: []
      }
    };
  }
}; 