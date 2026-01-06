import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative mt-32 glass-card border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-t from-gold-500/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold-500/30">
                <img src="/logo.png" alt="Zaitoone" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-script text-2xl text-gold-400">Zaitoone</h3>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              Authentic Lebanese cuisine in the heart of Bucharest. Award-winning restaurant serving 100% Halal food.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-stone-400 hover:text-gold-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-stone-400 hover:text-gold-400 transition-colors text-sm">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-stone-400 hover:text-gold-400 transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/reservations" className="text-stone-400 hover:text-gold-400 transition-colors text-sm">
                  Reservations
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <span className="text-stone-400">
                  Str. Nicolae G. Caramfil 2<br />Bucharest, Romania
                </span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a href="tel:+40737299900" className="text-stone-400 hover:text-gold-400 transition-colors">
                  +40 737 299 900
                </a>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <Clock className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <span className="text-stone-400">
                  Daily<br />12:00 PM - 11:00 PM
                </span>
              </li>
            </ul>
          </div>

          {/* Social & Awards */}
          <div>
            <h4 className="font-serif text-lg text-white mb-4">Follow Us</h4>
            <a
              href="https://www.instagram.com/zaitoone.ro/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-stone-400 hover:text-gold-400 transition-colors text-sm mb-6"
            >
              <Instagram className="w-5 h-5" />
              <span>@zaitoone.ro</span>
            </a>
            <div className="space-y-2">
              <p className="text-xs text-gold-400 font-medium uppercase tracking-wider">Awards</p>
              <p className="text-stone-400 text-sm">Horeca Awards Winner</p>
              <p className="text-stone-500 text-xs">2022, 2023, 2024</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-stone-500 text-sm">
            &copy; 2024 Zaitoone Restaurant. All rights reserved.
          </p>
          <p className="text-stone-500 text-sm">
            100% Halal Certified • Premium Lebanese Cuisine
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
