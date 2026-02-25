import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

const lerp = (start, end, progress) => start + (end - start) * progress;

// Shared ref for scroll progress — avoids re-rendering Canvas
const scrollProgressRef = { current: 0 };

function ScrollControlledModel({
  url,
  startRotationY = -Math.PI / 2,
  endRotationY = 0,
  startScale = 0.6,
  endScale = 1.2,
  startPositionY = -1,
  endPositionY = -2,
  baseScale = 8,
}) {
  const meshRef = useRef();
  const { scene } = useGLTF(url);

  useFrame(() => {
    if (!meshRef.current) return;
    const p = scrollProgressRef.current;

    const targetRotationY = lerp(startRotationY, endRotationY, p);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y, targetRotationY, 0.1
    );

    const targetScale = lerp(startScale, endScale, p) * baseScale;
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1)
    );

    const targetPositionY = lerp(startPositionY, endPositionY, p);
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y, targetPositionY, 0.1
    );

    meshRef.current.rotation.y += 0.001;
  });

  return (
    <primitive
      ref={meshRef}
      object={scene}
      scale={startScale * baseScale}
      position={[0, startPositionY, 0]}
      rotation={[0, startRotationY, 0]}
    />
  );
}

function ScrollControlledLighting() {
  const spotLightRef = useRef();
  const goldLightRef = useRef();

  useFrame(() => {
    const p = scrollProgressRef.current;
    if (spotLightRef.current) spotLightRef.current.intensity = lerp(0.5, 1.5, p);
    if (goldLightRef.current) goldLightRef.current.intensity = lerp(0.2, 1, p);
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <spotLight ref={spotLightRef} position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} color="#ffffff" />
      <pointLight ref={goldLightRef} position={[-5, 5, -5]} intensity={0.2} color="#d49e3d" />
      <pointLight position={[5, -5, 5]} intensity={0.3} color="#ffffff" />
    </>
  );
}

const ScrollModel3D = ({
  modelUrl,
  className = "w-full h-full",
  enableLetterbox = true,
  letterboxHeight = 10,
}) => {
  const containerRef = useRef(null);
  const topBarRef = useRef(null);
  const bottomBarRef = useRef(null);
  const textRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId;

    const update = () => {
      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      const progress = Math.max(0, Math.min(1,
        (scrollY - containerTop) / (containerTop + containerHeight - viewportHeight - containerTop)
      ));

      // Write to shared ref — useFrame reads it, no re-render
      scrollProgressRef.current = progress;

      // Text visibility — only setState when it actually changes
      const shouldShow = progress > 0.4;
      setTextVisible(prev => prev !== shouldShow ? shouldShow : prev);

      // Letterbox — direct DOM write
      if (enableLetterbox && topBarRef.current && bottomBarRef.current) {
        const h = Math.max(0, letterboxHeight * (1 - progress * 0.8));
        topBarRef.current.style.height = `${h}vh`;
        bottomBarRef.current.style.height = `${h}vh`;
      }

      // Scroll indicator opacity — direct DOM write
      if (scrollIndicatorRef.current) {
        scrollIndicatorRef.current.style.opacity = progress > 0.8 ? '0' : '0.6';
      }
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', update);
      cancelAnimationFrame(rafId);
    };
  }, [enableLetterbox, letterboxHeight]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: '200vh' }}
    >
      {enableLetterbox && (
        <>
          <div ref={topBarRef} className="letterbox-bar letterbox-top" style={{ height: `${letterboxHeight}vh` }} />
          <div ref={bottomBarRef} className="letterbox-bar letterbox-bottom" style={{ height: `${letterboxHeight}vh` }} />
        </>
      )}

      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 50% 50%, rgba(212, 158, 61, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 30% 70%, rgba(212, 158, 61, 0.05) 0%, transparent 40%),
              #0a0908
            `
          }}
        />

        <div className={`absolute inset-0 ${className}`}>
          <Canvas
            camera={{ position: [0, 0, 6], fov: 45 }}
            gl={{ alpha: true, antialias: true }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <ScrollControlledLighting />
              <ScrollControlledModel url={modelUrl} />
              <Environment preset="sunset" />
            </Suspense>
          </Canvas>
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10, 9, 8, 0.5) 100%)'
          }}
        />

        <div
          ref={textRef}
          className={`absolute inset-0 flex items-center justify-end px-8 lg:px-16 transition-all duration-700 ${
            textVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
        >
          <div className="max-w-md text-right">
            <p className="font-script text-gold-400 text-3xl mb-4">Signature</p>
            <h2 className="font-serif text-4xl lg:text-5xl text-white mb-6 leading-tight">
              Artisan<br /><span className="text-gold-400">Sandwiches</span>
            </h2>
            <p className="text-stone-400 text-lg leading-relaxed mb-8">
              Crafted with premium ingredients, our signature sandwiches
              are a testament to Lebanese culinary artistry.
            </p>
            <div className="inline-block">
              <span className="gold-underline text-gold-400 text-sm tracking-widest uppercase cursor-pointer">
                Explore Selection
              </span>
            </div>
          </div>
        </div>

        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
          style={{ opacity: 0.6 }}
        >
          <p className="text-stone-500 text-xs tracking-[0.3em] uppercase mb-3">Scroll to explore</p>
          <div className="w-px h-8 bg-gradient-to-b from-gold-500/40 to-transparent mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default ScrollModel3D;
