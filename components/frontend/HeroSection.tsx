'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle, Rocket, TrendingUp, Users } from 'lucide-react';

interface HeroSectionProps {
  settings: Record<string, string>;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  const trustIndicators = [
    { number: '150+', label: 'Projects', icon: CheckCircle },
    { number: '50+', label: 'Clients', icon: Users },
    { number: '5+', label: 'Years', icon: TrendingUp },
    { number: '24/7', label: 'Support', icon: Rocket },
  ];

  let features = ['Professional Development Team', 'Modern Technology Stack', 'Agile Development Process', '100% Client Satisfaction'];
  try {
    const parsed = typeof settings.hero_features === 'string' ? JSON.parse(settings.hero_features) : settings.hero_features;
    if (Array.isArray(parsed) && parsed.length > 0) features = parsed;
  } catch {}

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-accent-50/20 pt-20">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blurred gradient orbs */}
        <div className="absolute top-20 left-5 w-80 h-80 bg-gradient-to-br from-primary-200 via-primary-100 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-gradient-to-br from-accent-200 via-accent-100 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-gradient-to-tr from-primary-300/30 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-3">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0, 0, 0, 0.05) 25%, rgba(0, 0, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, 0.05) 75%, rgba(0, 0, 0, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 0, 0, 0.05) 25%, rgba(0, 0, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, 0.05) 75%, rgba(0, 0, 0, 0.05) 76%, transparent 77%, transparent)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <div className="container relative z-10 pt-12 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 rounded-full text-sm font-medium mb-8 border border-primary-200/50"
            >
              <Rocket className="w-4 h-4 mr-2" />
              {settings.hero_badge || 'Trusted by Industry Leaders'}
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 mb-8 leading-tight tracking-tight"
            >
              {(() => {
                const title = settings.hero_title || 'Solusi Teknologi\nTerpercaya';
                const parts = title.split('\n');
                return parts.length > 1 ? (
                  <>{parts[0]}<span className="gradient-text block mt-2">{parts.slice(1).join(' ')}</span></>
                ) : (
                  title
                );
              })()}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-secondary-600 mb-10 max-w-2xl leading-relaxed text-balance"
            >
              {settings.hero_subtitle || 'Kami menghadirkan inovasi teknologi terdepan dengan layanan profesional yang membantu bisnis Anda berkembang pesat di era digital'}
            </motion.p>

            {/* Features Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center text-secondary-700 bg-white/40 backdrop-blur-sm px-4 py-3 rounded-xl border border-secondary-100/30 hover:bg-white/60 transition-all duration-300"
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <Link 
                href="/contact" 
                className="btn-primary group inline-flex items-center justify-center px-8 py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link 
                href="/portfolio" 
                className="btn-secondary group inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold bg-white border-2 border-secondary-200 text-secondary-700 hover:bg-secondary-50 hover:border-primary-300 transition-all duration-300 hover:shadow-lg"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                View Our Work
              </Link>
            </motion.div>

            {/* Trust Indicators Cards */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {trustIndicators.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    className="bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-secondary-100/30 hover:bg-white/60 hover:border-primary-200/50 transition-all duration-300 group"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                        {item.number}
                      </div>
                      <div className="text-xs text-secondary-600 font-medium mt-1 text-center">
                        {item.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            {/* Floating Card 1 */}
            <div className="relative mx-8 my-8">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-gradient-to-br from-white to-secondary-50 rounded-3xl shadow-2xl p-8 border border-secondary-100 backdrop-blur-sm"
              >
                <motion.div
                  className="flex items-center mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-secondary-900 text-lg">Project Completed</h3>
                    <p className="text-secondary-600 text-sm">Recently Delivered</p>
                  </div>
                </motion.div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-secondary-600 font-medium">Progress</span>
                    <motion.span 
                      className="text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1, duration: 0.6 }}
                    >
                      100%
                    </motion.span>
                  </div>
                  <motion.div 
                    className="w-full bg-gradient-to-r from-secondary-200 to-secondary-100 rounded-full h-3 overflow-hidden shadow-inner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <motion.div 
                      className="h-3 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 shadow-lg"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: 1.2, duration: 1.5, ease: 'easeOut' }}
                    ></motion.div>
                  </motion.div>
                </div>

                <div className="mt-6 pt-6 border-t border-secondary-100">
                  <p className="text-secondary-600 text-sm">
                    Delivering excellence through innovative solutions and dedicated support.
                  </p>
                </div>
              </motion.div>

              {/* Floating Badge 1 - 24/7 Support */}
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -top-6 -right-6 bg-gradient-to-br from-accent-500 to-accent-600 text-white p-4 rounded-2xl shadow-2xl border border-accent-400/50 backdrop-blur-sm"
              >
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs font-medium">Support</div>
              </motion.div>

              {/* Floating Badge 2 - Years */}
              <motion.div
                animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white p-4 rounded-2xl shadow-2xl border border-primary-400/50 backdrop-blur-sm"
              >
                <div className="text-2xl font-bold">5+</div>
                <div className="text-xs font-medium">Years</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}