import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import ParticleSystem from '../components/ParticleSystem';
import GradientOrbs from '../components/GradientOrbs';
import MenuItem3D from '../components/3d/MenuItem3D';
import { initRevealOnScroll } from '../utils/animations';
import { menuData, categories } from '../data/menuData';

const MenuCard = ({ item }) => {
  const hasLink = item.slug;
  const has3D = item.modelUrl;

  const cardContent = (
    <div className={`glass-card glow-border rounded-xl overflow-hidden transition-all reveal ${hasLink ? 'group hover:bg-white/[0.03] cursor-pointer' : 'hover:bg-white/[0.02]'}`}>
      {/* 3D Badge for items with models */}
      {has3D && hasLink && (
        <div className="absolute top-4 left-4 z-10 bg-gold-500/90 text-stone-950 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
          View in 3D
        </div>
      )}

      {/* 3D Model or Image */}
      {has3D ? (
        <div className="relative h-80 bg-gradient-to-b from-stone-900 to-stone-950">
          <MenuItem3D
            name={item.name}
            description={item.description}
            price={item.price}
            modelUrl={item.modelUrl}
            scale={item.scale || 1}
            position={item.position}
            autoRotate={true}
          />
        </div>
      ) : item.image ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-900">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      ) : null}

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-serif text-xl text-white group-hover:text-gold-400 transition-colors">{item.name}</h3>
          <span className="text-gold-400 font-medium whitespace-nowrap ml-4">{item.price}</span>
        </div>
        <p className="text-stone-400 text-sm leading-relaxed">{item.description}</p>
        {hasLink && (
          <p className="text-gold-500/60 text-xs mt-4 uppercase tracking-wider group-hover:text-gold-400 transition-colors">
            View Details →
          </p>
        )}
      </div>

      {/* Hover overlay */}
      {hasLink && (
        <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/5 transition-colors pointer-events-none" />
      )}
    </div>
  );

  if (hasLink) {
    return (
      <Link to={`/menu/${item.slug}`} className="block relative">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

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

  const cycleCategory = (direction) => {
    const newIndex = direction === 'next'
      ? (activeCategory + 1) % categories.length
      : (activeCategory - 1 + categories.length) % categories.length;
    scrollToCategory(newIndex);
  };

  return (
    <div className="min-h-screen">
      <ParticleSystem />
      <GradientOrbs />

      {/* Floating Category Menu Button */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50">
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

        {/* Category Panel */}
        <div
          className={`absolute left-0 top-16 transition-all duration-300 ${
            menuOpen
              ? 'opacity-100 translate-x-0 pointer-events-auto'
              : 'opacity-0 -translate-x-4 pointer-events-none'
          }`}
        >
          <div className="bg-stone-900/95 border border-gold-500/20 backdrop-blur-md rounded-xl p-3 min-w-[180px]">
            <p className="text-gold-500/60 text-xs uppercase tracking-wider px-3 py-2">Categories</p>
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(index)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                  activeCategory === index
                    ? 'bg-gold-500/20 text-gold-400'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>

          {/* Cycle Arrows */}
          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => cycleCategory('prev')}
              className="w-8 h-8 rounded-full bg-stone-900/90 border border-gold-500/20 flex items-center justify-center text-gold-400 hover:bg-stone-800/90 transition-all"
            >
              <span className="text-sm">&#8593;</span>
            </button>
            <button
              onClick={() => cycleCategory('next')}
              className="w-8 h-8 rounded-full bg-stone-900/90 border border-gold-500/20 flex items-center justify-center text-gold-400 hover:bg-stone-800/90 transition-all"
            >
              <span className="text-sm">&#8595;</span>
            </button>
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
                  <MenuCard key={index} item={item} use3D={false} />
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
