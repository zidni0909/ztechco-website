'use client';

import Navbar from '@/components/frontend/Navbar';
import Footer from '@/components/frontend/Footer';
import ContactForm from '@/components/frontend/ContactForm';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ContactContent({ settings }: { settings: Record<string, any> }) {
  const email = settings.contact_email || 'info@ztech.com';
  const phone = settings.contact_phone || '+62 xxx xxxx xxxx';
  const address = settings.contact_address || 'Jakarta, Indonesia';
  const workingHours = settings.contact_working_hours || 'Mon - Fri: 9:00 AM - 6:00 PM';

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: email,
      description: 'Send us an email anytime',
      action: `mailto:${email}`
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: phone,
      description: 'Mon-Fri from 9am to 6pm',
      action: `tel:${phone.replace(/\s+/g, '')}`
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: address,
      description: 'Come say hello at our office',
      action: '#'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: workingHours,
      description: 'Weekend by appointment',
      action: '#'
    }
  ];

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
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <>
      <Navbar settings={settings} />

      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-accent-50/20 pt-32 pb-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200/20 to-transparent rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-accent-200/15 to-transparent rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 rounded-full text-sm font-medium mb-8 border border-primary-200/50"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Get In Touch
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-secondary-900 mb-8 leading-tight"
            >
              Let's Start Your
              <span className="gradient-text block mt-3">Next Project</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto text-balance leading-relaxed"
            >
              Ready to transform your business with cutting-edge technology? We're here to help you every step of the way. Let's discuss your vision and make it reality.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-secondary-50/30 to-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 rounded-3xl blur-2xl"></div>
                <div className="relative bg-white rounded-3xl p-8 sm:p-10 border border-secondary-100 shadow-lg">
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <Send className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-secondary-900">Send us a Message</h2>
                      <p className="text-secondary-600 text-sm">We'll get back to you within 24 hours</p>
                    </div>
                  </div>
                  <ContactForm />
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-secondary-900 mb-4">Contact Information</h2>
                <p className="text-secondary-600 leading-relaxed text-lg">
                  Have questions about our services? Need a custom quote? Our team is ready to help you find the perfect solution for your business needs.
                </p>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-4"
              >
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/5 group-hover:to-accent-500/5 rounded-2xl transition-all duration-300 blur-2xl -z-10"></div>
                      <div className="bg-white rounded-2xl p-6 border border-secondary-100 hover:border-primary-200/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <div className="flex items-start gap-4">
                          <motion.div
                            whileHover={{ scale: 1.15, rotate: 5 }}
                            className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-secondary-900 mb-1 group-hover:text-primary-600 transition-colors duration-300">
                              {info.title}
                            </h3>
                            <p className="text-secondary-900 font-medium mb-1">
                              {info.content}
                            </p>
                            <p className="text-secondary-600 text-sm">
                              {info.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-3xl border border-secondary-100 shadow-lg"
              >
                <div className="h-80 bg-gradient-to-br from-primary-500 via-accent-400 to-primary-600 relative overflow-hidden flex items-center justify-center group">
                  <div className="text-center z-10 relative">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="mb-4"
                    >
                      <MapPin className="w-16 h-16 text-white mx-auto opacity-90" />
                    </motion.div>
                    <p className="text-white text-2xl font-bold mb-2">Find Us Here</p>
                    <p className="text-white/80">{address}</p>
                  </div>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full mix-blend-screen filter blur-2xl group-hover:blur-3xl transition-all"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full mix-blend-screen filter blur-2xl group-hover:blur-3xl transition-all"></div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.4'%3e%3ccircle cx='7' cy='7' r='1'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
          }}></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container relative z-10 text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
            Join 50+ successful companies who have trusted us with their digital transformation. Let's discuss how we can help your business grow and thrive in the digital age.
          </p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link
              href={`mailto:${email}`}
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-primary-700 font-semibold bg-white hover:bg-secondary-50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group border border-white/30"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Us Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-white font-semibold bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 hover:border-white transition-all duration-300 hover:-translate-y-1 group"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Us Today
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer settings={settings} />
    </>
  );
}
