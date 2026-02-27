import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';

// Shared scroll ref — read inside useFrame, no React re-renders
const scrollRef = { current: 0 };

const FloatingModel = ({ modelUrl, position, scale, speed, rotationSpeed, glowColor, baseTilt = 0.5 }) => {
  const meshRef = useRef();
  const { scene } = useGLTF(modelUrl);
  const clonedScene = scene.clone();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.15;
    meshRef.current.rotation.y += rotationSpeed;
    // Base tilt toward viewer + subtle animation
    meshRef.current.rotation.x = baseTilt + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.03;
  });

  return (
    <group ref={meshRef} position={position} scale={scale}>
      <primitive object={clonedScene} />
      <pointLight color={glowColor} intensity={2} distance={3} />
    </group>
  );
};

const ParallaxScene = ({ models }) => {
  const groupRef = useRef();

  useFrame(() => {
    const p = scrollRef.current;
    if (groupRef.current) {
      groupRef.current.rotation.y = p * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#fff8e7" />
      <pointLight position={[-5, 2, -3]} intensity={1.5} color="#d49e3d" />
      <pointLight position={[5, -2, 3]} intensity={1.5} color="#d49e3d" />

      {models.map((model, index) => {
        const p = scrollRef.current;
        return (
          <FloatingModel
            key={index}
            modelUrl={model.url}
            position={[
              model.basePosition[0] + (p * model.parallaxFactor * 2),
              model.basePosition[1],
              model.basePosition[2] - (p * model.parallaxFactor)
            ]}
            scale={model.scale}
            speed={model.floatSpeed}
            rotationSpeed={model.rotationSpeed}
            glowColor={model.glowColor}
          />
        );
      })}

      <Environment preset="studio" />
    </group>
  );
};

const Floating3DGallery = () => {
  const containerRef = useRef(null);
  const glowRef = useRef(null);

  const models = [
    {
      url: '/models/menu-items/panini-bologna.glb',
      basePosition: [-2.2, 0.5, 1.5],
      scale: 3.5,
      floatSpeed: 0.8,
      rotationSpeed: 0.003,
      parallaxFactor: 1.5,
      glowColor: '#d49e3d'
    },
    {
      url: '/models/menu-items/panini-caprese.glb',
      basePosition: [0, -0.3, 2.5],
      scale: 4,
      floatSpeed: 1.0,
      rotationSpeed: 0.004,
      parallaxFactor: 1.0,
      glowColor: '#f0c674'
    },
    {
      url: '/models/menu-items/panini-parma.glb',
      basePosition: [2.2, 0.2, 2],
      scale: 3.5,
      floatSpeed: 1.2,
      rotationSpeed: 0.005,
      parallaxFactor: 0.5,
      glowColor: '#d49e3d'
    }
  ];

  useEffect(() => {
    let rafId;

    const update = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1,
        (windowHeight - rect.top) / (windowHeight + rect.height)
      ));
      scrollRef.current = progress;

      // Direct DOM write for glow overlay
      if (glowRef.current) {
        glowRef.current.style.background =
          `radial-gradient(ellipse at 50% 50%, rgba(212, 158, 61, ${(0.1 + progress * 0.1).toFixed(3)}) 0%, transparent 60%)`;
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
      className="relative min-h-[150vh] overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(12, 10, 9, 1) 0%, rgba(28, 25, 23, 0.8) 50%, rgba(12, 10, 9, 1) 100%)'
      }}
    >
      <div className="absolute inset-0 gradient-mesh opacity-30" />

      {/* Reduced from 20 to 8 particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold-500/30 rounded-full"
            style={{
              left: `${(i * 13.7) % 100}%`,
              top: `${(i * 17.3) % 100}%`,
              animation: `particle-float ${8 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`
            }}
          />
        ))}
      </div>

      {/* Header section removed - can be restored later */}

      <div className="sticky top-0 h-screen mt-32">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <ParallaxScene models={models} />
          </Suspense>
        </Canvas>

        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(212, 158, 61, 0.1) 0%, transparent 60%)'
          }}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-stone-950 to-transparent pointer-events-none" />

      <div className="absolute top-1/4 left-8 w-32 h-32 border border-gold-500/10 rounded-full animate-pulse-ring" />
      <div className="absolute bottom-1/4 right-8 w-48 h-48 border border-gold-500/5 rounded-full animate-pulse-ring" style={{ animationDelay: '1s' }} />
    </section>
  );
};

export default Floating3DGallery;
