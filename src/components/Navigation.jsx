import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Phone } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/about', label: 'About' },
    { path: '/reservations', label: 'Reservations' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold-500/30 group-hover:border-gold-500/60 transition-all duration-300">
              <img src="/logo.png" alt="Zaitoone" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-script text-3xl text-gold-400 group-hover:text-gold-300 transition-colors">
                Zaitoone
              </h1>
              <p className="text-xs text-stone-400 tracking-widest uppercase">Lebanese Cuisine</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wider uppercase transition-all duration-300 relative group ${
                  isActive(link.path)
                    ? 'text-gold-400'
                    : 'text-stone-300 hover:text-gold-400'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gold-500 transition-all duration-300 ${
                    isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Contact Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://www.instagram.com/zaitoone.ro/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-gold-400 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="tel:+40737299900"
              className="text-stone-400 hover:text-gold-400 transition-colors"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-stone-300 hover:text-gold-400 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-scale-up">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium tracking-wider uppercase transition-colors ${
                    isActive(link.path)
                      ? 'text-gold-400'
                      : 'text-stone-300 hover:text-gold-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
                <a
                  href="https://www.instagram.com/zaitoone.ro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-gold-400 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="tel:+40737299900"
                  className="text-stone-400 hover:text-gold-400 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
