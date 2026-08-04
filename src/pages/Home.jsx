import { useEffect, useRef } from 'react';
import { cdnUrl } from '../utils/cdn';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollVideo from '../components/ScrollVideo';
import ScrollPhotoScatter from '../components/ScrollPhotoScatter';
import { initRevealOnScroll, animateCounter } from '../utils/animations';

const signatureDishes = [
  {
    name: 'Creveți Zaitoone',
    category: 'Fructe de mare',
    image: cdnUrl('/images/Bd1gJ5mfPkI8xvGcg87VfxbL0M.png'),
    description: 'Creveți aromați cu sos special de rodie'
  },
  {
    name: 'Falafel',
    category: 'Mezze',
    image: cdnUrl('/images/um8WPEW3IJgQ6weNmAI8LkTJTTU.png'),
    description: 'Chifteluțe de năut cu ceapă, coriandru, usturoi'
  },
  {
    name: 'Shawarma de vită',
    category: 'Signature',
    image: cdnUrl('/images/9wHbKYDkXhVshqL638OVzkGL5i4.png'),
    description: 'Mușchi de vită marinat în sos special'
  },
  {
    name: 'Grătar mixt',
    category: 'Grătar',
    image: cdnUrl('/images/upkDONhpHXbWaIu7d75TDsqWXE.png'),
    description: 'Vită, pui, kafta, cotlet de miel'
  },
  {
    name: 'Künefe la shish',
    category: 'Deserturi',
    image: cdnUrl('/images/QYJ0UQkrKsXWblBBY8VuJpEk.png'),
    description: 'Fidea caramelizată, brânză dulce, miere, fistic'
  },
  {
    name: 'Tabbouleh',
    category: 'Salate',
    image: cdnUrl('/images/bHeryJnDuLQMzlNKlClRNywCOwU.png'),
    description: 'Pătrunjel, ceapă, bulgur, lămâie, ulei de măsline'
  }
];


