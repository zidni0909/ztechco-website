'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Sparkles, Rocket } from 'lucide-react';

export default function CTASection({ settings }: { settings: Record<string, any> }) {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600">
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        ></motion.div>
      </div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.4'%3e%3ccircle cx='7' cy='7' r='1'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
        }}></div>
      </div>

      {/* Floating Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 8, 0], x: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 -left-20 w-48 h-48 bg-white/10 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{ y: [0, 25, 0], rotate: [0, -5, 0], x: [0, -20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent-400/20 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl"
        ></motion.div>
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-4 py-2.5 bg-white/15 backdrop-blur-md rounded-full text-sm font-medium border border-white/30 mx-auto"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {settings.cta_badge || 'Ready to Get Started?'}
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight">
                {(() => {
                  const title = settings.cta_title || 'Transform Your Business with\nCutting-Edge Technology';
                  const parts = title.split('\n');
                  return parts.length > 1 ? (
                    <>{parts[0]}<span className="block text-accent-200 mt-3">{parts.slice(1).join(' ')}</span></>
                  ) : (
                    title
                  );
                })()}
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed text-balance"
            >
              {settings.cta_subtitle || 'Join 50+ successful companies who have trusted us to deliver exceptional digital solutions. Let\'s discuss how we can accelerate your growth and transform your vision into reality.'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-primary-700 bg-white hover:bg-secondary-50 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 group gap-2 border border-white"
              >
                <Rocket className="w-5 h-5" />
                Start Your Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link 
                href="/portfolio" 
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-white bg-white/20 backdrop-blur-sm border-2 border-white/40 hover:border-white/60 hover:bg-white/30 transition-all duration-300 group gap-2"
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                View Our Work
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-8"
            ></motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <p className="text-primary-200 text-sm font-medium">Trusted by Industry Leaders</p>
              <div className="flex flex-wrap justify-center items-center gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="text-white/40 hover:text-white/80 transition-colors duration-300 text-sm font-medium px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 backdrop-blur-sm"
                  >
                    Client {i}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}