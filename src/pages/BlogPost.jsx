import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, ArrowRight, ChefHat } from 'lucide-react';
import ParticleSystem from '../components/ParticleSystem';
import GradientOrbs from '../components/GradientOrbs';
import { initRevealOnScroll, initParallaxScroll } from '../utils/animations';
import { cdnUrl } from '../utils/cdn';

// Blog posts data
export const blogPosts = [
  {
    slug: 'secretele-bucatariei-libaneze',
    title: 'Secretele Bucătăriei Libaneze: O Călătorie prin Arome și Tradiții',
    excerpt: 'Bucătăria libaneză este mult mai mult decât simple preparate culinare — este o artă transmisă din generație în generație, o expresie a ospitalității și a dragostei pentru ingredientele proaspete.',
    image: cdnUrl('/images/moutabal-cu-trufe.jpg'),
    date: '10 Martie 2026',
    readTime: '5 min citire',
    author: 'Chef Ahmad',
    authorRole: 'Bucătar Șef Zaitoone',
    content: (
      <>
        <p className="text-stone-300 text-lg leading-relaxed mb-6">
          Bucătăria libaneză este mult mai mult decât simple preparate culinare — este o
          artă transmisă din generație în generație, o expresie a ospitalității și a
          dragostei pentru ingredientele proaspete și naturale. La Zaitoone, fiecare
          preparat spune o poveste, iar astăzi vă invit să descoperiți câteva dintre
          secretele care fac bucătăria noastră atât de specială.
        </p>

        <h3 className="font-serif text-2xl text-white mt-10 mb-4">
          Meze: Inima Mesei Libaneze
        </h3>
        <p className="text-stone-300 leading-relaxed mb-6">
          În tradiția libaneză, masa începe întotdeauna cu meze — o selecție generoasă
          de aperitive care se împart între toți cei de la masă. Această tradiție
          reflectă spiritul de comuniune și generozitate care definește cultura noastră.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-10">
          <div className="reveal rounded-2xl overflow-hidden">
            <img
              src={cdnUrl('/images/sambusek-cu-branza.jpg')}
              alt="Sambusek cu brânză"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
            />
            <p className="text-stone-500 text-sm mt-3 text-center italic">
              Sambusek cu brânză — plăcinte crocante umplute cu brânză aromată
            </p>
          </div>
          <div className="reveal rounded-2xl overflow-hidden" style={{ transitionDelay: '0.1s' }}>
            <img
              src={cdnUrl('/images/salata-panache.jpg')}
              alt="Salată Panache"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
            />
            <p className="text-stone-500 text-sm mt-3 text-center italic">
              Salată Panache — prospețime și culoare în fiecare farfurie
            </p>
          </div>
        </div>

        <h3 className="font-serif text-2xl text-white mt-10 mb-4">
          Ingrediente Care Fac Diferența
        </h3>
        <p className="text-stone-300 leading-relaxed mb-6">
          Secretul oricărui preparat libanez autentic constă în calitatea ingredientelor.
          Uleiul de măsline extravirgin, lămâia proaspătă, usturoiul, mentă, pătrunjel și
          condimentele precum za'atar și sumac sunt fundamentele bucătăriei noastre. La
          Zaitoone, importăm multe dintre aceste ingrediente direct din Liban pentru a
          păstra autenticitatea fiecărei rețete.
        </p>

        <blockquote className="border-l-4 border-gold-500 pl-6 my-8 italic text-stone-400">
          „Bucătăria libaneză nu este doar despre mâncare — este despre a aduce oamenii
          împreună, despre a împărtăși povești și a crea amintiri în jurul mesei."
          <footer className="text-gold-500 mt-2 not-italic">— Chef Ahmad</footer>
        </blockquote>

        <h3 className="font-serif text-2xl text-white mt-10 mb-4">
          O Invitație la Masa Noastră
        </h3>
        <p className="text-stone-300 leading-relaxed mb-6">
          Vă invităm să veniți și să descoperiți personal magia bucătăriei libaneze.
          Fie că optați pentru un meze tradițional, pentru preparatele noastre la grătar
          sau pentru deserturile rafinate, vă promitem o experiență culinară de neuitat.
        </p>
        <p className="text-stone-300 leading-relaxed">
          La Zaitoone, fiecare vizită este o călătorie în inima Libanului — și sunteți
          bineveniți oricând la masa noastră.
        </p>
      </>
    ),
  },
];

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find((p) => p.slug === slug);

  useEffect(() => {
    if (!post) {
      navigate('/blog');
      return;
    }

    const cleanupReveal = initRevealOnScroll();
    const cleanupParallax = initParallaxScroll();

    return () => {
      cleanupReveal();
      cleanupParallax();
    };
  }, [post, navigate]);

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <ParticleSystem />
      <GradientOrbs />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div className="parallax-bg absolute inset-0 z-0">
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/30" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-gold-400 hover:text-gold-300 transition-colors mb-6 reveal"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Înapoi la Blog</span>
          </Link>

          <div className="reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="flex items-center space-x-4 text-stone-300 text-sm mb-4">
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </span>
            </div>
          </div>

          <h1 className="reveal font-serif text-4xl md:text-5xl text-white leading-tight" style={{ transitionDelay: '0.2s' }}>
            {post.title}
          </h1>
        </div>
      </section>

      {/* Article Content */}
      <section className="relative py-16 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="reveal glass-card glow-border rounded-3xl p-8 md:p-12">
            {/* Author */}
            <div className="flex items-center space-x-3 mb-8 pb-8 border-b border-stone-800">
              <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <p className="text-white font-semibold">{post.author}</p>
                <p className="text-stone-500 text-sm">{post.authorRole}</p>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-invert prose-gold max-w-none">
              {post.content}
            </div>

            {/* Footer CTA */}
            <div className="mt-12 pt-8 border-t border-stone-800">
              <Link
                to="/menu"
                className="inline-flex items-center space-x-2 text-gold-400 hover:text-gold-300 transition-colors group"
              >
                <span>Explorează Meniul Nostru</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </article>
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

export default BlogPost;
