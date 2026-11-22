import { useEffect, useRef, useState, memo } from 'react';
import * as THREE from 'three';

/**
 * High-fidelity 2D Fallback Component
 * Rendered when WebGL is unsupported, disabled, or initializing.
 * Synchronized with the taller athletic container proportions and high-contrast typography.
 */
export function HeroProductFallback({ className = '' }) {
  return (
    <div 
      className={`relative w-full aspect-[4/5] flex items-center justify-center select-none overflow-hidden ${className}`}
      aria-label="RK Nutrition Pure Whey Isolate Supplement Container"
      role="img"
    >
      {/* Studio Radial Backlight */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(213,31,50,0.20)_0%,rgba(11,11,11,0)_72%)] pointer-events-none" 
        aria-hidden="true"
      />

      {/* Ground Contact Shadow */}
      <div 
        className="absolute bottom-1 sm:bottom-6 w-24 sm:w-60 h-4 sm:h-8 bg-black/90 rounded-full blur-lg pointer-events-none"
        aria-hidden="true" 
      />

      {/* Supplement Container 2D Rendering */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[125px] sm:max-w-[220px]">
        
        {/* Screw-on Ribbed Lid with Knurled Texture */}
        <div className="w-[74%] h-5 sm:h-9 bg-gradient-to-r from-[#141414] via-[#2A2A2A] to-[#121212] rounded-t-sm border-t border-x border-[#383838] shadow-md flex items-center justify-around px-1 sm:px-2 overflow-hidden">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-[1px] sm:w-[1.5px] h-full bg-[#404040]/90 shadow-[0_0_1px_rgba(255,255,255,0.15)]" />
          ))}
        </div>

        {/* Signature Anodized Red Accent Ring */}
        <div className="w-[78%] h-1 sm:h-2.5 bg-gradient-to-r from-[#B01726] via-[#FF1732] to-[#8E101D] shadow-md shadow-[#D51F32]/50" />

        {/* Jar Shoulder Curve */}
        <div className="w-[90%] h-3 sm:h-7 bg-gradient-to-r from-[#121212] via-[#222222] to-[#0E0E0E] border-x border-[#2A2A2A] [clip-path:polygon(7%_0%,93%_0%,100%_100%,0%_100%)]" />

        {/* Main Matte Black Container Body */}
        <div className="w-full h-40 min-[360px]:h-44 sm:h-80 bg-gradient-to-r from-[#0D0D0D] via-[#1A1A1A] to-[#0A0A0A] border-x border-b border-[#2A2A2A] rounded-b-md shadow-2xl flex flex-col items-center justify-between p-2 sm:p-5 relative overflow-hidden">
          
          {/* Subtle Cylinder Highlight */}
          <div className="absolute top-0 left-2.5 sm:left-7 w-2 sm:w-3.5 h-full bg-gradient-to-r from-white/[0.10] to-transparent pointer-events-none" />
          <div className="absolute top-0 right-1.5 sm:right-4 w-1.5 sm:w-2.5 h-full bg-gradient-to-r from-transparent to-[#D51F32]/25 pointer-events-none" />

          {/* Label Header */}
          <div className="w-full text-center mt-0.5">
            <div className="inline-flex items-center gap-1 px-1.5 sm:px-3 py-0.5 bg-[#D51F32] text-[8px] sm:text-[11px] font-heading font-black tracking-wider sm:tracking-widest text-[#FFFFFF] uppercase shadow-md border border-white/20">
              RK NUTRITION
            </div>
            <p className="text-[6px] sm:text-[9px] font-mono tracking-[0.15em] sm:tracking-[0.24em] text-[#C0C0C0] uppercase mt-0.5 font-bold truncate">
              CORE PERFORMANCE
            </p>
          </div>

          {/* Product Headline */}
          <div className="text-center my-auto">
            <span className="font-heading font-black text-lg sm:text-4xl text-[#FFFFFF] tracking-wider block leading-none drop-shadow-md">
              PURE WHEY
            </span>
            <span className="font-heading font-black text-base sm:text-3xl text-[#FF1732] tracking-wider block leading-none mt-0.5 drop-shadow-[0_0_10px_rgba(255,23,50,0.3)]">
              ISOLATE
            </span>
            <span className="font-mono text-[6px] sm:text-[9px] tracking-widest text-[#D0D0D0] uppercase block mt-0.5 font-semibold">
              100% ISOLATE
            </span>
          </div>

          {/* Macro Callout Matrix */}
          <div className="w-full bg-[#121212] border border-[#333333] py-1 sm:py-2 px-1 sm:px-2 flex items-center justify-around text-center rounded-sm shadow-inner">
            <div>
              <span className="font-heading font-black text-xs sm:text-base text-[#FFFFFF] block leading-none">27G</span>
              <span className="text-[6px] sm:text-[8px] font-mono text-[#C0C0C0] uppercase font-bold">PROTEIN</span>
            </div>
            <div className="w-[1px] sm:w-[1.5px] h-3 sm:h-4 bg-[#333333]" />
            <div>
              <span className="font-heading font-black text-xs sm:text-base text-[#FF1732] block leading-none">0G</span>
              <span className="text-[6px] sm:text-[8px] font-mono text-[#FF1732] uppercase font-bold">SUGAR</span>
            </div>
            <div className="w-[1px] sm:w-[1.5px] h-3 sm:h-4 bg-[#333333]" />
            <div>
              <span className="font-heading font-black text-xs sm:text-base text-[#FFFFFF] block leading-none">6.2G</span>
              <span className="text-[6px] sm:text-[8px] font-mono text-[#C0C0C0] uppercase font-bold">BCAA</span>
            </div>
          </div>

          {/* Bottom Specifications */}
          <div className="text-[6px] sm:text-[9px] font-mono tracking-wider sm:tracking-widest text-[#FFFFFF] uppercase text-center w-full font-bold truncate">
            NET WT 2.0 KG (4.4 LBS)
          </div>

        </div>
      </div>
    </div>
  );
}

