'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';

export default function Navbar({ settings = {} }: { settings?: Record<string, any> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setScrollY(scrolled);
      setIsScrolled(scrolled > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/85 backdrop-blur-xl shadow-soft border-b border-secondary-100/50' 
          : 'bg-gradient-to-b from-white/10 to-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      variants={navVariants}
    >
      <div className="container">
        <div className="flex justify-between items-center h-20 px-4 sm:px-6 lg:px-0">
          {/* Logo with hover effect */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
            <Link href="/" className="relative">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.site_title || 'ZTech Grup'} className="h-10" />
              ) : (
                <span className="text-2xl font-bold gradient-text relative px-2 py-1 rounded-lg">
                  {settings.site_title || 'ZTech Grup'}
                </span>
              )}
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {links.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  className="px-4 py-2 text-secondary-700 hover:text-primary-600 font-medium transition-all duration-300 relative group rounded-lg hover:bg-secondary-50"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-4 w-0 h-1 bg-gradient-to-r from-primary-600 to-accent-600 group-hover:w-[calc(100%-2rem)] rounded-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="hidden md:block"
            >
              <Link 
                href="/contact" 
                className="btn-primary group inline-flex items-center px-6 py-3 rounded-2xl text-white font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {settings.navbar_cta_text || 'Get Quote'}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="lg:hidden p-2 rounded-xl hover:bg-secondary-100 transition-colors duration-300 active:scale-95"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6 text-secondary-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6 text-secondary-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-secondary-100/50 overflow-hidden"
          >
            <div className="container px-4 sm:px-6 py-6 space-y-3">
              {links.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20, y: -5 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    className="block py-3 px-4 text-secondary-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 rounded-xl font-medium transition-all duration-300 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="pt-4 border-t border-secondary-200 mt-4"
              >
                <Link 
                  href="/contact" 
                  className="btn-primary w-full text-center inline-flex items-center justify-center group px-6 py-3 rounded-2xl text-white font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {settings.navbar_cta_text || 'Get Quote'}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
