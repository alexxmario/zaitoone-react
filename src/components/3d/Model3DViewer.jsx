import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PresentationControls } from '@react-three/drei';

function Model({ url, scale = 1, position = [0, 0, 0], autoRotate = false }) {
  const meshRef = useRef();
  const { scene } = useGLTF(url);

  useFrame(() => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={scene}
      scale={scale}
      position={position}
    />
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-gold-400 text-sm">Loading 3D Model...</div>
    </div>
  );
}

const Model3DViewer = ({
  modelUrl,
  scale = 1,
  position = [0, 0, 0],
  autoRotate = false,
  enableZoom = true,
  enablePan = true,
  className = "w-full h-96",
  cameraPosition = [0, 0, 5],
}) => {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: cameraPosition, fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          <PresentationControls
            enabled={!autoRotate}
            global
            zoom={enableZoom ? 1 : 0}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            <Model
              url={modelUrl}
              scale={scale}
              position={position}
              autoRotate={autoRotate}
            />
          </PresentationControls>

          {!autoRotate && (
            <OrbitControls
              enableZoom={enableZoom}
              enablePan={enablePan}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
            />
          )}

          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Model3DViewer;
