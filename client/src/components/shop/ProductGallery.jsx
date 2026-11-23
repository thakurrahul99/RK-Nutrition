import { useState } from 'react';

export default function ProductGallery({ images = [], name = 'Product', productId }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [imageFailed, setImageFailed] = useState(false);

  const displayImages = images && images.length > 0 ? images : [];
  const baseActive = displayImages.length > 0 ? displayImages[selectedIndex] || displayImages[0] : null;
  const fallbackProductImage = productId ? `/images/products/${productId}.webp` : null;
  const activeImage = !imageFailed ? (baseActive || fallbackProductImage) : null;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="space-y-4">
      
      {/* Primary Display Frame */}
      <div 
        className="relative aspect-square sm:aspect-[4/5] bg-[#141414] border border-[#262626] overflow-hidden flex items-center justify-center shadow-2xl group cursor-crosshair select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Signature RK red corner block accent */}
        <div className="absolute top-0 right-0 w-3 h-3 bg-[#E11D2E] z-20 pointer-events-none transition-transform duration-300 group-hover:scale-125" />

        {/* Ambient atmospheric red glow behind product tub */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 opacity-40 group-hover:opacity-75"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(225, 29, 46, 0.16) 0%, rgba(225, 29, 46, 0.04) 45%, transparent 70%)'
          }}
          aria-hidden="true"
        />

        {/* Abstract Athletic Steel Backdrop Graphic */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#F5F4F2_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        {activeImage ? (
          <div className="relative w-full h-full flex items-center justify-center p-6 sm:p-10 overflow-hidden">
            <img
              key={activeImage}
              src={activeImage}
              alt={`${name} - preview ${selectedIndex + 1}`}
              onError={() => setImageFailed(true)}
              className="relative max-w-full max-h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out will-change-transform"
              style={{
                transform: isHovered 
                  ? `scale(1.3) translate(${(50 - mousePos.x) * 0.25}%, ${(50 - mousePos.y) * 0.25}%)` 
                  : 'scale(1) translate(0%, 0%)',
                transformOrigin: `${mousePos.x}% ${mousePos.y}%`
              }}
            />
          </div>
        ) : (
          <div className="relative flex flex-col items-center justify-center text-center p-8 space-y-4 z-10">
            <div className="w-24 h-24 bg-[#141414] border border-[#2E2E2E] flex items-center justify-center relative overflow-hidden shadow-2xl">
              <span className="font-heading font-black text-4xl text-[#F5F4F2]">RK</span>
              <div className="absolute top-0 right-0 w-3 h-3 bg-[#E11D2E]" />
            </div>
            <div className="space-y-1">
              <span className="font-heading text-sm tracking-widest text-[#F5F4F2] uppercase font-bold block">
                RK NUTRITION FORMULATION
              </span>
              <span className="text-[11px] font-mono tracking-wider text-[#8C8C8C] uppercase block">
                LAB-TESTED ATHLETIC SPECIFICATION
              </span>
            </div>
          </div>
        )}

        {/* Interactive Zoom Hint Pill */}
        <div className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest text-[#8C8C8C] bg-[#111111]/90 backdrop-blur-sm px-2.5 py-1 border border-[#242424] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2E] animate-pulse" />
          <span>Interactive Zoom</span>
        </div>

        {/* Lab Tested Status Badge */}
        <div className="absolute bottom-3 right-3 text-[10px] font-mono uppercase tracking-widest text-[#8C8C8C] bg-[#111111]/90 backdrop-blur-sm px-2.5 py-1 border border-[#242424] flex items-center gap-1.5 pointer-events-none">
          <span className="w-1.5 h-1.5 bg-[#E11D2E]" />
          <span>RK NUTRITION • 100% PURE</span>
        </div>
      </div>

      {/* Thumbnails (Only rendered when additional images exist) */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              aria-label={`View image ${idx + 1}`}
              className={`w-16 h-16 sm:w-20 sm:h-20 bg-[#141414] border p-1.5 shrink-0 transition-all duration-300 cursor-pointer ${
                selectedIndex === idx
                  ? 'border-[#E11D2E] ring-2 ring-[#E11D2E]/40 scale-105 shadow-lg shadow-[#E11D2E]/20'
                  : 'border-[#262626] opacity-70 hover:opacity-100 hover:border-[#8C8C8C]'
              }`}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-contain filter drop-shadow-md"
              />
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
