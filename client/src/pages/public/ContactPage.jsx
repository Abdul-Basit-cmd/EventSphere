import React, { useState } from 'react';
import { Mail, MapPin, Clock, Send, MessageSquare, Sparkles, Copy, Check, ExternalLink } from 'lucide-react';
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
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('support@eventsphere.io');
    setCopiedEmail(true);
    toast.success('Email copied to clipboard');
    setTimeout(() => setCopiedEmail(false), 2000);
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
      toast.success('Message sent! Our coordination team will get back to you within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 450);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* 1. Header with subtle radial glow */}
      <div className="relative rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-[11px] font-semibold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Support & Inquiries</span>
          </div>

          <h1
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
            className="text-2xl sm:text-4xl font-bold tracking-tight"
          >
            Get in Touch with Our Team
          </h1>

          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs sm:text-sm leading-relaxed">
            Have questions about hosting an upcoming convention, exhibitor credential verification, or custom booth allocations? We are here to help.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* 2. Interactive Contact Info Cards (Left Column) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="space-y-4"
        >
          {/* Email Card */}
          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md space-y-3 hover:border-blue-500/30 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl border border-blue-500/20 bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Mail className="w-4 h-4" />
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="text-[11px] font-medium text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800/60 hover:bg-slate-800 transition-colors"
                title="Copy email"
              >
                {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div>
              <p style={{ color: 'var(--color-text)' }} className="text-sm font-semibold">Email Us</p>
              <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">support@eventsphere.io</p>
              <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">partners@eventsphere.io</p>
            </div>
          </div>

          {/* Headquarters Card */}
          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md space-y-3 hover:border-emerald-500/30 transition-all duration-200">
            <div className="w-9 h-9 rounded-xl border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p style={{ color: 'var(--color-text)' }} className="text-sm font-semibold">Global Headquarters</p>
              <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">500 Howard Street, Suite 400</p>
              <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">San Francisco, CA 94105</p>
            </div>
          </div>

          {/* Operating Hours Card */}
          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md space-y-3 hover:border-slate-700 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl border border-slate-800 bg-slate-800/50 flex items-center justify-center text-slate-400">
                <Clock className="w-4 h-4" />
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Desk
              </span>
            </div>
            <div>
              <p style={{ color: 'var(--color-text)' }} className="text-sm font-semibold">Support Desk Hours</p>
              <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">Monday – Friday</p>
              <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">08:00 – 18:00 UTC</p>
            </div>
          </div>

          {/* Interactive Map Visual Surface */}
          <div className="relative p-5 rounded-2xl border border-slate-800/80 bg-slate-950/80 overflow-hidden space-y-2">
            <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[10px]">COORDS: 37.7891° N, 122.3992° W</span>
              <span className="text-blue-400 font-semibold text-[10px] flex items-center gap-1">
                San Francisco <ExternalLink className="w-3 h-3" />
              </span>
            </div>
            <div className="relative z-10 h-24 rounded-xl border border-slate-800 bg-slate-900/80 flex items-center justify-center text-center p-3">
              <div className="space-y-1">
                <div className="inline-flex p-1.5 rounded-lg bg-blue-500/20 text-blue-400 mb-1">
                  <MapPin className="w-4 h-4 animate-bounce" />
                </div>
                <p className="text-[11px] font-semibold text-slate-200">EventSphere Hub Campus</p>
                <p className="text-[10px] text-slate-500">Howard Tech Corridor</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. Elevated Contact Form Surface (Right 2 Columns) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="lg:col-span-2 p-6 sm:p-8 rounded-2xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-md shadow-2xl shadow-black/20"
        >
          <div className="space-y-1.5 mb-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Inquiry Form</span>
            </div>
            <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold tracking-tight">
              Send us a direct inquiry
            </h2>
            <p style={{ color: 'var(--color-text-muted)' }} className="text-xs leading-relaxed">
              Fill out the form below and an event coordination specialist will respond with technical or booking assistance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="name" required>Your Name</FieldLabel>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/40 transition-all"
                />
              </div>

              <div>
                <FieldLabel htmlFor="email" required>Work Email</FieldLabel>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="s.jenkins@company.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/40 transition-all"
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="subject">Subject / Inquiry Type</FieldLabel>
              <input
                type="text"
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Exhibition booth reservation or platform integration"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/40 transition-all"
              />
            </div>

            <div>
              <FieldLabel htmlFor="message" required>Message Details</FieldLabel>
              <textarea
                name="message"
                id="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Share specific questions about booth dimensions, dates, speaker sessions, or API integrations..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/40 transition-all resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <p className="text-[11px] text-slate-500">
                🔒 Inquiries are routed under strict data privacy protocols.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold rounded-xl btn-primary shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 disabled:opacity-60 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Transmitting...' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
