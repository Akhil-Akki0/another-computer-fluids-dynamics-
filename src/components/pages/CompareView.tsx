import React from 'react';
import { Scale, Check, X, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { COMPARISON_DATA } from '../../data/comparison';
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

export const CompareView: React.FC = () => {
  const { setRoute, theme } = useAppStore();

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
          <Scale className="w-4 h-4" />
          <span>Vendor & Architecture Evaluation</span>
        </div>
        <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          AetherCFD vs Traditional Solvers
        </h1>
        <p className={`text-base leading-relaxed ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
        }`}>
          An honest, side-by-side engineering appraisal comparing browser-native Lattice Boltzmann against enterprise desktop suites (Ansys Fluent) and cloud platforms (SimScale, Luminary Cloud, Navier AI).
        </p>
      </motion.div>

      {/* Comparison table */}
      <motion.div variants={itemVariants} className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/80">
                <th className="py-4 px-6 font-mono text-[11px] uppercase tracking-wider text-slate-400 w-1/4">
                  Feature / Capability
                </th>
                <th className="py-4 px-6 font-bold text-cyan-300 bg-cyan-950/40 border-x border-cyan-500/20 w-1/4">
                  AetherCFD (In-Browser)
                </th>
                <th className="py-4 px-6 font-semibold text-slate-300 w-1/4">
                  Ansys Fluent (Desktop)
                </th>
                <th className="py-4 px-6 font-semibold text-slate-300 w-1/4">
                  SimScale / Luminary (Cloud)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {COMPARISON_DATA.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-200">
                    <div>{row.feature}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{row.category}</div>
                  </td>
                  <td className="py-4 px-6 font-medium text-cyan-200 bg-cyan-950/20 border-x border-cyan-500/20">
                    {row.aetherCfd}
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {row.traditionalAnsys}
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {row.cloudSimScale}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Honesty block */}
      <motion.div variants={itemVariants} className="p-6 rounded-2xl border border-white/10 bg-slate-950/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Honest Evaluation Commitment</span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            AetherCFD is intentionally focused on rapid 2D conceptual iteration, education, and canonical verification. For certification-grade multi-billion cell 3D aero-acoustics or combustion chemistry, high-performance computing clusters running commercial software remain appropriate.
          </p>
        </div>
        <button
          onClick={() => setRoute('simulator')}
          className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-xs flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
        >
          <span>Try Free Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>

    </motion.div>
  );
};
