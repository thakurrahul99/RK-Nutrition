import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#111111] text-[#F5F4F2] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
      {/* Background Lighting & Grid */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C8202B]/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,#F5F4F2_1px,transparent_1px),linear-gradient(to_bottom,#F5F4F2_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10 space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#161616] border border-[#2E2E2E] text-xs font-mono uppercase tracking-widest text-[#C8202B] font-semibold">
          <span className="w-1.5 h-1.5 bg-[#C8202B] animate-pulse" />
          <span>ERROR 404 • ROUTE NOT LOCATED</span>
        </div>

        {/* Large 404 Headline */}
        <div className="space-y-2">
          <h1 className="font-heading font-black text-7xl sm:text-8xl md:text-9xl tracking-tight text-[#F5F4F2] uppercase leading-none">
            404<span className="text-[#C8202B]">.</span>
          </h1>
          <h2 className="font-heading text-2xl sm:text-3xl text-[#F5F4F2] uppercase font-bold tracking-wider">
            PAGE NOT FOUND
          </h2>
          <p className="text-sm sm:text-base text-[#8C8C8C] max-w-lg mx-auto font-body leading-relaxed">
            The page or supplement formulation you are looking for does not exist, has been removed, or has moved to a new destination.
          </p>
        </div>

        {/* Instant Search Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto relative">
          <div className="flex items-center bg-[#161616] border border-[#2A2A2A] focus-within:border-[#C8202B] transition-colors p-1.5">
            <Search className="w-4 h-4 text-[#8C8C8C] ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products or categories..."
              className="w-full bg-transparent px-3 py-2 text-sm text-[#F5F4F2] placeholder-[#555555] focus:outline-none font-body"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#C8202B] hover:bg-[#AC1721] text-[#F5F4F2] font-heading uppercase tracking-wider text-xs font-bold transition-colors shrink-0 cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Recovery Destination Hub */}
        <div className="pt-6 border-t border-[#222222] grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto text-left">
          <Link
            to="/products"
            className="p-4 bg-[#141414] border border-[#242424] hover:border-[#C8202B] transition-colors group flex flex-col justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#C8202B]">01 • CATALOGUE</span>
              <span className="font-heading text-lg font-bold text-[#F5F4F2] group-hover:text-[#C8202B] transition-colors block">
                All Products
              </span>
              <p className="text-[11px] text-[#7C7C7C] font-body">
                Explore our full line of whey isolates, gainers, and pre-workouts.
              </p>
            </div>
            <div className="pt-3 flex items-center justify-between text-xs text-[#555555]">
              <span>Shop</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C8202B] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/categories"
            className="p-4 bg-[#141414] border border-[#242424] hover:border-[#C8202B] transition-colors group flex flex-col justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#C8202B]">02 • CATEGORIES</span>
              <span className="font-heading text-lg font-bold text-[#F5F4F2] group-hover:text-[#C8202B] transition-colors block">
                Categories
              </span>
              <p className="text-[11px] text-[#7C7C7C] font-body">
                Structured around specific physical training objectives.
              </p>
            </div>
            <div className="pt-3 flex items-center justify-between text-xs text-[#555555]">
              <span>Browse</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C8202B] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/"
            className="p-4 bg-[#141414] border border-[#242424] hover:border-[#C8202B] transition-colors group flex flex-col justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#C8202B]">03 • HOME</span>
              <span className="font-heading text-lg font-bold text-[#F5F4F2] group-hover:text-[#C8202B] transition-colors block">
                Storefront
              </span>
              <p className="text-[11px] text-[#7C7C7C] font-body">
                Return to the main page and brand introduction.
              </p>
            </div>
            <div className="pt-3 flex items-center justify-between text-xs text-[#555555]">
              <span>Return</span>
              <ArrowLeft className="w-3.5 h-3.5 text-[#C8202B] group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
