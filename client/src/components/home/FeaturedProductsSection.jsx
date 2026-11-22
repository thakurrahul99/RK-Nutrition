import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../shop/ProductCard';
import { useProducts } from '../../context/ProductContext';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProductsSection() {
  const navigate = useNavigate();
  const { featuredProducts } = useProducts();

  if (featuredProducts.length === 0) return null;

  return (
    <section 
      id="featured-products"
      aria-label="Featured Products Showcase"
      className="py-24 sm:py-28 bg-[#111111] border-b border-[#222222] relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C8202B]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Distinct RK Brand Details */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.25em] text-[#C8202B] font-bold mb-3">
              <span className="w-6 h-[2px] bg-[#C8202B]" />
              RK NUTRITION • FOUNDATIONAL SERIES
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-[#F5F4F2] uppercase font-black tracking-tight leading-[0.95]">
              FEATURED <span className="text-[#C8202B]">PRODUCTS.</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-sm text-[#8C8C8C] max-w-md font-body leading-relaxed">
              Engineered for athletes who demand clean formulation, verified bioavailability, and unyielding athletic standards.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C8202B] hover:text-[#F5F4F2] transition-colors font-bold whitespace-nowrap self-start sm:self-auto"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={(p) => navigate(`/product/${p.id}`)}
            />
          ))}
        </div>

        {/* Bottom Destination Link Strip */}
        <div className="mt-14 pt-8 border-t border-[#1F1F1F] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono text-[#8C8C8C] uppercase tracking-wider">
            SHOWCASING {featuredProducts.length} FOUNDATIONAL FORMULATIONS • 100% TRANSPARENT
          </span>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] hover:bg-[#222222] border border-[#2E2E2E] hover:border-[#C8202B] text-xs font-heading tracking-widest uppercase text-[#F5F4F2] transition-colors"
          >
            <span>Explore Full Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C8202B]" />
          </Link>
        </div>

      </div>
    </section>
  );
}
