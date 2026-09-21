import { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';


function Model({ url, scale = 1, autoRotate = false, rotateSpeed = 0.005 }) {
  const pivotRef = useRef();
  const { scene } = useGLTF(url);

  // Clone, compute bounding box center, and wrap in an offset group
  // so the pivot (pivotRef) rotates around the model's true center
  const { offsetGroup } = useMemo(() => {
    const clone = scene.clone(true);
    // Force world matrix update on all descendants
    clone.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());

    // Create an inner group that holds the clone shifted by -center
    const inner = new THREE.Group();
    inner.add(clone);
    clone.position.set(-center.x, -center.y, -center.z);

    return { offsetGroup: inner };
  }, [scene]);

  useFrame((_, delta) => {
    if (autoRotate && pivotRef.current) {
      pivotRef.current.rotation.y += rotateSpeed * Math.min(delta, 0.05) * 60;
    }
  });

  return (
    <group ref={pivotRef} scale={scale}>
      <primitive object={offsetGroup} />
    </group>
  );
}

// 70° elevation = looking down from 70° above horizontal
// In Three.js polar angle: 0 = top, PI/2 = horizon
// 70° from horizontal = 20° from top = PI/2 - 70*(PI/180) = ~0.349 rad
const ELEVATION_55_DEG = Math.PI / 2 - (55 * Math.PI / 180);

const Model3DViewer = ({
  modelUrl,
  scale = 1,
  position = [0, 0, 0],
  autoRotate = true,
  rotateSpeed = 0.005,
  enableZoom = false,
  enablePan = false,
  className = "w-full h-96",
  cameraDistance = 5,
  transparent = true,
}) => {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setReady(true);
    });
    observer.observe(containerRef.current);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // Calculate camera position at 70° elevation
  const cameraPosition = useMemo(() => {
    const y = Math.cos(ELEVATION_55_DEG) * cameraDistance;
    const z = Math.sin(ELEVATION_55_DEG) * cameraDistance;
    return [0, y, z];
  }, [cameraDistance]);

  return (
    <div ref={containerRef} className={className}>
      {ready && <Canvas
        dpr={[1, 1.5]}
        frameloop={visible && pageVisible ? (autoRotate ? 'always' : 'demand') : 'never'}
        camera={{ position: cameraPosition, fov: 18 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.45} />
          <directionalLight position={[5, 8, 5]} intensity={0.7} color="#fff8e7" />
          <pointLight position={[-5, 3, -3]} intensity={1.3} color="#d49e3d" />
          <pointLight position={[5, -2, 3]} intensity={1.3} color="#d49e3d" />

          <Model
            url={modelUrl}
            scale={scale}
            position={position}
            autoRotate={autoRotate}
            rotateSpeed={rotateSpeed}
          />

          <OrbitControls
            enableZoom={enableZoom}
            enablePan={enablePan}
            enableRotate={!autoRotate}
            minPolarAngle={autoRotate ? ELEVATION_55_DEG : 0.1}
            maxPolarAngle={ELEVATION_55_DEG}
            target={[0, 0, 0]}
          />

          <Environment preset="night" environmentIntensity={0.5} />
        </Suspense>
      </Canvas>}
    </div>
  );
};

export default Model3DViewer;
