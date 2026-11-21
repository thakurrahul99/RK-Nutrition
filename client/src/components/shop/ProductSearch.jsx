import { Search, X } from 'lucide-react';

export default function ProductSearch({
  searchQuery,
  onSearchChange,
  onClearSearch
}) {
  return (
    <div className="relative flex-1 min-w-[200px] max-w-md">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-[#8C8C8C] absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products or categories..."
          aria-label="Search product catalogue"
          className="w-full bg-[#161616] border border-[#2A2A2A] focus:border-[#C8202B] text-[#F5F4F2] placeholder-[#666666] text-xs font-mono py-2.5 pl-9 pr-8 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C8202B] transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={onClearSearch}
            aria-label="Clear search input"
            className="absolute right-2 p-1 text-[#8C8C8C] hover:text-[#F5F4F2] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
