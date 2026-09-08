import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Users,
  Compass,
  ArrowRight,
  Calendar,
  MapPin,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Building2,
  QrCode,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchExpos } from '../../api/expoApi';
import { getExpoCoverImage } from '../../utils/expoImages';

const featureCards = [
  {
    icon: Layers,
    badge: 'Organizers',
    accentColor: 'var(--color-primary)',
    title: 'Centralized Floorplans & Logistics',
    description:
      'Configure visual booth dimensions, assign pricing tiers, verify exhibitor credentials, and manage live multi-track speaker agendas from a unified command center.',
    highlight: 'Real-time capacity tracking',
  },
  {
    icon: Building2,
    badge: 'Exhibitors',
    accentColor: 'var(--color-success)',
    title: 'Showcase & High-Impact Lead Inquiries',
    description:
      'Reserve verified booth spaces directly on the expo map, browse neighboring stands for synergy, and collect structured inquiries directly from visiting delegates.',
    highlight: 'Instant lead capture pipeline',
  },
  {
    icon: Compass,
    badge: 'Attendees',
    accentColor: 'var(--color-accent)',
    title: 'Personalized Agenda & Direct Engagement',
    description:
      'Discover cutting-edge exhibitions, bookmark keynote sessions into a synchronized daily agenda, verify booth check-ins, and message exhibitors on-site.',
    highlight: 'Synchronized session bookmarking',
  },
];

const steps = [
  {
    step: '01',
    title: 'Discover & Register',
    badge: 'Step One',
    desc: 'Browse scheduled industry conventions, view floor layout previews, and set up your verified role credentials in minutes.',
    icon: Users,
    color: 'var(--color-primary)',
  },
  {
    step: '02',
    title: 'Select Booths & Schedule',
    badge: 'Step Two',
    desc: 'Exhibitors lock in prime floorplan stands with transparent dimensions. Attendees curate keynotes into a personal agenda.',
    icon: Layers,
    color: 'var(--color-success)',
  },
  {
    step: '03',
    title: 'Engage & Exchange',
    badge: 'Step Three',
    desc: 'Check in seamlessly on exhibition day, connect with vendor representatives, and conduct commercial inquiries in real time.',
    icon: QrCode,
    color: 'var(--color-accent)',
  },
];

const FALLBACK_FEATURED = [
  {
    _id: 'featured-1',
    title: 'Global Tech & AI Summit 2026',
    theme: 'Artificial Intelligence & Robotics',
    description: 'Explore generative AI breakthroughs, autonomous robotics displays, and enterprise cloud infrastructure.',
    date: '2026-10-15T09:00:00.000Z',
    location: 'Metropolitan Convention Center, Hall A',
  },
  {
    _id: 'featured-2',
    title: 'Clean Energy & Climate Expo',
    theme: 'Renewable Power & Grid Tech',
    description: 'Connecting solar pioneers, battery storage innovators, and green energy venture leaders.',
    date: '2026-11-04T09:00:00.000Z',
    location: 'Bayfront Expo Pavilion',
  },
  {
    _id: 'featured-3',
    title: 'International FinTech & Commerce Fair',
    theme: 'Digital Banking & Enterprise APIs',
    description: 'The premier gathering for decentralized payments, core banking architects, and cross-border trade.',
    date: '2026-12-08T09:00:00.000Z',
    location: 'Grand Horizon Center, San Francisco',
  },
];

