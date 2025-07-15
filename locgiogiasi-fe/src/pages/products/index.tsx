import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import ProductCard, { Product } from "@/components/ProductCard";
import api from "@/utils/api";
import { GetServerSideProps } from "next";

// Component for loading skeleton
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-card overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
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

interface ProductsPageProps {
  products: Product[];
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
  brands: { _id: string; name: string }[];
}

export default function ProductsPage({ products, pagination, brands }: ProductsPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    const query = { ...router.query };

    if (value) {
      query[filterType] = String(value);
    } else {
      delete query[filterType];
    }
    
    // Reset page to 1 when filters change
    delete query.page;
    
    router.push({ pathname: '/products', query });
  };
  
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > pagination.pages) return;
    const query = { ...router.query, page: String(pageNumber) };
    router.push({ pathname: '/products', query });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const currentFilters = {
    search: router.query.search || "",
    brand: router.query.brand || "",
    price: router.query.price || "",
    sort: router.query.sort || "newest",
  };

  return (
    <div>
      <div className="bg-white">
        {/* Page Header */}
        <div className="bg-secondary-100 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">Sản phẩm lọc gió ô tô</h1>
            <div className="flex items-center text-sm text-secondary-600">
              <Link href="/" className="hover:text-primary-600">Trang chủ</Link>
              <span className="mx-2">/</span>
              <span>Sản phẩm</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="w-full md:w-1/4 lg:w-1/5">
              <div className="bg-white rounded-lg shadow-card p-5 sticky top-24">
                {/* Search */}
                <div className="mb-6">
                  <h3 className="font-semibold text-secondary-900 mb-3">Tìm kiếm</h3>
                  <form onSubmit={(e) => { e.preventDefault(); handleFilterChange('search', (e.target as any).search.value); }}>
                    <div className="relative">
                      <input
                        type="text"
                        name="search"
                        placeholder="Tìm kiếm sản phẩm..."
                        defaultValue={currentFilters.search}
                        className="w-full border border-secondary-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
                      />
                      <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-secondary-900 mb-3">Hãng xe</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <div className="flex items-center">
                      <input type="radio" id="brand-all" name="brand" className="w-4 h-4 text-primary-600"
                        checked={!currentFilters.brand} onChange={() => handleFilterChange("brand", "")} />
                      <label htmlFor="brand-all" className="ml-2 text-secondary-700">Tất cả</label>
                    </div>
                    {brands.map((brand) => (
                      <div key={brand._id} className="flex items-center">
                        <input type="radio" id={`brand-${brand._id}`} name="brand" className="w-4 h-4 text-primary-600"
                          checked={currentFilters.brand === brand._id} onChange={() => handleFilterChange("brand", brand._id)} />
                        <label htmlFor={`brand-${brand._id}`} className="ml-2 text-secondary-700">{brand.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-secondary-900 mb-3">Giá</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                       <div key={range.value} className="flex items-center">
                         <input type="radio" id={`price-${range.value}`} name="price" className="w-4 h-4 text-primary-600"
                           checked={currentFilters.price === range.value} onChange={() => handleFilterChange("price", range.value)} />
                         <label htmlFor={`price-${range.value}`} className="ml-2 text-secondary-700">{range.label}</label>
                       </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => router.push('/products')}
                  className="w-full text-center px-4 py-2 border border-secondary-300 rounded-lg text-sm text-secondary-700 hover:bg-secondary-100"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="w-full md:w-3/4 lg:w-4/5">
              {/* Toolbar */}
              <div className="bg-white rounded-lg shadow-card p-4 mb-6 flex justify-between items-center">
                <p className="text-secondary-600 text-sm">
                  Hiển thị <span className="font-semibold text-secondary-900">{(pagination.page - 1) * pagination.limit + 1}-{(pagination.page - 1) * pagination.limit + products.length}</span> trên <span className="font-semibold text-secondary-900">{pagination.total}</span> sản phẩm
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-secondary-600 text-sm">Sắp xếp:</span>
                  <select 
                    className="border border-secondary-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                    value={currentFilters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="name-asc">Tên: A-Z</option>
                    <option value="name-desc">Tên: Z-A</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading 
                  ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
                  : products.map((product) => <ProductCard key={product.id} product={product} />)
                }
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}
                      className="px-3 py-2 leading-tight text-secondary-500 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-100 hover:text-secondary-700 disabled:opacity-50">
                      Trước
                    </button>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(pageNumber => (
                      <button key={pageNumber} onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 leading-tight border rounded-lg ${pagination.page === pageNumber ? 'bg-primary-600 text-white border-primary-600' : 'text-secondary-500 bg-white border-secondary-300 hover:bg-secondary-100 hover:text-secondary-700'}`}>
                        {pageNumber}
                      </button>
                    ))}
                    <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.pages}
                      className="px-3 py-2 leading-tight text-secondary-500 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-100 hover:text-secondary-700 disabled:opacity-50">
                      Sau
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
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
      sort: query.sort || 'newest'
    };

    if (query.price) {
      const [min, max] = (query.price as string).split('-');
      if(min) params.minPrice = min;
      if(max && max !== 'Infinity') params.maxPrice = max;
    }

    const [productRes, brandRes] = await Promise.all([
      api.get('/products', { params }),
      api.get('/brands') 
    ]);

    const products = productRes.data.data.map((p: any) => ({
      id: p._id,
      name: p.name,
      slug: p.slug || p._id,
      // image: p.images[0]?.url || '/loc-gio-dieu-hoa.jpg',
      image: '/loc-gio-dieu-hoa.jpg',
      price: p.price,
      sale: !!(p.salePrice && p.salePrice < p.price)
    }));

    const pagination = {
      ...productRes.data.pagination,
      limit: params.limit
    };
    
    const brands = brandRes.data.success ? (brandRes.data.brands || brandRes.data.data) : [];

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