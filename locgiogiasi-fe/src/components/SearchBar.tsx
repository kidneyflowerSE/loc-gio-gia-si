import { Car, Cog, Calendar, Search, ChevronDown, Filter } from 'lucide-react';

export default function SearchBar() {
  const selectClass = "w-full appearance-none rounded-lg border border-secondary-300 bg-white py-3 pl-10 pr-10 text-secondary-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors";
  const iconClass = "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400";
  const chevronClass = "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400";

  const options = {
    brands: ["Toyota", "Honda", "Ford", "Mazda"],
    models: ["Camry", "Civic", "Ranger", "CX-5"],
    years: ["2023", "2022", "2021", "2020"],
    types: [
      { value: "loc-gio", label: "Lọc gió động cơ" },
      { value: "loc-dieu-hoa", label: "Lọc gió điều hòa" },
      { value: "loc-dau", label: "Lọc dầu" },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-20 relative z-10">
      <div className="rounded-xl bg-white p-6 md:p-8 shadow-2xl shadow-secondary-900/10 border border-secondary-100">
        <h2 className="text-xl font-bold text-secondary-900 mb-6 text-center md:text-left">
          Tìm kiếm lọc gió phù hợp cho xe của bạn
        </h2>
        <form action="/products" method="get" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          
          <div className="relative">
            <label htmlFor="brand" className="sr-only">Hãng xe</label>
            <Car className={iconClass} />
            <select id="brand" name="brand" className={selectClass}>
              <option value="">Chọn hãng xe</option>
              {options.brands.map(brand => <option key={brand} value={brand.toLowerCase()}>{brand}</option>)}
            </select>
            <ChevronDown className={chevronClass} />
          </div>

          <div className="relative">
            <label htmlFor="model" className="sr-only">Dòng xe</label>
              <Cog className={iconClass} />
              <select id="model" name="model" className={selectClass}>
                  <option value="">Chọn dòng xe</option>
                  {options.models.map(model => <option key={model} value={model.toLowerCase()}>{model}</option>)}
              </select>
              <ChevronDown className={chevronClass} />
          </div>
          
          <div className="relative">
            <label htmlFor="year" className="sr-only">Năm sản xuất</label>
              <Calendar className={iconClass} />
              <select id="year" name="year" className={selectClass}>
                  <option value="">Chọn năm</option>
                  {options.years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
              <ChevronDown className={chevronClass} />
          </div>
          
          <div className="relative">
            <label htmlFor="type" className="sr-only">Loại phụ tùng</label>
              <Filter className={iconClass} />
              <select id="type" name="type" className={selectClass}>
                  <option value="">Loại phụ tùng</option>
                  {options.types.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
              <ChevronDown className={chevronClass} />
          </div>

          <button 
            type="submit" 
            className="flex h-full w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-3 font-semibold text-white shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-700 hover:scale-105 active:scale-100"
          >
            <Search className="h-5 w-5" />
            <span>Tìm kiếm</span>
          </button>
        </form>
      </div>
    </div>
  );
}