import React from 'react';
import { 
  ArrowRight, 
  Layers, 
  Activity, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { BenchmarkStudy } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface BenchmarkStudyCardProps {
  study: BenchmarkStudy;
  isSelected?: boolean;
  onSelect: (study: BenchmarkStudy) => void;
  onLaunchLive?: (study: BenchmarkStudy) => void;
  variants?: Variants;
}

export const BenchmarkStudyCard: React.FC<BenchmarkStudyCardProps> = ({
  study,
  isSelected = false,
  onSelect,
  onLaunchLive,
  variants,
}) => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark';

  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden ${
        isSelected
          ? isDark
            ? 'bg-gradient-to-b from-amber-500/10 via-slate-900/90 to-slate-950 border-amber-500/60 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30'
            : 'bg-gradient-to-b from-amber-50 via-white to-slate-50 border-amber-500/70 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30'
          : isDark
            ? 'bg-slate-900/70 hover:bg-slate-900/95 border-white/10 hover:border-cyan-500/40 shadow-lg hover:shadow-cyan-500/5'
            : 'bg-white hover:bg-slate-50/90 border-slate-200 hover:border-cyan-500/40 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Top Graphic Thumbnail of Simulation Result */}
      <div 
        onClick={() => onSelect(study)}
        className="relative w-full h-44 bg-slate-950 overflow-hidden cursor-pointer select-none border-b border-white/5"
      >
        <SimulationThumbnail studyId={study.id} />

        {/* Verification Grade Tag */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wide uppercase bg-slate-950/80 backdrop-blur-md border border-white/15 text-slate-200 shadow-sm">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>{study.verificationGrade}</span>
        </div>

        {/* Measured Error Pill */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 shadow-sm">
          <span>{study.rmseValue || study.measuredError}</span>
        </div>

        {/* Physics Domain Pill Bottom-Left */}
        <div className="absolute bottom-2.5 left-3 z-10 text-[10px] font-mono text-slate-300 bg-slate-950/70 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
          {study.computationalDomain || study.geometryType}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        
        {/* Title and Literature Citation */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
              {study.referenceAuthor} ({study.referenceYear})
            </span>
          </div>

          <h3 
            onClick={() => onSelect(study)}
            className={`text-lg font-bold tracking-tight cursor-pointer transition-colors ${
              isSelected 
                ? 'text-amber-400' 
                : isDark 
                  ? 'text-white group-hover:text-cyan-300' 
                  : 'text-slate-900 group-hover:text-cyan-600'
            }`}
          >
            {study.title}
          </h3>

          <p className={`text-xs line-clamp-2 leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {study.summary}
          </p>
        </div>

        {/* Study Parameters Matrix */}
        <div className={`grid grid-cols-2 gap-2 p-3 rounded-xl border text-xs font-mono ${
          isDark 
            ? 'bg-slate-950/50 border-white/5' 
            : 'bg-slate-100/70 border-slate-200'
        }`}>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>Reynolds Number</span>
            </div>
            <div className={`font-bold tabular-nums ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              Re = {study.reynoldsNumber.toLocaleString()}
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase">
              <Layers className="w-3 h-3 text-amber-400" />
              <span>Mesh Resolution</span>
            </div>
            <div className={`font-bold tabular-nums ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {study.meshResolution || '256 × 128 Nodes'}
            </div>
          </div>

          <div className="space-y-0.5 pt-1.5 border-t border-white/5">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Verification</span>
            </div>
            <div className="font-semibold text-emerald-400 text-[11px] truncate" title={study.measuredError}>
              {study.measuredError}
            </div>
          </div>

          <div className="space-y-0.5 pt-1.5 border-t border-white/5">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase">
              <SlidersHorizontal className="w-3 h-3 text-purple-400" />
              <span>Flow Speed</span>
            </div>
            <div className={`font-medium text-[11px] truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {study.flowSpeed || 'Subsonic LBM'}
            </div>
          </div>
        </div>

        {/* Action Buttons: View Details & Live Solver */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => onSelect(study)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isSelected
                ? 'bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-md shadow-amber-500/20'
                : isDark
                  ? 'bg-white/10 hover:bg-cyan-500 hover:text-black text-white border border-white/10 hover:border-cyan-500 shadow-sm'
                  : 'bg-slate-900 hover:bg-cyan-600 text-white shadow-sm'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>

          {onLaunchLive && (
            <button
              onClick={() => onLaunchLive(study)}
              title="Launch directly in interactive 2D LBM solver"
              className="py-2 px-3 rounded-lg border border-cyan-500/30 hover:border-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sim</span>
            </button>
          )}
        </div>

      </div>
    </motion.div>
  );
};

/**
 * High-fidelity SVG CFD simulation result thumbnail customized per study.
 * Renders authentic streamlines, vorticity contours, boundary layer physics,
 * and geometry obstacles with clean vector graphics.
 */
const SimulationThumbnail: React.FC<{ studyId: string }> = ({ studyId }) => {
  switch (studyId) {
    case 'lid-driven-cavity':
      return (
        <svg className="w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="none">
          <defs>
            <radialGradient id="vortexGrad" cx="55%" cy="45%" r="45%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.45" />
              <stop offset="85%" stopColor="#0f172a" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.9" />
            </radialGradient>
            <linearGradient id="lidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Background grid */}
          <rect width="320" height="180" fill="#040711" />
          <path d="M 40,20 L 280,20 L 280,160 L 40,160 Z" fill="url(#vortexGrad)" stroke="#1e293b" strokeWidth="1.5" />

          {/* Moving top lid */}
          <line x1="40" y1="20" x2="280" y2="20" stroke="url(#lidGrad)" strokeWidth="3" />
          <polygon points="260,16 276,20 260,24" fill="#f59e0b" />
          <text x="160" y="14" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="middle">
            Top Lid Velocity u_w = 1.0 m/s
          </text>

          {/* Primary central vortex streamlines */}
          <ellipse cx="170" cy="85" rx="75" ry="45" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.75" />
          <ellipse cx="172" cy="83" rx="55" ry="32" fill="none" stroke="#06b6d4" strokeWidth="1.4" strokeOpacity="0.85" />
          <ellipse cx="174" cy="81" rx="35" ry="20" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.95" />
          <ellipse cx="175" cy="80" rx="15" ry="9" fill="#06b6d4" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1.8" />

          {/* Secondary bottom-right corner eddy */}
          <ellipse cx="260" cy="145" rx="16" ry="12" fill="none" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="2 2" />
          {/* Secondary bottom-left corner eddy */}
          <ellipse cx="60" cy="148" rx="14" ry="10" fill="none" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="2 2" />

          {/* Centerline validation probe axis */}
          <line x1="160" y1="20" x2="160" y2="160" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
          <circle cx="160" cy="90" r="3.5" fill="#f59e0b" />
        </svg>
      );

    case 'cylinder-strouhal':
      return (
        <svg className="w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="none">
          <defs>
            <radialGradient id="vortexPos" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="vortexNeg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background */}
          <rect width="320" height="180" fill="#040711" />

          {/* Incoming laminar streamlines */}
          <line x1="10" y1="50" x2="80" y2="50" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.6" />
          <line x1="10" y1="70" x2="70" y2="70" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="10" y1="90" x2="60" y2="90" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.8" />
          <line x1="10" y1="110" x2="70" y2="110" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="10" y1="130" x2="80" y2="130" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.6" />

          {/* Cylinder obstacle */}
          <circle cx="75" cy="90" r="18" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="75" cy="90" r="8" fill="#0f172a" />

          {/* Alternating Karman vortex shedding cores */}
          <circle cx="125" cy="65" r="22" fill="url(#vortexPos)" />
          <circle cx="170" cy="115" r="24" fill="url(#vortexNeg)" />
          <circle cx="215" cy="68" r="26" fill="url(#vortexPos)" />
          <circle cx="260" cy="112" r="28" fill="url(#vortexNeg)" />
          <circle cx="300" cy="72" r="26" fill="url(#vortexPos)" />

          {/* Sinuous wake center streamline */}
          <path
            d="M 93,90 Q 125,50 150,90 T 215,90 T 280,90 T 320,90"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            strokeOpacity="0.75"
          />

          {/* Vortex markers */}
          <circle cx="125" cy="65" r="3" fill="#38bdf8" />
          <circle cx="170" cy="115" r="3" fill="#f59e0b" />
          <circle cx="215" cy="68" r="3" fill="#38bdf8" />
          <circle cx="260" cy="112" r="3" fill="#f59e0b" />
        </svg>
      );

    case 'poiseuille-channel':
      return (
        <svg className="w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="none">
          <defs>
            <linearGradient id="poiseuilleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* Background */}
          <rect width="320" height="180" fill="#040711" />
          <rect x="20" y="35" width="280" height="110" fill="url(#poiseuilleGrad)" stroke="#1e293b" strokeWidth="1" />

          {/* Top and Bottom Channel walls with hatching */}
          <line x1="20" y1="35" x2="300" y2="35" stroke="#94a3b8" strokeWidth="3" />
          <line x1="20" y1="145" x2="300" y2="145" stroke="#94a3b8" strokeWidth="3" />

          {/* Streamlines */}
          <line x1="30" y1="55" x2="290" y2="55" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="30" y1="75" x2="290" y2="75" stroke="#38bdf8" strokeWidth="1.4" strokeOpacity="0.7" />
          <line x1="30" y1="90" x2="290" y2="90" stroke="#f59e0b" strokeWidth="1.8" strokeOpacity="0.9" strokeDasharray="4 2" />
          <line x1="30" y1="105" x2="290" y2="105" stroke="#38bdf8" strokeWidth="1.4" strokeOpacity="0.7" />
          <line x1="30" y1="125" x2="290" y2="125" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />

          {/* Parabolic velocity profile vectors overlay */}
          <path
            d="M 50,35 Q 150,90 50,145"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
          />

          {/* Vector arrows */}
          <line x1="50" y1="55" x2="100" y2="55" stroke="#06b6d4" strokeWidth="1.5" />
          <polygon points="100,53 106,55 100,57" fill="#06b6d4" />

          <line x1="50" y1="72" x2="135" y2="72" stroke="#06b6d4" strokeWidth="1.5" />
          <polygon points="135,70 141,72 135,74" fill="#06b6d4" />

          <line x1="50" y1="90" x2="150" y2="90" stroke="#f59e0b" strokeWidth="2" />
          <polygon points="150,88 158,90 150,92" fill="#f59e0b" />

          <line x1="50" y1="108" x2="135" y2="108" stroke="#06b6d4" strokeWidth="1.5" />
          <polygon points="135,106 141,108 135,110" fill="#06b6d4" />

          <line x1="50" y1="125" x2="100" y2="125" stroke="#06b6d4" strokeWidth="1.5" />
          <polygon points="100,123 106,125 100,127" fill="#06b6d4" />

          <text x="180" y="93" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
            u(y) = 4·u_max·y·(1-y)
          </text>
        </svg>
      );

    case 'backward-facing-step':
      return (
        <svg className="w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="none">
          <defs>
            <radialGradient id="recircGrad" cx="30%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
              <stop offset="80%" stopColor="#06b6d4" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.9" />
            </radialGradient>
          </defs>

          {/* Background */}
          <rect width="320" height="180" fill="#040711" />

          {/* Step Solid Geometry */}
          <path d="M 10,100 L 90,100 L 90,150 L 10,150 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <line x1="90" y1="150" x2="310" y2="150" stroke="#94a3b8" strokeWidth="2" />
          <line x1="10" y1="35" x2="310" y2="35" stroke="#94a3b8" strokeWidth="2" />

          {/* Recirculation zone behind step */}
          <path d="M 90,100 Q 140,105 210,150 L 90,150 Z" fill="url(#recircGrad)" />

          {/* Trapped reverse eddy */}
          <ellipse cx="130" cy="130" rx="25" ry="12" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
          <polygon points="140,116 132,118 140,120" fill="#f59e0b" />

          {/* Separation shear layer line */}
          <path
            d="M 90,100 Q 140,102 210,150"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
          />

          {/* Main flow streamlines above step */}
          <path d="M 10,50 L 90,50 Q 160,55 310,65" fill="none" stroke="#38bdf8" strokeWidth="1.3" strokeOpacity="0.8" />
          <path d="M 10,70 L 90,70 Q 160,80 310,105" fill="none" stroke="#38bdf8" strokeWidth="1.3" strokeOpacity="0.8" />
          <path d="M 10,85 L 90,85 Q 160,105 310,135" fill="none" stroke="#06b6d4" strokeWidth="1.3" strokeOpacity="0.7" />

          {/* Reattachment Stagnation Point X_r */}
          <circle cx="210" cy="150" r="4" fill="#10b981" />
          <line x1="210" y1="150" x2="210" y2="168" stroke="#10b981" strokeWidth="1.5" />
          <text x="210" y="176" fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            X_r Reattachment
          </text>
        </svg>
      );

    case 'naca-0012':
    default:
      return (
        <svg className="w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="none">
          <defs>
            <radialGradient id="airfoilSuctionGrad" cx="35%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background */}
          <rect width="320" height="180" fill="#040711" />

          {/* Suction surface low pressure glow */}
          <ellipse cx="140" cy="70" rx="70" ry="35" fill="url(#airfoilSuctionGrad)" />

          {/* Upper accelerated suction streamlines */}
          <path d="M 20,60 Q 100,50 140,55 T 290,80" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.9" />
          <path d="M 20,40 Q 100,32 140,40 T 290,65" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.7" />

          {/* NACA 0012 Airfoil Profile at Angle of Attack */}
          <g transform="translate(130, 95) rotate(-6)">
            {/* Airfoil solid geometry */}
            <path
              d="M -70,0 C -60,-16 0,-18 70,0 C 0,14 -60,12 -70,0 Z"
              fill="#1e293b"
              stroke="#e2e8f0"
              strokeWidth="2"
            />
            {/* Chord line */}
            <line x1="-70" y1="0" x2="70" y2="0" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" />
            {/* Stagnation point at leading edge */}
            <circle cx="-70" cy="0" r="3.5" fill="#f59e0b" />
          </g>

          {/* Lower pressure surface streamlines */}
          <path d="M 20,115 Q 100,125 150,120 T 290,115" fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeOpacity="0.75" />
          <path d="M 20,135 Q 100,142 150,140 T 290,135" fill="none" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />

          {/* Angle of Attack Annotation */}
          <text x="250" y="45" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
            α = 4.0°
          </text>
          <text x="250" y="58" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            C_l = 0.437
          </text>
        </svg>
      );
  }
};
