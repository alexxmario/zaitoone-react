import Model3DViewer from './Model3DViewer';

const MenuItem3D = ({
  name,
  description,
  price,
  modelUrl,
  imageUrl,
  scale = 1,
  autoRotate = true,
}) => {
  return (
    <div className="glass-card glow-border rounded-2xl overflow-hidden group hover:bg-white/[0.05] transition-all">
      <div className="relative h-96 bg-gradient-to-b from-stone-900 to-stone-950">
        {modelUrl ? (
          <Model3DViewer
            modelUrl={modelUrl}
            scale={scale}
            position={[0, -1.5, 0]}
            autoRotate={autoRotate}
            enableZoom={false}
            enablePan={false}
            className="w-full h-full"
            cameraPosition={[0, 0, 1.5]}
          />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-stone-500 text-sm">No preview available</p>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-gold-500 text-stone-950 px-4 py-2 rounded-full font-bold text-sm shadow-lg">
          {price}
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-serif text-2xl text-white mb-2">{name}</h3>
        <p className="text-stone-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default MenuItem3D;
