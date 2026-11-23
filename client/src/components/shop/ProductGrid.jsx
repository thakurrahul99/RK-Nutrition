import ProductCard from './ProductCard';
import EmptyState from './EmptyState';

export default function ProductGrid({ 
  products = [], 
  onSelectProduct,
  emptyStateType = 'empty',
  onResetFilters,
  onBackToHome
}) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        type={emptyStateType}
        onResetFilters={onResetFilters}
        onBackToHome={onBackToHome}
      />
    );
  }

  return (
    <div 
      aria-label="Products Collection"
      className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelectProduct={onSelectProduct}
        />
      ))}
    </div>
  );
}
