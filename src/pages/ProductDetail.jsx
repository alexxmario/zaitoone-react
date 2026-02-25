import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Model3DViewer from '../components/3d/Model3DViewer';
import ParticleSystem from '../components/ParticleSystem';
import GradientOrbs from '../components/GradientOrbs';
import { getItemBySlug, getItemsWithModels, categories } from '../data/menuData';
import { initRevealOnScroll } from '../utils/animations';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const item = getItemBySlug(slug);
  const itemsWithModels = getItemsWithModels();

  useEffect(() => {
    const cleanup = initRevealOnScroll();
    return cleanup;
  }, []);

  // If item not found, redirect to menu
  useEffect(() => {
    if (!item) {
      navigate('/menu');
    }
  }, [item, navigate]);

  if (!item) {
    return null;
  }

  // Find previous and next items with 3D models
  const currentIndex = itemsWithModels.findIndex((i) => i.slug === slug);
  const prevItem = currentIndex > 0 ? itemsWithModels[currentIndex - 1] : null;
  const nextItem = currentIndex < itemsWithModels.length - 1 ? itemsWithModels[currentIndex + 1] : null;

  // Get category info
  const categoryInfo = categories.find((c) => c.id === item.category);

  return (
    <div className="min-h-screen atmospheric-bg">
      <ParticleSystem />
      <GradientOrbs />

      {/* Back Navigation */}
      <div className="fixed top-24 left-6 z-40">
        <Link
          to="/menu"
          className="flex items-center gap-2 text-stone-400 hover:text-gold-400 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm tracking-wider uppercase">Back to Menu</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[70vh]">
            {/* 3D Model Section */}
            <div className="reveal relative">
              {/* Ambient glow behind model */}
              <div
                className="absolute inset-0 -m-10 rounded-full blur-3xl opacity-30"
                style={{
                  background: 'radial-gradient(circle, rgba(212, 158, 61, 0.3) 0%, transparent 70%)',
                }}
              />

              {/* 3D Model Viewer */}
              <div className="relative aspect-square max-w-lg mx-auto">
                <Model3DViewer
                  modelUrl={item.modelUrl}
                  scale={item.scale * 1.5 || 6}
                  position={item.position || [0, -1, 0]}
                  autoRotate={true}
                  enableZoom={true}
                  enablePan={false}
                  className="w-full h-full"
                  cameraPosition={[0, 0, 4]}
                />
              </div>

              {/* Interaction hint */}
              <p className="text-center text-stone-600 text-xs tracking-wider uppercase mt-4">
                Drag to rotate • Scroll to zoom
              </p>
            </div>

            {/* Product Info Section */}
            <div className="reveal lg:pl-8">
              {/* Category Badge */}
              {categoryInfo && (
                <div className="mb-6">
                  <span className="text-gold-500/70 text-xs tracking-[0.3em] uppercase">
                    {categoryInfo.title}
                  </span>
                </div>
              )}

              {/* Product Name */}
              <h1 className="font-serif text-5xl lg:text-6xl text-white mb-4 leading-tight">
                {item.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                <span className="font-serif text-3xl text-gold-400">{item.price}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-gold-500/30 to-transparent" />
              </div>

              {/* Description */}
              <p className="text-stone-400 text-lg leading-relaxed mb-8">
                {item.fullDescription || item.description}
              </p>

              {/* Decorative Line */}
              <div className="w-20 h-px bg-gold-500/30 mb-8" />

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/reservations"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 text-stone-950 font-serif text-lg tracking-wide hover:bg-gold-400 transition-colors"
                >
                  Reserve a Table
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gold-500/30 text-gold-400 font-serif tracking-wide hover:bg-gold-500/10 transition-colors"
                >
                  View Full Menu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Between Products */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2">
            {/* Previous */}
            <div className="py-8 pr-4 border-r border-white/5">
              {prevItem ? (
                <Link
                  to={`/menu/${prevItem.slug}`}
                  className="group flex items-center gap-4 hover:opacity-80 transition-opacity"
                >
                  <ArrowLeft className="w-5 h-5 text-stone-500 group-hover:text-gold-400 group-hover:-translate-x-1 transition-all" />
                  <div>
                    <p className="text-stone-600 text-xs tracking-wider uppercase mb-1">Previous</p>
                    <p className="font-serif text-white group-hover:text-gold-400 transition-colors">
                      {prevItem.name}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="opacity-30">
                  <p className="text-stone-600 text-xs tracking-wider uppercase mb-1">Previous</p>
                  <p className="font-serif text-stone-600">No previous item</p>
                </div>
              )}
            </div>

            {/* Next */}
            <div className="py-8 pl-4 text-right">
              {nextItem ? (
                <Link
                  to={`/menu/${nextItem.slug}`}
                  className="group flex items-center justify-end gap-4 hover:opacity-80 transition-opacity"
                >
                  <div>
                    <p className="text-stone-600 text-xs tracking-wider uppercase mb-1">Next</p>
                    <p className="font-serif text-white group-hover:text-gold-400 transition-colors">
                      {nextItem.name}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-stone-500 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                </Link>
              ) : (
                <div className="opacity-30">
                  <p className="text-stone-600 text-xs tracking-wider uppercase mb-1">Next</p>
                  <p className="font-serif text-stone-600">No next item</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Other 3D Items */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <p className="font-script text-gold-400 text-2xl mb-3">Explore More</p>
            <h2 className="font-serif text-3xl text-white">Featured Dishes</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {itemsWithModels
              .filter((i) => i.slug !== slug)
              .slice(0, 3)
              .map((otherItem) => (
                <Link
                  key={otherItem.slug}
                  to={`/menu/${otherItem.slug}`}
                  className="reveal group glass-card p-6 rounded-xl hover:bg-white/[0.03] transition-all"
                >
                  <div className="aspect-square mb-4 relative overflow-hidden rounded-lg bg-stone-900/50">
                    <Model3DViewer
                      modelUrl={otherItem.modelUrl}
                      scale={otherItem.scale || 4}
                      position={otherItem.position || [0, -1, 0]}
                      autoRotate={true}
                      enableZoom={false}
                      enablePan={false}
                      className="w-full h-full"
                      cameraPosition={[0, 0, 3]}
                    />
                  </div>
                  <h3 className="font-serif text-xl text-white group-hover:text-gold-400 transition-colors mb-1">
                    {otherItem.name}
                  </h3>
                  <p className="text-gold-400 text-sm">{otherItem.price}</p>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
