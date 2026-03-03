import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Instagram, Sparkles, Award, MapPinned } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { initRevealOnScroll, initParallaxScroll } from '../utils/animations';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_68mdslu';
const EMAILJS_TEMPLATE_ID = 'template_m5szl02';
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
          to_email: 'alexionescu870@gmail.com',
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
      setErrorMessage('Failed to send reservation. Please try calling us or try again later.');
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
        <div className="parallax-bg absolute inset-0 z-0">
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
              Book a Table
            </span>
          </div>
          <div className="reveal" style={{ transitionDelay: '0.1s' }}>
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 gradient-text">
              Reservations
            </h1>
          </div>
          <div className="reveal" style={{ transitionDelay: '0.2s' }}>
            <p className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Reserve your table for an unforgettable Lebanese dining experience
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
                <h2 className="font-serif text-4xl text-white mb-6">Get in Touch</h2>
                <p className="text-stone-400 text-lg leading-relaxed">
                  We'd love to host you at Zaitoone. Reserve your table or contact us for any
                  special requests.
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
                      <h4 className="text-white font-semibold mb-2 text-lg">Address</h4>
                      <p className="text-stone-400">
                        Str. Nicolae G. Caramfil 2<br />
                        Lake Herastrau Area<br />
                        Bucharest, Romania
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
                      <h4 className="text-white font-semibold mb-2 text-lg">Phone</h4>
                      <a
                        href="tel:+40737299900"
                        className="text-stone-400 hover:text-gold-400 transition-colors text-lg"
                      >
                        +40 737 299 900
                      </a>
                      <br />
                      <a
                        href="tel:+40731000000"
                        className="text-stone-400 hover:text-gold-400 transition-colors text-lg"
                      >
                        +40 731 000 000
                      </a>
                      <p className="text-stone-500 text-sm mt-1">
                        rezervari@zaitoone.ro
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
                      <h4 className="text-white font-semibold mb-2 text-lg">Opening Hours</h4>
                      <p className="text-stone-400">
                        Luni-Joi: 12:00 - 23:00<br />
                        Vineri-Sâmbătă: 12:00 - 00:00<br />
                        Duminică: 12:00 - 22:00
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
                      <p className="text-stone-500 text-sm mt-1">Follow us for updates</p>
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
                  <p className="text-stone-400 text-xs">Award-Winning</p>
                </div>
                <div className="glass-card p-4 rounded-xl text-center">
                  <MapPinned className="w-6 h-6 text-gold-400 mx-auto mb-2" />
                  <p className="text-stone-400 text-xs">Exclusive Location</p>
                </div>
              </div>
            </div>

            {/* Reservation Form */}
            <div className="reveal relative z-20">
              <div className="glass-card glow-border p-8 rounded-2xl relative">
                <h3 className="font-serif text-3xl text-white mb-6">Reserve Your Table</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-stone-400 mb-2 text-sm">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-stone-500 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                      placeholder="John Doe"
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
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-stone-500 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-stone-400 mb-2 text-sm">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-stone-500 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                        placeholder="+40 xxx xxx xxx"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="date" className="block text-stone-400 mb-2 text-sm">
                        Date *
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="time" className="block text-stone-400 mb-2 text-sm">
                        Time *
                      </label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="guests" className="block text-stone-400 mb-2 text-sm">
                      Number of Guests *
                    </label>
                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                    >
                      <option value="">Select number of guests</option>
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5 Guests</option>
                      <option value="6">6 Guests</option>
                      <option value="7+">7+ Guests</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-stone-400 mb-2 text-sm">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-stone-500 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all resize-none"
                      placeholder="Any dietary restrictions or special occasions?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus !== 'idle'}
                    className={`liquid-button w-full py-4 rounded-full font-semibold transition-all duration-300 shadow-lg ${
                      formStatus === 'success'
                        ? 'bg-green-600 hover:bg-green-600'
                        : formStatus === 'error'
                        ? 'bg-red-600 hover:bg-red-600'
                        : 'bg-gold-500 hover:bg-gold-600 hover:shadow-gold-500/50'
                    } ${
                      formStatus === 'submitting' ? 'opacity-70' : ''
                    } text-stone-950`}
                  >
                    {formStatus === 'idle' && 'Submit Reservation Request'}
                    {formStatus === 'submitting' && 'Sending Request...'}
                    {formStatus === 'success' && '✓ Request Sent!'}
                    {formStatus === 'error' && '✕ Failed to Send'}
                  </button>

                  {errorMessage && (
                    <p className="text-red-400 text-sm text-center">{errorMessage}</p>
                  )}

                  <p className="text-stone-500 text-sm text-center">
                    We'll confirm your reservation via phone or email within 24 hours
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
