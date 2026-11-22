import { Link } from 'react-router-dom';
import ProductCard from '../shop/ProductCard';
import { useProducts } from '../../context/ProductContext';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProductsSection() {
  const { featuredProducts } = useProducts();

  if (!featuredProducts || featuredProducts.length === 0) return null;

  // Max 4 products on the homepage for optimal visual pacing and mobile performance
  const displayProducts = featuredProducts.slice(0, 4);

  return (
    <section 
      id="featured-products"
      aria-label="Featured Products Showcase"
      className="py-14 sm:py-20 lg:py-24 bg-[#0B0B0B] border-t border-[#1F1F1F] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-[11px] font-heading uppercase tracking-[0.16em] text-[#8C8C8C] block mb-2">
              FOUNDATIONAL FORMULATIONS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#F5F4F2] uppercase font-bold tracking-tight">
              FEATURED <span className="text-[#E11D2E]">PRODUCTS.</span>
            </h2>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-[#F5F4F2] hover:text-[#E11D2E] transition-colors font-bold whitespace-nowrap self-start sm:self-end"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E11D2E]" />
          </Link>
        </div>

        {/* 2-Column Mobile Grid, 4-Column Desktop Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
