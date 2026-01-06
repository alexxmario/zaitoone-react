import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Award, Sparkles, ArrowRight } from 'lucide-react';
import ParticleSystem from '../components/ParticleSystem';
import GradientOrbs from '../components/GradientOrbs';
import { initRevealOnScroll, initScrollRotation, animateCounter } from '../utils/animations';

const Home = () => {
  const statsRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const cleanupReveal = initRevealOnScroll();
    const cleanupRotation = initScrollRotation();

    // Animated counters for stats
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach((counter) => {
              const target = parseInt(counter.getAttribute('data-target'));
              animateCounter(counter, target);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    const currentStatsRef = statsRef.current;

    if (currentStatsRef) {
      statsObserver.observe(currentStatsRef);
    }

    return () => {
      cleanupReveal();
      cleanupRotation();
      if (currentStatsRef) {
        statsObserver.unobserve(currentStatsRef);
      }
    };
  }, []);

  return (
    <div className="min-h-screen">
      <ParticleSystem />
      <GradientOrbs />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1920&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-stone-500/40" />
            <div className="absolute inset-0 backdrop-grayscale backdrop-brightness-50" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-20">
          <div className="reveal space-y-8">
            <div className="inline-block px-6 py-3 rounded-full border border-gold-500/30 bg-gold-500/10 backdrop-blur-sm">
              <p className="text-gold-400 text-sm font-medium tracking-wider uppercase">
                Award-Winning Lebanese Cuisine
              </p>
            </div>

            <h1 className="font-script text-6xl md:text-8xl lg:text-9xl text-gold-400 mb-6 text-shadow">
              Zaitoone
            </h1>

            <p className="font-serif text-3xl md:text-5xl text-white max-w-4xl mx-auto leading-tight text-shadow">
              Authentic Lebanese Flavors in the Heart of Bucharest
            </p>

            <p className="text-stone-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Experience the rich traditions of Lebanese cuisine with our award-winning dishes,
              crafted from premium ingredients and served with Mediterranean hospitality.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link
                to="/menu"
                className="liquid-button group px-8 py-4 bg-gold-500 hover:bg-gold-600 text-stone-950 font-semibold rounded-full transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-gold-500/50"
              >
                <span>Explore Menu</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/reservations"
                className="px-8 py-4 border-2 border-gold-500 text-gold-400 hover:bg-gold-500/10 font-semibold rounded-full transition-all duration-300"
              >
                Reserve a Table
              </Link>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-gold-500/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gold-500 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Mezze */}
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center" data-scroll-rotate>
            {/* Image */}
            <div className="reveal relative group">
              <div className="absolute -inset-8 bg-gradient-to-br from-gold-500/20 to-gold-600/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 rounded-full border-2 border-gold-500/20 animate-pulse" />
                <div className="absolute inset-4 rounded-full border border-gold-500/10" />
                <div
                  className="absolute inset-8 rounded-full overflow-hidden shadow-2xl shadow-gold-500/20 spin-image"
                  style={{ transform: 'rotate(0deg)' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800"
                    alt="Mezze"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-transparent" />
                </div>
                <div className="absolute top-0 right-0 bg-gold-500 text-stone-950 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg animate-float">
                  Traditional
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="reveal space-y-6">
              <div className="inline-block">
                <p className="font-script text-5xl text-gold-400 mb-2">Mezze</p>
                <div className="h-1 w-24 bg-gradient-to-r from-gold-500 to-transparent" />
              </div>
              <h3 className="font-serif text-4xl text-white leading-tight">
                Begin Your Journey with Authentic Starters
              </h3>
              <p className="text-stone-400 text-lg leading-relaxed">
                Our mezze selection features traditional Lebanese appetizers, from creamy hummus
                and smoky moutabal to crispy falafel and savory sambousik. Each dish is prepared
                using time-honored recipes passed down through generations.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-gold-400 font-semibold">Hummus</p>
                  <p className="text-stone-500 text-sm">Classic chickpea purée</p>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-gold-400 font-semibold">Falafel</p>
                  <p className="text-stone-500 text-sm">Crispy herb patties</p>
                </div>
              </div>
              <Link
                to="/menu"
                className="inline-flex items-center space-x-2 text-gold-400 hover:text-gold-300 transition-colors group"
              >
                <span className="font-medium">View Full Mezze Menu</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Grilled */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-b from-transparent to-gold-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center" data-scroll-rotate>
            {/* Content */}
            <div className="reveal space-y-6 md:order-1">
              <div className="inline-block">
                <p className="font-script text-5xl text-gold-400 mb-2">From the Grill</p>
                <div className="h-1 w-24 bg-gradient-to-r from-gold-500 to-transparent" />
              </div>
              <h3 className="font-serif text-4xl text-white leading-tight">
                Master-Grilled Perfection
              </h3>
              <p className="text-stone-400 text-lg leading-relaxed">
                Experience the art of Lebanese grilling with our signature shawarma, succulent
                kebabs, and mixed grill platters. Each piece is marinated in aromatic spices and
                grilled to perfection over open flames.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-gold-400 font-semibold">Shawarma</p>
                  <p className="text-stone-500 text-sm">Marinated & spit-roasted</p>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-gold-400 font-semibold">Mixed Grill</p>
                  <p className="text-stone-500 text-sm">Assorted grilled meats</p>
                </div>
              </div>
              <Link
                to="/menu"
                className="inline-flex items-center space-x-2 text-gold-400 hover:text-gold-300 transition-colors group"
              >
                <span className="font-medium">Explore Grilled Specialties</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Image */}
            <div className="reveal relative group md:order-2">
              <div className="absolute -inset-8 bg-gradient-to-br from-gold-500/20 to-gold-600/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 rounded-full border-2 border-gold-500/20 animate-pulse" />
                <div className="absolute inset-4 rounded-full border border-gold-500/10" />
                <div
                  className="absolute inset-8 rounded-full overflow-hidden shadow-2xl shadow-gold-500/20 spin-image"
                  style={{ transform: 'rotate(0deg)' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800"
                    alt="Grilled"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-transparent" />
                </div>
                <div className="absolute top-0 left-0 bg-gold-500 text-stone-950 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg animate-float">
                  Signature
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Sweets */}
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center" data-scroll-rotate>
            {/* Image */}
            <div className="reveal relative group">
              <div className="absolute -inset-8 bg-gradient-to-br from-gold-500/20 to-gold-600/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 rounded-full border-2 border-gold-500/20 animate-pulse" />
                <div className="absolute inset-4 rounded-full border border-gold-500/10" />
                <div
                  className="absolute inset-8 rounded-full overflow-hidden shadow-2xl shadow-gold-500/20 spin-image"
                  style={{ transform: 'rotate(0deg)' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1571167250798-7854eb672a4d?w=800"
                    alt="Sweets"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-transparent" />
                </div>
                <div className="absolute top-0 right-0 bg-gold-500 text-stone-950 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg animate-float">
                  Artisan
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="reveal space-y-6">
              <div className="inline-block">
                <p className="font-script text-5xl text-gold-400 mb-2">Sweets</p>
                <div className="h-1 w-24 bg-gradient-to-r from-gold-500 to-transparent" />
              </div>
              <h3 className="font-serif text-4xl text-white leading-tight">
                Divine Lebanese Desserts
              </h3>
              <p className="text-stone-400 text-lg leading-relaxed">
                Complete your meal with our exquisite selection of traditional Lebanese sweets.
                From honey-soaked baklava to creamy knefeh, each dessert is a masterpiece of
                delicate flavors and textures.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-gold-400 font-semibold">Baklava</p>
                  <p className="text-stone-500 text-sm">Layered phyllo & nuts</p>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-gold-400 font-semibold">Knefeh</p>
                  <p className="text-stone-500 text-sm">Cheese pastry dessert</p>
                </div>
              </div>
              <Link
                to="/menu"
                className="inline-flex items-center space-x-2 text-gold-400 hover:text-gold-300 transition-colors group"
              >
                <span className="font-medium">Discover Sweet Delights</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="reveal text-center">
              <div className="font-serif text-5xl md:text-6xl text-gold-400 mb-2">
                <span className="counter" data-target="3">
                  0
                </span>
                x
              </div>
              <p className="text-stone-400 uppercase tracking-wider text-sm">Horeca Awards</p>
            </div>
            <div className="reveal text-center">
              <div className="font-serif text-5xl md:text-6xl text-gold-400 mb-2">
                <span className="counter" data-target="100">
                  0
                </span>
                %
              </div>
              <p className="text-stone-400 uppercase tracking-wider text-sm">Halal Certified</p>
            </div>
            <div className="reveal text-center">
              <div className="font-serif text-5xl md:text-6xl text-gold-400 mb-2">
                <span className="counter" data-target="50">
                  0
                </span>
                +
              </div>
              <p className="text-stone-400 uppercase tracking-wider text-sm">Menu Items</p>
            </div>
            <div className="reveal text-center">
              <div className="font-serif text-5xl md:text-6xl text-gold-400 mb-2">
                <span className="counter" data-target="10">
                  0
                </span>
                +
              </div>
              <p className="text-stone-400 uppercase tracking-wider text-sm">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
              Why Choose Zaitoone
            </h2>
            <p className="text-stone-400 text-lg max-w-2xl mx-auto">
              Experience authentic Lebanese cuisine with award-winning quality
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="reveal glass-card glow-border p-8 rounded-2xl text-center group hover:bg-white/[0.05] transition-all">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-gold-400" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-3">100% Halal</h3>
              <p className="text-stone-400 leading-relaxed">
                All our ingredients are certified Halal, ensuring authentic and ethical Lebanese
                cuisine
              </p>
            </div>

            <div className="reveal glass-card glow-border p-8 rounded-2xl text-center group hover:bg-white/[0.05] transition-all">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8 text-gold-400" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-3">Award-Winning</h3>
              <p className="text-stone-400 leading-relaxed">
                Recognized by Horeca Awards for three consecutive years (2022, 2023, 2024)
              </p>
            </div>

            <div className="reveal glass-card glow-border p-8 rounded-2xl text-center group hover:bg-white/[0.05] transition-all">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ChefHat className="w-8 h-8 text-gold-400" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-3">Authentic Recipes</h3>
              <p className="text-stone-400 leading-relaxed">
                Traditional Lebanese recipes using premium ingredients and time-honored techniques
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gold-500/10 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
            Ready to Experience Authentic Lebanese Cuisine?
          </h2>
          <p className="text-stone-400 text-lg mb-8">
            Reserve your table today and embark on a culinary journey to Lebanon
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

export default Home;
