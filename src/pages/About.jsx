import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Heart, Leaf, MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import ParticleSystem from '../components/ParticleSystem';
import GradientOrbs from '../components/GradientOrbs';
import { initRevealOnScroll, initParallaxScroll, initTiltCards } from '../utils/animations';

const About = () => {
  useEffect(() => {
    const cleanupReveal = initRevealOnScroll();
    const cleanupParallax = initParallaxScroll();
    const cleanupTilt = initTiltCards();

    return () => {
      cleanupReveal();
      cleanupParallax();
      cleanupTilt();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <ParticleSystem />
      <GradientOrbs />

      {/* Hero Section with Parallax */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="parallax-bg absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=1920&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/60 to-stone-950" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-20">
          <div className="reveal">
            <span className="text-gold-500 font-script text-3xl md:text-4xl opacity-90 mb-4 block animate-float">
              Our Story
            </span>
          </div>
          <div className="reveal" style={{ transitionDelay: '0.1s' }}>
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 gradient-text">
              About Zaitoone
            </h1>
          </div>
          <div className="reveal" style={{ transitionDelay: '0.2s' }}>
            <p className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Bringing authentic Lebanese flavors to the heart of Bucharest
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
              A Taste of Lebanon in Bucharest
            </h2>
            <div className="w-20 h-[1px] bg-gold-500 mx-auto mb-8" />
            <p className="text-stone-400 text-lg leading-relaxed mb-6">
              Nestled in the exclusive area of Lake Herastrau, Zaitoone is more than just a
              restaurant—it's a culinary journey to the heart of Lebanon. We bring you the
              authentic flavors, aromas, and traditions of Lebanese cuisine, crafted with passion
              and served with Mediterranean warmth.
            </p>
            <p className="text-stone-400 text-lg leading-relaxed">
              Our name, "Zaitoone" (meaning "olive" in Arabic), reflects our commitment to using
              the finest ingredients and traditional recipes passed down through generations. Every
              dish tells a story of Lebanese heritage, prepared with love and respect for culinary
              traditions that have delighted palates for centuries.
            </p>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-b from-transparent to-gold-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
              Award-Winning Excellence
            </h2>
            <p className="text-stone-400 text-lg">
              Recognized for our commitment to quality and authentic Lebanese cuisine
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="reveal tilt-card glass-card glow-border p-8 rounded-2xl text-center group hover:bg-white/[0.05] transition-all">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gold-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-10 h-10 text-gold-400" />
                </div>
                <div className="absolute top-0 right-1/4 w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              </div>
              <h3 className="font-serif text-3xl text-gold-400 mb-2">2022</h3>
              <p className="text-white font-semibold mb-2">Horeca Awards Winner</p>
              <p className="text-stone-500 text-sm">Excellence in Lebanese Cuisine</p>
            </div>

            <div className="reveal tilt-card glass-card glow-border p-8 rounded-2xl text-center group hover:bg-white/[0.05] transition-all" style={{ transitionDelay: '0.1s' }}>
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gold-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-10 h-10 text-gold-400" />
                </div>
                <div className="absolute top-0 right-1/4 w-2 h-2 bg-gold-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
              </div>
              <h3 className="font-serif text-3xl text-gold-400 mb-2">2023</h3>
              <p className="text-white font-semibold mb-2">Horeca Awards Winner</p>
              <p className="text-stone-500 text-sm">Best Ethnic Restaurant</p>
            </div>

            <div className="reveal tilt-card glass-card glow-border p-8 rounded-2xl text-center group hover:bg-white/[0.05] transition-all" style={{ transitionDelay: '0.2s' }}>
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gold-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-10 h-10 text-gold-400" />
                </div>
                <div className="absolute top-0 right-1/4 w-2 h-2 bg-gold-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
              </div>
              <h3 className="font-serif text-3xl text-gold-400 mb-2">2024</h3>
              <p className="text-white font-semibold mb-2">Horeca Awards Winner</p>
              <p className="text-stone-500 text-sm">Outstanding Culinary Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">Our Core Values</h2>
            <p className="text-stone-400 text-lg">What makes Zaitoone special</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="reveal glass-card glow-border p-8 rounded-2xl text-center group hover:bg-white/[0.05] transition-all">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Leaf className="w-8 h-8 text-gold-400" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-3">100% Halal</h3>
              <p className="text-stone-400 leading-relaxed">
                All our dishes are prepared with certified Halal ingredients, ensuring the highest
                quality and adherence to Islamic dietary guidelines.
              </p>
            </div>

            <div className="reveal glass-card glow-border p-8 rounded-2xl text-center group hover:bg-white/[0.05] transition-all">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-gold-400" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-3">Authentic Recipes</h3>
              <p className="text-stone-400 leading-relaxed">
                Our chefs use traditional Lebanese recipes passed down through generations,
                preserving the authentic flavors of Lebanon.
              </p>
            </div>

            <div className="reveal glass-card glow-border p-8 rounded-2xl text-center group hover:bg-white/[0.05] transition-all">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8 text-gold-400" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-3">Premium Ingredients</h3>
              <p className="text-stone-400 leading-relaxed">
                We source only the finest, freshest ingredients to ensure every dish exceeds your
                expectations for quality and taste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-t from-transparent to-gold-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">Visit Us</h2>
              <p className="text-stone-400 text-lg mb-8 leading-relaxed">
                Located in the exclusive Lake Herastrau area, Zaitoone offers an elegant dining
                experience in one of Bucharest's most beautiful locations.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-gold-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Address</h4>
                    <p className="text-stone-400">
                      Str. Nicolae G. Caramfil 2<br />Bucharest, Romania
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-gold-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Phone</h4>
                    <a
                      href="tel:+40737299900"
                      className="text-stone-400 hover:text-gold-400 transition-colors"
                    >
                      +40 737 299 900
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-gold-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Hours</h4>
                    <p className="text-stone-400">
                      Daily<br />12:00 PM - 11:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="reveal glass-card glow-border p-8 rounded-2xl">
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
                  alt="Restaurant Interior"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gold-500/10 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
            Experience Lebanese Hospitality
          </h2>
          <p className="text-stone-400 text-lg mb-8">
            Join us for an unforgettable dining experience
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

export default About;
