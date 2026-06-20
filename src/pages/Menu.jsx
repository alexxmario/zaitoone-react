import { useEffect, useState, lazy, Suspense, Component } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import ParticleSystem from '../components/ParticleSystem';
import GradientOrbs from '../components/GradientOrbs';
import { initRevealOnScroll } from '../utils/animations';
import { menuData, categories } from '../data/menuData';

const Model3DViewer = lazy(() => import('../components/3d/Model3DViewer'));

class ErrorBoundary3D extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? this.props.fallback || null : this.props.children; }
}

const MenuCard = ({ item, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className="glass-card glow-border rounded-xl overflow-hidden transition-all reveal relative hover:bg-white/[0.02] md:cursor-pointer"
    >
      {/* Image */}
      {item.image && (
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-900">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-serif text-xl text-white">{item.name}</h3>
          <span className="text-gold-400 font-medium whitespace-nowrap ml-4">{item.price}</span>
        </div>
        <p className="text-stone-400 text-sm leading-relaxed">{item.description}</p>
      </div>
    </div>
  );
};

const ProductModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div
      className="flex fixed inset-0 z-[100] items-center justify-end md:justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full h-full md:h-auto bg-stone-900 border-0 md:border border-gold-500/20 rounded-none md:rounded-2xl overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {item.modelUrl ? (
          <div className="w-full aspect-[4/3] overflow-hidden bg-stone-950">
            <ErrorBoundary3D fallback={
              item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : null
            }>
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
                </div>
              }>
                <Model3DViewer
                  modelUrl={item.modelUrl}
                  scale={4}
                  autoRotate={false}
                  enableZoom={true}
                  cameraDistance={item.cameraDistance || 3}
                  className="w-full h-full"
                />
              </Suspense>
            </ErrorBoundary3D>
          </div>
        ) : item.image ? (
          <div className="w-full aspect-[4/3] overflow-hidden bg-stone-950">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}

        <div className="p-5 md:p-8">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-serif text-xl md:text-3xl text-white">{item.name}</h3>
            <span className="text-gold-400 font-semibold text-xl whitespace-nowrap ml-4">{item.price}</span>
          </div>
          {item.nameEn && (
            <p className="text-stone-500 text-sm italic mb-4">{item.nameEn}</p>
          )}
          <p className="text-stone-300 leading-relaxed">{item.description}</p>
          {item.descriptionEn && (
            <p className="text-stone-500 text-sm mt-2 italic">{item.descriptionEn}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const cleanup = initRevealOnScroll();
    return cleanup;
  }, []);

  const scrollToCategory = (index) => {
    const element = document.getElementById(`category-${categories[index].id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveCategory(index);
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [selectedItem]);

  return (
    <div className="min-h-screen">
      <ParticleSystem />
      <GradientOrbs />
      <ProductModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      {/* Floating Category Menu Button */}
      <div className="fixed left-4 md:left-6 top-1/2 -translate-y-1/2 z-50">
        {/* Menu Toggle Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`w-12 h-12 rounded-full bg-stone-900/90 border border-gold-500/30 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:border-gold-500/60 hover:bg-stone-800/90 ${menuOpen ? 'bg-gold-500/20' : ''}`}
        >
          {menuOpen ? (
            <X className="w-5 h-5 text-gold-400" />
          ) : (
            <div className="flex flex-col gap-1">
              <span className="w-4 h-0.5 bg-gold-400 rounded-full" />
              <span className="w-4 h-0.5 bg-gold-400 rounded-full" />
              <span className="w-4 h-0.5 bg-gold-400 rounded-full" />
            </div>
          )}
        </button>

        {/* Category Panel - opens to the right, vertically centered */}
        <div
          className={`absolute left-14 top-1/2 -translate-y-1/2 transition-all duration-300 ${
            menuOpen
              ? 'opacity-100 translate-x-0 pointer-events-auto'
              : 'opacity-0 -translate-x-4 pointer-events-none'
          }`}
        >
          <div className="bg-stone-900/95 border border-gold-500/20 backdrop-blur-md rounded-xl p-2">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(index)}
                className={`w-full text-left px-3 py-1.5 rounded-lg transition-all text-xs whitespace-nowrap ${
                  activeCategory === index
                    ? 'bg-gold-500/20 text-gold-400'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-stone-900/50 to-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="reveal">
            <span className="text-gold-500 font-script text-3xl md:text-4xl opacity-90 mb-4 block animate-float">
              Our Menu
            </span>
          </div>
          <div className="reveal" style={{ transitionDelay: '0.1s' }}>
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 gradient-text">
              Authentic Lebanese Cuisine
            </h1>
          </div>
          <div className="reveal" style={{ transitionDelay: '0.2s' }}>
            <p className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              100% Halal dishes prepared with traditional recipes and the finest ingredients
            </p>
          </div>

          {/* Badges */}
          <div className="reveal mt-12 flex flex-wrap justify-center gap-4" style={{ transitionDelay: '0.3s' }}>
            <div className="glass-card px-8 py-4 rounded-full border border-gold-500/20">
              <span className="text-gold-400 font-medium text-sm uppercase tracking-widest">
                100% Halal Certified
              </span>
            </div>
            <div className="glass-card px-8 py-4 rounded-full border border-gold-500/20">
              <span className="text-gold-400 font-medium text-sm uppercase tracking-widest">
                Award Winning
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Categories */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.map((category) => (
            <div key={category.id} id={`category-${category.id}`} className="mb-24 scroll-mt-24">
              <div className="mb-12 text-center reveal">
                <span className="text-gold-500 font-script text-2xl opacity-80 mb-2 block">
                  {category.label}
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
                  {category.title}
                </h2>
                <div className="w-20 h-[1px] bg-gold-500 mx-auto" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menuData[category.id]?.map((item, index) => (
                  <MenuCard key={index} item={item} onSelect={setSelectedItem} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gold-500/10 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
            Ready to Experience These Flavors?
          </h2>
          <p className="text-stone-400 text-lg mb-8">
            Reserve your table and taste the authentic flavors of Lebanon
          </p>
          <Link
            to="/reservations"
            className="liquid-button inline-flex items-center space-x-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-stone-950 font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-gold-500/50"
          >
            <span>Make a Reservation</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Menu;
