'use client';

import { motion } from 'framer-motion';
import { Users, Award, Clock, Zap } from 'lucide-react';

export default function StatsSection({ settings }: { settings: Record<string, any> }) {
  const defaultStats = [
    { number: '50', suffix: '+', label: 'Happy Clients', description: 'Trusted by businesses worldwide', icon: Users },
    { number: '150', suffix: '+', label: 'Projects Completed', description: 'Successfully delivered solutions', icon: Award },
    { number: '5', suffix: '+', label: 'Years Experience', description: 'In technology development', icon: Clock },
    { number: '99', suffix: '%', label: 'Client Satisfaction', description: 'Based on client feedback', icon: Zap },
  ];

  const iconList = [Users, Award, Clock, Zap];
  let statsItems = defaultStats;
  try {
    const parsed = typeof settings.stats_items === 'string' ? JSON.parse(settings.stats_items) : settings.stats_items;
    if (Array.isArray(parsed) && parsed.length > 0) {
      statsItems = parsed.map((item: any, i: number) => ({
        ...item,
        icon: iconList[i % iconList.length],
      }));
    }
  } catch {}

  const stats = statsItems;

  // Counter animation component
  const Counter = ({ from = 0, to, duration = 2.5, suffix = '' }: { from?: number; to: number; duration?: number; suffix?: string }) => {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration,
            ease: 'easeOut',
            delay: 0.2,
          }}
          viewport={{ once: true }}
        >
          {Math.round(from)}
        </motion.span>
        {suffix}
      </motion.span>
    );
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-primary-50/20 to-accent-50/10 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 right-0 w-80 h-80 bg-gradient-to-br from-primary-200/15 to-transparent rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -bottom-40 left-0 w-96 h-96 bg-gradient-to-tr from-accent-200/10 to-transparent rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-6"
          >
            {settings.stats_title || 'Trusted by Industry Leaders'}
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed"
          >
            {settings.stats_subtitle || 'Our track record speaks for itself. We\'ve helped businesses of all sizes achieve their digital transformation goals with innovative solutions and dedicated support.'}
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/10 group-hover:to-accent-500/10 rounded-3xl transition-all duration-500 blur-2xl -z-10"></div>

                {/* Card */}
                <div className="relative bg-white rounded-3xl p-8 text-center border border-secondary-100/50 hover:border-primary-200/50 transition-all duration-300 h-full hover:shadow-2xl hover:-translate-y-3 group/card">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-b-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 8, y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover/card:shadow-2xl transition-shadow duration-300"
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Number with counter */}
                  <div className="mb-4">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-accent-500 to-primary-700 mb-2"
                    >
                      {stat.number}
                      <span className="text-3xl">{stat.suffix}</span>
                    </motion.div>
                  </div>

                  {/* Label */}
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-xl font-bold text-secondary-900 mb-3 group-hover/card:text-primary-600 transition-colors duration-300"
                  >
                    {stat.label}
                  </motion.h3>

                  {/* Description */}
                  <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-secondary-600 text-sm leading-relaxed"
                  >
                    {stat.description}
                  </motion.p>

                  {/* Bottom shimmer effect */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-0 group-hover/card:opacity-100"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  ></motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}