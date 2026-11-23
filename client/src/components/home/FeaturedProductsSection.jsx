import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../shop/ProductCard';
import { useProducts } from '../../context/ProductContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProductsSection() {
  const navigate = useNavigate();
  const { featuredProducts } = useProducts();
  const containerRef = useScrollReveal();

  if (!featuredProducts || featuredProducts.length === 0) return null;

  // Max 4 products on the homepage for optimal visual pacing and mobile performance
  const displayProducts = featuredProducts.slice(0, 4);

  return (
    <section 
      id="featured-products"
      ref={containerRef}
      aria-label="Featured Products Showcase"
      className="py-16 sm:py-20 lg:py-24 bg-[#0B0B0B] border-t border-[#1A1A1A] relative overflow-hidden"
    >
      {/* Background Ambient Radial Flare */}
      <div 
        className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_top,rgba(225,29,46,0.12)_0%,transparent_70%)] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="reveal-init flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2E]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#9CA3AF] font-bold">
                FOUNDATIONAL FORMULATIONS
              </span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#F5F4F2] uppercase font-bold tracking-tight">
              FEATURED <span className="text-[#E11D2E]">PRODUCTS.</span>
            </h2>
          </div>

          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-[#F5F4F2] hover:text-[#E11D2E] transition-colors font-bold whitespace-nowrap self-start sm:self-end py-1"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E11D2E] transition-transform duration-200 group-hover:translate-x-1.5" />
          </Link>
        </div>

        {/* 2-Column Mobile Grid, 4-Column Desktop Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {displayProducts.map((product, idx) => (
            <div key={product.id || product._id || idx} className={`reveal-init stagger-${idx + 1}`}>
              <ProductCard 
                product={product} 
                onSelectProduct={(p) => navigate(`/product/${p.slug || p.id || p._id}`)}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
