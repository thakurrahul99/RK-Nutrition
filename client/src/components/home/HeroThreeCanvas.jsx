import { useEffect, useRef, useState, memo } from 'react';
import * as THREE from 'three';
import { HeroProductFallback } from './HeroProduct3D';

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
    grad.addColorStop(0, '#505050');
    grad.addColorStop(0.5, '#D0D0D0');
    grad.addColorStop(1, '#505050');
    ctx.fillStyle = grad;
    ctx.fillRect(x + 1, 0, ribWidth - 2, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(1, 1);
  return texture;
}

/**
 * Procedurally generates the 4K-resolution high-contrast typography and nutritional label texture.
 */
function createSupplementLabelTexture() {
  const width = 4096;
  const height = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // 1. Deep Matte Black Anodized Body Background
  ctx.fillStyle = '#080808';
  ctx.fillRect(0, 0, width, height);

  // 2. Ultra-fine micro-carbon tactile weave texture
  ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
  for (let y = 0; y < height; y += 8) {
    ctx.fillRect(0, y, width, 1.5);
  }
  for (let x = 0; x < width; x += 8) {
    ctx.fillRect(x, 0, 1.5, height);
  }

  // 3. Technical Coordinate Crosshairs
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 200; x < width; x += 600) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Active Viewing Facet (Facing viewer)
  const centerX = width * 0.50;

  // 4. Top Technical Framing Header
  const topY = 280;
  ctx.strokeStyle = '#282828';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX - 700, topY);
  ctx.lineTo(centerX + 700, topY);
  ctx.stroke();

  // Top Red Accent Segment
  ctx.strokeStyle = '#D51F32';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(centerX - 160, topY);
  ctx.lineTo(centerX + 160, topY);
  ctx.stroke();

  // 5. Brand Identification Tag
  ctx.fillStyle = '#D51F32';
  const tagW = 340;
  const tagH = 54;
  ctx.fillRect(centerX - tagW / 2, topY - 80, tagW, tagH);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 32px "Oswald", "Impact", "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '5px';
  ctx.fillText('RK NUTRITION', centerX, topY - 52);

  ctx.fillStyle = '#E5E5E5';
  ctx.font = '700 24px "Plus Jakarta Sans", "Helvetica Neue", sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('PERFORMANCE SERIES', centerX, topY + 45);

  // 6. Dominant Typographic Product Hierarchy
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 170px "Oswald", "Arial Black", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('PURE WHEY', centerX, 560);

  ctx.fillStyle = '#FF1732';
  ctx.font = '900 160px "Oswald", "Arial Black", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('ISOLATE', centerX, 715);

  ctx.fillStyle = '#C0C0C0';
  ctx.font = '700 34px "Plus Jakarta Sans", monospace';
  ctx.letterSpacing = '10px';
  ctx.fillText('100% CROSS-FLOW MICRO-FILTERED WHEY', centerX, 790);

  // 7. High-Contrast Macro Nutritive Matrix Callouts
  const matrixY = 880;
  const boxW = 1200;
  const boxH = 240;
  const boxX = centerX - boxW / 2;

  ctx.fillStyle = '#111111';
  ctx.fillRect(boxX, matrixY, boxW, boxH);

  ctx.strokeStyle = '#2A2A2A';
  ctx.lineWidth = 3;
  ctx.strokeRect(boxX, matrixY, boxW, boxH);

  ctx.strokeStyle = '#FF1732';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(boxX, matrixY);
  ctx.lineTo(boxX + 160, matrixY);
  ctx.stroke();

  // Draw 3 Metric Columns
  const cols = [
    { val: '27G', unit: 'PROTEIN', sub: 'PER SERVING', highlight: false },
    { val: '0G', unit: 'SUGAR', sub: 'ZERO FILLERS', highlight: true },
    { val: '6.2G', unit: 'BCAAS', sub: 'LEUCINE RICH', highlight: false }
  ];

  const colWidth = boxW / 3;
  cols.forEach((col, i) => {
    const cx = boxX + colWidth * i + colWidth / 2;

    if (i > 0) {
      ctx.strokeStyle = '#252525';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(boxX + colWidth * i, matrixY + 30);
      ctx.lineTo(boxX + colWidth * i, matrixY + boxH - 30);
      ctx.stroke();
    }

    ctx.fillStyle = col.highlight ? '#FF1732' : '#FFFFFF';
    ctx.font = '900 86px "Oswald", "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '2px';
    ctx.fillText(col.val, cx, matrixY + 110);

    ctx.fillStyle = col.highlight ? '#FF1732' : '#FFFFFF';
    ctx.font = '700 24px "Oswald", sans-serif';
    ctx.letterSpacing = '5px';
    ctx.fillText(col.unit, cx, matrixY + 155);

    ctx.fillStyle = '#777777';
    ctx.font = '600 16px monospace';
    ctx.letterSpacing = '3px';
    ctx.fillText(col.sub, cx, matrixY + 195);
  });

  // 8. Quality Assurance & Formulation Bar
  const stripY = 1200;
  ctx.fillStyle = '#161616';
  ctx.fillRect(centerX - 600, stripY, 1200, 48);
  ctx.strokeStyle = '#2C2C2C';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(centerX - 600, stripY, 1200, 48);

  ctx.fillStyle = '#B8B8B8';
  ctx.font = '700 18px monospace';
  ctx.letterSpacing = '5px';
  ctx.textBaseline = 'middle';
  ctx.fillText('ZERO AMINO SPIKING  •  LAB TESTED PURITY  •  CFM ISOLATE', centerX, stripY + 24);

  // 9. Technical Specifications & Net Weight
  const footerY = 1380;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 48px "Oswald", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('NET WT 2.0 KG (4.4 LBS)', centerX, footerY);

  ctx.fillStyle = '#888888';
  ctx.font = '600 22px monospace';
  ctx.letterSpacing = '5px';
  ctx.fillText('DIETARY SUPPLEMENT  •  APPROX. 66 SERVINGS', centerX, footerY + 50);

  ctx.fillStyle = '#FF1732';
  ctx.font = '700 20px monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText('BATCH: RK-2026-IND  •  FORMULATED FOR ATHLETIC VITALITY', centerX, footerY + 95);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function HeroThreeCanvasComponent({ className = '' }) {
  const mountRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasWebGl, setHasWebGl] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch {
      setHasWebGl(false);
      return;
    }

    const { clientWidth: width, clientHeight: height } = container;
    const initialWidth = width || 380;
    const initialHeight = height || 475;

    renderer.setSize(initialWidth, initialHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, initialWidth / initialHeight, 0.1, 100);
    camera.position.set(0, 0.25, 4.2);

    const lidKnurlTexture = createLidKnurlTexture();
    const labelTexture = createSupplementLabelTexture();

    const tubGroup = new THREE.Group();
    scene.add(tubGroup);

    // Tub Body
    const bodyGeometry = new THREE.CylinderGeometry(0.85, 0.82, 1.75, 64, 1, false);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x0A0A0A,
      roughness: 0.35,
      metalness: 0.15,
      map: labelTexture,
      bumpScale: 0.002
    });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = -0.15;
    tubGroup.add(bodyMesh);

    // Red Anodized Accent Ring
    const ringGeo = new THREE.CylinderGeometry(0.855, 0.855, 0.05, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xD51F32,
      roughness: 0.25,
      metalness: 0.85
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = 0.75;
    tubGroup.add(ringMesh);

    // Ribbed Lid
    const lidGeo = new THREE.CylinderGeometry(0.81, 0.83, 0.38, 64);
    const lidMat = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.5,
      metalness: 0.2,
      bumpMap: lidKnurlTexture,
      bumpScale: 0.015
    });
    const lidMesh = new THREE.Mesh(lidGeo, lidMat);
    lidMesh.position.y = 0.96;
    tubGroup.add(lidMesh);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 3.5);
    scene.add(keyLight);

    const redRimLight = new THREE.PointLight(0xD51F32, 3.5, 8);
    redRimLight.position.set(-2.5, 1, -2);
    scene.add(redRimLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-3, 0, 3);
    scene.add(fillLight);

    // Contact Ground Shadow
    const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.55
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.05;
    scene.add(shadowMesh);

    setIsLoaded(true);

    let animationId;
    let targetRotationY = -0.05;
    let currentRotationY = -0.05;

    // Interactive Drag
    let isDragging = false;
    let previousMouseX = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      previousMouseX = e.clientX;
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      previousMouseX = e.clientX;
      targetRotationY += deltaX * 0.008;
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isDragging) {
        targetRotationY += 0.002;
      }
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      tubGroup.rotation.y = currentRotationY;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 380;
      const h = container.clientHeight || 475;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
      if (domEl.parentNode) {
        domEl.parentNode.removeChild(domEl);
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
      <div 
        ref={mountRef} 
        className="w-full h-full relative z-10 cursor-grab active:cursor-grabbing"
      />
      {!isLoaded && (
        <div className="absolute inset-0 z-0">
          <HeroProductFallback />
        </div>
      )}
    </div>
  );
}

export const HeroThreeCanvas = memo(HeroThreeCanvasComponent);
export default HeroThreeCanvas;
