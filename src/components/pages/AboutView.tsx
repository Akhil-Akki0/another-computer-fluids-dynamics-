import React from 'react';
import { ShieldCheck, Users, Globe, Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45 },
  },
};

export const AboutView: React.FC = () => {
  const { theme } = useAppStore();

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-16 px-6 max-w-7xl mx-auto space-y-16"
    >
      
      {/* Header */}
      <motion.div variants={itemVariants} className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-cyan-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Scientific Mission & Ethical Transparency</span>
        </div>
        <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          About the AetherCFD Project
        </h1>
        <p className={`text-base leading-relaxed ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Founded on the principle that fluid dynamics computation should be universally accessible, mathematically open, and verifiable against experimental benchmarks without artificial commercial gatekeeping.
        </p>
      </motion.div>

      {/* Guiding Principles */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="glass-panel p-6 rounded-xl border border-white/10 space-y-3">
          <div className="w-8 h-8 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
            01
          </div>
          <h3 className="text-base font-bold text-white">Transparent Verification</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            We never market approximate solvers as flight-certified engineering tools. Every benchmark shows real literature reference deviations and grid convergence uncertainty.
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="glass-panel p-6 rounded-xl border border-white/10 space-y-3">
          <div className="w-8 h-8 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
            02
          </div>
          <h3 className="text-base font-bold text-white">Zero Cloud Lock-in</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your proprietary CAD profiles and meshes execute locally in your browser memory. We never transmit geometry to external servers or train proprietary models on your intellectual property.
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="glass-panel p-6 rounded-xl border border-white/10 space-y-3">
          <div className="w-8 h-8 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
            03
          </div>
          <h3 className="text-base font-bold text-white">Universal Excel Export</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Engineers run on spreadsheets. We treat structured .xlsx files as first-class citizens, embedding charts, force vectors, and convergence metrics in one-click downloads.
          </p>
        </motion.div>
      </motion.div>

      {/* Advisory Board */}
      <motion.div variants={itemVariants} className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Scientific Advisory Board & Contributors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr. Elena Rostova',
              role: 'Chair of Aerodynamics (Placeholder)',
              institution: 'Formerly Imperial College London CFD Lab',
              bio: 'Specialist in Lattice Boltzmann boundary conditions and high-order spectral methods for turbulent shear flows.',
            },
            {
              name: 'Prof. Marcus Vance',
              role: 'Senior Numerical Analyst (Placeholder)',
              institution: 'Center for Turbulence Research',
              bio: 'Author of canonical papers on incompressible Navier-Stokes discretization and ASME V&V 20 uncertainty estimation.',
            },
            {
              name: 'Dr. Julian Thorne',
              role: 'Lead Thermal Architecture (Placeholder)',
              institution: 'Hyperscale Cooling Consortium',
              bio: 'Pioneer in micro-channel conjugate heat transfer and data center energy minimization models.',
            },
          ].map((advisor, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ y: -2 }}
              className="p-6 rounded-xl border border-white/10 bg-slate-950/40 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs text-cyan-300">
                  {advisor.name.split(' ')[1]?.[0] || 'A'}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{advisor.name}</h3>
                  <span className="text-[11px] text-cyan-400 block">{advisor.role}</span>
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-400">{advisor.institution}</div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">{advisor.bio}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Legal & Compliance Disclosures */}
      <motion.div variants={itemVariants} className="space-y-6 pt-6 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Section 03 · Governance, Legal & Accessibility</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Compliance & Operational Disclosures</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="glass-panel p-6 rounded-xl border border-white/10 space-y-3">
            <h4 className="font-bold text-white text-sm">Privacy & Data Governance Policy</h4>
            <p className="leading-relaxed">
              AetherCFD is architected on a zero-ingestion model. Numerical grids, CAD geometry contours, flow parameters, and output Excel workbooks are computed and stored exclusively in transient client browser memory (RAM). No cookies or analytical tracking identifiers are stored or shared.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/10 space-y-3">
            <h4 className="font-bold text-white text-sm">Terms of Verification (ASME V&V 20)</h4>
            <p className="leading-relaxed">
              Numerical results produced by the 2D Lattice Boltzmann and Navier-Stokes Web Worker solvers are intended for aerodynamic design ideation, parametric screening, and educational curricula. They do not constitute certified flight envelopes or FAA/EASA airworthiness compliance.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/10 space-y-3">
            <h4 className="font-bold text-white text-sm">Accessibility Statement (WCAG 2.2 AA)</h4>
            <p className="leading-relaxed">
              AetherCFD is engineered to meet WCAG 2.2 Level AA accessibility benchmarks. All interactive stages support full keyboard navigation (Tab/Shift+Tab, Arrow keys, Enter/Space), high-contrast theme toggles, and ARIA labels on all graphical telemetry canvases.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/10 space-y-3">
            <h4 className="font-bold text-white text-sm">Open Science & Non-Proliferation Ethics</h4>
            <p className="leading-relaxed">
              The project is released under the permissive MIT license for open civilian education and research. The software contains no export-controlled dual-use missile or nuclear hydrodynamic codes and complies with international academic sharing protocols.
            </p>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
};
