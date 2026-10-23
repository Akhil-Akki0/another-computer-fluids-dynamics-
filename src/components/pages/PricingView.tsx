import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  Cpu, 
  GraduationCap, 
  Building2, 
  ArrowRight, 
  HelpCircle, 
  ShieldCheck, 
  FileSpreadsheet, 
  Zap,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45 },
  },
};

interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaAction: 'simulator' | 'contact';
  highlighted?: boolean;
}

export const PricingView: React.FC = () => {
  const { setRoute, theme } = useAppStore();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const tiers: PricingTier[] = [
    {
      id: 'community',
      name: 'Open Browser Core',
      price: '$0',
      period: 'forever open source',
      description: 'Zero registration, zero installation. Full 2D Lattice Boltzmann simulation directly inside Chrome, Firefox, or Safari.',
      features: [
        'Instant client-side D2Q9 LBM solver',
        'Up to 160x80 (12,800 cell) lattice in real-time Web Workers',
        'Full 6-sheet formatted Excel (.xlsx) workbook export',
        'Embedded force balance telemetry charts in exported sheets',
        'Richardson extrapolation grid convergence plots (GCI)',
        'All 5 canonical validation benchmarks (Ghia, Williamson, etc.)',
        'Complete interactive aerodynamics learning hub & calculators',
        'Zero telemetry: CAD and flow files never leave local browser memory',
      ],
      ctaLabel: 'Launch Free Simulator',
      ctaAction: 'simulator',
      highlighted: false,
    },
    {
      id: 'academic',
      name: 'Academic & University Lab',
      badge: 'Empowering Education',
      price: '$0',
      period: 'free for accredited schools',
      description: 'Dedicated curriculum integration for fluid mechanics professorships, aerospace student chapters, and research laboratories.',
      features: [
        'Everything in Open Browser Core',
        'Classroom assignments pack & reproducible student solution keys',
        'Custom geometry SVG/DXF contour vector import',
        'Direct CSV benchmark dataset generator for lab reports',
        'ASME V&V 20 uncertainty verification documentation package',
        'Dedicated educator support desk with 24h turnaround',
        'Curriculum workshop slides & Python automation notebooks',
        'No student logins or IT department firewall approvals needed',
      ],
      ctaLabel: 'Request Academic Syllabus Pack',
      ctaAction: 'contact',
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise & Dedicated Cluster',
      badge: 'Air-Gapped & Custom',
      price: 'Custom',
      period: 'tailored industrial deployment',
      description: 'For defense, aerospace OEM, and motorsport organizations requiring air-gapped on-premises instances and 3D cluster offload.',
      features: [
        'Everything in Academic & Core',
        'Self-hosted on-premises deployment via Docker / Kubernetes',
        'Air-gapped security mode: 100% network isolation compliance',
        '3D cluster offloading backend (GPU-accelerated LBM & OpenFOAM)',
        'Custom CAD STEP/IGES healing & automated boundary boundary layer mesher',
        'Signed ASME V&V 20 & AIAA G-077 compliance audit trail',
        'Custom constitutive fluid property library (non-Newtonian, cryogenics)',
        'Dedicated senior CFD aerodynamicist SLA & private Slack channel',
      ],
      ctaLabel: 'Consult with CFD Team',
      ctaAction: 'contact',
      highlighted: false,
    },
  ];

  const comparisonFeatures = [
    { name: 'Browser-native 2D LBM Solver (60 FPS)', core: true, academic: true, enterprise: true },
    { name: 'Formatted Excel (.xlsx) Export with Embedded Charts', core: true, academic: true, enterprise: true },
    { name: 'Richardson Extrapolation & GCI Convergence', core: true, academic: true, enterprise: true },
    { name: 'Canonical Benchmarks (Ghia 1982, Williamson 1989)', core: true, academic: true, enterprise: true },
    { name: 'Zero Login / No Account Friction', core: true, academic: true, enterprise: true },
    { name: 'Classroom Curriculum & Lab Solution Manuals', core: false, academic: true, enterprise: true },
    { name: 'Custom DXF / Boundary Vector Geometry Upload', core: false, academic: true, enterprise: true },
    { name: 'Air-Gapped & On-Premises Docker Deployment', core: false, academic: false, enterprise: true },
    { name: '3D GPU Cluster Offload Pipeline (OpenFOAM / CUDA)', core: false, academic: false, enterprise: true },
    { name: 'Certified ASME V&V 20 Audit Documentation', core: false, academic: false, enterprise: true },
    { name: 'Dedicated Aerodynamics SLA & Consultation', core: false, academic: false, enterprise: true },
  ];

  const faqs = [
    {
      q: 'Why is the in-browser simulator completely free with no registration?',
      a: 'AetherCFD was engineered to eliminate artificial commercial friction in aerodynamic education and early concept ideation. By running our discrete Lattice Boltzmann solver in client-side Web Workers using your local CPU/GPU hardware, we incur zero server compute costs per simulation step, allowing us to keep the core workspace permanently open and free.',
    },
    {
      q: 'Are my proprietary CAD geometries or fluid parameters sent to a cloud server?',
      a: 'No. The in-browser simulation engine runs 100% locally inside your browser sandbox. Your mesh parameters, obstacle shapes, velocity fields, and exported Excel workbooks remain exclusively in your local machine memory. We collect zero telemetry and zero design data.',
    },
    {
      q: 'Can university professors use AetherCFD in undergraduate fluid dynamics classes?',
      a: 'Yes, extensively. AetherCFD is designed so students can launch simulations instantly on any computer (Mac, Windows, Linux, Chromebook) without software installation, license dongles, or IT administrator permissions. Contact our team to receive ready-to-teach lab assignment templates.',
    },
    {
      q: 'What is the accuracy of the in-browser solver compared to commercial software?',
      a: 'For 2D incompressible canonical benchmarks (such as the Ghia et al. 1982 lid-driven cavity or Williamson 1989 cylinder shedding), our solver agrees within 0.41% RMSE of published literature data. However, as stated in our Transparency Notice, 2D approximations should never substitute for certified 3D flight-envelope safety compliance.',
    },
    {
      q: 'How does enterprise on-premises deployment work?',
      a: 'We provide containerized Docker images and Helm charts that can be deployed entirely inside your company air-gapped intranet or private AWS/Azure VPC. All telemetry is disabled by default.',
    },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-16 px-6 max-w-7xl mx-auto space-y-20"
    >
      
      {/* 01: Header */}
      <motion.div variants={itemVariants} className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-cyan-400">
          <Zap className="w-4 h-4" />
          <span>Section 01 · Transparent Access & Sizing</span>
        </div>
        <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Accessible Engineering Pricing
        </h1>
        <p className={`text-base leading-relaxed ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Free and open access for students, researchers, and independent engineers. Scalable on-premises and dedicated cluster options for enterprise aerodynamics teams.
        </p>
      </motion.div>

      {/* 02: Pricing Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative rounded-2xl p-8 transition-all flex flex-col justify-between ${
              tier.highlighted
                ? 'border-2 border-cyan-400/80 bg-slate-900/90 shadow-2xl shadow-cyan-950/40'
                : 'border border-white/10 glass-panel'
            }`}
          >
            {tier.badge && (
              <div className="absolute -top-3 left-8 px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black text-[10px] font-bold font-mono tracking-wider uppercase">
                {tier.badge}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed min-h-[48px]">
                  {tier.description}
                </p>
              </div>

              <div className="pt-2 pb-4 border-b border-white/10">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white font-mono">{tier.price}</span>
                  <span className="text-xs text-slate-400 font-mono">/ {tier.period}</span>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase text-slate-400 block tracking-wider font-semibold">
                  Included Capabilities:
                </span>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => {
                  if (tier.ctaAction === 'simulator') {
                    setRoute('simulator');
                  } else {
                    setRoute('contact');
                  }
                }}
                className={`w-full py-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  tier.highlighted
                    ? 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-lg shadow-cyan-500/20'
                    : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                }`}
              >
                <span>{tier.ctaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </motion.div>

      {/* 03: Feature Comparison Table */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400">
          <FileSpreadsheet className="w-4 h-4" />
          <span>Section 02 · Detailed Capability Matrix</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Full Platform Feature Breakdown</h2>

        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/60 font-mono text-slate-400 uppercase text-[11px]">
                  <th className="py-4 px-6 font-semibold">Solver & Workflow Feature</th>
                  <th className="py-4 px-6 text-center font-semibold">Open Browser Core</th>
                  <th className="py-4 px-6 text-center font-semibold text-cyan-400">Academic Lab</th>
                  <th className="py-4 px-6 text-center font-semibold">Enterprise Cluster</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {comparisonFeatures.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-slate-200">
                      {row.name}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      {row.core ? (
                        <div className="inline-flex w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <span className="text-slate-600 font-mono">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-center bg-cyan-950/10">
                      {row.academic ? (
                        <div className="inline-flex w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <span className="text-slate-600 font-mono">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      {row.enterprise ? (
                        <div className="inline-flex w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <span className="text-slate-600 font-mono">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* 04: Enterprise & Research Statement */}
      <motion.div variants={itemVariants} className="p-8 rounded-2xl border border-white/10 bg-slate-950/60 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Section 03 · Air-Gapped Security Architecture</span>
            </div>
            <h3 className="text-xl font-bold text-white">Need On-Premises Air-Gapped Deployment?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We provide turnkey Docker images and Kubernetes manifests configured to operate within zero-trust networks with complete isolation from public DNS and external telemetry.
            </p>
          </div>
          <button
            onClick={() => setRoute('contact')}
            className="px-6 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-xs transition-colors shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>Request Enterprise Specifications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* 05: Frequently Asked Questions */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400">
          <HelpCircle className="w-4 h-4" />
          <span>Section 04 · Procurement & Technical FAQ</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-xl border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-sm text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

    </motion.div>
  );
};
