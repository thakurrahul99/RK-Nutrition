export default function CategoryNavigation({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts = {}
}) {
  return (
    <nav 
      aria-label="Shop Categories"
      className="border-b border-[#222222] bg-[#141414] sticky top-[69px] z-30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto py-3 no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id];

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative whitespace-nowrap px-4 py-2 text-xs sm:text-sm font-heading tracking-wider uppercase transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C8202B] ${
                  isSelected
                    ? 'text-[#F5F4F2] bg-[#1E1E1E] border border-[#C8202B]'
                    : 'text-[#8C8C8C] hover:text-[#F5F4F2] hover:bg-[#1A1A1A] border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{cat.label}</span>
                  {typeof count === 'number' && (
                    <span 
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-none ${
                        isSelected 
                          ? 'bg-[#C8202B] text-[#F5F4F2]' 
                          : 'bg-[#222222] text-[#8C8C8C] group-hover:text-[#F5F4F2]'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </span>
                {isSelected && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8202B]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
