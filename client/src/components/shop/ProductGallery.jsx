import { useState } from 'react';

export default function ProductGallery({ images = [], name = 'Product' }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages = images && images.length > 0 ? images : [];
  const activeImage = displayImages.length > 0 ? displayImages[selectedIndex] || displayImages[0] : null;

  return (
    <div className="space-y-4">
      
      {/* Primary Display Frame */}
      <div className="relative aspect-square sm:aspect-[4/5] bg-[#161616] border border-[#282828] overflow-hidden flex items-center justify-center shadow-2xl">
        {/* Signature RK red corner block accent */}
        <div className="absolute top-0 right-0 w-3 h-3 bg-[#C8202B] z-20 pointer-events-none" />

        {/* Subtle RK Monogram Watermark */}
        <span 
          className="absolute font-heading font-black text-9xl text-white/[0.025] select-none pointer-events-none tracking-tighter"
          aria-hidden="true"
        >
          RK
        </span>

        {/* Abstract Athletic Steel Backdrop Graphic */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#F5F4F2_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {activeImage ? (
          <img
            src={activeImage}
            alt={`${name} - preview ${selectedIndex + 1}`}
            className="relative max-w-[85%] max-h-[85%] object-contain filter drop-shadow-2xl transition-all duration-300"
          />
        ) : (
          <div className="relative flex flex-col items-center justify-center text-center p-8 space-y-4 z-10">
            <div className="w-24 h-24 bg-[#141414] border border-[#2E2E2E] flex items-center justify-center relative overflow-hidden shadow-2xl">
              <span className="font-heading font-black text-4xl text-[#F5F4F2]">RK</span>
              <div className="absolute top-0 right-0 w-3 h-3 bg-[#C8202B]" />
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

        <div className="absolute bottom-3 right-3 text-[10px] font-mono uppercase tracking-widest text-[#8C8C8C] bg-[#111111]/90 px-2.5 py-1 border border-[#242424] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#C8202B]" />
          <span>RK NUTRITION // LAB-TESTED</span>
        </div>
      </div>

      {/* Thumbnails (Only rendered when additional images exist) */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              aria-label={`View image ${idx + 1}`}
              className={`w-16 h-16 sm:w-20 sm:h-20 bg-[#161616] border p-1 shrink-0 transition-colors ${
                selectedIndex === idx
                  ? 'border-[#C8202B] ring-1 ring-[#C8202B]'
                  : 'border-[#282828] hover:border-[#8C8C8C]'
              }`}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
