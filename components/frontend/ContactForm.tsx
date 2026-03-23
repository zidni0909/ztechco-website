'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    // Honeypot check - if filled, silently pretend success
    if (formData.get('website')) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSuccess(false), 3000);
      setLoading(false);
      return;
    }

    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || '',
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    try {
      const res = await fetch('/api/contact-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative bg-white rounded-xl shadow-md p-8 space-y-6">
      {success && (
        <div className="bg-primary-50 text-primary-700 p-4 rounded-lg border border-primary-200">
          Message sent successfully! We'll get back to you soon.
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      
      {/* Honeypot field - hidden from real users */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">Name</label>
        <input
          type="text"
          name="name"
          required
          className="input-field"
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">Email</label>
        <input
          type="email"
          name="email"
          required
          className="input-field"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">Phone (Optional)</label>
        <input
          type="tel"
          name="phone"
          className="input-field"
          placeholder="Your phone number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">Subject</label>
        <input
          type="text"
          name="subject"
          required
          className="input-field"
          placeholder="Subject"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">Message</label>
        <textarea
          name="message"
          required
          rows={5}
          className="input-field"
          placeholder="Your message..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
