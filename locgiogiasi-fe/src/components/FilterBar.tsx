import { useState, useEffect } from "react";
import api from "@/utils/api";

interface Props {
  onSearch: (term: string) => void;
  onFilter: (filters: Record<string, string>) => void;
}

export default function FilterBar({ onSearch, onFilter }: Props) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const [brands, setBrands] = useState<{ _id: string; name: string }[]>([]);
  const [allCarModels, setAllCarModels] = useState<{ _id: string; name: string; brandId: string }[]>([]);
  const displayedCarModels = filters.brand
    ? allCarModels.filter((m) => m.brandId === filters.brand)
    : allCarModels;

  // Fetch brands on mount
  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await api.get("/brands", { params: { isActive: true, limit: 1000 } });
        if (res.data.success) {
          const list = res.data.data || res.data.brands || [];
          setBrands(list);
          // aggregate all car models
          const models: { _id: string; name: string; brandId: string }[] = [];
          list.forEach((b: any) => {
            (b.carModels || []).forEach((m: any) => {
              models.push({ _id: m._id, name: m.name, brandId: b._id });
            });
          });
          setAllCarModels(models);
        }
      } catch (error) {
        console.error("Failed to fetch brands", error);
      }
    }
    fetchBrands();
  }, []);

  // no individual car model fetch needed

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const next = { ...filters, [key]: value };
    // Reset dependent filters
    if (key === "brand") {
      next["model"] = "";
    }
    setFilters(next);
    onFilter(next);
  };

  return (
    <div className="grid gap-4 md:grid-cols-[2fr_repeat(6,_1fr)]">
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-secondary-200 focus:border-primary-500 focus:ring focus:ring-primary-200 transition-colors"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>

      <select
        className="rounded-lg border border-secondary-200 py-2.5 px-4 bg-white focus:border-primary-500 focus:ring focus:ring-primary-200 transition-colors"
        onChange={(e) => handleFilterChange("brand", e.target.value)}
        value={filters.brand || ""}
      >
        <option value="">Hãng xe</option>
        {brands.map((b) => (
          <option key={b._id} value={b._id}>{b.name}</option>
        ))}
      </select>

      <select
        className="rounded-lg border border-secondary-200 py-2.5 px-4 bg-white focus:border-primary-500 focus:ring focus:ring-primary-200 transition-colors"
        onChange={(e) => handleFilterChange("carModel", e.target.value)}
        value={filters.carModel || ""}
        // show all models but optionally filter list; still enabled
      >
        <option value="">Dòng xe</option>
        {displayedCarModels.map((m) => (
          <option key={m._id} value={m._id}>{m.name}</option>
        ))}
      </select>

      {/* Sort By */}
      <select
        className="rounded-lg border border-secondary-200 py-2.5 px-4 bg-white focus:border-primary-500 focus:ring focus:ring-primary-200 transition-colors"
        onChange={(e) => handleFilterChange("sortBy", e.target.value)}
        value={filters.sortBy || ""}
      >
        <option value="">Sắp xếp</option>
        <option value="price">Giá</option>
        <option value="name">Tên</option>
        <option value="createdAt">Mới nhất</option>
      </select>

      {/* Sort Order */}
      <select
        className="rounded-lg border border-secondary-200 py-2.5 px-4 bg-white focus:border-primary-500 focus:ring focus:ring-primary-200 transition-colors"
        onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
        value={filters.sortOrder || ""}
      >
        <option value="desc">Giảm dần</option>
        <option value="asc">Tăng dần</option>
      </select>

      <select
        className="rounded-lg border border-secondary-200 py-2.5 px-4 bg-white focus:border-primary-500 focus:ring focus:ring-primary-200 transition-colors"
        onChange={(e) => handleFilterChange("year", e.target.value)}
        value={filters.year || ""}
      >
        <option value="">Năm</option>
        {Array.from({ length: 11 }, (_, i) => 2015 + i).map((y) => (
          <option key={y} value={y.toString()}>{y}</option>
        ))}
      </select>

      <select
        className="rounded-lg border border-secondary-200 py-2.5 px-4 bg-white focus:border-primary-500 focus:ring focus:ring-primary-200 transition-colors"
        onChange={(e) => handleFilterChange("price", e.target.value)}
        value={filters.price || ""}
      >
        <option value="">Giá</option>
        <option value="0-300000">Dưới 300k</option>
        <option value="300000-500000">300k - 500k</option>
        <option value="500000-800000">500k - 800k</option>
        <option value="800000-Infinity">Trên 800k</option>
      </select>
    </div>
  );
} 