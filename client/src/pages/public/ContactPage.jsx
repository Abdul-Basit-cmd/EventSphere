import React, { useState } from 'react';
import { Mail, MapPin, Clock, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import FieldLabel from '../../components/ui/FieldLabel';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Message sent! We will get back to you.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 400);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Header */}
      <div style={{ borderColor: 'var(--color-border)' }} className="space-y-2 border-b pb-5">
        <h1
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
          className="text-3xl font-bold tracking-tight"
        >
          Contact EventSphere
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">
          Have questions about organizing an exhibition or joining as an exhibitor? Get in touch with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* 1. Contact Information Card - Slide from Left */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
          className="p-6 rounded-[10px] border space-y-6 card-lift"
        >
          <div className="space-y-1">
            <h2 style={{ color: 'var(--color-text)' }} className="text-base font-semibold">
              Contact Information
            </h2>
            <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">
              Reach out directly via email or office location.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div
                style={{
                  backgroundColor: 'var(--color-surface-alt)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-primary)',
                }}
                className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5"
              >
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <p style={{ color: 'var(--color-text)' }} className="font-semibold">Email Address</p>
                <p style={{ color: 'var(--color-text-muted)' }}>support@eventsphere.io</p>
                <p style={{ color: 'var(--color-text-muted)' }}>partners@eventsphere.io</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                style={{
                  backgroundColor: 'var(--color-surface-alt)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-success)',
                }}
                className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5"
              >
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <p style={{ color: 'var(--color-text)' }} className="font-semibold">Headquarters</p>
                <p style={{ color: 'var(--color-text-muted)' }}>500 Howard Street, Suite 400</p>
                <p style={{ color: 'var(--color-text-muted)' }}>San Francisco, CA 94105</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                style={{
                  backgroundColor: 'var(--color-surface-alt)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-muted)',
                }}
                className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5"
              >
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <p style={{ color: 'var(--color-text)' }} className="font-semibold">Operating Hours</p>
                <p style={{ color: 'var(--color-text-muted)' }}>Monday – Friday</p>
                <p style={{ color: 'var(--color-text-muted)' }}>09:00 – 18:00 UTC</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. Simple Inquiry Form - Slide from Right */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
          className="md:col-span-2 p-6 md:p-8 rounded-[10px] border"
        >
          <div className="space-y-1 mb-6">
            <h2 style={{ color: 'var(--color-text)' }} className="text-base font-semibold">
              Send us a message
            </h2>
            <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">
              Fill out the form below and an event coordination specialist will respond shortly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="name" required>Your Name</FieldLabel>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  style={{
                    backgroundColor: 'var(--color-surface-alt)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg border placeholder-[#555] transition-colors"
                />
              </div>

              <div>
                <FieldLabel htmlFor="email" required>Email Address</FieldLabel>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@company.com"
                  style={{
                    backgroundColor: 'var(--color-surface-alt)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg border placeholder-[#555] transition-colors"
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="subject">Subject</FieldLabel>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Inquiry regarding upcoming exhibition participation"
                style={{
                  backgroundColor: 'var(--color-surface-alt)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
                className="w-full px-3 py-2 text-xs rounded-lg border placeholder-[#555] transition-colors"
              />
            </div>

            <div>
              <FieldLabel htmlFor="message" required>Message</FieldLabel>
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Provide details about your inquiry or requirements..."
                style={{
                  backgroundColor: 'var(--color-surface-alt)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
                className="w-full px-3 py-2 text-xs rounded-lg border placeholder-[#555] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg btn-primary disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