const HomePage = () => {
  const [featuredExpos, setFeaturedExpos] = useState([]);
  const [loadingExpos, setLoadingExpos] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadFeatured = async () => {
      try {
        const res = await fetchExpos({ limit: 3 });
        if (isMounted) {
          const list = res.data?.expos || [];
          setFeaturedExpos(list.length > 0 ? list.slice(0, 3) : FALLBACK_FEATURED);
        }
      } catch (err) {
        if (isMounted) {
          setFeaturedExpos(FALLBACK_FEATURED);
        }
      } finally {
        if (isMounted) setLoadingExpos(false);
      }
    };
    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-24 md:space-y-32">
      {/* 1. HERO SECTION WITH ACETERNITY-STYLE LIGHT RAYS & RADIAL GRID */}
      <section className="relative -mt-4 pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden rounded-3xl border border-slate-800/60 bg-[#0A0E18]/70 backdrop-blur-xl">
        {/* Animated Light Ray Beam */}
        <div className="hero-glow-ray" />

        {/* Subtle Low-Opacity Grid Pattern with Radial Edge Fade */}
        <div className="absolute inset-0 bg-grid-pattern hero-radial-mask pointer-events-none opacity-80" />

        {/* Hero Content Container */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Status Badge Pill */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-md text-xs font-medium text-blue-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span>Next-Generation Exhibition Platform</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Enterprise Ready</span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
              fontWeight: 800,
            }}
            className="tracking-tight leading-[1.08] text-white"
          >
            Orchestrate World-Class <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Exhibitions & Conventions
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
            style={{ color: 'var(--color-text-muted)' }}
            className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal"
          >
            A cohesive digital operating system for trade shows and conferences. Configure live
            interactive booth floorplans, automate exhibitor onboarding, and deliver synchronized
            speaker tracks.
          </motion.p>

          {/* Call To Action Buttons with Ambient Glow Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.35, ease: 'easeOut' }}
            className="relative flex flex-wrap items-center justify-center gap-4 pt-3"
          >
            {/* Ambient soft glow behind buttons */}
            <div className="ambient-glow-pill w-72 h-16 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            <Link
              to="/expos"
              className="relative z-10 inline-flex items-center gap-2.5 px-6 py-3 text-xs font-semibold rounded-xl btn-primary shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
            >
              <span>Explore Upcoming Expos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/auth/register"
              className="relative z-10 inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold rounded-xl border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 hover:text-white transition-all shadow-sm"
            >
              <span>Create Account</span>
            </Link>
          </motion.div>

          {/* Trust Metric Chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Interactive 2D Floorplans</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Exhibitor Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Synchronized Agendas</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURED EXPOS WITH UNSPLASH IMAGERY & GLASS CARDS */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Exhibitions</span>
            </div>
            <h2
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
              className="text-2xl sm:text-3xl font-bold tracking-tight"
            >
              Explore Flagship Industry Expos
            </h2>
            <p style={{ color: 'var(--color-text-muted)' }} className="text-xs sm:text-sm">
              Discover verified convention dates, keynote speakers, and participating industry brands.
            </p>
          </div>
          <Link
            to="/expos"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors group self-start sm:self-auto"
          >
            <span>Browse all expos</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredExpos.map((expo, idx) => {
            const coverImage = getExpoCoverImage(expo, idx);
            return (
              <motion.div
                key={expo._id || idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.1 * idx, ease: 'easeOut' }}
                className="group relative flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md overflow-hidden hover:border-blue-500/40 hover:-translate-y-1.5 transition-all duration-300 shadow-lg shadow-black/20"
              >
                {/* Image Container with Zoom & Gradient Overlay */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={coverImage}
                    alt={expo.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E131F] via-[#0E131F]/40 to-transparent" />
                  
                  {/* Theme Badge Overlay */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-blue-400 border border-blue-500/30">
                      {expo.theme || 'Industry Expo'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3
                      style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
                      className="text-base font-bold line-clamp-1 group-hover:text-blue-300 transition-colors"
                    >
                      {expo.title}
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)' }} className="text-xs line-clamp-2 leading-relaxed">
                      {expo.description || 'Join leading organizations and industry delegates at this exhibition.'}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-800/70 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{expo.date ? new Date(expo.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Q4 2026'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">{expo.location || 'Exhibition Grounds'}</span>
                    </div>

                    <Link
                      to={expo._id?.startsWith('featured-') ? '/expos' : `/expos/${expo._id}`}
                      className="mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-blue-600 text-slate-200 hover:text-white transition-all duration-200"
                    >
                      <span>Explore Expo Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. DESIGNED FOR EVERY STAKEHOLDER (AUDIENCE CARDS) */}
      <section className="space-y-8 pt-4">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Role-Tailored Architecture</span>
          </div>
          <h2
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
            className="text-2xl sm:text-3xl font-bold tracking-tight"
          >
            Engineered for Every Stakeholder
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs sm:text-sm">
            Dedicated portals designed around specific responsibilities, permissions, and goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.12 * idx, ease: 'easeOut' }}
                className="group p-6 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md space-y-5 hover:border-slate-700 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      borderColor: 'rgba(255,255,255,0.08)',
                      color: feat.accentColor,
                    }}
                    className="w-12 h-12 rounded-xl border flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform"
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-slate-800 bg-slate-950/60 text-slate-400">
                    {feat.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3
                    style={{ color: 'var(--color-text)' }}
                    className="text-base font-semibold group-hover:text-blue-300 transition-colors"
                  >
                    {feat.title}
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)' }} className="text-xs leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2 text-[11px] font-medium text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>{feat.highlight}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. CONNECTED PROCESS FLOW ("HOW IT WORKS") */}
      <section className="space-y-10 pt-4">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Execution Flow</span>
          </div>
          <h2
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
            className="text-2xl sm:text-3xl font-bold tracking-tight"
          >
            How EventSphere Works
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs sm:text-sm">
            A transparent three-stage sequence from registration to live engagement.
          </p>
        </div>

        {/* Process Cards with Connecting Trace */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Subtle horizontal connecting line on desktop */}
          <div className="hidden md:block absolute top-1/2 left-16 right-16 h-0.5 bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-cyan-500/20 -translate-y-6 z-0 pointer-events-none" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.15 * idx, ease: 'easeOut' }}
                className="relative z-10 p-6 rounded-2xl border border-slate-800/80 bg-slate-900/70 backdrop-blur-md space-y-4 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div
                    style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                    className="w-10 h-10 rounded-xl border bg-slate-950 flex items-center justify-center text-slate-300 font-mono text-sm font-bold shadow-inner"
                  >
                    {step.step}
                  </div>
                  <span
                    style={{ color: step.color }}
                    className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-800/60 border border-slate-700/60"
                  >
                    {step.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h4 style={{ color: 'var(--color-text)' }} className="text-sm font-semibold">
                    {step.title}
                  </h4>
                  <p style={{ color: 'var(--color-text-muted)' }} className="text-xs leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. BOTTOM CTA ELEVATED SURFACE */}
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-[#111625] to-[#0A0D16] p-8 sm:p-12 text-center space-y-6 shadow-2xl shadow-blue-950/20"
      >
        <div className="ambient-glow-pill w-80 h-32 top-0 left-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-xl mx-auto space-y-3">
          <h3
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
            className="text-2xl sm:text-3xl font-bold tracking-tight"
          >
            Ready to modernise your exhibition experience?
          </h3>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs sm:text-sm leading-relaxed">
            Whether coordinating your next multi-day convention or securing prime booth real estate,
            EventSphere powers your workflow.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/auth/register" className="px-6 py-2.5 text-xs font-semibold rounded-xl btn-primary">
            Create Free Account
          </Link>
          <Link
            to="/auth/login"
            className="px-6 py-2.5 text-xs font-semibold rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 transition-colors"
          >
            Sign In to Portal
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
