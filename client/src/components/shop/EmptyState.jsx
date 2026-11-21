import { PackageSearch, RefreshCw, ArrowLeft } from 'lucide-react';

export default function EmptyState({ 
  type = 'empty', 
  onResetFilters,
  onBackToHome 
}) {
  const getContextualContent = () => {
    switch (type) {
      case 'search':
        return {
          title: "Nothing here yet.",
          subtitle: "No products matched your search query. Try checking your spelling or clearing your keywords.",
          showReset: true,
          resetLabel: "Clear Search & Filters"
        };
      case 'category':
        return {
          title: "Nothing here yet.",
          subtitle: "No products currently available in this category. Check back soon or explore other categories.",
          showReset: true,
          resetLabel: "View All Products"
        };
      case 'filter':
        return {
          title: "Nothing here yet.",
          subtitle: "No products match the selected filter combination. Try clearing your filters to see more results.",
          showReset: true,
          resetLabel: "Reset Filters"
        };
      case 'empty':
      default:
        return {
          title: "Nothing here yet.",
          subtitle: "Our official product catalogue is currently being prepared for commercial release. Built around discipline, consistency, and athletic standards.",
          showReset: false,
          resetLabel: ""
        };
    }
  };

  const content = getContextualContent();

  return (
    <div className="py-20 px-4 text-center max-w-xl mx-auto my-8">
      {/* Graphic Container with Knurled Border */}
      <div className="relative inline-flex items-center justify-center w-20 h-20 bg-[#161616] border border-[#2E2E2E] mb-6 shadow-xl">
        <PackageSearch className="w-9 h-9 text-[#C8202B]" />
        <span className="absolute top-0 right-0 w-2 h-2 bg-[#C8202B]" />
        <span className="absolute bottom-0 left-0 w-2 h-2 bg-[#C8202B]" />
      </div>

      {/* Main Title */}
      <h2 className="font-heading text-3xl sm:text-4xl text-[#F5F4F2] uppercase font-bold tracking-tight mb-3">
        {content.title}
      </h2>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-[#8C8C8C] leading-relaxed font-body mb-8">
        {content.subtitle}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {content.showReset && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C8202B] hover:bg-[#AC1721] text-[#F5F4F2] font-heading uppercase tracking-wider text-sm transition-colors shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{content.resetLabel}</span>
          </button>
        )}

        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1A1A1A] hover:bg-[#222222] border border-[#2E2E2E] hover:border-[#C8202B] text-[#F5F4F2] font-heading uppercase tracking-wider text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
        )}
      </div>

      <div className="mt-12 pt-6 border-t border-[#1F1F1F] text-[11px] font-mono text-[#5A5A5A] uppercase tracking-widest">
        RK NUTRITION CATALOGUE ARCHITECTURE
      </div>
    </div>
  );
}
