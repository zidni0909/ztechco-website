'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Smartphone, Globe, Database, Shield, Zap } from 'lucide-react';

interface ServicesProps {
  services: any[];
}

export default function ServicesSection({ services }: ServicesProps) {
  // Icon mapping for services
  const iconMap: { [key: string]: any } = {
    'web': Code,
    'mobile': Smartphone,
    'website': Globe,
    'database': Database,
    'security': Shield,
    'optimization': Zap,
  };

  const getServiceIcon = (title: string, iconString?: string) => {
    if (iconString && iconMap[iconString.toLowerCase()]) {
      return iconMap[iconString.toLowerCase()];
    }
    
    const titleLower = title.toLowerCase();
    if (titleLower.includes('web')) return Code;
    if (titleLower.includes('mobile')) return Smartphone;
    if (titleLower.includes('database')) return Database;
    if (titleLower.includes('security')) return Shield;
    return Globe; // default
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-primary-50/20 to-accent-50/10 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200/30 to-transparent rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-accent-200/20 to-transparent rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 rounded-full text-sm font-medium mb-8 border border-primary-200/50"
          >
            <Zap className="w-4 h-4 mr-2" />
            Our Premium Services
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6"
          >
            Comprehensive
            <span className="gradient-text block mt-2">Technology Solutions</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed text-balance"
          >
            From concept to deployment, we provide end-to-end technology services that drive your business forward in the digital age.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {services.map((service: any, index: number) => {
            const Icon = getServiceIcon(service.title, service.icon);
            
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className="relative group"
              >
                {/* Background gradient blur on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/10 group-hover:to-accent-500/10 rounded-3xl  transition-all duration-500 blur-2xl -z-10"></div>

                {/* Card */}
                <div className="relative bg-white rounded-3xl p-8 border border-secondary-100 hover:border-primary-200/50 transition-all duration-300 h-full hover:shadow-2xl hover:-translate-y-2 group">
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Icon Container */}
                  <div className="mb-6">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 6 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-secondary-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-secondary-600 mb-8 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                  
                  {/* Link with Animation */}
                  <motion.div
                    className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700"
                    whileHover={{ x: 8 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    Learn More
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </motion.div>

                  {/* Bottom Shimmer Effect */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-0 group-hover:opacity-100"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  ></motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center pt-8 border-t border-secondary-100"
        >
          <Link 
            href="/services" 
            className="inline-flex items-center px-8 py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
          >
            View All Services
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}