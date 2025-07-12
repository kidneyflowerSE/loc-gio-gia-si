import { useState } from "react";

interface Props {
  onSearch: (term: string) => void;
  onFilter: (filters: Record<string, string>) => void;
}

export default function FilterBar({ onSearch, onFilter }: Props) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilter(next);
  };

  return (
    <div className="grid gap-4 md:grid-cols-[2fr_repeat(4,_1fr)]">
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
      >
        <option value="">Hãng xe</option>
        <option value="toyota">Toyota</option>
        <option value="honda">Honda</option>
        <option value="ford">Ford</option>
      </select>

      <select
        className="rounded-lg border border-secondary-200 py-2.5 px-4 bg-white focus:border-primary-500 focus:ring focus:ring-primary-200 transition-colors"
        onChange={(e) => handleFilterChange("model", e.target.value)}
      >
        <option value="">Dòng xe</option>
        <option value="vios">Vios</option>
        <option value="civic">Civic</option>
      </select>

      <select
        className="rounded-lg border border-secondary-200 py-2.5 px-4 bg-white focus:border-primary-500 focus:ring focus:ring-primary-200 transition-colors"
        onChange={(e) => handleFilterChange("year", e.target.value)}
      >
        <option value="">Năm</option>
        <option value="2020">2020</option>
        <option value="2021">2021</option>
        <option value="2022">2022</option>
      </select>

      <select
        className="rounded-lg border border-secondary-200 py-2.5 px-4 bg-white focus:border-primary-500 focus:ring focus:ring-primary-200 transition-colors"
        onChange={(e) => handleFilterChange("price", e.target.value)}
      >
        <option value="">Giá</option>
        <option value="0-500k">Dưới 500k</option>
        <option value="500k-1tr">500k - 1tr</option>
        <option value="1tr-2tr">1tr - 2tr</option>
        <option value=">2tr">Trên 2tr</option>
      </select>
    </div>
  );
} 