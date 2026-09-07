import React from 'react';
import { Layers, Users, Compass, Sparkles, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const roles = [
  {
    icon: Layers,
    color: 'var(--color-primary)',
    title: 'Event Organizers',
    desc: 'Administrators maintain complete control over expo scheduling, booth dimensions, pricing tiers, exhibitor document verification, and overarching logistics.',
  },
  {
    icon: Users,
    color: 'var(--color-success)',
    title: 'Exhibitors & Vendors',
    desc: 'Companies manage branding, select available booth slots on live floorplans, view neighboring stands, and handle commercial inquiry messages from delegates.',
  },
  {
    icon: Compass,
    color: 'var(--color-accent)',
    title: 'Delegates & Attendees',
    desc: 'Visitors register for expos, build a personalized daily agenda by bookmarking speaker sessions, check in at booths, and send questions directly to vendors.',
  },
];

const AboutPage = () => {
  return (
    <div className="space-y-16 md:space-y-20 max-w-4xl mx-auto">
      {/* 1. About EventSphere Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="space-y-4 pt-2"
      >
        <div
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium"
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
          <span>About the Platform</span>
        </div>

        <h1
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
          className="text-3xl sm:text-4xl font-bold tracking-tight"
        >
          Purpose-Built Exhibition Operations
        </h1>

        <p style={{ color: 'var(--color-text-muted)' }} className="text-sm sm:text-base leading-relaxed font-normal">
          EventSphere is an integrated management environment designed to replace disjointed
          spreadsheets, uncoordinated email chains, and manual floorplan reservations. We serve
          commercial organizers, verified industry vendors, and conference attendees through a
          centralized, role-tailored interface.
        </p>
      </motion.section>

      {/* 2. Mission Statement */}
      <motion.section
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          borderLeft: '3px solid var(--color-primary)',
        }}
        className="p-8 rounded-[10px] border space-y-3"
      >
        <div
          style={{ color: 'var(--color-primary)' }}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
        >
          <Target className="w-4 h-4" />
          <span>Our Mission</span>
        </div>
        <p style={{ color: 'var(--color-text)' }} className="text-base sm:text-lg font-medium leading-relaxed">
          "To provide exhibitions, trade fairs, and conventions with dependable digital
          infrastructure that ensures transparency, accelerates onboarding, and turns live event
          logistics into seamless participant experiences."
        </p>
        <p style={{ color: 'var(--color-text-muted)' }} className="text-xs leading-relaxed">
          From verified booth allocations to synchronized speaker tracks and direct inquiry routing, every feature is tuned for operational clarity.
        </p>
      </motion.section>

      {/* 3. Three Role Cards */}
      <section
        style={{ borderColor: 'var(--color-border)' }}
        className="space-y-6 pt-6 border-t"
      >
        <div className="space-y-1">
          <h2
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
            className="text-xl font-bold"
          >
            Who EventSphere Serves
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">
            Distinct portals designed around each stakeholder's responsibilities and goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roles.map((role, idx) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 * idx, ease: 'easeOut' }}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
                className="p-5 rounded-[10px] border space-y-3 card-lift"
              >
                <div
                  style={{
                    backgroundColor: 'var(--color-surface-alt)',
                    borderColor: 'var(--color-border)',
                    color: role.color,
                  }}
                  className="w-8 h-8 rounded-lg border flex items-center justify-center"
                >
                  <Icon className="w-4 h-4" />
                </div>
                <h3 style={{ color: 'var(--color-text)' }} className="text-sm font-semibold">
                  {role.title}
                </h3>
                <p style={{ color: 'var(--color-text-muted)' }} className="text-xs leading-relaxed">
                  {role.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
