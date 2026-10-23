import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  CheckCircle2, 
  ChevronRight, 
  HelpCircle, 
  GraduationCap, 
  Play, 
  Award, 
  Flame, 
  ArrowRight,
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

const GLOSSARY_TERMS = [
  { term: 'Reynolds Number (Re)', category: 'Dimensionless', def: 'Ratio of inertial to viscous forces: Re = ρVL/μ. Governs transition between laminar streamlines and turbulent mixing.' },
  { term: 'Lattice Boltzmann Method (LBM)', category: 'Numerics', def: 'Mesoscopic solver paradigm evolving particle distribution functions across discrete velocity spaces (e.g. D2Q9) instead of directly discretizing Navier-Stokes.' },
  { term: 'Courant-Friedrichs-Lewy (CFL)', category: 'Stability', def: 'Stability condition in explicit numerical PDE solvers: CFL = u·Δt/Δx. In LBM, lattice velocity must stay below c_s ≈ 0.577 to prevent instability.' },
  { term: 'Kármán Vortex Street', category: 'Phenomena', def: 'Repeating pattern of alternating swirling vortices detached from blunt bodies at Re > 47, governed by Strouhal shedding frequency.' },
  { term: 'Boundary Layer', category: 'Boundary Physics', def: 'Viscous shear zone adjacent to solid walls where velocity gradients transition from zero (no-slip condition) to free-stream U_inf.' },
  { term: 'y+ (y-plus)', category: 'Meshing', def: 'Dimensionless wall distance: y+ = y·u_τ/ν. For resolved viscous sublayers without wall functions, target y+ ≈ 1.' },
  { term: 'Strouhal Number (St)', category: 'Dimensionless', def: 'Dimensionless vortex shedding frequency: St = f·L/U. Approximates St ≈ 0.198·(1 - 19.7/Re) for circular cylinders.' },
  { term: 'Boussinesq Approximation', category: 'Thermodynamics', def: 'Formulation where fluid density variations are neglected in mass conservation and viscous terms, but retained in the gravitational buoyancy source.' },
  { term: 'BGK Single Relaxation Time', category: 'LBM Collision', def: 'Bhatnagar-Gross-Krook approximation representing particle collision toward Maxwellian equilibrium with a single relaxation timescale tau = 3ν + 0.5.' },
  { term: 'Bounce-Back Condition', category: 'Boundary Physics', def: 'Simple, exact no-slip boundary enforcement in Lattice Boltzmann where incoming momentum distribution vectors are reflected 180° back to the source node.' },
  { term: 'Grid Convergence Index (GCI)', category: 'Verification', def: 'ASME standard method for numerical discretization error estimation based on generalized Richardson extrapolation across three mesh densities.' },
  { term: 'Mach Number (Ma)', category: 'Dimensionless', def: 'Ratio of local flow velocity to the speed of sound: Ma = V/a. Incompressible solvers require Ma < 0.3 for negligible density change.' },
];

const QUIZ_QUESTIONS = [
  {
    question: 'In the Lattice Boltzmann Method (D2Q9), what governs numerical stability during the collision step?',
    options: [
      'Relaxation time tau must be strictly greater than 0.5',
      'The Mach number must exceed 1.0',
      'The viscosity must be negative',
      'The grid spacing must be non-uniform'
    ],
    correctAnswer: 0,
    explanation: 'Since kinematic viscosity is ν = (tau - 0.5)/3, tau must remain strictly greater than 0.5 for physical, positive fluid viscosity.'
  },
  {
    question: 'When resolving a turbulent boundary layer without semi-empirical wall functions (y+ resolved), what is the target first-cell height y+?',
    options: [
      'y+ ≈ 30 to 300',
      'y+ ≈ 1.0 (Viscous Sublayer)',
      'y+ > 1000',
      'y+ = 0.0001'
    ],
    correctAnswer: 1,
    explanation: 'A target y+ ≈ 1.0 ensures the first computational cell sits inside the laminar viscous sublayer where linear velocity profiles dominate.'
  },
  {
    question: 'At what approximate Reynolds number does flow past a smooth circular cylinder first exhibit periodic Kármán vortex street shedding?',
    options: [
      'Re ≈ 0.1',
      'Re ≈ 47',
      'Re ≈ 5,000,000',
      'Re = 0 (Potential Flow)'
    ],
    correctAnswer: 1,
    explanation: 'The Hopf bifurcation from steady symmetric recirculation bubbles to periodic shedding occurs at the critical Reynolds number Re ≈ 47.'
  },
  {
    question: 'According to the incompressible flow criterion, below what Mach number are density variations typically negligible (< 5%)?',
    options: [
      'Ma < 0.3',
      'Ma < 1.5',
      'Ma < 5.0',
      'Ma = 0.85'
    ],
    correctAnswer: 0,
    explanation: 'For Ma < 0.3, dynamic pressure variations induce less than 5% density compression, permitting the incompressible Navier-Stokes formulation.'
  }
];

