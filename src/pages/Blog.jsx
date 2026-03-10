import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import ParticleSystem from '../components/ParticleSystem';
import GradientOrbs from '../components/GradientOrbs';
import { initRevealOnScroll, initParallaxScroll, initTiltCards } from '../utils/animations';
import { blogPosts } from './BlogPost';

const BlogCard = ({ post, index }) => (
  <Link
    to={`/blog/${post.slug}`}
    className="reveal tilt-card glass-card glow-border rounded-2xl overflow-hidden group block hover:bg-white/[0.03] transition-all duration-300"
    style={{ transitionDelay: `${index * 0.1}s` }}
  >
    {/* Thumbnail */}
    <div className="relative h-56 overflow-hidden">
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
    </div>

    {/* Content */}
    <div className="p-6">
      <div className="flex items-center space-x-4 text-stone-500 text-sm mb-3">
        <span className="flex items-center space-x-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{post.date}</span>
        </span>
        <span className="flex items-center space-x-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{post.readTime}</span>
        </span>
      </div>

      <h3 className="font-serif text-xl text-white mb-3 group-hover:text-gold-400 transition-colors line-clamp-2">
        {post.title}
      </h3>

      <p className="text-stone-400 text-sm leading-relaxed line-clamp-3 mb-4">
        {post.excerpt}
      </p>

      <span className="inline-flex items-center space-x-2 text-gold-400 text-sm group-hover:text-gold-300 transition-colors">
        <span>Citește mai mult</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </span>
    </div>
  </Link>
);

const Blog = () => {
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

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="parallax-bg absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/60 to-stone-950" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-20">
          <div className="reveal">
            <span className="text-gold-500 font-script text-3xl md:text-4xl opacity-90 mb-4 block animate-float">
              Descoperă
            </span>
          </div>
          <div className="reveal" style={{ transitionDelay: '0.1s' }}>
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 gradient-text">
              Blog Zaitoone
            </h1>
          </div>
          <div className="reveal" style={{ transitionDelay: '0.2s' }}>
            <p className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Povești, rețete și tradiții din bucătăria libaneză
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))}
          </div>

          {/* Coming Soon */}
          {blogPosts.length < 3 && (
            <div className="mt-16 text-center reveal">
              <div className="glass-card glow-border rounded-2xl p-12 max-w-2xl mx-auto">
                <h3 className="font-serif text-2xl text-white mb-4">
                  Mai multe articole în curând
                </h3>
                <p className="text-stone-400">
                  Urmărește-ne pentru mai multe povești, rețete și noutăți din lumea Zaitoone.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gold-500/10 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
            Experimentează Ospitalitatea Libaneză
          </h2>
          <p className="text-stone-400 text-lg mb-8">
            Rezervă o masă și descoperă aromele autentice ale Libanului
          </p>
          <Link
            to="/reservations"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-stone-950 font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-gold-500/50"
          >
            <span>Fă o Rezervare</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Blog;
