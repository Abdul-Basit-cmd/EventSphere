import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Users, Compass, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const featureCards = [
  {
    icon: Layers,
    iconColor: 'var(--color-primary)',
    title: 'For Organizers',
    description:
      'Manage expos, configure floorplan booths, publish speaker schedules, review applications, and oversee event logistics with centralized control.',
  },
  {
    icon: Users,
    iconColor: 'var(--color-success)',
    title: 'For Exhibitors',
    description:
      'Showcase your brand, reserve verified booths, connect with neighboring exhibitors, and receive direct commercial inquiries from attendees.',
  },
  {
    icon: Compass,
    iconColor: 'var(--color-accent)',
    title: 'For Attendees',
    description:
      'Discover upcoming industry expos, bookmark keynote sessions into a personalized schedule, visit booths, and connect directly with company reps.',
  },
];

const steps = [
  {
    num: '01',
    color: 'var(--color-primary)',
    title: 'Register',
    desc: 'Create your account as an attendee or company representative. Verify your email to activate portal access.',
  },
  {
    num: '02',
    color: 'var(--color-success)',
    title: 'Get Approved',
    desc: 'Exhibitors submit profile and credential details for admin verification to maintain verified convention standards.',
  },
  {
    num: '03',
    color: 'var(--color-accent)',
    title: 'Participate',
    desc: 'Reserve booth positions, bookmark agenda sessions, check in on-site, and exchange structured inquiries.',
  },
];

const HomePage = () => {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* 1. Hero Section */}
      <section
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #2563EB0D 0%, transparent 70%)',
        }}
        className="text-center max-w-3xl mx-auto space-y-6 pt-6 md:pt-10 pb-4"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium"
        >
          <span
            style={{ background: 'var(--color-success)' }}
            className="w-2 h-2 rounded-full"
          />
          <span>Unified Expo & Convention Management</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            color: 'var(--color-text)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
          }}
          className="tracking-tight leading-[1.1]"
        >
          EventSphere
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
          style={{ color: 'var(--color-text-muted)' }}
          className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal"
        >
          A calm, dependable infrastructure for managing industry exhibitions, floorplan booth
          allocations, speaker schedules, and high-impact vendor networking.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-3 pt-2"
        >
          <Link
            to="/expos"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg btn-primary"
          >
            <span>Browse Expos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/auth/register"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg border hover:border-[var(--color-border-light)] hover:bg-[var(--color-surface-alt)] transition-all"
          >
            <span>Get Started</span>
          </Link>
        </motion.div>
      </section>

      {/* 2. Features Section */}
      <section
        style={{ borderColor: 'var(--color-border)' }}
        className="space-y-8 pt-10 border-t"
      >
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-bold tracking-tight"
          >
            Designed for Every Stakeholder
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">
            Purpose-built workflows tailored for organizers, verified exhibitors, and attendees.
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
                transition={{ duration: 0.4, delay: 0.15 * idx, ease: 'easeOut' }}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
                className="p-6 rounded-[10px] border space-y-4 card-lift"
              >
                <div
                  style={{
                    backgroundColor: 'var(--color-surface-alt)',
                    borderColor: 'var(--color-border)',
                    color: feat.iconColor,
                  }}
                  className="w-10 h-10 rounded-lg border flex items-center justify-center"
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3
                    style={{ color: 'var(--color-text)' }}
                    className="text-base font-semibold"
                  >
                    {feat.title}
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)' }} className="text-xs leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section
        style={{ borderColor: 'var(--color-border)' }}
        className="space-y-8 pt-10 border-t"
      >
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-bold tracking-tight"
          >
            How It Works
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">
            A clear, three-stage path from setup to live participation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 * idx, ease: 'easeOut' }}
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
              className="p-5 rounded-[10px] border space-y-3 card-lift"
            >
              <div className="flex items-center gap-3">
                <span
                  style={{
                    backgroundColor: 'var(--color-surface-alt)',
                    borderColor: 'var(--color-border)',
                    color: step.color,
                  }}
                  className="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold"
                >
                  {step.num}
                </span>
                <h4 style={{ color: 'var(--color-text)' }} className="text-sm font-semibold">
                  {step.title}
                </h4>
              </div>
              <p style={{ color: 'var(--color-text-muted)' }} className="text-xs leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. CTA Banner */}
      <motion.section
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          borderTop: '2px solid var(--color-primary)',
        }}
        className="p-8 md:p-10 rounded-[10px] border text-center space-y-4 max-w-3xl mx-auto"
      >
        <h3
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
          className="text-xl sm:text-2xl font-bold"
        >
          Ready to join EventSphere?
        </h3>
        <p style={{ color: 'var(--color-text-muted)' }} className="text-xs max-w-md mx-auto leading-relaxed">
          Whether you are coordinating an upcoming convention or attending industry sessions, get started in minutes.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/auth/register" className="px-5 py-2 text-xs font-semibold rounded-lg btn-primary">
            Create Account
          </Link>
          <Link
            to="/auth/login"
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            className="px-5 py-2 text-xs font-semibold rounded-lg border hover:bg-[var(--color-border)] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
