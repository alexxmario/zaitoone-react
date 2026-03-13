import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Instagram, Sparkles, Award, MapPinned } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { initRevealOnScroll, initParallaxScroll } from '../utils/animations';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_68mdslu';
const EMAILJS_TEMPLATE_ID = 'template_m5szl02';
const EMAILJS_CUSTOMER_TEMPLATE_ID = 'template_8qxevqa';
const EMAILJS_PUBLIC_KEY = 'tj_YvQ_mvZ3eN-48Y';

const Reservations = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

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
    setFormStatus('submitting');
    setErrorMessage('');

    try {
      // Send email to restaurant
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          guests: formData.guests,
          message: formData.message || 'Fără cereri speciale',
          to_email: 'office@zaitoone.ro',
        },
        EMAILJS_PUBLIC_KEY
      );

      // Send confirmation email to customer
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_CUSTOMER_TEMPLATE_ID,
        {
          to_name: formData.name,
          to_email: formData.email,
          date: formData.date,
          time: formData.time,
          guests: formData.guests,
        },
        EMAILJS_PUBLIC_KEY
      );

      setFormStatus('success');
      setTimeout(() => {
        setFormStatus('idle');
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          guests: '',
          message: '',
        });
      }, 3000);
    } catch (error) {
      console.error('EmailJS error:', error);
      setFormStatus('error');
      setErrorMessage('Nu s-a putut trimite rezervarea. Vă rugăm să ne sunați sau să încercați din nou.');
      setTimeout(() => {
        setFormStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }}>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/60 to-stone-950" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-20">
          <div className="reveal">
            <span className="text-gold-500 font-script text-3xl md:text-4xl opacity-90 mb-4 block animate-float">
              Rezervă o Masă
            </span>
          </div>
          <div className="reveal" style={{ transitionDelay: '0.1s' }}>
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 gradient-text">
              Rezervări
            </h1>
          </div>
          <div className="reveal" style={{ transitionDelay: '0.2s' }}>
            <p className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Rezervă-ți masa pentru o experiență culinară libaneză de neuitat
            </p>
          </div>
        </div>
      </section>

      {/* Contact & Form Section */}
      <section className="relative py-32 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-12">
              <div className="reveal">
                <h2 className="font-serif text-4xl text-white mb-6">Contactează-ne</h2>
                <p className="text-stone-400 text-lg leading-relaxed">
                  Ne-ar face plăcere să te găzduim la Zaitoone. Rezervă-ți masa sau contactează-ne pentru orice solicitare specială.
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                <div className="reveal glass-card glow-border p-6 rounded-xl hover:bg-white/[0.05] transition-all group">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2 text-lg">Adresă</h4>
                      <p className="text-stone-400">
                        Str. Nicolae G. Caramfil 2<br />
                        Zona Lacul Herăstrău<br />
                        București, România
                      </p>
                    </div>
                  </div>
                </div>

                <div className="reveal glass-card glow-border p-6 rounded-xl hover:bg-white/[0.05] transition-all group">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Phone className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2 text-lg">Telefon</h4>
                      <a
                        href="tel:+40737299900"
                        className="text-stone-400 hover:text-gold-400 transition-colors text-lg"
                      >
                        +40 737 299 900
                      </a>
                      <br />
                      <a
                        href="tel:+40376203741"
                        className="text-stone-400 hover:text-gold-400 transition-colors text-lg"
                      >
                        +40 (376) 203 741
                      </a>
                      <p className="text-stone-500 text-sm mt-1">
                        office@zaitoone.ro
                      </p>
                    </div>
                  </div>
                </div>

                <div className="reveal glass-card glow-border p-6 rounded-xl hover:bg-white/[0.05] transition-all group">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Clock className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2 text-lg">Program</h4>
                      <p className="text-stone-400">
                        Zilnic: 12:00 - 00:00
                      </p>
                    </div>
                  </div>
                </div>

                <div className="reveal glass-card glow-border p-6 rounded-xl hover:bg-white/[0.05] transition-all group">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Instagram className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2 text-lg">Social Media</h4>
                      <a
                        href="https://www.instagram.com/zaitoone.ro/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-400 hover:text-gold-400 transition-colors"
                      >
                        @zaitoone.ro
                      </a>
                      <p className="text-stone-500 text-sm mt-1">Urmărește-ne pentru noutăți</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="reveal grid grid-cols-3 gap-4">
                <div className="glass-card p-4 rounded-xl text-center">
                  <Sparkles className="w-6 h-6 text-gold-400 mx-auto mb-2" />
                  <p className="text-stone-400 text-xs">100% Halal</p>
                </div>
                <div className="glass-card p-4 rounded-xl text-center">
                  <Award className="w-6 h-6 text-gold-400 mx-auto mb-2" />
                  <p className="text-stone-400 text-xs">Premiat</p>
                </div>
                <div className="glass-card p-4 rounded-xl text-center">
                  <MapPinned className="w-6 h-6 text-gold-400 mx-auto mb-2" />
                  <p className="text-stone-400 text-xs">Locație Exclusivă</p>
                </div>
              </div>
            </div>

            {/* Reservation Form */}
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
                <h3 className="font-serif text-3xl text-white mb-6">Rezervă-ți Masa</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-stone-400 mb-2 text-sm">
                      Nume Complet *
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
                      placeholder="Ion Popescu"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
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
                        placeholder="ion@exemplu.ro"
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

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="date" className="block text-stone-400 mb-2 text-sm">
                        Data *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          required
                          style={{ background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}
                          className={`w-full px-4 py-3 border border-white/10 rounded-lg focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all ${formData.date ? 'text-white' : 'text-transparent'}`}
                        />
                        {!formData.date && (
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none">
                            Selectează data
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="time" className="block text-stone-400 mb-2 text-sm">
                        Ora *
                      </label>
                      <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        style={{ background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}
                        className="w-full px-4 py-3 border border-white/10 rounded-lg text-white focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                      >
                        <option value="" disabled>Selectează ora</option>
                        <option value="12:00">12:00</option>
                        <option value="12:15">12:15</option>
                        <option value="12:30">12:30</option>
                        <option value="12:45">12:45</option>
                        <option value="13:00">13:00</option>
                        <option value="13:15">13:15</option>
                        <option value="13:30">13:30</option>
                        <option value="13:45">13:45</option>
                        <option value="14:00">14:00</option>
                        <option value="14:15">14:15</option>
                        <option value="14:30">14:30</option>
                        <option value="14:45">14:45</option>
                        <option value="15:00">15:00</option>
                        <option value="15:15">15:15</option>
                        <option value="15:30">15:30</option>
                        <option value="15:45">15:45</option>
                        <option value="16:00">16:00</option>
                        <option value="16:15">16:15</option>
                        <option value="16:30">16:30</option>
                        <option value="16:45">16:45</option>
                        <option value="17:00">17:00</option>
                        <option value="17:15">17:15</option>
                        <option value="17:30">17:30</option>
                        <option value="17:45">17:45</option>
                        <option value="18:00">18:00</option>
                        <option value="18:15">18:15</option>
                        <option value="18:30">18:30</option>
                        <option value="18:45">18:45</option>
                        <option value="19:00">19:00</option>
                        <option value="19:15">19:15</option>
                        <option value="19:30">19:30</option>
                        <option value="19:45">19:45</option>
                        <option value="20:00">20:00</option>
                        <option value="20:15">20:15</option>
                        <option value="20:30">20:30</option>
                        <option value="20:45">20:45</option>
                        <option value="21:00">21:00</option>
                        <option value="21:15">21:15</option>
                        <option value="21:30">21:30</option>
                        <option value="21:45">21:45</option>
                        <option value="22:00">22:00</option>
                        <option value="22:15">22:15</option>
                        <option value="22:30">22:30</option>
                        <option value="22:45">22:45</option>
                        <option value="23:00">23:00</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="guests" className="block text-stone-400 mb-2 text-sm">
                      Număr de Persoane *
                    </label>
                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      required
                      style={{ background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}
                      className="w-full px-4 py-3 border border-white/10 rounded-lg text-white focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                    >
                      <option value="">Selectează numărul de persoane</option>
                      <option value="1">1 Persoană</option>
                      <option value="2">2 Persoane</option>
                      <option value="3">3 Persoane</option>
                      <option value="4">4 Persoane</option>
                      <option value="5">5 Persoane</option>
                      <option value="6">6 Persoane</option>
                      <option value="7">7 Persoane</option>
                      <option value="8">8 Persoane</option>
                      <option value="9">9 Persoane</option>
                      <option value="10">10 Persoane</option>
                      <option value="11">11 Persoane</option>
                      <option value="12">12 Persoane</option>
                      <option value="13">13 Persoane</option>
                      <option value="14">14 Persoane</option>
                      <option value="15">15 Persoane</option>
                      <option value="16">16 Persoane</option>
                      <option value="17">17 Persoane</option>
                      <option value="18">18 Persoane</option>
                      <option value="19">19 Persoane</option>
                      <option value="20">20 Persoane</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-stone-400 mb-2 text-sm">
                      Cereri Speciale (Opțional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      style={{ background: 'rgba(255,255,255,0.05)', cursor: 'text' }}
                      className="w-full px-4 py-3 border border-white/10 rounded-lg text-white placeholder-stone-500 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all resize-none"
                      placeholder="Restricții alimentare sau ocazii speciale?"
                    />
                  </div>

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
                    {formStatus === 'idle' && 'Trimite Cererea de Rezervare'}
                    {formStatus === 'submitting' && 'Se trimite...'}
                    {formStatus === 'success' && '✓ Cerere Trimisă!'}
                    {formStatus === 'error' && '✕ Eroare la Trimitere'}
                  </button>

                  {errorMessage && (
                    <p className="text-red-400 text-sm text-center">{errorMessage}</p>
                  )}

                  <p className="text-stone-500 text-sm text-center">
                    Vom confirma rezervarea ta prin telefon sau email în maxim 24 de ore
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reservations;
