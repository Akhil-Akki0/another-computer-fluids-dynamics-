import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Copy, 
  Check, 
  Compass, 
  Layers, 
  FileSpreadsheet, 
  ShieldCheck, 
  Cpu,
  GraduationCap
} from 'lucide-react';
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

export const ContactView: React.FC = () => {
  const { setRoute, theme } = useAppStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    industry: 'aerospace',
    inquiryType: 'mesh_convergence',
    reynoldsRange: 'transitional',
    meshTarget: 'browser_standard',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      const generatedId = `AE-CFD-${Math.floor(1000 + Math.random() * 9000)}`;
      setReferenceId(generatedId);
      setSubmitted(true);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-16 px-6 max-w-7xl mx-auto space-y-16"
    >
      
      {/* 01: Header */}
      <motion.div variants={itemVariants} className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-cyan-400">
          <MessageSquare className="w-4 h-4" />
          <span>Section 01 · Technical Consultation & Academic Engagement</span>
        </div>
        <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Talk to a CFD Aerodynamicist
        </h1>
        <p className={`text-base leading-relaxed ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Have questions regarding mesh convergence, boundary layer approximations, custom geometry import, or integrating AetherCFD into university engineering curricula? Reach our technical engineering team.
        </p>
      </motion.div>

      {/* 02: Form and Info Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Form (7 Cols) */}
        <motion.div variants={itemVariants} className="lg:col-span-7 glass-panel rounded-2xl p-8 border border-white/10 shadow-2xl">
          {submitted ? (
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Inquiry Transmitted</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-white">{formData.name}</span>. A senior aerodynamics specialist will review your physics requirements and reply to <span className="text-cyan-400 font-mono">{formData.email}</span> within 24 business hours.
                </p>
              </div>

              {/* Inquiry Reference Ticket Box */}
              <div className="p-4 rounded-xl border border-white/10 bg-slate-950/80 max-w-sm mx-auto flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Reference Ticket ID</span>
                  <span className="text-base font-mono font-bold text-cyan-400">{referenceId}</span>
                </div>
                <button
                  onClick={handleCopyId}
                  className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="pt-4 flex items-center justify-center gap-4">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  Send Another Inquiry
                </button>
                <button
                  onClick={() => setRoute('simulator')}
                  className="px-4 py-2 rounded-lg bg-cyan-400 text-black font-semibold text-xs hover:bg-cyan-300 transition-colors"
                >
                  Back to Simulator
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 block mb-1.5 font-medium">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. Katherine Johnson"
                    className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1.5 font-medium">Work / Academic Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="k.johnson@nasa.gov"
                    className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 block mb-1.5 font-medium">Institution / Company</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="Langley Research Center / Stanford Aero"
                    className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1.5 font-medium">Primary Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="aerospace" className="bg-slate-900 text-white">Aerospace & Defense</option>
                    <option value="automotive" className="bg-slate-900 text-white">Automotive & Motorsport</option>
                    <option value="energy" className="bg-slate-900 text-white">Wind & Hydro Turbines</option>
                    <option value="thermal" className="bg-slate-900 text-white">Electronics Cooling</option>
                    <option value="marine" className="bg-slate-900 text-white">Marine & Hydrodynamics</option>
                    <option value="academic" className="bg-slate-900 text-white">Academic & Teaching</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 block mb-1.5 font-medium">Inquiry Type</label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="mesh_convergence" className="bg-slate-900 text-white">Mesh Convergence & GCI</option>
                    <option value="boundary_conditions" className="bg-slate-900 text-white">Boundary Layer & y+</option>
                    <option value="academic_pack" className="bg-slate-900 text-white">Academic Syllabus Pack</option>
                    <option value="air_gap" className="bg-slate-900 text-white">Air-Gapped Enterprise</option>
                    <option value="custom_benchmark" className="bg-slate-900 text-white">Custom Benchmark Study</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1.5 font-medium">Reynolds Regime</label>
                  <select
                    value={formData.reynoldsRange}
                    onChange={(e) => setFormData({ ...formData, reynoldsRange: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="laminar" className="bg-slate-900 text-white">Re &lt; 2,300 (Laminar)</option>
                    <option value="transitional" className="bg-slate-900 text-white">Re 2,300 - 50,000</option>
                    <option value="turbulent" className="bg-slate-900 text-white">Re &gt; 50,000 (RANS/LES)</option>
                    <option value="compressible" className="bg-slate-900 text-white">Ma &gt; 0.3 (Compressible)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1.5 font-medium">Target Grid Size</label>
                  <select
                    value={formData.meshTarget}
                    onChange={(e) => setFormData({ ...formData, meshTarget: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="browser_standard" className="bg-slate-900 text-white">&lt; 15,000 cells (Web Worker)</option>
                    <option value="workstation" className="bg-slate-900 text-white">15k - 200k cells (GPU)</option>
                    <option value="cluster" className="bg-slate-900 text-white">&gt; 1M cells (HPC Cluster)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1.5 font-medium">Technical Inquiry or Physics Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detail your boundary conditions, obstacle geometry, Reynolds number target, or course syllabus needs..."
                  className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-cyan-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Technical Consultation</span>
              </button>
            </form>
          )}
        </motion.div>

        {/* Right Info (5 Cols) */}
        <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-slate-950/60 space-y-5 shadow-xl">
            <h3 className="font-bold text-white text-sm">Direct Scientific Communications</h3>
            
            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-white block">aerodynamics@aethercfd.org</span>
                  <span className="text-slate-400 text-[11px]">Primary technical response desk (24h SLA)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-white block">academic@aethercfd.org</span>
                  <span className="text-slate-400 text-[11px]">University curriculum & laboratory course packs</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-white block">AIAA & ASME Working Groups</span>
                  <span className="text-slate-400 text-[11px]">ASME V&V 20 & AIAA G-077 committee liaison</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 leading-relaxed">
              For academic course licensing and student workshop accounts, educational access is always 100% free with zero registration and unlimited browser exports.
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 glass-panel space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Data Protection Guarantee</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              All communications and simulation parameter files submitted through this portal are treated as confidential engineering disclosures and are never incorporated into public training datasets.
            </p>
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
};