export const LearnView: React.FC = () => {
  const { setRoute, theme } = useAppStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const categories = ['all', 'Dimensionless', 'Numerics', 'Boundary Physics', 'Meshing', 'Stability'];

  const filteredGlossary = GLOSSARY_TERMS.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(search.toLowerCase()) || 
                          item.def.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAnswerQuiz = (optionIdx: number) => {
    if (quizAnswered) return;
    setSelectedQuizOption(optionIdx);
    setQuizAnswered(true);
    if (optionIdx === QUIZ_QUESTIONS[currentQuizIndex].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedQuizOption(null);
      setQuizAnswered(false);
    } else {
      // Completed
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedQuizOption(null);
    setQuizAnswered(false);
    setQuizScore(0);
  };

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
          <BookOpen className="w-4 h-4" />
          <span>CFD Learning Hub · Theory, Formulas & Interactive Quizzes</span>
        </div>
        <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Computational Fluid Dynamics Fundamentals
        </h1>
        <p className={`text-base leading-relaxed ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Master the mathematical formulations, boundary layer physics, discrete collision-streaming steps, and verification standards that power modern aerodynamics.
        </p>
      </motion.div>

      {/* Curriculum path (5 Modules) */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <span>Mastery Curriculum Path</span>
          </h2>
          <span className="text-xs font-mono text-cyan-400">5 Accredited Modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            {
              module: 'Module 01',
              title: 'Governing Equations',
              desc: 'Continuity, Navier-Stokes momentum, and viscous stress tensors.',
              time: '25 mins',
            },
            {
              module: 'Module 02',
              title: 'Lattice Boltzmann',
              desc: 'D2Q9 velocity space, Maxwell equilibrium, and BGK streaming.',
              time: '35 mins',
            },
            {
              module: 'Module 03',
              title: 'Boundary Layers',
              desc: 'No-slip bounce-back, moving walls, and y+ first-cell resolution.',
              time: '30 mins',
            },
            {
              module: 'Module 04',
              title: 'Turbulence & Wake',
              desc: 'Kármán vortex street shedding, Strouhal curves, and wake decay.',
              time: '40 mins',
            },
            {
              module: 'Module 05',
              title: 'Verification (V&V 20)',
              desc: 'Richardson grid convergence, GCI indices, and benchmark proof.',
              time: '30 mins',
            },
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="glass-panel p-5 rounded-xl border border-white/10 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">{item.module}</span>
                  <span className="text-[10px] font-mono text-slate-500">{item.time}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>

              <button 
                onClick={() => setRoute('docs')}
                className="pt-2 text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Read Notes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Aerodynamics Formulas Cheat-Sheet */}
      <motion.div variants={itemVariants} className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">Aerodynamics & CFD Formulas Cheat-Sheet</h2>
            <span className="text-xs text-slate-400">Essential non-dimensional equations and numerical bounds</span>
          </div>
          <button
            onClick={() => setRoute('calculators')}
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 text-xs flex items-center gap-1.5 font-semibold cursor-pointer"
          >
            <span>Open Live Calculators</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2">
            <span className="text-cyan-400 font-bold block">1. REYNOLDS NUMBER (RE)</span>
            <div className="text-white text-sm">Re = (ρ · V · L) / μ = (V · L) / ν</div>
            <p className="text-slate-400 font-sans text-xs">Laminar for Re &lt; 2300 in internal pipe flow; transition on flat plate occurs at Re_crit ≈ 5×10^5.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2">
            <span className="text-amber-400 font-bold block">2. STROUHAL VORTEX SHEDDING (ST)</span>
            <div className="text-white text-sm">St = (f · D) / U ≈ 0.198 · (1 - 19.7 / Re)</div>
            <p className="text-slate-400 font-sans text-xs">Empirical correlation for cylinder shedding oscillation frequency matching Williamson 1989 experimental curve.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2">
            <span className="text-emerald-400 font-bold block">3. FIRST-CELL WALL HEIGHT (Y+)</span>
            <div className="text-white text-sm">y+ = (y · u_τ) / ν, where u_τ = √(τ_w / ρ)</div>
            <p className="text-slate-400 font-sans text-xs">Target y+ ≈ 1.0 for wall-resolved viscous sublayer; y+ ≈ 30-300 for high-Re log-law wall functions.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2">
            <span className="text-purple-400 font-bold block">4. COURANT-FRIEDRICHS-LEWY (CFL)</span>
            <div className="text-white text-sm">CFL = (u · Δt) / Δx ≤ CFL_max</div>
            <p className="text-slate-400 font-sans text-xs">In D2Q9 Lattice Boltzmann, keep lattice velocity u &lt; 0.1 to avoid compressibility dissipation errors.</p>
          </div>
        </div>
      </motion.div>

      {/* Interactive CFD Engineering Quiz */}
      <motion.div variants={itemVariants} className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Interactive CFD Engineering Knowledge Check</h2>
              <span className="text-xs text-slate-400">Test your fluid mechanics comprehension in real time</span>
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-400">Score: <strong className="text-emerald-400">{quizScore}</strong> / {QUIZ_QUESTIONS.length}</span>
            <button
              onClick={handleResetQuiz}
              className="p-1.5 rounded hover:bg-white/5 text-slate-400 hover:text-white"
              title="Reset Quiz"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Question */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
            <span>QUESTION {currentQuizIndex + 1} OF {QUIZ_QUESTIONS.length}</span>
            <span className="text-slate-500 font-sans">Multiple Choice</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white">
            {QUIZ_QUESTIONS[currentQuizIndex].question}
          </h3>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {QUIZ_QUESTIONS[currentQuizIndex].options.map((opt, oIdx) => {
              const isSelected = selectedQuizOption === oIdx;
              const isCorrect = oIdx === QUIZ_QUESTIONS[currentQuizIndex].correctAnswer;
              let btnStyle = 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-200';

              if (quizAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                } else {
                  btnStyle = 'opacity-40 bg-white/5 border-white/5 text-slate-400';
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleAnswerQuiz(oIdx)}
                  disabled={quizAnswered}
                  className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {quizAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {quizAnswered && (
            <motion.div 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-3"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Technical Explanation</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {QUIZ_QUESTIONS[currentQuizIndex].explanation}
              </p>
              
              <div className="flex justify-end pt-1">
                {currentQuizIndex < QUIZ_QUESTIONS.length - 1 ? (
                  <button
                    onClick={handleNextQuiz}
                    className="px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Next Question
                  </button>
                ) : (
                  <div className="text-xs text-emerald-400 font-bold font-mono">
                    Quiz Completed! Final Score: {quizScore} / {QUIZ_QUESTIONS.length}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Searchable Glossary Section */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Searchable CFD Engineering Glossary</h2>
            <p className="text-xs text-slate-400">Instant lookup for non-dimensional groups and numerical definitions</p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search terms (e.g. 'y+', 'LBM', 'CFL')..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-mono transition-colors cursor-pointer capitalize whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Glossary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGlossary.length === 0 ? (
            <div className="col-span-3 py-12 text-center text-xs text-slate-400">
              No glossary definitions match "{search}". Try searching "Reynolds", "CFL", or "Boundary".
            </div>
          ) : (
            filteredGlossary.map((item, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -2 }}
                className="p-4 rounded-xl border border-white/10 bg-slate-950/40 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-cyan-300 font-mono">{item.term}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.def}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

    </motion.div>
  );
};
