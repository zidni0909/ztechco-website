'use client';

import { motion } from 'framer-motion';
import { Code, Smartphone, Palette, Database, Cloud, Shield, Monitor, Settings } from 'lucide-react';

const iconMap: Record<string, any> = {
  code: Code,
  smartphone: Smartphone,
  palette: Palette,
  database: Database,
  cloud: Cloud,
  shield: Shield,
  monitor: Monitor,
  settings: Settings,
};

function getIcon(iconName?: string) {
  if (!iconName) return Settings;
  const lower = iconName.toLowerCase();
  for (const [key, Icon] of Object.entries(iconMap)) {
    if (lower.includes(key)) return Icon;
  }
  return Settings;
}

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

export default function ServicesGrid({ services }: { services: any[] }) {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-secondary-50/30 to-white">
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service: any) => {
            const Icon = getIcon(service.icon);
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-secondary-200 hover:border-primary-200/50 h-full flex flex-col hover:-translate-y-1">
                  {/* Accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-accent-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                  {/* Icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-secondary-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-secondary-600 leading-relaxed flex-1">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
