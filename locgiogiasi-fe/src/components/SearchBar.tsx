import { Car, Cog, Calendar, Search, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/utils/api';

export default function SearchBar() {
  const selectClass = "w-full appearance-none rounded-lg border border-secondary-300 bg-white py-3 pl-10 pr-10 text-secondary-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors";
  const iconClass = "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400";
  const chevronClass = "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400";

  const router = useRouter();

  const [brands, setBrands] = useState<{ _id: string; name: string }[]>([]);
  const [models, setModels] = useState<{ _id: string; name: string; years: string[] }[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Fetch brands on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/brands', { params: { isActive: true } });
        if (res.data.success) setBrands(res.data.brands || res.data.data || res.data);
      } catch {
        // ignore error
      }
    })();
  }, []);

  // Fetch models when brand changes
  useEffect(() => {
    if (!selectedBrand) {
      setModels([]);
      setYears([]);
      setSelectedModel('');
      setSelectedYear('');
      return;
    }
    (async () => {
      try {
        const res = await api.get(`/brands/${selectedBrand}/car-models`);
        if (res.data.success) {
          const list = res.data.carModels || res.data.data || res.data;
          setModels(Array.isArray(list) ? list : []);
        }
      } catch {
        // ignore
      }
    })();
  }, [selectedBrand]);

  // Extract unique years when model changes
  useEffect(() => {
    if (!selectedModel) {
      setYears([]);
      setSelectedYear('');
      return;
    }
    const model = models.find(m => m._id === selectedModel);
    if (model) {
      setYears(model.years || []);
    }
  }, [selectedModel, models]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query: Record<string, string> = {};
    if (searchTerm.trim()) query.search = searchTerm.trim();
    if (selectedBrand) query.brand = selectedBrand;
    if (selectedModel) query.carModel = selectedModel;
    if (selectedYear) query.year = selectedYear;
    router.push({ pathname: '/products', query });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-20 relative z-10">
      <div className="rounded-xl bg-white p-6 md:p-8 shadow-2xl shadow-secondary-900/10 border border-secondary-100">
        <h2 className="text-xl font-bold text-secondary-900 mb-6 text-center md:text-left">
          Tìm kiếm lọc gió phù hợp cho xe của bạn
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">

          {/* Search keyword */}
          <div className="relative">
            <label htmlFor="keyword" className="sr-only">Từ khóa</label>
            <Search className={iconClass} />
            <input
              type="text"
              id="keyword"
              name="keyword"
              placeholder="Tên hoặc mã sản phẩm"
              className="w-full appearance-none rounded-lg border border-secondary-300 bg-white py-3 pl-10 pr-4 text-secondary-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Brand */}
          <div className="relative">
            <label htmlFor="brand" className="sr-only">Hãng xe</label>
            <Car className={iconClass} />
            <select id="brand" name="brand" className={selectClass} value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
              <option value="">Chọn hãng xe</option>
              {brands.map(brand => (
                <option key={brand._id} value={brand._id}>{brand.name}</option>
              ))}
            </select>
            <ChevronDown className={chevronClass} />
          </div>

          {/* Model */}
          <div className="relative">
            <label htmlFor="model" className="sr-only">Dòng xe</label>
            <Cog className={iconClass} />
            <select id="model" name="model" className={selectClass} value={selectedModel} onChange={e => setSelectedModel(e.target.value)} disabled={!models.length} >
              <option value="">{models.length ? 'Chọn dòng xe' : 'Chọn hãng trước'}</option>
              {models.map(model => (
                <option key={model._id} value={model._id}>{model.name}</option>
              ))}
            </select>
            <ChevronDown className={chevronClass} />
          </div>

          {/* Year */}
          <div className="relative">
            <label htmlFor="year" className="sr-only">Năm sản xuất</label>
            <Calendar className={iconClass} />
            <select id="year" name="year" className={selectClass} value={selectedYear} onChange={e => setSelectedYear(e.target.value)} disabled={!years.length} >
              <option value="">{years.length ? 'Chọn năm' : 'Chọn dòng xe trước'}</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <ChevronDown className={chevronClass} />
          </div>

          {/* Submit */}
          <button type="submit" className="flex h-full w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-3 font-semibold text-white shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-700 hover:scale-105 active:scale-100 disabled:opacity-50" disabled={!searchTerm.trim() && !selectedBrand}>
            <Search className="h-5 w-5" />
            <span>Tìm kiếm</span>
          </button>
        </form>
      </div>
    </div>
  );
}