const Home = () => {
  const statsRef = useRef(null);
  const hasAnimated = useRef(false);
  const horizontalRef = useRef(null);
  const horizontalSectionRef = useRef(null);
  const indicatorsRef = useRef([]);

  useEffect(() => {
    const cleanupReveal = initRevealOnScroll();

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

    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.2 }
    );

    const currentStatsRef = statsRef.current;
    const staggerElements = document.querySelectorAll('.fade-up-stagger');

    if (currentStatsRef) {
      statsObserver.observe(currentStatsRef);
    }

    staggerElements.forEach((el) => staggerObserver.observe(el));

    let rafId;
    const handleGalleryScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const section = horizontalSectionRef.current;
        const track = horizontalRef.current;
        if (!section || !track) return;

        const rect = section.getBoundingClientRect();
        const sectionHeight = section.offsetHeight;
        const viewportHeight = window.innerHeight;
        const scrollableDistance = sectionHeight - viewportHeight;

        const progress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));

        const maxTranslate = track.scrollWidth - window.innerWidth;
        track.style.transform = `translateX(-${progress * maxTranslate}px)`;

        const itemWidth = 500;
        const newActive = Math.min(
          Math.round((progress * maxTranslate) / (itemWidth + 24)),
          signatureDishes.length - 1
        );
        indicatorsRef.current.forEach((el, i) => {
          if (!el) return;
          if (i === newActive) {
            el.style.width = '3rem';
            el.className = 'h-px transition-all duration-300 bg-gold-400';
          } else {
            el.style.width = '2rem';
            el.className = 'h-px transition-all duration-300 bg-stone-700';
          }
        });
      });
    };

    window.addEventListener('scroll', handleGalleryScroll, { passive: true });

    return () => {
      cleanupReveal();
      if (currentStatsRef) {
        statsObserver.unobserve(currentStatsRef);
      }
      staggerElements.forEach((el) => staggerObserver.unobserve(el));
      window.removeEventListener('scroll', handleGalleryScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="min-h-screen atmospheric-bg">
      <div className="film-grain" />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: Cinematic Video Hero
      ═══════════════════════════════════════════════════════════════════ */}
      <ScrollVideo
        enableLetterbox={true}
        letterboxHeight={12}
        overlayContent={
          <div className="text-center px-4 z-10">
            <p className="text-stone-400 text-xs tracking-[0.4em] uppercase mb-8 opacity-70">
              Award-Winning Lebanese Cuisine
            </p>
            <h1 className="mb-6">
              <img src={cdnUrl('/zaitoone-logo.svg')} alt="Zaitoone" className="h-24 md:h-32 mx-auto" style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(32%) saturate(754%) hue-rotate(357deg) brightness(92%) contrast(88%)' }} />
            </h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent mx-auto mb-6" />
            <p className="font-serif text-xl md:text-2xl text-white/90 tracking-wide">
              Bucharest
            </p>
          </div>
        }
        scrollMultiplier={1}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: Welcome Manifesto
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-7 reveal">
              <p className="font-script text-gold-400 text-3xl md:text-4xl mb-6">
                Povestea noastră
              </p>
              <h2 className="font-serif text-editorial-lg text-white leading-none">
                Rădăcini
                <br />
                <span className="text-gold-400">libaneze,</span>
                <br />
                eleganță
                <br />
                contemporană
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-24 reveal">
              <div className="line-draw mb-8" />
              <p className="text-stone-400 text-lg leading-relaxed mb-6">
                Din 2014 pe Bulevardul Nicolae Caramfil, aproape de lacul Floreasca.
                Rețete de familie, mezze și grătar pe jar, ospitalitate autentică libaneză
                în inima Bucureștiului.
              </p>
              <p className="text-stone-500 text-base leading-relaxed mb-8">
                Fiecare ingredient spune o poveste. Fiecare masă este o călătorie
                spre țărmurile însorite ale Mediteranei.
              </p>
              <Link
                to="/about"
                className="gold-underline text-gold-400 text-sm tracking-widest uppercase"
              >
                Descoperă povestea noastră
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: Photo Scatter Showcase
      ═══════════════════════════════════════════════════════════════════ */}
      <ScrollPhotoScatter
        enableLetterbox={true}
        letterboxHeight={10}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4: Signature Dishes Showcase
      ═══════════════════════════════════════════════════════════════════ */}
      <div ref={horizontalSectionRef} className="relative" style={{ height: '300vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 w-full reveal">
            <div className="flex justify-between items-end">
              <div>
                <p className="font-script text-gold-400 text-2xl mb-3">Signature</p>
                <h2 className="font-serif text-3xl md:text-4xl text-white">
                  Curated Selections
                </h2>
              </div>
              <Link
                to="/menu"
                className="hidden md:flex items-center gap-2 text-gold-400 text-sm tracking-widest uppercase gold-underline"
              >
                Full Menu
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div
            ref={horizontalRef}
            className="flex gap-6 px-6 lg:px-8 pb-8 will-change-transform"
            style={{ transform: 'translateX(0px)' }}
          >
            {signatureDishes.map((dish) => (
              <div
                key={dish.name}
                className="dish-card group flex-shrink-0"
                style={{ width: '70vw', maxWidth: '500px' }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-900 mb-6">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="dish-card-image w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-gold-400/80 text-xs tracking-[0.2em] uppercase">
                      {dish.category}
                    </span>
                  </div>
                </div>
                <div className="px-1">
                  <h3 className="font-serif text-2xl text-white mb-2 group-hover:text-gold-400 transition-colors">
                    {dish.name}
                  </h3>
                  <p className="text-stone-500 text-sm">
                    {dish.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {signatureDishes.map((_, index) => (
              <div
                key={index}
                ref={el => indicatorsRef.current[index] = el}
                className={`h-px transition-all duration-300 ${
                  index === 0 ? 'bg-gold-400' : 'bg-stone-700'
                }`}
                style={{ width: index === 0 ? '3rem' : '2rem' }}
              />
            ))}
          </div>

          <div className="md:hidden text-center mt-6">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-gold-400 text-sm tracking-widest uppercase"
            >
              View Full Menu
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>


      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5: Experience / Stats
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80"
            alt="Restaurant atmosphere"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/95 to-stone-950" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="reveal">
              <p className="font-script text-gold-400 text-3xl mb-6">
                Experiența
              </p>
              <h2 className="font-serif text-editorial-lg text-white mb-8">
                Un deceniu de
                <br />
                <span className="text-gold-400">excelență</span>
              </h2>
              <p className="text-stone-400 text-lg leading-relaxed">
                Triplă câștigătoare a Premiilor Horeca, recunoscută pentru excelență culinară
                și ospitalitate autentică mediteraneană.
              </p>
            </div>

            <div ref={statsRef} className="fade-up-stagger">
              <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                <div className="text-center lg:text-left">
                  <div className="font-serif text-5xl md:text-6xl text-white mb-2">
                    <span className="counter" data-target="3">0</span>
                    <span className="text-gold-400">×</span>
                  </div>
                  <p className="text-stone-500 text-xs tracking-[0.2em] uppercase">Premii Horeca</p>
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-serif text-5xl md:text-6xl text-white mb-2">
                    <span className="counter" data-target="10">0</span>
                    <span className="text-gold-400">+</span>
                  </div>
                  <p className="text-stone-500 text-xs tracking-[0.2em] uppercase">Ani de excelență</p>
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-serif text-5xl md:text-6xl text-white mb-2">
                    <span className="counter" data-target="150">0</span>
                    <span className="text-gold-400">+</span>
                  </div>
                  <p className="text-stone-500 text-xs tracking-[0.2em] uppercase">Preparate autentice</p>
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-serif text-5xl md:text-6xl text-white mb-2">
                    <span className="counter" data-target="100">0</span>
                    <span className="text-gold-400">%</span>
                  </div>
                  <p className="text-stone-500 text-xs tracking-[0.2em] uppercase">Halal Certified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6: Values / Philosophy
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <p className="font-script text-gold-400 text-2xl mb-3">Filosofie</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white">
              Principiile noastre
            </h2>
          </div>
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
            <div className="value-card reveal text-center md:text-left">
              <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">01</p>
              <h3 className="font-serif text-2xl text-white mb-4">Autenticitate</h3>
              <p className="text-stone-500 leading-relaxed">
                Rețete tradiționale libaneze transmise din generație în generație,
                preparate cu aceeași dedicare ca și strămoșii noștri.
              </p>
            </div>
            <div className="value-card reveal text-center md:text-left">
              <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">02</p>
              <h3 className="font-serif text-2xl text-white mb-4">Calitate</h3>
              <p className="text-stone-500 leading-relaxed">
                Ingrediente premium selectate cu grijă. 100% certificat Halal,
                asigurând cele mai înalte standarde în fiecare preparat.
              </p>
            </div>
            <div className="value-card reveal text-center md:text-left">
              <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">03</p>
              <h3 className="font-serif text-2xl text-white mb-4">Ospitalitate</h3>
              <p className="text-stone-500 leading-relaxed">
                Căldura mediteraneană întâlnește serviciul rafinat. Fiecare oaspete
                este tratat ca un membru al familiei, fiecare vizită o sărbătoare.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7: Catering Promo
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={cdnUrl('/catering/images/catering-11.jpg')}
            alt="Catering Zaitoone"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-stone-950/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <p className="font-script text-gold-400 text-3xl mb-4">Evenimente Speciale</p>
              <h2 className="font-serif text-5xl md:text-6xl text-white leading-none mb-6">
                Catering
                <br />
                <span className="text-gold-400">Zaitoone</span>
              </h2>
              <p className="text-stone-400 text-lg leading-relaxed mb-4">
                Nunți, aniversări, corporate, gale — aducem bucătăria libaneză
                direct la evenimentul tău, oriunde în București.
              </p>
              <p className="text-stone-500 text-base leading-relaxed mb-10">
                Meniuri personalizate, ingrediente premium, prezentare impecabilă.
                Pentru orice număr de invitați.
              </p>
              <Link
                to="/catering"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gold-500 text-stone-950 font-serif text-lg tracking-wide hover:bg-gold-400 transition-colors duration-300"
              >
                Solicită ofertă
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="reveal hidden lg:block">
              <div className="relative h-[480px]">
                <div
                  className="absolute overflow-hidden rounded-lg shadow-2xl"
                  style={{ width: '220px', top: '30px', left: '0px', transform: 'rotate(-3deg)' }}
                >
                  <img src={cdnUrl('/catering/images/catering-03.jpg')} alt="" className="w-full object-cover" />
                </div>
                <div
                  className="absolute overflow-hidden rounded-lg shadow-2xl"
                  style={{ width: '260px', top: '0px', left: '140px', transform: 'rotate(1deg)', zIndex: 2 }}
                >
                  <img src={cdnUrl('/catering/images/catering-07.jpg')} alt="" className="w-full object-cover" />
                </div>
                <div
                  className="absolute overflow-hidden rounded-lg shadow-2xl"
                  style={{ width: '220px', top: '80px', left: '300px', transform: 'rotate(3.5deg)', zIndex: 3 }}
                >
                  <img src={cdnUrl('/catering/images/catering-13.jpg')} alt="" className="w-full object-cover" />
                </div>
                <div
                  className="absolute overflow-hidden rounded-lg shadow-xl"
                  style={{ width: '160px', bottom: '20px', left: '60px', transform: 'rotate(-1.5deg)', zIndex: 4 }}
                >
                  <img src={cdnUrl('/catering/images/catering-05.jpg')} alt="" className="w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 8: Reservation CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(212, 158, 61, 0.1) 2px,
                rgba(212, 158, 61, 0.1) 4px
              )`
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center reveal">
          <p className="font-script text-gold-400 text-3xl mb-6">
            Alătură-te
          </p>
          <h2 className="font-serif text-editorial-lg text-white mb-8">
            Rezervă-ți
            <br />
            <span className="text-gold-400">experiența</span>
          </h2>
          <p className="text-stone-400 text-lg max-w-xl mx-auto mb-12">
            Pornește într-o călătorie culinară prin Liban.
            Masa ta te așteaptă.
          </p>
          <Link
            to="/reservations"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gold-500 text-stone-950 font-serif text-lg tracking-wide hover:bg-gold-400 transition-colors duration-300"
          >
            Fă o rezervare
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="mt-16 pt-8 border-t border-white/5">
            <p className="text-stone-600 text-sm tracking-wider">
              Sau sună-ne la{' '}
              <a href="tel:+40737299900" className="text-stone-400 hover:text-gold-400 transition-colors">
                +40 737 299 900
              </a>
              {' '}/{' '}
              <a href="tel:+40376203741" className="text-stone-400 hover:text-gold-400 transition-colors">
                +40 (376) 203 741
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
