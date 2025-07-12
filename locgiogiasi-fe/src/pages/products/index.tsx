import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/Layout";
import ProductCard, { Product } from "@/components/ProductCard";

// Dummy products (will be replaced with real data later)
const allProducts: Product[] = Array.from({ length: 24 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Lọc Gió ${i % 2 === 0 ? 'Động Cơ' : 'Điều Hòa'} ${['Toyota', 'Honda', 'Ford', 'Mazda', 'Hyundai'][i % 5]} ${['Vios', 'City', 'Ranger', 'CX-5', 'Accent'][i % 5]} ${2019 + (i % 5)}`,
  slug: `loc-gio-${i % 2 === 0 ? 'dong-co' : 'dieu-hoa'}-${i}`,
  image: "/loc-gio-dieu-hoa.jpg",
  price: 300000 + (i * 50000),
  sale: i % 3 === 0,
}));

// Filter options
const filterOptions = {
  brands: ["Toyota", "Honda", "Ford", "Mazda", "Hyundai", "Kia", "Mitsubishi", "Suzuki"],
  types: ["Lọc gió động cơ", "Lọc gió điều hòa", "Lọc dầu", "Lọc nhiên liệu"],
  priceRanges: [
    { label: "Dưới 300.000đ", min: 0, max: 300000 },
    { label: "300.000đ - 500.000đ", min: 300000, max: 500000 },
    { label: "500.000đ - 800.000đ", min: 500000, max: 800000 },
    { label: "Trên 800.000đ", min: 800000, max: Infinity },
  ]
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    brand: "",
    type: "",
    priceRange: "",
    sort: "newest"
  });
  
  const productsPerPage = 12;
  
  // Apply filters and sorting
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesBrand = !filters.brand || product.name.toLowerCase().includes(filters.brand.toLowerCase());
    const matchesType = !filters.type || product.name.toLowerCase().includes(filters.type.toLowerCase());
    
    let matchesPrice = true;
    if (filters.priceRange) {
      const range = filterOptions.priceRanges.find(r => r.label === filters.priceRange);
      if (range) {
        matchesPrice = product.price >= range.min && product.price <= range.max;
      }
    }
    
    return matchesSearch && matchesBrand && matchesType && matchesPrice;
  }).sort((a, b) => {
    switch (filters.sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return parseInt(b.id) - parseInt(a.id); // newest
    }
  });
  
  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of product list
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (

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
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm sản phẩm..."
                      className="w-full border border-secondary-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
                      value={filters.search}
                      onChange={(e) => handleFilterChange("search", e.target.value)}
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-secondary-900 mb-3">Hãng xe</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="brand-all"
                        name="brand"
                        className="w-4 h-4 text-primary-600"
                        checked={filters.brand === ""}
                        onChange={() => handleFilterChange("brand", "")}
                      />
                      <label htmlFor="brand-all" className="ml-2 text-secondary-700">Tất cả</label>
                    </div>
                    {filterOptions.brands.map((brand) => (
                      <div key={brand} className="flex items-center">
                        <input
                          type="radio"
                          id={`brand-${brand}`}
                          name="brand"
                          className="w-4 h-4 text-primary-600"
                          checked={filters.brand === brand}
                          onChange={() => handleFilterChange("brand", brand)}
                        />
                        <label htmlFor={`brand-${brand}`} className="ml-2 text-secondary-700">{brand}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-secondary-900 mb-3">Loại sản phẩm</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="type-all"
                        name="type"
                        className="w-4 h-4 text-primary-600"
                        checked={filters.type === ""}
                        onChange={() => handleFilterChange("type", "")}
                      />
                      <label htmlFor="type-all" className="ml-2 text-secondary-700">Tất cả</label>
                    </div>
                    {filterOptions.types.map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          type="radio"
                          id={`type-${type}`}
                          name="type"
                          className="w-4 h-4 text-primary-600"
                          checked={filters.type === type}
                          onChange={() => handleFilterChange("type", type)}
                        />
                        <label htmlFor={`type-${type}`} className="ml-2 text-secondary-700">{type}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-secondary-900 mb-3">Giá</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="price-all"
                        name="price"
                        className="w-4 h-4 text-primary-600"
                        checked={filters.priceRange === ""}
                        onChange={() => handleFilterChange("priceRange", "")}
                      />
                      <label htmlFor="price-all" className="ml-2 text-secondary-700">Tất cả</label>
                    </div>
                    {filterOptions.priceRanges.map((range) => (
                      <div key={range.label} className="flex items-center">
                        <input
                          type="radio"
                          id={`price-${range.label}`}
                          name="price"
                          className="w-4 h-4 text-primary-600"
                          checked={filters.priceRange === range.label}
                          onChange={() => handleFilterChange("priceRange", range.label)}
                        />
                        <label htmlFor={`price-${range.label}`} className="ml-2 text-secondary-700">{range.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setFilters({
                      search: "",
                      brand: "",
                      type: "",
                      priceRange: "",
                      sort: "newest"
                    });
                    setCurrentPage(1);
                  }}
                  className="w-full bg-secondary-200 text-secondary-700 py-2 rounded-lg hover:bg-secondary-300 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>

            {/* Product Listing */}
            <div className="w-full md:w-3/4 lg:w-4/5">
              {/* Sorting and Results Count */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-secondary-200">
                <p className="text-secondary-600 mb-4 sm:mb-0">
                  Hiển thị {filteredProducts.length > 0 ? indexOfFirstProduct + 1 : 0}-
                  {Math.min(indexOfLastProduct, filteredProducts.length)} 
                  của {filteredProducts.length} sản phẩm
                </p>
                <div className="flex items-center">
                  <label htmlFor="sort" className="text-secondary-700 mr-2">Sắp xếp:</label>
                  <select
                    id="sort"
                    className="border border-secondary-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    value={filters.sort}
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

              {/* Products Grid */}
              {currentProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-card">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    Không tìm thấy sản phẩm
                  </h3>
                  <p className="text-secondary-600">
                    Vui lòng thử lại với bộ lọc khác
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {filteredProducts.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-1">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === 1
                          ? "text-secondary-400 cursor-not-allowed"
                          : "text-secondary-700 hover:bg-secondary-100"
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show only a window of pages around current page for many pages
                      if (
                        totalPages <= 7 ||
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded-lg ${
                              currentPage === page
                                ? "bg-primary-600 text-white"
                                : "text-secondary-700 hover:bg-secondary-100"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return <span key={page} className="px-1">...</span>;
                      }
                      return null;
                    })}
                    
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === totalPages
                          ? "text-secondary-400 cursor-not-allowed"
                          : "text-secondary-700 hover:bg-secondary-100"
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

  );
} 