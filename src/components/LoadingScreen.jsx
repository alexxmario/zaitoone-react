import { useState, useEffect } from 'react';
import Model3DViewer from './3d/Model3DViewer';

const LoadingScreen = ({ onComplete }) => {
  const [isSplitting, setIsSplitting] = useState(false);

  useEffect(() => {
    // Wait for 6 seconds to allow 3D model to load and display, then start the split animation
    const timer = setTimeout(() => {
      setIsSplitting(true);

      // After split animation completes (1.5s), notify parent
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
    }, 6000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`loading-screen ${isSplitting ? 'splitting' : ''}`}>
      {/* Left Panel */}
      <div className="loading-panel loading-panel-left"></div>

      {/* Right Panel */}
      <div className="loading-panel loading-panel-right"></div>

      {/* Center Content */}
      <div className="loading-center-content">
        <div className="loading-3d-container-center">
          <Model3DViewer
            modelUrl="/models/menu-items/tacchino-sandwich.glb"
            scale={8}
            position={[0, -1.5, 0]}
            autoRotate={true}
            enableZoom={false}
            enablePan={false}
            className="w-full h-full"
            cameraPosition={[0, 0, 5]}
          />
        </div>
        <div className="loading-text-center">
          <h1 className="mb-4 animate-pulse">
            <img src="/zaitoone-logo.svg" alt="Zaitoone" className="h-20 md:h-32 mx-auto" style={{ filter: 'invert(67%) sepia(57%) saturate(396%) hue-rotate(2deg) brightness(92%) contrast(87%)' }} />
          </h1>
          <p className="text-stone-400 text-xl tracking-widest uppercase">
            Loading Experience...
          </p>
        </div>
      </div>

      {/* Loading Progress Bar */}
      {!isSplitting && (
        <div className="loading-progress-container">
          <div className="loading-progress-bar">
            <div className="loading-progress-fill"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
