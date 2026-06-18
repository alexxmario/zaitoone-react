import { useRef, useEffect, useState } from 'react';
import { cdnUrl } from '../utils/cdn';

const menuPhotos = [
  {
    src: cdnUrl('/images/Bd1gJ5mfPkI8xvGcg87VfxbL0M.png'),
    alt: 'Creveți Zaitoone',
  },
  {
    src: cdnUrl('/images/um8WPEW3IJgQ6weNmAI8LkTJTTU.png'),
    alt: 'Falafel',
  },
  {
    src: cdnUrl('/images/9wHbKYDkXhVshqL638OVzkGL5i4.png'),
    alt: 'Shawarma de vită',
  },
  {
    src: cdnUrl('/images/upkDONhpHXbWaIu7d75TDsqWXE.png'),
    alt: 'Grătar mixt',
  },
  {
    src: cdnUrl('/images/QYJ0UQkrKsXWblBBY8VuJpEk.png'),
    alt: 'Künefe',
  },
  {
    src: cdnUrl('/images/bHeryJnDuLQMzlNKlClRNywCOwU.png'),
    alt: 'Tabbouleh',
  },
  {
    src: cdnUrl('/images/tvGaal8qmReWLV8sr7X7RbGP9G0.jpg'),
    alt: 'Baba Ganoush',
  },
];

// Random scattered positions for each photo - spread even wider
const photoConfigs = [
  { x: -120, y: -30, rotate: -15, scale: 0.9, z: 1 },
  { x: -20, y: -50, rotate: 10, scale: 1.1, z: 3 },
  { x: -80, y: 40, rotate: -8, scale: 0.85, z: 2 },
  { x: 25, y: 25, rotate: 18, scale: 0.95, z: 4 },
  { x: -50, y: -10, rotate: -4, scale: 1.15, z: 5 },
  { x: -10, y: 45, rotate: 12, scale: 0.8, z: 0 },
  { x: -100, y: 5, rotate: -20, scale: 0.75, z: 1 },
];

const lerp = (start, end, progress) => start + (end - start) * progress;

const ScrollPhotoScatter = ({
  enableLetterbox = true,
  letterboxHeight = 10,
}) => {
  const containerRef = useRef(null);
  const topBarRef = useRef(null);
  const bottomBarRef = useRef(null);
  const textRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const photosRef = useRef([]);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId;

    const update = () => {
      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      const progress = Math.max(0, Math.min(1,
        (scrollY - containerTop) / (containerTop + containerHeight - viewportHeight - containerTop)
      ));

      // Text visibility
      const shouldShow = progress > 0.4;
      setTextVisible(prev => prev !== shouldShow ? shouldShow : prev);

      // Letterbox effect
      if (enableLetterbox && topBarRef.current && bottomBarRef.current) {
        const h = Math.max(0, letterboxHeight * (1 - progress * 0.8));
        topBarRef.current.style.height = `${h}vh`;
        bottomBarRef.current.style.height = `${h}vh`;
      }

      // Scroll indicator
      if (scrollIndicatorRef.current) {
        scrollIndicatorRef.current.style.opacity = progress > 0.8 ? '0' : '0.6';
      }

      // Animate photos
      photosRef.current.forEach((photo, index) => {
        if (!photo) return;
        const config = photoConfigs[index];

        // As scroll progresses, photos spread out more and rotate more
        const spreadFactor = lerp(0.6, 1.3, progress);
        const rotateExtra = lerp(0, config.rotate * 0.5, progress);
        const scaleAdjust = lerp(0.8, 1, progress);

        const x = config.x * spreadFactor;
        const y = config.y * spreadFactor;
        const rotate = config.rotate + rotateExtra;
        const scale = config.scale * scaleAdjust;

        photo.style.transform = `translate(${x}%, ${y}%) rotate(${rotate}deg) scale(${scale})`;
        photo.style.opacity = lerp(0.7, 1, progress);
      });
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', update);
      cancelAnimationFrame(rafId);
    };
  }, [enableLetterbox, letterboxHeight]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: '200vh' }}
    >
      {enableLetterbox && (
        <>
          <div ref={topBarRef} className="letterbox-bar letterbox-top" style={{ height: `${letterboxHeight}vh` }} />
          <div ref={bottomBarRef} className="letterbox-bar letterbox-bottom" style={{ height: `${letterboxHeight}vh` }} />
        </>
      )}

      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 50% 50%, rgba(212, 158, 61, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 30% 70%, rgba(212, 158, 61, 0.05) 0%, transparent 40%),
              #0a0908
            `
          }}
        />

        {/* Scattered Photos */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[1100px] h-[700px] max-w-[98vw] -translate-x-[8%]">
            {menuPhotos.map((photo, index) => {
              const config = photoConfigs[index];
              return (
                <div
                  key={index}
                  ref={el => photosRef.current[index] = el}
                  className="absolute left-1/2 top-1/2 w-36 md:w-48 aspect-[4/5] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
                  style={{
                    zIndex: config.z,
                    transform: `translate(${config.x * 0.6}%, ${config.y * 0.6}%) rotate(${config.rotate}deg) scale(${config.scale * 0.8})`,
                    opacity: 0.7,
                  }}
                >
                  {/* Photo frame effect */}
                  <div className="w-full h-full bg-stone-100 p-2 shadow-2xl shadow-black/50">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {/* Subtle polaroid bottom */}
                  <div className="absolute -bottom-4 left-0 right-0 h-6 bg-stone-100 rounded-b-sm" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10, 9, 8, 0.6) 100%)'
          }}
        />

        {/* Text Content */}
        <div
          ref={textRef}
          className={`absolute inset-0 flex items-center justify-end px-8 lg:px-16 transition-all duration-700 ${
            textVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
        >
          <div className="max-w-md text-right">
            <p className="font-script text-gold-400 text-3xl mb-4">Descoperă</p>
            <h2 className="font-serif text-4xl lg:text-5xl text-white mb-6 leading-tight">
              Preparate<br /><span className="text-gold-400">Autentice</span>
            </h2>
            <p className="text-stone-400 text-lg leading-relaxed mb-8">
              Fiecare farfurie spune o poveste de tradiție, pasiune
              și măiestrie culinară libaneză.
            </p>
            <div className="inline-block">
              <span className="gold-underline text-gold-400 text-sm tracking-widest uppercase cursor-pointer">
                Explorează Meniul
              </span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
          style={{ opacity: 0.6 }}
        >
          <p className="text-stone-500 text-xs tracking-[0.3em] uppercase mb-3">Scroll to explore</p>
          <div className="w-px h-8 bg-gradient-to-b from-gold-500/40 to-transparent mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default ScrollPhotoScatter;
