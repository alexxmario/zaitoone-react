import { useState, useEffect, useRef } from 'react';
import { UtensilsCrossed, Users, Calendar, MessageSquare } from 'lucide-react';
import { cdnUrl } from '../utils/cdn';
import { initRevealOnScroll, initParallaxScroll } from '../utils/animations';
import TurnstileWidget from '../components/TurnstileWidget';

const cateringPhotos = [
  '/catering/images/catering-01.jpg',
  '/catering/images/catering-02.jpg',
  '/catering/images/catering-03.jpg',
  '/catering/images/catering-04.jpg',
  '/catering/images/catering-05.jpg',
  '/catering/images/catering-06.jpg',
  '/catering/images/catering-07.jpg',
  '/catering/images/catering-08.jpg',
  '/catering/images/catering-09.jpg',
  '/catering/images/catering-10.jpg',
  '/catering/images/catering-11.jpg',
  '/catering/images/catering-12.jpg',
  '/catering/images/catering-13.jpg',
  '/catering/images/catering-14.jpg',
  '/catering/images/catering-15.jpg',
  '/catering/images/catering-16.jpg',
  '/catering/images/catering-17.jpg',
];

const Catering = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: '',
    guestsApprox: '',
    date: '',
    preferences: '',
  });

  const [formStatus, setFormStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef(null);

  useEffect(() => {
    const cleanupReveal = initRevealOnScroll();
    const cleanupParallax = initParallaxScroll();

    return () => {
      cleanupReveal();
      cleanupParallax();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!turnstileToken) {
      setFormStatus('error');
      setErrorMessage('Așteaptă finalizarea verificării anti-spam și încearcă din nou.');
      setTimeout(() => {
        setFormStatus('idle');
        setErrorMessage('');
      }, 5000);
      return;
    }

    setFormStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/send-catering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, 'cf-turnstile-response': turnstileToken }),
      });

      if (response.status === 403) throw new Error('Turnstile rejected');
      if (!response.ok) throw new Error('Server error');

      setFormStatus('success');
      setTimeout(() => {
        setFormStatus('idle');
        setFormData({
          name: '',
          phone: '',
          email: '',
          eventType: '',
          guestsApprox: '',
          date: '',
          preferences: '',
        });
      }, 3000);
    } catch (error) {
      console.error('Resend error:', error);
      setFormStatus('error');
      setErrorMessage(
        error.message === 'Turnstile rejected'
          ? 'Verificarea anti-spam a eșuat. Reîncarcă pagina și încearcă din nou.'
          : 'Nu s-a putut trimite cererea. Vă rugăm să ne sunați sau să încercați din nou.'
      );
      setTimeout(() => {
        setFormStatus('idle');
        setErrorMessage('');
      }, 5000);
    } finally {
      // Turnstile tokens are single-use: the one just submitted is spent
      // whether or not the request succeeded, so issue a fresh challenge.
      if (turnstileRef.current) turnstileRef.current.reset();
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }}>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1555244162-803834f70033?w=1920&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/60 to-stone-950" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-20">
          <div className="reveal">
            <span className="text-gold-500 font-script text-3xl md:text-4xl opacity-90 mb-4 block animate-float">
              Catering
            </span>
          </div>
          <div className="reveal" style={{ transitionDelay: '0.1s' }}>
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 gradient-text">
              Catering pentru Evenimente
            </h1>
          </div>
          <div className="reveal" style={{ transitionDelay: '0.2s' }}>
            <p className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Spune-ne despre evenimentul tău și noi vom crea o experiență culinară personalizată
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="relative py-32 overflow-hidden z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Info Cards */}
          <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <div className="glass-card p-5 rounded-xl text-center">
              <UtensilsCrossed className="w-6 h-6 text-gold-400 mx-auto mb-2" />
              <p className="text-stone-400 text-xs">Meniu Personalizat</p>
            </div>
            <div className="glass-card p-5 rounded-xl text-center">
              <Users className="w-6 h-6 text-gold-400 mx-auto mb-2" />
              <p className="text-stone-400 text-xs">Orice Număr de Invitați</p>
            </div>
            <div className="glass-card p-5 rounded-xl text-center">
              <Calendar className="w-6 h-6 text-gold-400 mx-auto mb-2" />
              <p className="text-stone-400 text-xs">Flexibilitate Totală</p>
            </div>
            <div className="glass-card p-5 rounded-xl text-center">
              <MessageSquare className="w-6 h-6 text-gold-400 mx-auto mb-2" />
              <p className="text-stone-400 text-xs">Consultanță Gratuită</p>
            </div>
          </div>

          {/* Form */}
          <div
            className="reveal"
            style={{
              position: 'relative',
              zIndex: 100,
              isolation: 'isolate'
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                padding: '2rem',
                position: 'relative',
                zIndex: 1
              }}
            >
              <h3 className="font-serif text-3xl text-white mb-2">Spune-ne despre evenimentul tău</h3>
              <p className="text-stone-400 mb-8">
                Completează câteva detalii de bază, iar noi te vom contacta pentru a discuta totul în detaliu.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact basics */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-stone-400 mb-2 text-sm">
                      Numele tău *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{ background: 'rgba(255,255,255,0.05)', cursor: 'text' }}
                      className="w-full px-4 py-3 border border-white/10 rounded-lg text-white placeholder-stone-500 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                      placeholder="Cum te numești?"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-stone-400 mb-2 text-sm">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      style={{ background: 'rgba(255,255,255,0.05)', cursor: 'text' }}
                      className="w-full px-4 py-3 border border-white/10 rounded-lg text-white placeholder-stone-500 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                      placeholder="+40 xxx xxx xxx"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-stone-400 mb-2 text-sm">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ background: 'rgba(255,255,255,0.05)', cursor: 'text' }}
                    className="w-full px-4 py-3 border border-white/10 rounded-lg text-white placeholder-stone-500 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                    placeholder="email@exemplu.ro"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="eventType" className="block text-stone-400 mb-2 text-sm">
                      Ce tip de eveniment ai în vedere? *
                    </label>
                    <input
                      type="text"
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      required
                      style={{ background: 'rgba(255,255,255,0.05)', cursor: 'text' }}
                      className="w-full px-4 py-3 border border-white/10 rounded-lg text-white placeholder-stone-500 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                      placeholder="ex: nuntă, aniversare, corporate, privat..."
                    />
                  </div>

                  <div>
                    <label htmlFor="guestsApprox" className="block text-stone-400 mb-2 text-sm">
                      Cam câți invitați? *
                    </label>
                    <input
                      type="text"
                      id="guestsApprox"
                      name="guestsApprox"
                      value={formData.guestsApprox}
                      onChange={handleChange}
                      required
                      style={{ background: 'rgba(255,255,255,0.05)', cursor: 'text' }}
                      className="w-full px-4 py-3 border border-white/10 rounded-lg text-white placeholder-stone-500 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                      placeholder="ex: 50, 100-150, nu sunt sigur..."
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="date" className="block text-stone-400 mb-2 text-sm">
                    Când ai dori să fie? *
                  </label>
                  <input
                    type="text"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    style={{ background: 'rgba(255,255,255,0.05)', cursor: 'text' }}
                    className="w-full px-4 py-3 border border-white/10 rounded-lg text-white placeholder-stone-500 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                    placeholder="ex: luna iunie, 15 iulie, încă nu m-am hotărât..."
                  />
                </div>

                {/* The main open-ended field */}
                <div>
                  <label htmlFor="preferences" className="block text-stone-400 mb-2 text-sm">
                    Spune-ne ce ți-ai dori *
                  </label>
                  <textarea
                    id="preferences"
                    name="preferences"
                    value={formData.preferences}
                    onChange={handleChange}
                    required
                    rows="6"
                    style={{ background: 'rgba(255,255,255,0.05)', cursor: 'text' }}
                    className="w-full px-4 py-3 border border-white/10 rounded-lg text-white placeholder-stone-500 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all resize-none"
                    placeholder="Descrie-ne viziunea ta: ce tip de preparate îți dorești, dacă ai preferințe speciale (vegetarian, halal, fără gluten), atmosfera pe care o vrei, bugetul orientativ, sau orice alt detaliu care ne-ar ajuta să creăm meniul perfect pentru tine..."
                  />
                </div>

                <TurnstileWidget ref={turnstileRef} onToken={setTurnstileToken} />

                <button
                  type="submit"
                  disabled={formStatus !== 'idle'}
                  style={{ cursor: 'pointer' }}
                  className={`w-full py-4 rounded-full font-semibold transition-all duration-300 shadow-lg ${
                    formStatus === 'success'
                      ? 'bg-green-600 hover:bg-green-600'
                      : formStatus === 'error'
                      ? 'bg-red-600 hover:bg-red-600'
                      : 'bg-gold-500 hover:bg-gold-600 hover:shadow-gold-500/50'
                  } ${
                    formStatus === 'submitting' ? 'opacity-70' : ''
                  } text-stone-950`}
                >
                  {formStatus === 'idle' && 'Trimite Cererea'}
                  {formStatus === 'submitting' && 'Se trimite...'}
                  {formStatus === 'success' && '✓ Cerere Trimisă!'}
                  {formStatus === 'error' && '✕ Eroare la Trimitere'}
                </button>

                {errorMessage && (
                  <p className="text-red-400 text-sm text-center">{errorMessage}</p>
                )}

                <p className="text-stone-500 text-sm text-center">
                  Te vom contacta în maxim 24 de ore pentru a discuta detaliile
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Video Showcase */}
      <section className="relative py-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal text-center mb-10">
            <p className="font-script text-gold-400 text-2xl mb-2">Momente Reale</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white">Din culisele unui eveniment</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 reveal">
            <video
              src={cdnUrl('/catering/videos/catering-video-02.mp4')}
              autoPlay
              muted
              loop
              playsInline
              className="w-full rounded-lg object-cover"
              style={{ maxHeight: '520px' }}
            />
            <video
              src={cdnUrl('/catering/videos/catering-video-01.mp4')}
              autoPlay
              muted
              loop
              playsInline
              className="w-full rounded-lg object-cover"
              style={{ maxHeight: '520px' }}
            />
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="relative pb-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal text-center mb-10">
            <p className="font-script text-gold-400 text-2xl mb-2">Galerie</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white">Inspirație pentru evenimentul tău</h2>
          </div>
          <div
            className="reveal"
            style={{ columns: '2', columnGap: '10px' }}
          >
            {cateringPhotos.map((photo, i) => (
              <div
                key={i}
                className="mb-2.5 overflow-hidden rounded-lg"
                style={{ breakInside: 'avoid' }}
              >
                <img
                  src={cdnUrl(photo)}
                  alt={`Catering Zaitoone ${i + 1}`}
                  className="w-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Catering;
