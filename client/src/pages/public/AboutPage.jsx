import React from 'react';
import {
  Layers,
  Users,
  Compass,
  Sparkles,
  Target,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const roles = [
  {
    icon: Layers,
    color: 'var(--color-primary)',
    badge: 'Organizers',
    title: 'Event Organizers & Admins',
    desc: 'Administrators maintain full control over expo scheduling, 2D booth dimensions, pricing tiers, exhibitor document verification, and overarching multi-track agendas.',
    features: ['Custom booth layouts', 'Speaker agenda publisher', 'Application review pipeline'],
  },
  {
    icon: Users,
    color: 'var(--color-success)',
    badge: 'Exhibitors',
    title: 'Exhibitors & Industry Vendors',
    desc: 'Companies manage digital branding, reserve available floorplan booth slots, browse neighboring stands for commercial synergy, and handle direct attendee inquiry messages.',
    features: ['Interactive stand reservation', 'Commercial inquiry inbox', 'Neighbor stand directory'],
  },
  {
    icon: Compass,
    color: 'var(--color-accent)',
    badge: 'Attendees',
    title: 'Delegates & Trade Attendees',
    desc: 'Visitors register for upcoming exhibitions, build personalized agendas by bookmarking speaker tracks, verify attendance check-ins, and direct message company reps.',
    features: ['Personal agenda builder', 'Instant booth check-in', 'Verified company directory'],
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Digital Infrastructure',
    badge: 'Phase 1',
    desc: 'Organizers publish comprehensive expo parameters, define physical booth matrices, and schedule speaker tracks.',
    icon: Globe,
  },
  {
    step: '02',
    title: 'Verified Vendor Selection',
    badge: 'Phase 2',
    desc: 'Exhibitors submit profile documents, select verified booth units on the live floorplan, and prepare showcase materials.',
    icon: ShieldCheck,
  },
  {
    step: '03',
    title: 'Live Convention Execution',
    badge: 'Phase 3',
    desc: 'Delegates navigate the event grounds, attend bookmarked keynotes, and exchange high-impact commercial inquiries.',
    icon: Zap,
  },
];

const stats = [
  { value: '100%', label: 'Synchronized Real-Time Data' },
  { value: '3-Tier', label: 'Role-Tailored Portals' },
  { value: 'Zero', label: 'Disjointed Spreadsheets' },
  { value: '< 2min', label: 'Fast Delegate Onboarding' },
];

const AboutPage = () => {
  return (
    <div className="space-y-16 md:space-y-24 max-w-5xl mx-auto">
      {/* 1. HERO SECTION WITH SUBTLE GRID BACKDROP & AMBIENT GLOW */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative rounded-3xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-8 sm:p-12 overflow-hidden text-center space-y-5"
      >
        <div className="ambient-glow-pill w-72 h-36 top-0 left-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-grid-pattern hero-radial-mask pointer-events-none opacity-60" />

        <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-xs font-semibold text-blue-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About EventSphere</span>
        </div>

        <h1
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
          className="relative z-10 text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight"
        >
          Purpose-Built Infrastructure for Modern Exhibitions
        </h1>

        <p
          style={{ color: 'var(--color-text-muted)' }}
          className="relative z-10 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal"
        >
          EventSphere is an integrated operations platform designed to eliminate fragmented spreadsheets,
          uncoordinated email threads, and manual floorplan reservations. We unite commercial organizers,
          verified industry exhibitors, and trade attendees.
        </p>

        {/* Platform Stat Highlights */}
        <div className="relative z-10 pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-sm"
            >
              <div className="text-xl sm:text-2xl font-extrabold text-blue-400 font-mono">
                {stat.value}
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 2. MISSION & ARCHITECTURE STATEMENT */}
      <motion.section
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative p-8 sm:p-10 rounded-2xl border border-slate-800/90 bg-gradient-to-r from-slate-900/90 to-[#0F1422]/90 backdrop-blur-md space-y-4 shadow-xl"
      >
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
          <Target className="w-4 h-4" />
          <span>Our Mission</span>
        </div>
        <p
          style={{ color: 'var(--color-text)' }}
          className="text-lg sm:text-xl font-medium leading-relaxed"
        >
          "To provide exhibitions, trade fairs, and conferences with dependable digital infrastructure
          that guarantees transparency, accelerates vendor onboarding, and turns live event logistics
          into seamless participant experiences."
        </p>
        <p style={{ color: 'var(--color-text-muted)' }} className="text-xs sm:text-sm leading-relaxed max-w-3xl">
          From verified booth reservations and live synchronized speaker tracks to direct inquiry routing,
          every feature is tuned for absolute operational clarity.
        </p>
      </motion.section>

      {/* 3. ELEVATED AUDIENCE / STAKEHOLDER CARDS */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Target Audience</span>
          </div>
          <h2
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
            className="text-2xl sm:text-3xl font-bold tracking-tight"
          >
            Who EventSphere Serves
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs sm:text-sm">
            Three specialized portals engineered specifically for the goals and needs of each participant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, idx) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.12 * idx, ease: 'easeOut' }}
                className="group p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex flex-col justify-between space-y-5 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/15"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      style={{ color: role.color }}
                      className="w-11 h-11 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center group-hover:scale-105 transition-transform"
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-slate-800 bg-slate-950 text-slate-400">
                      {role.badge}
                    </span>
                  </div>

                  <h3 style={{ color: 'var(--color-text)' }} className="text-base font-bold group-hover:text-blue-300 transition-colors">
                    {role.title}
                  </h3>

                  <p style={{ color: 'var(--color-text-muted)' }} className="text-xs leading-relaxed">
                    {role.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  {role.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. CONNECTED PROCESS STEPS */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Workflow Sequence</span>
          </div>
          <h2
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
            className="text-2xl sm:text-3xl font-bold tracking-tight"
          >
            How the System Executes
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs sm:text-sm">
            Connected execution phases ensuring accuracy from planning to convention day.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="hidden md:block absolute top-1/2 left-16 right-16 h-0.5 bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-cyan-500/20 -translate-y-6 z-0 pointer-events-none" />

          {processSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.15 * idx, ease: 'easeOut' }}
                className="relative z-10 p-6 rounded-2xl border border-slate-800/80 bg-slate-900/70 backdrop-blur-md space-y-4 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center text-slate-300 font-mono text-sm font-bold shadow-inner">
                    {step.step}
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-slate-800/60 border border-slate-700/60 text-emerald-400">
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

      {/* 5. CALL TO ACTION */}
      <section className="text-center p-8 sm:p-12 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-4">
        <h3
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
          className="text-2xl font-bold"
        >
          Join Upcoming Conventions Today
        </h3>
        <p style={{ color: 'var(--color-text-muted)' }} className="text-xs sm:text-sm max-w-md mx-auto">
          Sign up to explore live exhibition floorplans or register your company as a verified exhibitor.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/auth/register" className="px-6 py-2.5 text-xs font-semibold rounded-xl btn-primary">
            Get Started
          </Link>
          <Link
            to="/expos"
            className="px-6 py-2.5 text-xs font-semibold rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 transition-colors"
          >
            Browse Exhibitions
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
