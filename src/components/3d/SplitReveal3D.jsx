import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';

// Shared scroll ref — no React re-renders
const scrollRef = { current: 0 };

const SlidingModel = ({ modelUrl, startX, scale, rotationDirection }) => {
  const meshRef = useRef();
  const { scene } = useGLTF(modelUrl);
  const clonedScene = scene.clone();
  const targetX = startX > 0 ? 1.5 : -1.5;

  useFrame((state) => {
    if (!meshRef.current) return;
    const p = scrollRef.current;
    const currentX = startX + (targetX - startX) * Math.min(p * 1.5, 1);
    meshRef.current.position.x = currentX;
    meshRef.current.rotation.y += 0.005 * rotationDirection;
    meshRef.current.position.y = -0.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    const scaleProgress = Math.min(p * 2, 1);
    meshRef.current.scale.setScalar(scale * (0.5 + scaleProgress * 0.5));
  });

  return (
    <group ref={meshRef} position={[startX, -0.5, 0]}>
      <primitive object={clonedScene} />
      <pointLight color="#d49e3d" intensity={1.5} distance={4} />
    </group>
  );
};

const CentralBurst = () => {
  const mainRef = useRef();
  const secondRef = useRef();
  const spotRef = useRef();

  useFrame(() => {
    const intensity = Math.max(0, (scrollRef.current - 0.4) * 2.5);
    if (mainRef.current) mainRef.current.intensity = intensity * 8;
    if (secondRef.current) secondRef.current.intensity = intensity * 4;
    if (spotRef.current) spotRef.current.intensity = intensity * 3;
  });

  return (
    <group>
      <pointLight ref={mainRef} position={[0, 0, 2]} color="#d49e3d" intensity={0} distance={10} />
      <pointLight ref={secondRef} position={[0, 0, -2]} color="#f0c674" intensity={0} distance={8} />
      <spotLight ref={spotRef} position={[0, 5, 0]} color="#fff8e7" intensity={0} angle={0.5} penumbra={1} />
    </group>
  );
};

const SplitRevealScene = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[0, 5, 5]} intensity={0.3} color="#fff8e7" />
      <SlidingModel modelUrl="/models/menu-items/fagottini-ai-formaggio-e-pere.glb" startX={-6} scale={4} rotationDirection={1} />
      <SlidingModel modelUrl="/models/menu-items/gnocchi-ai-gamberi-zucchine.glb" startX={6} scale={4} rotationDirection={-1} />
      <CentralBurst />
      <Environment preset="studio" />
    </>
  );
};

const SplitReveal3D = () => {
  const containerRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const headerRef = useRef(null);
  const textOverlayRef = useRef(null);
  const burstOverlayRef = useRef(null);
  const cornerLRef = useRef(null);
  const cornerRRef = useRef(null);

  useEffect(() => {
    let rafId;

    const update = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const wh = window.innerHeight;

      const p = Math.max(0, Math.min(1,
        (wh - rect.top) / (wh + rect.height * 0.5)
      ));
      scrollRef.current = p;

      const tp = Math.max(0, (p - 0.3) * 2);

      // Direct DOM writes for all scroll-dependent styles
      if (orb1Ref.current) {
        orb1Ref.current.style.background = `radial-gradient(circle, rgba(212, 158, 61, ${(0.05 + p * 0.1).toFixed(3)}) 0%, transparent 70%)`;
        orb1Ref.current.style.transform = `scale(${1 + p * 0.5})`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.background = `radial-gradient(circle, rgba(240, 198, 116, ${(0.05 + p * 0.1).toFixed(3)}) 0%, transparent 70%)`;
        orb2Ref.current.style.transform = `scale(${1 + p * 0.5})`;
      }
      if (headerRef.current) {
        headerRef.current.style.opacity = Math.max(0, 1 - p * 2);
        headerRef.current.style.transform = `translateY(${p * -50}px)`;
      }
      if (textOverlayRef.current) {
        textOverlayRef.current.style.opacity = tp;
        textOverlayRef.current.style.transform = `scale(${0.8 + tp * 0.2})`;
      }
      if (burstOverlayRef.current) {
        burstOverlayRef.current.style.background = `radial-gradient(circle at 50% 50%, rgba(212, 158, 61, ${Math.max(0, (p - 0.5) * 0.3).toFixed(3)}) 0%, transparent 50%)`;
      }
      if (cornerLRef.current) {
        cornerLRef.current.style.opacity = 1 - p;
        cornerLRef.current.style.transform = `translate(${-p * 50}px, ${-p * 50}px)`;
      }
      if (cornerRRef.current) {
        cornerRRef.current.style.opacity = 1 - p;
        cornerRRef.current.style.transform = `translate(${p * 50}px, ${-p * 50}px)`;
      }
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[180vh] overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(12, 10, 9, 1) 0%, rgba(20, 17, 15, 1) 50%, rgba(12, 10, 9, 1) 100%)'
      }}
    >
      <div className="absolute inset-0">
        <div ref={orb1Ref} className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" />
        <div ref={orb2Ref} className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 pt-32 pb-8 text-center">
        <span ref={headerRef} className="text-gold-500/70 text-sm tracking-[0.3em] uppercase block mb-4">
          A Meeting of Flavors
        </span>
      </div>

      <div className="sticky top-0 h-screen flex items-center justify-center">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <SplitRevealScene />
          </Suspense>
        </Canvas>

        <div
          ref={textOverlayRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          style={{ opacity: 0 }}
        >
          <div className="text-center max-w-xl px-8">
            <div className="w-24 h-[1px] mx-auto mb-8 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Where Tradition
              <span className="block text-gold-400">Meets Innovation</span>
            </h2>
            <p className="text-stone-400 text-lg leading-relaxed">
              Every dish is a harmonious blend of time-honored Lebanese recipes
              and contemporary culinary artistry
            </p>
            <div className="w-24 h-[1px] mx-auto mt-8 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          </div>
        </div>

        <div
          ref={burstOverlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{ mixBlendMode: 'screen' }}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-stone-950 to-transparent pointer-events-none" />

      <div ref={cornerLRef} className="absolute top-32 left-8 w-16 h-16 border-l border-t border-gold-500/20" />
      <div ref={cornerRRef} className="absolute top-32 right-8 w-16 h-16 border-r border-t border-gold-500/20" />
    </section>
  );
};

export default SplitReveal3D;
