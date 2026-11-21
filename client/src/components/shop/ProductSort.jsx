import { ChevronDown } from 'lucide-react';

export default function ProductSort({
  selectedSort,
  onSelectSort,
  hasPrices = false
}) {
  const sortOptions = [
    { id: 'featured', label: 'Featured' },
    { id: 'alpha-asc', label: 'Alphabetical: A - Z' },
    { id: 'alpha-desc', label: 'Alphabetical: Z - A' },
    ...(hasPrices
      ? [
          { id: 'price-asc', label: 'Price: Low to High' },
          { id: 'price-desc', label: 'Price: High to Low' }
        ]
      : [])
  ];

  return (
    <div className="relative inline-flex items-center">
      <label htmlFor="shop-sort" className="sr-only">
        Sort Products
      </label>
      <div className="relative w-full">
        <select
          id="shop-sort"
          value={selectedSort}
          onChange={(e) => onSelectSort(e.target.value)}
          className="appearance-none bg-[#161616] border border-[#2A2A2A] hover:border-[#C8202B] text-[#F5F4F2] text-xs font-mono uppercase tracking-wider py-2.5 pl-3.5 pr-8 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C8202B] transition-colors cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.id} value={opt.id} className="bg-[#161616] text-[#F5F4F2]">
              Sort: {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-[#8C8C8C] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
