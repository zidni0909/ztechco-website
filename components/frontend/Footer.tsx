'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram, Sparkles } from 'lucide-react';

export default function Footer({ settings = {} }: { settings?: Record<string, any> }) {
  const quickLinks = [
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About Us' },
  ];

  const services = [
    { href: '/services', label: 'Web Development' },
    { href: '/services', label: 'Mobile Apps' },
    { href: '/services', label: 'UI/UX Design' },
    { href: '/services', label: 'Consulting' },
  ];

  const socialLinks = [
    { icon: Github, href: settings.social_github || '#', label: 'Github' },
    { icon: Twitter, href: settings.social_twitter || '#', label: 'Twitter' },
    { icon: Linkedin, href: settings.social_linkedin || '#', label: 'LinkedIn' },
    { icon: Instagram, href: settings.social_instagram || '#', label: 'Instagram' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="relative bg-gradient-to-br from-secondary-900 via-secondary-900 to-secondary-950 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.4'%3e%3ccircle cx='7' cy='7' r='1'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
        }}></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl opacity-15"></div>
      </div>

      <div className="container relative z-10">
        {/* Main Footer Content */}
        <div className="py-20 border-b border-secondary-800/50">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          >
            {/* Company Section */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mb-6"
              >
                <Link href="/" className="text-3xl font-bold gradient-text inline-flex items-center gap-2">
                  <Sparkles className="w-7 h-7" />
                  ZTech Grup
                </Link>
              </motion.div>
              
              <p className="text-secondary-400 mb-8 leading-relaxed text-sm font-medium">
                {settings.footer_text || 'Leading technology solutions provider, transforming businesses through innovative digital solutions and cutting-edge technology.'}
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.2, y: -5, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-11 h-11 bg-gradient-to-br from-secondary-800 to-secondary-700 hover:from-primary-600 hover:to-accent-600 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl border border-secondary-700 hover:border-primary-400"
                      aria-label={social.label}
                      title={social.label}
                    >
                      <Icon className="w-5 h-5 text-secondary-200 hover:text-white transition-colors" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-bold mb-8 text-white flex items-center gap-2">
                <span className="w-1 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></span>
                Quick Links
              </h3>
              <ul className="space-y-4">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-secondary-400 hover:text-primary-300 transition-all duration-300 flex items-center group text-sm font-medium"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-bold mb-8 text-white flex items-center gap-2">
                <span className="w-1 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></span>
                Services
              </h3>
              <ul className="space-y-4">
                {services.map((service, index) => (
                  <li key={index}>
                    <Link 
                      href={service.href}
                      className="text-secondary-400 hover:text-primary-300 transition-all duration-300 flex items-center group text-sm font-medium"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-bold mb-8 text-white flex items-center gap-2">
                <span className="w-1 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></span>
                Get in Touch
              </h3>
              <ul className="space-y-5">
                <li className="group">
                  <a
                    href={`mailto:${settings.contact_email || 'info@ztech.com'}`}
                    className="flex items-start gap-3 hover:translate-x-1 transition-all duration-300"
                  >
                    <Mail className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-secondary-400 text-xs font-medium mb-1">Email</p>
                      <p className="text-white hover:text-primary-300 transition-colors text-sm font-medium">
                        {settings.contact_email || 'info@ztech.com'}
                      </p>
                    </div>
                  </a>
                </li>
                <li className="group">
                  <a
                    href={`tel:${settings.contact_phone || '+62xxxxxxxxx'}`}
                    className="flex items-start gap-3 hover:translate-x-1 transition-all duration-300"
                  >
                    <Phone className="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-secondary-400 text-xs font-medium mb-1">Phone</p>
                      <p className="text-white hover:text-accent-300 transition-colors text-sm font-medium">
                        {settings.contact_phone || '+62 xxx xxxx xxxx'}
                      </p>
                    </div>
                  </a>
                </li>
                <li className="group">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-secondary-400 text-xs font-medium mb-1">Location</p>
                      <p className="text-white text-sm font-medium">
                        {settings.contact_address || 'Jakarta, Indonesia'}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="py-8 px-4 border-t border-secondary-800/50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <motion.p 
              whileHover={{ x: 5 }}
              className="text-secondary-500 text-sm text-center md:text-left"
            >
              &copy; {new Date().getFullYear()} <span className="gradient-text font-bold">ZTech Grup</span>. All rights reserved.
            </motion.p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
                { href: '/sitemap', label: 'Sitemap' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -2 }}
                  className="relative group"
                >
                  <Link 
                    href={item.href} 
                    className="text-secondary-500 hover:text-primary-400 transition-colors duration-300 font-medium"
                  >
                    {item.label}
                  </Link>
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 w-0 group-hover:w-full transition-all duration-300"
                  ></motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
