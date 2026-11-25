import { useState, useEffect, lazy, Suspense, memo } from 'react';

/**
 * High-fidelity 2D Fallback Component
 * Rendered when WebGL is unsupported, disabled, or initializing.
 */
export function HeroProductFallback({ className = '' }) {
  return (
    <div 
      className={`relative w-full aspect-[4/5] flex items-center justify-center select-none overflow-hidden ${className}`}
      aria-label="RK Nutrition Pure Whey Isolate Supplement Container"
      role="img"
    >
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,46,0.20)_0%,rgba(11,11,11,0)_72%)] pointer-events-none" 
        aria-hidden="true"
      />

      <div 
        className="absolute bottom-1 sm:bottom-6 w-24 sm:w-60 h-4 sm:h-8 bg-black/90 rounded-full blur-lg pointer-events-none"
        aria-hidden="true" 
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-[160px] sm:max-w-[220px] max-h-full">
        {/* Lid */}
        <div className="w-[74%] h-3.5 min-[360px]:h-4 sm:h-9 bg-gradient-to-r from-[#141414] via-[#2A2A2A] to-[#121212] rounded-t-sm border-t border-x border-[#383838] shadow-md flex items-center justify-around px-1 sm:px-2 overflow-hidden shrink-0">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-[1px] sm:w-[1.5px] h-full bg-[#404040]/90" />
          ))}
        </div>

        {/* Red Accent Ring */}
        <div className="w-[78%] h-0.5 min-[360px]:h-1 sm:h-2.5 bg-gradient-to-r from-[#B01726] via-[#E11D2E] to-[#8E101D] shadow-md shadow-[#E11D2E]/50 shrink-0" />

        {/* Jar Shoulder Curve */}
        <div className="w-[90%] h-2 min-[360px]:h-2.5 sm:h-7 bg-gradient-to-r from-[#121212] via-[#222222] to-[#0E0E0E] border-x border-[#2A2A2A] [clip-path:polygon(7%_0%,93%_0%,100%_100%,0%_100%)] shrink-0" />

        {/* Main Body */}
        <div className="w-full h-24 min-[360px]:h-28 min-[375px]:h-32 sm:h-80 bg-gradient-to-r from-[#0D0D0D] via-[#1A1A1A] to-[#0A0A0A] border-x border-b border-[#2A2A2A] rounded-b-md shadow-2xl flex flex-col items-center justify-between p-1.5 sm:p-5 relative overflow-hidden">
          <div className="w-full text-center mt-0.5">
            <div className="inline-flex items-center gap-1 px-1.5 sm:px-3 py-0.5 bg-[#E11D2E] text-[8px] sm:text-[11px] font-heading font-black tracking-wider text-[#FFFFFF] uppercase shadow-md">
              RK NUTRITION
            </div>
            <p className="text-[6px] sm:text-[9px] font-mono tracking-[0.15em] text-[#C0C0C0] uppercase mt-0.5 font-bold truncate">
              CORE PERFORMANCE
            </p>
          </div>

          <div className="text-center my-auto">
            <span className="font-heading font-black text-lg sm:text-4xl text-[#FFFFFF] tracking-wider block leading-none">
              PURE WHEY
            </span>
            <span className="font-heading font-black text-base sm:text-3xl text-[#E11D2E] tracking-wider block leading-none mt-0.5">
              ISOLATE
            </span>
          </div>

          <div className="w-full bg-[#121212] border border-[#333333] py-1 sm:py-2 px-1 sm:px-2 flex items-center justify-around text-center rounded-sm">
            <div>
              <span className="font-heading font-black text-xs sm:text-base text-[#FFFFFF] block leading-none">27G</span>
              <span className="text-[6px] sm:text-[8px] font-mono text-[#C0C0C0] uppercase font-bold">PROTEIN</span>
            </div>
            <div className="w-[1px] sm:w-[1.5px] h-3 sm:h-4 bg-[#333333]" />
            <div>
              <span className="font-heading font-black text-xs sm:text-base text-[#E11D2E] block leading-none">0G</span>
              <span className="text-[6px] sm:text-[8px] font-mono text-[#E11D2E] uppercase font-bold">SUGAR</span>
            </div>
            <div className="w-[1px] sm:w-[1.5px] h-3 sm:h-4 bg-[#333333]" />
            <div>
              <span className="font-heading font-black text-xs sm:text-base text-[#FFFFFF] block leading-none">6.2G</span>
              <span className="text-[6px] sm:text-[8px] font-mono text-[#C0C0C0] uppercase font-bold">BCAA</span>
            </div>
          </div>

          <div className="text-[6px] sm:text-[9px] font-mono tracking-wider text-[#FFFFFF] uppercase text-center w-full font-bold truncate">
            NET WT 2.0 KG (4.4 LBS)
          </div>
        </div>
      </div>
    </div>
  );
}

// Lazy-load Three.js canvas strictly on desktop
const LazyThreeCanvas = lazy(() => import('./HeroThreeCanvas'));

function HeroProduct3DComponent({ className = '' }) {
  const [showThreeCanvas, setShowThreeCanvas] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const mobileMql = window.matchMedia('(max-width: 767px)');
    const desktopMql = window.matchMedia('(min-width: 1024px)');
    const updateMode = () => {
      // Render live Three.js canvas on Desktop (>= 1024px) and Mobile (<= 767px)
      setShowThreeCanvas(desktopMql.matches || mobileMql.matches);
    };

    updateMode();
    mobileMql.addEventListener('change', updateMode);
    desktopMql.addEventListener('change', updateMode);
    return () => {
      mobileMql.removeEventListener('change', updateMode);
      desktopMql.removeEventListener('change', updateMode);
    };
  }, []);

  // On Tablet (768px - 1023px): Render static high-res WebP image
  if (!showThreeCanvas) {
    if (useFallback) {
      return <HeroProductFallback className={className} />;
    }

    return (
      <div 
        className={`relative w-full aspect-[4/5] flex items-center justify-center select-none overflow-visible ${className}`}
        aria-label="RK Nutrition Pure Whey Isolate Supplement Container"
      >
        <img
          src="/images/hero-tub.webp"
          fetchPriority="high"
          width="600"
          height="750"
          alt="RK Nutrition Pure Whey Isolate"
          onError={() => setUseFallback(true)}
          className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] drop-shadow-[0_4px_14px_rgba(225,29,46,0.22)] select-none pointer-events-none"
        />
      </div>
    );
  }

  // On Mobile (<= 767px) and Desktop (>= 1024px): Lazily mount 3D canvas
  return (
    <Suspense fallback={<HeroProductFallback className={className} />}>
      <LazyThreeCanvas className={className} />
    </Suspense>
  );
}

export const HeroProduct3D = memo(HeroProduct3DComponent);
export default HeroProduct3D;
