import { useRef, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Center } from '@react-three/drei';
import { cdnUrl } from '../../utils/cdn';

// Shared scroll ref — read inside useFrame, no React re-renders
const scrollRef = { current: 0 };

const FloatingModel = ({ modelUrl, position, scale, speed, rotationSpeed, glowColor }) => {
  const meshRef = useRef();
  const { scene } = useGLTF(modelUrl);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.2;
    meshRef.current.rotation.y += rotationSpeed;
    // Tilt top toward camera so you see the food, not the plate edge
    meshRef.current.rotation.x = 0.4 + Math.sin(state.clock.elapsedTime * 0.4) * 0.03;
    meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.25) * 0.02;
  });

  return (
    <group ref={meshRef} position={position} scale={scale}>
      <Center>
        <primitive object={clonedScene} />
      </Center>
      <pointLight color={glowColor} intensity={0.5} distance={3} />
    </group>
  );
};

const ParallaxScene = ({ models }) => {
  const groupRef = useRef();

  useFrame(() => {
    const p = scrollRef.current;
    if (groupRef.current) {
      groupRef.current.rotation.y = p * 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 8, 5]} intensity={0.7} color="#fff8e7" />
      <pointLight position={[-5, 3, -3]} intensity={1.3} color="#d49e3d" />
      <pointLight position={[5, -2, 3]} intensity={1.3} color="#d49e3d" />

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

      <Environment preset="night" environmentIntensity={0.5} />
    </group>
  );
};

const Floating3DGallery = () => {
  const containerRef = useRef(null);
  const glowRef = useRef(null);

  const models = [
    {
      url: cdnUrl('/models/3d/hummus-cu-muguri-de-pin.glb'),
      basePosition: [-5, 0.8, 1],
      scale: 9,
      floatSpeed: 0.7,
      rotationSpeed: 0.003,
      parallaxFactor: 1.8,
      glowColor: '#d49e3d'
    },
    {
      url: cdnUrl('/models/3d/mix-kebab.glb'),
      basePosition: [1, -0.5, 2],
      scale: 11,
      floatSpeed: 0.9,
      rotationSpeed: 0.004,
      parallaxFactor: 1.0,
      glowColor: '#f0c674'
    },
    {
      url: cdnUrl('/models/3d/fattoush.glb'),
      basePosition: [5.5, 0.3, 1.5],
      scale: 8.5,
      floatSpeed: 1.1,
      rotationSpeed: 0.005,
      parallaxFactor: 0.6,
      glowColor: '#d49e3d'
    },
    {
      url: cdnUrl('/models/3d/antricot-de-vita-wagyu.glb'),
      basePosition: [-3, -1.2, 0.5],
      scale: 8,
      floatSpeed: 0.6,
      rotationSpeed: -0.003,
      parallaxFactor: 1.4,
      glowColor: '#f0c674'
    },
    {
      url: cdnUrl('/models/3d/baba-ganoush.glb'),
      basePosition: [4, 1.2, 0],
      scale: 9,
      floatSpeed: 0.85,
      rotationSpeed: 0.004,
      parallaxFactor: 0.8,
      glowColor: '#d49e3d'
    },
    {
      url: cdnUrl('/models/3d/cotlet-de-miel.glb'),
      basePosition: [-1, 1.5, -2],
      scale: 9.5,
      floatSpeed: 1.0,
      rotationSpeed: -0.005,
      parallaxFactor: 1.6,
      glowColor: '#f0c674'
    },
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

      if (glowRef.current) {
        glowRef.current.style.background =
          `radial-gradient(ellipse at 50% 50%, rgba(212, 158, 61, ${(0.08 + progress * 0.12).toFixed(3)}) 0%, transparent 60%)`;
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

      {/* Section header */}
      <div className="relative z-10 pt-24 pb-8 text-center">
        <p className="font-script text-gold-400 text-3xl mb-3">Experiență 3D</p>
        <h2 className="font-serif text-3xl md:text-5xl text-white">
          Descoperă preparatele noastre
        </h2>
      </div>

      <div className="sticky top-0 h-screen">
        <Canvas
          camera={{ position: [0, 7, 5], fov: 50 }}
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
            background: 'radial-gradient(ellipse at 50% 50%, rgba(212, 158, 61, 0.08) 0%, transparent 60%)'
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
