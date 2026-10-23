import React from 'react';
import { Quote, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { CASE_STUDIES } from '../../data/caseStudies';
import { useAppStore } from '../../store/useAppStore';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
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

export const CaseStudiesView: React.FC = () => {
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
          <Quote className="w-4 h-4" />
          <span>Industrial Engagements & Peer Review</span>
        </div>
        <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Aerodynamic Engineering Case Studies
        </h1>
        <p className={`text-base leading-relaxed ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
        }`}>
          How engineering teams use AetherCFD to bypass HPC queue bottlenecks during concept development and export verified CFD datasets directly into design review spreadsheets.
        </p>
      </motion.div>

      {/* Case studies list */}
      <motion.div variants={itemVariants} className="space-y-8">
        {CASE_STUDIES.map((study) => (
          <motion.div
            key={study.id}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="glass-panel rounded-2xl p-8 sm:p-10 border border-white/10 space-y-6 shadow-2xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1 font-bold">
                  {study.sector}
                </span>
                <h2 className="text-2xl font-bold text-white">
                  {study.title}
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1 rounded border border-white/5">
                Client: {study.clientAlias}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-slate-300">
              <div>
                <h4 className="font-bold text-white mb-2">The Engineering Challenge</h4>
                <p className="leading-relaxed">{study.problem}</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">The Solution & Workflow</h4>
                <p className="leading-relaxed">{study.solution}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-cyan-300 font-mono text-xs">
              <strong>Quantified Impact:</strong> {study.quantitativeImpact}
            </div>

            <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40 text-xs italic text-slate-300 leading-relaxed">
              "{study.quote}"
              <span className="block mt-2 font-mono not-italic text-slate-500 text-[11px]">— {study.authorTitle}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </motion.div>
  );
};
