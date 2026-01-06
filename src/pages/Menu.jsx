import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ParticleSystem from '../components/ParticleSystem';
import GradientOrbs from '../components/GradientOrbs';
import MenuItem3D from '../components/3d/MenuItem3D';
import { initRevealOnScroll } from '../utils/animations';
import { menuData, categories } from '../data/menuData';

const MenuCard = ({ item, use3D = false }) => {
  if (use3D && item.modelUrl) {
    return (
      <div className="reveal">
        <MenuItem3D
          name={item.name}
          description={item.description}
          price={item.price}
          modelUrl={item.modelUrl}
          scale={item.scale || 1}
          autoRotate={true}
        />
      </div>
    );
  }

  return (
    <div className="glass-card glow-border p-6 rounded-xl hover:bg-white/[0.02] transition-all reveal">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-serif text-xl text-white">{item.name}</h3>
        <span className="text-gold-400 font-medium">{item.price}</span>
      </div>
      <p className="text-stone-400 text-sm leading-relaxed">{item.description}</p>
    </div>
  );
};

const Menu = () => {
  useEffect(() => {
    const cleanup = initRevealOnScroll();
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen">
      <ParticleSystem />
      <GradientOrbs />

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
            <div key={category.id} className="mb-24">
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
                  <MenuCard key={index} item={item} use3D={true} />
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