/**
 * Creates high-frequency knurled bump texture for the lid grip.
 */
function createLidKnurlTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 1024, 256);

  // Draw 64 vertical knurled ribs around circumference
  const ribWidth = 1024 / 64;
  for (let i = 0; i < 64; i++) {
    const x = i * ribWidth;
    const grad = ctx.createLinearGradient(x, 0, x + ribWidth, 0);
    grad.addColorStop(0.0, '#202020');
    grad.addColorStop(0.4, '#d8d8d8');
    grad.addColorStop(0.6, '#ffffff');
    grad.addColorStop(1.0, '#1a1a1a');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, ribWidth, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(1, 1);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates an ultra-crisp, high-contrast 2048x1024 canvas texture for the 3D supplement container label.
 * Designed with pure #FFFFFF whites, vibrant electric red #FF1732, and high-visibility typography
 * to completely eliminate any faded or washed-out look.
 */
function createSupplementLabelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // 1. Deep Obsidian-Black Base Surface (Maximum Contrast)
  const bgGrad = ctx.createLinearGradient(0, 0, 2048, 0);
  bgGrad.addColorStop(0.0, '#080808');
  bgGrad.addColorStop(0.2, '#0E0E0E');
  bgGrad.addColorStop(0.5, '#141414');
  bgGrad.addColorStop(0.8, '#0E0E0E');
  bgGrad.addColorStop(1.0, '#080808');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Subtle horizontal brushed hairline texture
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.018)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 1024; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(2048, y);
    ctx.stroke();
  }

  // ==========================================
  // 2. PRIMARY FRONT FACE (Centered at X = 1024)
  // ==========================================
  const centerX = 1024;

  // Left & Right Red Accent Vertical Stripes
  ctx.fillStyle = '#FF1732';
  ctx.fillRect(centerX - 430, 50, 5, 924);
  ctx.fillRect(centerX + 425, 50, 5, 924);

  // Vibrant Corner Technical Pips
  ctx.fillStyle = '#FF1732';
  ctx.fillRect(centerX - 430, 50, 30, 5);
  ctx.fillRect(centerX + 400, 50, 30, 5);
  ctx.fillRect(centerX - 430, 969, 30, 5);
  ctx.fillRect(centerX + 400, 969, 30, 5);

  // A: Brand Header Badge
  const badgeWidth = 380;
  const badgeHeight = 56;
  ctx.fillStyle = '#D51F32';
  ctx.fillRect(centerX - badgeWidth / 2, 95, badgeWidth, badgeHeight);

  // Subtle white border around badge for maximum pop
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(centerX - badgeWidth / 2, 95, badgeWidth, badgeHeight);

  // Brand Name inside Badge (Brilliant Pure White)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 34px "Oswald", "Bebas Neue", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '6px';
  ctx.fillText('RK NUTRITION', centerX, 124);

  // Subtitle under Badge (Bright Silver White)
  ctx.fillStyle = '#CCCCCC';
  ctx.font = 'bold 20px "Plus Jakarta Sans", monospace, sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('CORE PERFORMANCE SERIES • ATHLETIC GRADE', centerX, 185);

  // Accent divider line
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX - 260, 215);
  ctx.lineTo(centerX + 260, 215);
  ctx.stroke();

  ctx.fillStyle = '#FF1732';
  ctx.beginPath();
  ctx.arc(centerX, 215, 5, 0, Math.PI * 2);
  ctx.fill();

  // B: Dominant Product Title
  // PURE WHEY (Pure 100% Brilliant White with Depth)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 126px "Bebas Neue", "Oswald", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('PURE WHEY', centerX, 325);

  // ISOLATE (Vibrant Saturated Laser Red)
  ctx.fillStyle = '#FF1732';
  ctx.font = '900 126px "Bebas Neue", "Oswald", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('ISOLATE', centerX, 435);

  // Tagline under title (Clean Bright Gray)
  ctx.fillStyle = '#D4D4D4';
  ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '5px';
  ctx.fillText('100% MICRO-FILTERED WHEY PROTEIN ISOLATE', centerX, 510);

  // C: Structured Macro Matrix Box (3 Columns)
  const boxW = 700;
  const boxH = 130;
  const boxX = centerX - boxW / 2;
  const boxY = 575;

  ctx.fillStyle = '#111111';
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = '#383838';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  // Column 1: 27G PROTEIN
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 58px "Bebas Neue", "Oswald", sans-serif';
  ctx.fillText('27G', boxX + 118, boxY + 56);
  ctx.fillStyle = '#D0D0D0';
  ctx.font = 'bold 17px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('PROTEIN', boxX + 118, boxY + 92);
  ctx.fillStyle = '#8C8C8C';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('PER SERVING', boxX + 118, boxY + 112);

  // Divider 1
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(boxX + 233, boxY + 16);
  ctx.lineTo(boxX + 233, boxY + 114);
  ctx.stroke();

  // Column 2: 0G SUGAR (Red Highlight)
  ctx.fillStyle = '#221114';
  ctx.fillRect(boxX + 235, boxY + 3, 230, boxH - 6);

  ctx.fillStyle = '#FF1732';
  ctx.font = 'bold 58px "Bebas Neue", "Oswald", sans-serif';
  ctx.fillText('0G', boxX + 350, boxY + 56);
  ctx.font = 'bold 17px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('ADDED SUGAR', boxX + 350, boxY + 92);
  ctx.fillStyle = '#D0D0D0';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('ZERO FILLERS', boxX + 350, boxY + 112);

  // Divider 2
  ctx.beginPath();
  ctx.moveTo(boxX + 467, boxY + 16);
  ctx.lineTo(boxX + 467, boxY + 114);
  ctx.stroke();

  // Column 3: 6.2G BCAAS
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 58px "Bebas Neue", "Oswald", sans-serif';
  ctx.fillText('6.2G', boxX + 582, boxY + 56);
  ctx.fillStyle = '#D0D0D0';
  ctx.font = 'bold 17px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('BCAAS', boxX + 582, boxY + 92);
  ctx.fillStyle = '#8C8C8C';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('LEUCINE RICH', boxX + 582, boxY + 112);

  // D: Quality Guarantee Strip
  const stripW = 700;
  const stripH = 44;
  const stripX = centerX - stripW / 2;
  const stripY = 735;
  ctx.fillStyle = '#0F0F0F';
  ctx.fillRect(stripX, stripY, stripW, stripH);
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 2;
  ctx.strokeRect(stripX, stripY, stripW, stripH);

  ctx.fillStyle = '#D0D0D0';
  ctx.font = 'bold 16px "Plus Jakarta Sans", monospace, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('ZERO AMINO SPIKING  •  LAB TESTED PURITY  •  CFM ISOLATE', centerX, stripY + 24);

  // E: Bottom Specifications (Brilliant White & Clean Tag)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('NET WT. 2.0 KG (4.4 LBS)  //  66 SERVINGS', centerX, 825);

  ctx.fillStyle = '#AAAAAA';
  ctx.font = 'bold 14px monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText('CROSS-FLOW MICROFILTRATION (CFM)  •  FORMULATED IN INDIA', centerX, 858);

  // ==========================================
  // 3. LEFT FLANK (Nutrition Facts & Amino Matrix)
  // ==========================================
  const leftX = 80;
  ctx.textAlign = 'left';

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px "Oswald", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('SUPPLEMENT FACTS', leftX, 250);

  ctx.fillStyle = '#CCCCCC';
  ctx.font = 'bold 14px monospace';
  ctx.letterSpacing = '1px';
  ctx.fillText('Serving Size: 1 Scoop (30g) | Servings: 66', leftX, 280);

  // Nutrition Rows
  const nutrients = [
    ['Energy', '113 kcal', '5.6%'],
    ['Pure Protein (dry basis)', '27.0 g', '54%'],
    ['Total Carbohydrates', '0.8 g', '< 1%'],
    ['- Dietary Fiber', '0.0 g', '0%'],
    ['- Total Sugars', '0.0 g', '0%'],
    ['Total Fat', '0.3 g', '< 1%'],
    ['- Saturated Fat', '0.1 g', '< 1%'],
    ['Sodium', '45 mg', '2%'],
    ['Calcium', '140 mg', '14%']
  ];

  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(leftX, 295);
  ctx.lineTo(leftX + 460, 295);
  ctx.stroke();

  let tableY = 325;
  nutrients.forEach(([name, val, dv]) => {
    ctx.fillStyle = '#B0B0B0';
    ctx.font = '15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(name, leftX, tableY);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(val, leftX + 310, tableY);

    ctx.fillStyle = '#888888';
    ctx.font = '13px monospace';
    ctx.fillText(dv, leftX + 420, tableY);

    ctx.beginPath();
    ctx.moveTo(leftX, tableY + 8);
    ctx.lineTo(leftX + 460, tableY + 8);
    ctx.stroke();

    tableY += 30;
  });

  // BCAA Callout on Left Flank
  ctx.fillStyle = '#FF1732';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('TYPICAL AMINO ACID PROFILE PER SERVING:', leftX, tableY + 25);
  ctx.fillStyle = '#CCCCCC';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('BCAAs: 6,200mg  |  EAAs: 12,800mg  |  Glutamine: 4,900mg', leftX, tableY + 50);

  // ==========================================
  // 4. RIGHT FLANK (Directions, Quality, Barcode)
  // ==========================================
  const rightX = 1500;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px "Oswald", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('DIRECTIONS FOR USE', rightX, 250);

  ctx.fillStyle = '#CCCCCC';
  ctx.font = '15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Mix 1 scoop (30g) with 250ml of cold water or', rightX, 285);
  ctx.fillText('milk alternative. Shake thoroughly for 20-30 seconds.', rightX, 312);
  ctx.fillText('Consume immediately post-workout or between meals.', rightX, 339);

  ctx.fillStyle = '#FF1732';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('QUALITY ASSURANCE & PURITY', rightX, 390);
  ctx.fillStyle = '#B0B0B0';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Cold micro-filtered native whey isolate.', rightX, 418);
  ctx.fillText('Excludes thickeners, gums & amino spiking.', rightX, 444);
  ctx.fillText('Batch certified for label accuracy.', rightX, 470);

  // Barcode
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 48; i++) {
    const bw = (i % 4 === 0 ? 6 : i % 2 === 0 ? 3 : 2);
    ctx.fillRect(rightX + (i * 8), 530, bw, 65);
  }
  ctx.fillStyle = '#CCCCCC';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('8 901234 567890', rightX + 80, 620);
  ctx.fillText('BATCH: RK-2026-IND // VERIFIED', rightX, 646);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  // Ensure sRGB color space is applied to texture so colors are vivid and punchy
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

