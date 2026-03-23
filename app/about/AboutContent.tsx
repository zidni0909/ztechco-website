'use client';

import Navbar from '@/components/frontend/Navbar';
import Footer from '@/components/frontend/Footer';
import { motion } from 'framer-motion';
import { Users, Award, Clock, Target, CheckCircle, Zap, Shield, Heart, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function AboutContent({ settings }: { settings: Record<string, any> }) {
  const stats = [
    { icon: Users, number: '50+', label: 'Happy Clients', description: 'Satisfied customers worldwide' },
    { icon: Award, number: '150+', label: 'Projects Completed', description: 'Successfully delivered' },
    { icon: Clock, number: '5+', label: 'Years Experience', description: 'In technology industry' },
    { icon: Target, number: '99%', label: 'Success Rate', description: 'Project completion rate' },
  ];

  const values = [
    {
      icon: Zap,
      title: 'Innovation First',
      description: 'We embrace cutting-edge technologies and innovative approaches to solve complex business challenges.'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Every project undergoes rigorous testing and quality checks to ensure exceptional results.'
    },
    {
      icon: Heart,
      title: 'Client-Centric',
      description: 'Your success is our priority. We build lasting partnerships through dedicated support.'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Our skilled professionals bring years of experience and passion to every project.'
    },
  ];

  const defaultFeatures = [
    'Professional Development Team',
    'Agile Development Methodology',
    '24/7 Technical Support',
    'Scalable Solutions',
    'Modern Technology Stack',
    'Quality Assurance Testing'
  ];

  const features = (() => {
    try {
      return settings.about_features ? JSON.parse(settings.about_features) : defaultFeatures;
    } catch {
      return defaultFeatures;
    }
  })();

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <>
      <Navbar settings={settings} />

      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-accent-50/20 pt-32 pb-20">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200/20 to-transparent rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-accent-200/15 to-transparent rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="container relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100/50 backdrop-blur-sm rounded-full border border-primary-200/30 mb-6">
              <Rocket className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">About ZTech Grup</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {settings.about_title || 'Transforming Business Through'} <span className="gradient-text">Innovation</span>
            </h1>

            <p className="text-xl text-secondary-600 leading-relaxed mb-8">
              {settings.about_subtitle || 'With 5+ years of expertise in technology solutions, we have helped 50+ companies achieve their digital transformation goals through innovative and scalable solutions.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-accent-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.1'%3e%3ccircle cx='30' cy='30' r='1'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
          }}></div>
        </div>

        <div className="container relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-white/20 rounded-full">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <h3 className="text-lg font-semibold mb-1">{stat.label}</h3>
                  <p className="text-sm opacity-90">{stat.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-secondary-900 mb-6 leading-tight">
{settings.about_why_title || <>Why Choose <span className="gradient-text">ZTech Grup</span>?</>}
              </h2>

              <p className="text-lg text-secondary-600 mb-6 leading-relaxed">
                {settings.about_why_text || 'We are not just a technology company; we are your strategic partner in digital transformation. Our approach combines cutting-edge technology with deep industry expertise.'}
              </p>

              <ul className="space-y-4 mb-8">
                {features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                    <span className="text-secondary-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all duration-300">
                  Get In Touch
                  <CheckCircle className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 to-accent-100/30 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-secondary-200 space-y-6">
                {/* Floating badges */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 -right-4 px-4 py-2 bg-primary-600 text-white rounded-full text-sm font-bold shadow-lg"
                >
                  5+ Years
                </motion.div>

                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-8 -left-4 px-4 py-2 bg-accent-600 text-white rounded-full text-sm font-bold shadow-lg"
                >
                  50+ Clients
                </motion.div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-secondary-900">Our Promise</h3>
                  <p className="text-secondary-600">
                    Deliver exceptional technology solutions that drive real business value and create lasting partnerships.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-secondary-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-secondary-600">
              These principles guide everything we do and how we work with our clients.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative"
                >
                  <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-secondary-200 h-full flex flex-col">
                    {/* Shimmer effect */}
                    <motion.div
                      animate={{ x: [-100, 100] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
                    />

                    {/* Accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-accent-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                    <Icon className="w-12 h-12 text-primary-600 mb-4" />
                    <h3 className="text-lg font-bold text-secondary-900 mb-2">{value.title}</h3>
                    <p className="text-secondary-600 text-sm flex-1">{value.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Work Together?</h2>
            <p className="text-xl opacity-90 mb-8">
              Let's discuss how ZTech Grup can help transform your business and achieve your digital goals.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/contact" className="inline-block px-8 py-3 bg-white text-primary-600 font-bold rounded-2xl hover:bg-secondary-50 transition-all duration-300">
                Start Your Journey
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer settings={settings} />
    </>
  );
}
