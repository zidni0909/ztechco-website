'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Filter } from 'lucide-react';
import Navbar from '@/components/frontend/Navbar';
import Footer from '@/components/frontend/Footer';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  client: string;
  project_url: string;
  is_published: boolean;
  created_at: string;
}

export default function PortfolioContent({ settings }: { settings: Record<string, string> }) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portfolio').then(res => res.json()).then(data => {
      const items = data.items || data;
      setItems(Array.isArray(items) ? items.filter((item: any) => item.is_published) : []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

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
      transition: { duration: 0.5 },
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <Navbar settings={settings} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-secondary-900 via-primary-900/50 to-secondary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.1'%3e%3ccircle cx='30' cy='30' r='1'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
          }}></div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-8">
              <Filter className="w-4 h-4 text-primary-300" />
              <span className="text-sm font-medium text-primary-200">Our Latest Works</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Crafted with <span className="gradient-text">Excellence</span>
            </h1>

            <p className="text-lg text-secondary-200 leading-relaxed">
              Explore our curated collection of innovative project solutions, cutting-edge designs, and transformative digital experiences that drive real business impact and deliver exceptional value.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button className="px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl">
                  Get Started
                </button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/contact" className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-2xl font-bold transition-all duration-300 backdrop-blur-xl flex items-center gap-2">
                  Contact Us <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-24 bg-gradient-to-b from-white via-secondary-50 to-white">
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-3xl bg-white shadow-lg border border-secondary-200 overflow-hidden">
                  <div className="h-64 bg-secondary-100 animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-secondary-100 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-secondary-100 rounded animate-pulse w-1/2" />
                    <div className="h-4 bg-secondary-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-secondary-600 text-lg">No portfolio items published yet.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="group h-full"
                >
                  <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-secondary-200 hover:border-primary-200">
                    <div className="relative overflow-hidden h-64 bg-secondary-100">
                      {item.image_url ? (
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          transition={{ duration: 0.4 }}
                          className="w-full h-full"
                        >
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary-400">
                          No Image
                        </div>
                      )}

                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-gradient-to-t from-secondary-900 via-secondary-900/50 to-transparent flex items-end justify-end p-4"
                      >
                        {item.project_url && (
                          <motion.a
                            href={item.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-10 h-10 bg-white/20 hover:bg-accent-600 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300"
                          >
                            <ExternalLink className="w-5 h-5 text-white" />
                          </motion.a>
                        )}
                      </motion.div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-secondary-900 mb-2 group-hover:gradient-text transition-all duration-300">
                        {item.title}
                      </h3>

                      {item.client && (
                        <p className="text-sm text-primary-600 font-semibold mb-2">
                          Client: {item.client}
                        </p>
                      )}

                      <p className="text-secondary-600 text-sm leading-relaxed flex-1">
                        {item.description}
                      </p>

                      {item.project_url && (
                        <motion.a
                          href={item.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ x: 5 }}
                          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-bold text-sm group/btn mt-4"
                        >
                          View Project
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 p-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl text-white text-center"
          >
            <h2 className="text-3xl font-bold mb-3">Let's Work Together</h2>
            <p className="text-lg opacity-90 mb-6">
              Ready to bring your next project to life? Let's discuss your ideas and create something amazing.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="inline-block px-8 py-3 bg-white text-primary-600 font-bold rounded-2xl hover:bg-secondary-50 transition-all duration-300"
              >
                Start Your Project
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer settings={settings} />
    </main>
  );
}