/**
 * Creates soft procedural contact ground shadow texture.
 */
function createContactShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 230);
  grad.addColorStop(0.0, 'rgba(0, 0, 0, 0.90)');
  grad.addColorStop(0.25, 'rgba(0, 0, 0, 0.65)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.25)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.00)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function HeroProduct3DComponent({ className = '' }) {
  const mountRef = useRef(null);
  const [hasWebGl, setHasWebGl] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Check WebGL availability
    const checkWebGL = () => {
      try {
        const testCanvas = document.createElement('canvas');
        return Boolean(
          window.WebGLRenderingContext &&
            (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
        );
      } catch {
        return false;
      }
    };

    if (!checkWebGL()) {
      setHasWebGl(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    // Detect user accessibility preferences & device capabilities
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileDevice = window.innerWidth < 768 || 'ontouchstart' in window;

    // 2. Initialize Three.js Scene, Camera, Renderer
    const width = container.clientWidth || 380;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    // Camera positioned at eye level with optimal framing for the taller container
    camera.position.set(0, 0.25, 7.4);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobileDevice,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch {
      setHasWebGl(false);
      return;
    }

    const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobileDevice ? 1.0 : 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    // Linear tone mapping with exposure 1.0 preserves vibrant pure whites and saturated reds without fading
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1.0;

    // Clear background to full transparent so dark surfaces show seamlessly
    renderer.setClearColor(0x000000, 0);

    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // 3. Studio Lighting Rig
    // A: Ambient Base (Keeps packaging text bright, crisp, and high-contrast)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambientLight);

    // B: Key Light (Neutral studio light hitting the front face directly)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(2.0, 3.8, 5.0);
    scene.add(keyLight);

    // C: Soft Cool Neutral Fill Light
    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 1.0);
    fillLight.position.set(-4.0, 1.5, 3.0);
    scene.add(fillLight);

    // D: Signature RK Red Rim/Edge Light (Cinematic silhouette highlight)
    const rimRedLight = new THREE.DirectionalLight(0xd51f32, 3.5);
    rimRedLight.position.set(-3.5, 2.5, -2.5);
    scene.add(rimRedLight);

    // E: Top Highlight Light for Lid Grooves and Accent Ring
    const topLight = new THREE.PointLight(0xffffff, 1.3, 12);
    topLight.position.set(0, 5.5, 2.0);
    scene.add(topLight);

    // 4. Construct TALLER, IMPOSING Supplement Container Geometry
    const tubGroup = new THREE.Group();
    // Scale group to prominent athletic proportions (0.92 gives commanding stature without clipping)
    tubGroup.scale.set(0.92, 0.92, 0.92);
    scene.add(tubGroup);

    // High-Resolution Procedural Textures
    const labelTexture = createSupplementLabelTexture();
    const knurlTexture = createLidKnurlTexture();

    // Enable Maximum Anisotropic Filtering on label to keep text pin-sharp on curved surface
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    if (labelTexture) {
      labelTexture.anisotropy = maxAnisotropy;
    }

    // Tub Materials
    const darkSatinPlastic = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.35,
      metalness: 0.15
    });

    // Lid Material with Knurled Rib Bump Map
    const lidMaterial = new THREE.MeshStandardMaterial({
      color: 0x161616,
      bumpMap: knurlTexture,
      bumpScale: 0.08,
      roughness: 0.36,
      metalness: 0.20
    });

    // Signature Anodized Red Accent Ring
    const anodizedRedRingMaterial = new THREE.MeshStandardMaterial({
      color: 0xd51f32,
      roughness: 0.16,
      metalness: 0.85
    });

    // Front-Facing Product Label Material (Zero metallic absorption so white/red text pops brightly)
    const labelMaterial = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.32,
      metalness: 0.04
    });

    // Part A: Main Tub Body Cylinder (Taller body height: 2.25 units)
    const bodyHeight = 2.25;
    const bodyGeometry = new THREE.CylinderGeometry(1.05, 1.05, bodyHeight, 64);
    const bodyMesh = new THREE.Mesh(bodyGeometry, labelMaterial);
    bodyMesh.position.y = 0;
    // Rotate bodyMesh by Math.PI so the front label (u = 0.5) faces directly toward +Z (the camera)
    bodyMesh.rotation.y = Math.PI;
    tubGroup.add(bodyMesh);

    // Part B: Beveled Base Fillet Chamfer
    const baseHeight = 0.12;
    const baseGeometry = new THREE.CylinderGeometry(1.05, 0.98, baseHeight, 64);
    const baseMesh = new THREE.Mesh(baseGeometry, darkSatinPlastic);
    baseMesh.position.y = -(bodyHeight / 2 + baseHeight / 2);
    tubGroup.add(baseMesh);

    // Part C: Curved Shoulder Transition
    const shoulderHeight = 0.26;
    const shoulderGeometry = new THREE.CylinderGeometry(0.88, 1.05, shoulderHeight, 64);
    const shoulderMesh = new THREE.Mesh(shoulderGeometry, darkSatinPlastic);
    shoulderMesh.position.y = bodyHeight / 2 + shoulderHeight / 2;
    tubGroup.add(shoulderMesh);

    // Part D: Container Neck Collar
    const neckHeight = 0.10;
    const neckGeometry = new THREE.CylinderGeometry(0.88, 0.88, neckHeight, 64);
    const neckMesh = new THREE.Mesh(neckGeometry, darkSatinPlastic);
    neckMesh.position.y = bodyHeight / 2 + shoulderHeight + neckHeight / 2;
    tubGroup.add(neckMesh);

    // Part E: Anodized RK Red Accent Ring Gasket
    const ringHeight = 0.06;
    const ringGeometry = new THREE.CylinderGeometry(0.92, 0.92, ringHeight, 64);
    const ringMesh = new THREE.Mesh(ringGeometry, anodizedRedRingMaterial);
    ringMesh.position.y = bodyHeight / 2 + shoulderHeight + neckHeight + ringHeight / 2;
    tubGroup.add(ringMesh);

    // Part F: Screw-on Lid with Knurled Texture
    const lidHeight = 0.40;
    const lidGeometry = new THREE.CylinderGeometry(0.96, 0.96, lidHeight, 64);
    const lidMesh = new THREE.Mesh(lidGeometry, lidMaterial);
    lidMesh.position.y = bodyHeight / 2 + shoulderHeight + neckHeight + ringHeight + lidHeight / 2;
    tubGroup.add(lidMesh);

    // Part G: Top Lid Crown Lip
    const lipHeight = 0.08;
    const lidLipGeometry = new THREE.CylinderGeometry(0.99, 0.99, lipHeight, 64);
    const lidLipMesh = new THREE.Mesh(lidLipGeometry, darkSatinPlastic);
    lidLipMesh.position.y = bodyHeight / 2 + shoulderHeight + neckHeight + ringHeight + lidHeight + lipHeight / 2;
    tubGroup.add(lidLipMesh);

    // Part H: Soft Ground Contact Shadow Plane
    const shadowTexture = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.78,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -(bodyHeight / 2 + baseHeight + 0.06);
    scene.add(shadowMesh);

    // Initial Studio Display Orientation
    // Subtle ~3.5° yaw angle provides natural 3D depth on the right edge while keeping the front label 100% readable
    const baseRotationY = 0.06;
    const baseRotationX = 0.02;
    tubGroup.rotation.y = baseRotationY;
    tubGroup.rotation.x = baseRotationX;

    // 5. Interactivity State (Gentle mouse tilt parallax on desktop)
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const onMouseMove = (e) => {
      if (isMobileDevice || prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      // Restrained tilt limits (max ~5.5°) so branding NEVER disappears
      mouse.targetX = normX * 0.10;
      mouse.targetY = normY * 0.06;
    };

    const onMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    container.addEventListener('mousemove', onMouseMove, { passive: true });
    container.addEventListener('mouseleave', onMouseLeave, { passive: true });

    // 6. Visibility-Aware Animation Loop
    let animationFrameId;
    let isVisible = true;
    let isTabActive = !document.hidden;
    const clock = new THREE.Clock();

    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible || !isTabActive) return;

      const elapsedTime = clock.getElapsedTime();

      // Subtle, smooth floating motion
      if (!prefersReducedMotion) {
        const floatOffset = Math.sin(elapsedTime * 1.2) * 0.05;
        tubGroup.position.y = floatOffset;
        
        // Shadow expands/contracts subtly in sync with float
        const shadowScale = 1.0 - floatOffset * 0.3;
        shadowMesh.scale.set(shadowScale, shadowScale, 1.0);
        shadowMat.opacity = 0.78 - floatOffset * 0.3;

        // Smooth lerp mouse tilt on desktop
        if (!isMobileDevice) {
          mouse.x += (mouse.targetX - mouse.x) * 0.05;
          mouse.y += (mouse.targetY - mouse.y) * 0.05;

          // Keep front label facing user at all times
          tubGroup.rotation.y = baseRotationY + mouse.x + Math.sin(elapsedTime * 0.5) * 0.02;
          tubGroup.rotation.x = baseRotationX - mouse.y;
        } else {
          // Mobile: gentle slow drift without mouse dependency
          tubGroup.rotation.y = baseRotationY + Math.sin(elapsedTime * 0.4) * 0.025;
        }
      }

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    // 7. Responsive Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // 8. Complete Resource Disposal and Memory Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();

      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);

      // Dispose geometries & materials
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => {
              if (mat.map) mat.map.dispose();
              if (mat.bumpMap) mat.bumpMap.dispose();
              mat.dispose();
            });
          } else {
            if (object.material.map) object.material.map.dispose();
            if (object.material.bumpMap) object.material.bumpMap.dispose();
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!hasWebGl) {
    return <HeroProductFallback className={className} />;
  }

  return (
    <div 
      className={`relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[460px] aspect-[4/5] flex items-center justify-center select-none ${className}`}
      aria-label="3D Interactive Supplement Container — RK Nutrition Pure Whey Isolate"
      role="region"
    >
      {/* Studio Radial Backlight (Enhances metallic container silhouette) */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(213,31,50,0.18)_0%,rgba(11,11,11,0)_72%)] pointer-events-none" 
        aria-hidden="true"
      />

      {/* Three.js Canvas Mount */}
      <div 
        ref={mountRef} 
        className="w-full h-full relative z-10 cursor-grab active:cursor-grabbing"
      />

      {/* Loading state seamless placeholder to prevent layout shift */}
      {!isLoaded && (
        <div className="absolute inset-0 z-0">
          <HeroProductFallback />
        </div>
      )}
    </div>
  );
}

export const HeroProduct3D = memo(HeroProduct3DComponent);
export default HeroProduct3D;
