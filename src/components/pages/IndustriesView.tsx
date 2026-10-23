import React from 'react';
import { Compass, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { INDUSTRIES_DATA } from '../../data/industries';
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

export const IndustriesView: React.FC = () => {
  const { selectedIndustryId, setSelectedIndustryId, setRoute, theme } = useAppStore();
  const selectedInd = INDUSTRIES_DATA.find(i => i.id === selectedIndustryId) || INDUSTRIES_DATA[0];

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
          <Compass className="w-4 h-4" />
          <span>Industrial Applications & Physics Regimes</span>
        </div>
        <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Aerodynamic & Thermal Industry Solutions
        </h1>
        <p className={`text-base leading-relaxed ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
        }`}>
          From transonic aerospace separation and Formula ground effects to micro-channel server rack cold plates and blood vessel hemodynamics.
        </p>
      </motion.div>

      {/* Selector row */}
      <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10">
        {INDUSTRIES_DATA.map((ind) => (
          <button
            key={ind.id}
            onClick={() => setSelectedIndustryId(ind.id)}
            className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedInd.id === ind.id
                ? 'bg-cyan-500 text-black font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            {ind.title}
          </button>
        ))}
      </motion.div>

      {/* Active Industry Deep Dive */}
      <motion.div variants={itemVariants}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedInd.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="glass-panel rounded-2xl p-8 sm:p-10 border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-10 shadow-2xl"
          >
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase text-cyan-400 block mb-1 font-bold">
                  {selectedInd.category}
                </span>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedInd.title}
                </h2>
                <p className="text-base text-cyan-300/90 font-medium">
                  {selectedInd.headline}
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedInd.description}
              </p>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Real Engineering Case Proof</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedInd.caseHighlight}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setRoute('simulator')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-xs transition-colors cursor-pointer"
                >
                  <span>Launch Live Simulation for {selectedInd.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Key Physics & Metrics */}
            <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-white/10 lg:pl-10">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Dominant Aerodynamic Physics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedInd.keyPhysics.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-cyan-300"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Reynolds Range:</span>
                  <span className="text-white font-bold">{selectedInd.reynoldsRange}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Mach Regimes:</span>
                  <span className="text-white font-bold">{selectedInd.machRange}</span>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-950/60 border border-white/10 space-y-3 font-mono">
                <div className="text-[11px] uppercase tracking-wider text-slate-400">Validated Benchmarks</div>
                {selectedInd.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">{m.label}</span>
                    <span className="text-emerald-400 font-bold">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

    </motion.div>
  );
};
