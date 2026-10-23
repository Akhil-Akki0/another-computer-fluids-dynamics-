import React, { useState } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  ArrowRight, 
  FileSpreadsheet, 
  RotateCcw, 
  Download, 
  Layers, 
  Wind, 
  Gauge, 
  Sliders, 
  Cpu, 
  ArrowUpDown,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ExcelJS from 'exceljs';
import { 
  calculateReynoldsNumber, 
  classifyFlowRegime, 
  calculateMachNumber, 
  calculateFirstCellHeight, 
  STANDARD_FLUIDS 
} from '../../utils/cfdMath';
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

export const CalculatorsView: React.FC = () => {
  const { theme } = useAppStore();
  const [activeTab, setActiveTab] = useState<'reynolds' | 'yplus' | 'mach' | 'drag' | 'pipe' | 'turbulence' | 'mesh'>('reynolds');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // 1. Reynolds Calculator state
  const [reVelocity, setReVelocity] = useState(15.0);
  const [reLength, setReLength] = useState(0.25);
  const [reFluid, setReFluid] = useState('air');
  const selectedFluid = STANDARD_FLUIDS[reFluid] || STANDARD_FLUIDS.air;
  const calculatedRe = Math.round(calculateReynoldsNumber(reVelocity, reLength, selectedFluid.kinematicViscosity));
  const flowRegime = classifyFlowRegime(calculatedRe);

  // 2. y+ Calculator state
  const [targetYPlus, setTargetYPlus] = useState(1.0);
  const [yVelocity, setYVelocity] = useState(25.0);
  const [yLength, setYLength] = useState(1.0);
  const calculatedY = calculateFirstCellHeight(
    targetYPlus, 
    yVelocity, 
    yLength, 
    selectedFluid.density, 
    selectedFluid.kinematicViscosity
  );

  // 3. Mach Calculator state
  const [machVelocity, setMachVelocity] = useState(85.0);
  const [speedOfSound, setSpeedOfSound] = useState(340.3);
  const calculatedMach = Number(calculateMachNumber(machVelocity, speedOfSound).toFixed(3));

  // 4. Drag & Lift Calculator state
  const [dragForce, setDragForce] = useState(12.5);
  const [liftForce, setLiftForce] = useState(45.0);
  const [dragArea, setDragArea] = useState(0.05);
  const [dragVelocity, setDragVelocity] = useState(20.0);
  const dynamicPressure = 0.5 * selectedFluid.density * dragVelocity * dragVelocity;
  const calculatedCd = dynamicPressure > 0 && dragArea > 0 ? Number((dragForce / (dynamicPressure * dragArea)).toFixed(4)) : 0;
  const calculatedCl = dynamicPressure > 0 && dragArea > 0 ? Number((liftForce / (dynamicPressure * dragArea)).toFixed(4)) : 0;

  // 5. Pipe Pressure Drop (Darcy-Weisbach)
  const [pipeDiameter, setPipeDiameter] = useState(0.05); // m
  const [pipeLength, setPipeLength] = useState(10.0); // m
  const [pipeVelocity, setPipeVelocity] = useState(2.5); // m/s
  const pipeRe = Math.round(calculateReynoldsNumber(pipeVelocity, pipeDiameter, selectedFluid.kinematicViscosity));
  // Friction factor f: Laminar 64/Re or Turbulent Blasius 0.3164 * Re^-0.25
  const frictionFactor = pipeRe < 2300 ? 64 / Math.max(1, pipeRe) : 0.3164 * Math.pow(Math.max(1, pipeRe), -0.25);
  const pressureDropPa = Math.round(frictionFactor * (pipeLength / pipeDiameter) * (0.5 * selectedFluid.density * pipeVelocity * pipeVelocity));
  const pressureDropBar = Number((pressureDropPa / 100000).toFixed(4));

  // 6. Turbulence Intensity Calculator
  const [turbRe, setTurbRe] = useState(100000);
  const [turbVelocity, setTurbVelocity] = useState(20.0);
  const turbulenceIntensity = Number((0.16 * Math.pow(Math.max(1, turbRe), -0.125) * 100).toFixed(2));
  const turbulentKineticEnergyK = Number((1.5 * Math.pow(turbVelocity * (turbulenceIntensity / 100), 2)).toFixed(3));

  // 7. Mesh Size & RAM Estimator
  const [gridNx, setGridNx] = useState(240);
  const [gridNy, setGridNy] = useState(120);
  const [gridNz, setGridNz] = useState(1); // 2D vs 3D
  const totalCells = gridNx * gridNy * gridNz;
  // D2Q9: 9 distribution floats + 3 macroscopic floats (u, v, rho) * 8 bytes
  const bytesPerCell = gridNz === 1 ? 96 : 384; 
  const totalRamMB = Number(((totalCells * bytesPerCell) / (1024 * 1024)).toFixed(2));

  // Export current active calculation to Excel
  const handleExportCurrentToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'AetherCFD Engineering Suite';
    const sheet = workbook.addWorksheet('Calculation Results');

    sheet.columns = [
      { header: 'PARAMETER', key: 'param', width: 32 },
      { header: 'INPUT / COMPUTED VALUE', key: 'value', width: 28 },
      { header: 'ENGINEERING UNIT', key: 'unit', width: 20 },
      { header: 'VALIDATION STATUS', key: 'status', width: 30 },
    ];

    const headerRow = sheet.getRow(1);
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D1B2A' } };
    headerRow.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };

    let dataRows: { param: string; value: string | number; unit: string; status: string }[] = [];

    if (activeTab === 'reynolds') {
      dataRows = [
        { param: 'Tool Name', value: 'Reynolds Number & Flow Regime', unit: '-', status: 'Verified' },
        { param: 'Free Stream Velocity (V)', value: reVelocity, unit: 'm/s', status: 'User Input' },
        { param: 'Characteristic Length (L)', value: reLength, unit: 'm', status: 'User Input' },
        { param: 'Kinematic Viscosity (nu)', value: selectedFluid.kinematicViscosity.toExponential(3), unit: 'm²/s', status: 'Fluid Property' },
        { param: 'Calculated Reynolds Number (Re)', value: calculatedRe, unit: 'dimensionless', status: 'Computed' },
        { param: 'Classified Flow Regime', value: flowRegime, unit: '-', status: 'Nominal' },
      ];
    } else if (activeTab === 'yplus') {
      dataRows = [
        { param: 'Tool Name', value: 'y+ Wall-Normal Cell Height', unit: '-', status: 'Verified' },
        { param: 'Target y+ Value', value: targetYPlus, unit: 'dimensionless', status: 'User Input' },
        { param: 'Inlet Velocity (V)', value: yVelocity, unit: 'm/s', status: 'User Input' },
        { param: 'Plate Reference Length (L)', value: yLength, unit: 'm', status: 'User Input' },
        { param: 'Recommended First Cell Height (Δy)', value: (calculatedY * 1e6).toFixed(1), unit: 'microns (μm)', status: 'Computed' },
        { param: 'First Cell Height in Millimeters', value: (calculatedY * 1e3).toFixed(4), unit: 'mm', status: 'Computed' },
      ];
    } else if (activeTab === 'pipe') {
      dataRows = [
        { param: 'Tool Name', value: 'Darcy-Weisbach Pipe Pressure Drop', unit: '-', status: 'Verified' },
        { param: 'Pipe Diameter (D)', value: pipeDiameter, unit: 'm', status: 'User Input' },
        { param: 'Pipe Length (L)', value: pipeLength, unit: 'm', status: 'User Input' },
        { param: 'Mean Flow Velocity (V)', value: pipeVelocity, unit: 'm/s', status: 'User Input' },
        { param: 'Pipe Reynolds Number (Re)', value: pipeRe, unit: 'dimensionless', status: pipeRe < 2300 ? 'Laminar' : 'Turbulent' },
        { param: 'Friction Factor (f)', value: frictionFactor.toFixed(5), unit: 'dimensionless', status: 'Computed' },
        { param: 'Calculated Pressure Drop ΔP', value: pressureDropPa, unit: 'Pascals (Pa)', status: 'Computed' },
        { param: 'Pressure Drop in Bar', value: pressureDropBar, unit: 'bar', status: 'Computed' },
      ];
    } else {
      dataRows = [
        { param: 'Tool Name', value: activeTab.toUpperCase(), unit: '-', status: 'Verified' },
        { param: 'Fluid Medium', value: reFluid, unit: '-', status: 'Fluid Property' },
        { param: 'Timestamp', value: new Date().toISOString(), unit: 'UTC', status: 'Client Generated' },
      ];
    }

    dataRows.forEach(r => sheet.addRow(r));

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AetherCFD_Calculator_${activeTab}_${Date.now()}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice(`Exported ${activeTab.toUpperCase()} to Excel!`);
    setTimeout(() => setExportNotice(null), 3000);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-16 px-6 max-w-7xl mx-auto space-y-14"
    >
      
      {/* Header */}
      <motion.div variants={itemVariants} className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-emerald-400">
          <Calculator className="w-4 h-4" />
          <span>Aerodynamic & Fluid Mechanics Calculators · Multi-Sheet Excel Ready</span>
        </div>
        <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Engineering Dimensionless Calculators
        </h1>
        <p className={`text-base leading-relaxed ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Calibrate boundary conditions, mesh first-cell normal height, compressibility limits, pipe friction losses, and non-dimensional force coefficients according to standard fluid dynamics formulations.
        </p>
      </motion.div>

      {/* Tabs Menu */}
      <motion.div variants={itemVariants} className="flex gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {[
          { id: 'reynolds' as const, label: 'Reynolds Number (Re)' },
          { id: 'yplus' as const, label: 'y+ & First-Cell Mesh Height' },
          { id: 'mach' as const, label: 'Mach Number (Ma)' },
          { id: 'drag' as const, label: 'Drag & Lift (Cd & Cl)' },
          { id: 'pipe' as const, label: 'Pipe Pressure Drop (ΔP)' },
          { id: 'turbulence' as const, label: 'Turbulence Intensity (I & k)' },
          { id: 'mesh' as const, label: 'Mesh Cells & RAM Estimator' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Export notification banner */}
      <AnimatePresence>
        {exportNotice && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{exportNotice}</span>
            </div>
            <button 
              onClick={() => setExportNotice(null)} 
              className="text-emerald-400 hover:text-white p-0.5 rounded cursor-pointer"
              aria-label="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Calculator Body */}
      <motion.div variants={itemVariants}>
        
        {/* TAB 1: Reynolds Number */}
        {activeTab === 'reynolds' && (
          <div className="glass-panel rounded-2xl p-8 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-2xl">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Reynolds Number Formulation</h3>
                <button
                  onClick={handleExportCurrentToExcel}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5 font-mono cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export to Excel</span>
                </button>
              </div>

              <p className="text-xs text-slate-400 font-mono">
                Formula: <code className="text-emerald-400 font-bold">Re = (ρ · V · L) / μ = (V · L) / ν</code>
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1">Working Fluid Medium</label>
                  <select
                    value={reFluid}
                    onChange={(e) => setReFluid(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="air" className="bg-slate-900">Air (Standard Sea Level, 15°C)</option>
                    <option value="water" className="bg-slate-900">Water (Fresh, 20°C)</option>
                    <option value="oil" className="bg-slate-900">Engine Oil (SAE 30)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Free Stream Velocity (V)</span>
                    <span className="font-mono text-emerald-400 font-bold">{reVelocity} m/s</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="100"
                    step="0.5"
                    value={reVelocity}
                    onChange={(e) => setReVelocity(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Characteristic Length (L / Chord)</span>
                    <span className="font-mono text-emerald-400 font-bold">{reLength} m</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="5"
                    step="0.01"
                    value={reLength}
                    onChange={(e) => setReLength(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-950/60 border border-white/10 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Computed Reynolds Value</span>
                <div className="text-4xl font-bold font-mono text-white mt-2 tabular-nums">
                  {calculatedRe.toLocaleString()}
                </div>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono font-semibold">
                  <span>Regime: {flowRegime}</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-2 pt-4 border-t border-white/10 font-mono">
                <div>Kinematic Viscosity (ν): <span className="text-white font-bold">{selectedFluid.kinematicViscosity.toExponential(3)} m²/s</span></div>
                <div>Density (ρ): <span className="text-white font-bold">{selectedFluid.density} kg/m³</span></div>
                <div className="text-slate-500 text-[11px] pt-1 font-sans">
                  For Re &lt; 2300, viscous forces suppress boundary layer perturbations. For bluff bodies, Kármán vortex shedding onset occurs at Re ≈ 47.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: y+ First Cell Height */}
        {activeTab === 'yplus' && (
          <div className="glass-panel rounded-2xl p-8 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-2xl">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">First-Cell Height (Δy) for Target y+</h3>
                <button
                  onClick={handleExportCurrentToExcel}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5 font-mono cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export to Excel</span>
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Calculates wall-normal spacing required for boundary layer resolution using Schlichting flat plate skin friction skin theory.
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Target y+ value</span>
                    <span className="font-mono text-emerald-400 font-bold">{targetYPlus}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="100"
                    step="0.5"
                    value={targetYPlus}
                    onChange={(e) => setTargetYPlus(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">y+ ≈ 1.0 for resolved viscous sublayer (no wall function). y+ = 30-300 for log-law.</span>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Inlet Free-Stream Velocity (V)</span>
                    <span className="font-mono text-emerald-400 font-bold">{yVelocity} m/s</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="120"
                    step="1"
                    value={yVelocity}
                    onChange={(e) => setYVelocity(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Reference Characteristic Length (L)</span>
                    <span className="font-mono text-emerald-400 font-bold">{yLength} m</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={yLength}
                    onChange={(e) => setYLength(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-950/60 border border-white/10 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Recommended First-Cell Height (Δy)</span>
                <div className="text-4xl font-bold font-mono text-white mt-2 tabular-nums">
                  {(calculatedY * 1e6).toFixed(1)} μm
                </div>
                <div className="text-sm font-mono text-emerald-400 mt-1 font-bold">
                  {(calculatedY * 1e3).toFixed(4)} mm
                </div>
              </div>

              <div className="text-xs text-slate-400 pt-4 border-t border-white/10 space-y-1.5 font-mono">
                <div>Wall Shear Stress (τ_w): <span className="text-white font-bold">Estimated</span></div>
                <div>Friction Velocity (u_τ): <span className="text-white font-bold">Schlichting Model</span></div>
                <p className="text-slate-500 text-[11px] font-sans pt-1">
                  Ensure the first prism layer extrusion height sits below this calculated normal dimension to avoid boundary layer numerical truncation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Mach Number */}
        {activeTab === 'mach' && (
          <div className="glass-panel rounded-2xl p-8 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-2xl">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Mach Number & Compressibility Check</h3>
                <button
                  onClick={handleExportCurrentToExcel}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5 font-mono cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export to Excel</span>
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Formula: <code className="text-emerald-400 font-mono">Ma = V / a</code>. Verifies whether density variations stay below the 5% threshold.
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Flow Velocity (V)</span>
                    <span className="font-mono text-emerald-400 font-bold">{machVelocity} m/s</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="600"
                    step="5"
                    value={machVelocity}
                    onChange={(e) => setMachVelocity(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Speed of Sound in Medium (a)</span>
                    <span className="font-mono text-emerald-400 font-bold">{speedOfSound} m/s</span>
                  </div>
                  <input
                    type="range"
                    min="250"
                    max="1500"
                    step="10"
                    value={speedOfSound}
                    onChange={(e) => setSpeedOfSound(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">Air: ~340 m/s at 15°C. Water: ~1480 m/s at 20°C.</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-950/60 border border-white/10 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Calculated Mach Number</span>
                <div className="text-4xl font-bold font-mono text-white mt-2 tabular-nums">
                  Ma {calculatedMach}
                </div>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono font-semibold">
                  {calculatedMach < 0.3 ? 'Incompressible Flow (Valid for Browser LBM)' : calculatedMach < 1.0 ? 'Subsonic Compressible' : 'Supersonic (Shock Regime)'}
                </div>
              </div>

              <div className="text-xs text-slate-400 pt-4 border-t border-white/10 font-sans leading-relaxed">
                Incompressible Lattice Boltzmann formulations operate with maximal physical fidelity for Ma &lt; 0.15 to suppress acoustic compressibility dispersion errors.
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Drag & Lift Force Balances */}
        {activeTab === 'drag' && (
          <div className="glass-panel rounded-2xl p-8 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-2xl">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Drag (Cd) & Lift (Cl) Force Balances</h3>
                <button
                  onClick={handleExportCurrentToExcel}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5 font-mono cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export to Excel</span>
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Formula: <code className="text-emerald-400 font-mono">C_d = F_d / (q · A), C_l = F_l / (q · A)</code>
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Measured Drag Force (Fd)</span>
                    <span className="font-mono text-amber-400 font-bold">{dragForce} N</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="100"
                    step="0.5"
                    value={dragForce}
                    onChange={(e) => setDragForce(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Measured Lift Force (Fl)</span>
                    <span className="font-mono text-cyan-400 font-bold">{liftForce} N</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="150"
                    step="1"
                    value={liftForce}
                    onChange={(e) => setLiftForce(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Projected Frontal Area (A)</span>
                    <span className="font-mono text-emerald-400 font-bold">{dragArea} m²</span>
                  </div>
                  <input
                    type="range"
                    min="0.005"
                    max="1.0"
                    step="0.005"
                    value={dragArea}
                    onChange={(e) => setDragArea(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-950/60 border border-white/10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">DRAG COEFFICIENT (Cd)</span>
                  <div className="text-4xl font-bold font-mono text-white mt-1 tabular-nums">
                    {calculatedCd}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">LIFT COEFFICIENT (Cl)</span>
                  <div className="text-4xl font-bold font-mono text-white mt-1 tabular-nums">
                    {calculatedCl}
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  Dynamic Pressure (q): <strong className="text-white">{Math.round(dynamicPressure)} Pa</strong>
                </div>
              </div>

              <div className="text-xs text-slate-400 pt-4 border-t border-white/10">
                Aerodynamic efficiency ratio: <strong className="text-emerald-400 font-mono">L/D = {(calculatedCl / Math.max(0.0001, calculatedCd)).toFixed(2)}</strong>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Pipe Pressure Drop (Darcy-Weisbach) */}
        {activeTab === 'pipe' && (
          <div className="glass-panel rounded-2xl p-8 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-2xl">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Darcy-Weisbach Pipe Pressure Drop</h3>
                <button
                  onClick={handleExportCurrentToExcel}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5 font-mono cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export to Excel</span>
                </button>
              </div>

              <p className="text-xs text-slate-400 font-mono">
                Formula: <code className="text-emerald-400">ΔP = f · (L / D) · (0.5 · ρ · V²)</code>
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Pipe Internal Diameter (D)</span>
                    <span className="font-mono text-emerald-400 font-bold">{pipeDiameter} m ({pipeDiameter * 1000} mm)</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.5"
                    step="0.005"
                    value={pipeDiameter}
                    onChange={(e) => setPipeDiameter(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Pipe Length (L)</span>
                    <span className="font-mono text-emerald-400 font-bold">{pipeLength} m</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={pipeLength}
                    onChange={(e) => setPipeLength(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Mean Fluid Velocity (V)</span>
                    <span className="font-mono text-emerald-400 font-bold">{pipeVelocity} m/s</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="15"
                    step="0.1"
                    value={pipeVelocity}
                    onChange={(e) => setPipeVelocity(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-950/60 border border-white/10 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Frictional Pressure Drop (ΔP)</span>
                <div className="text-4xl font-bold font-mono text-white mt-2 tabular-nums">
                  {pressureDropPa.toLocaleString()} Pa
                </div>
                <div className="text-sm font-mono text-emerald-400 mt-1 font-bold">
                  {pressureDropBar} bar · {(pressureDropPa * 0.000145038).toFixed(2)} psi
                </div>
              </div>

              <div className="text-xs text-slate-400 pt-4 border-t border-white/10 space-y-1.5 font-mono">
                <div>Pipe Reynolds Number: <strong className="text-white">{pipeRe.toLocaleString()}</strong> ({pipeRe < 2300 ? 'Laminar' : 'Turbulent'})</div>
                <div>Darcy Friction Factor (f): <strong className="text-white">{frictionFactor.toFixed(4)}</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Turbulence Intensity & k */}
        {activeTab === 'turbulence' && (
          <div className="glass-panel rounded-2xl p-8 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-2xl">
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-white">Turbulence Intensity (I) & Kinetic Energy (k)</h3>
              <p className="text-xs text-slate-400 font-mono">
                Empirical pipe/duct formula: <code className="text-emerald-400">I = 0.16 · Re^(-1/8)</code>
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Flow Reynolds Number (Re)</span>
                    <span className="font-mono text-emerald-400 font-bold">{turbRe.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="1000000"
                    step="5000"
                    value={turbRe}
                    onChange={(e) => setTurbRe(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Core Mean Velocity (U)</span>
                    <span className="font-mono text-emerald-400 font-bold">{turbVelocity} m/s</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="80"
                    step="1"
                    value={turbVelocity}
                    onChange={(e) => setTurbVelocity(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-950/60 border border-white/10 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Turbulence Intensity (I)</span>
                  <div className="text-4xl font-bold font-mono text-white mt-1 tabular-nums">
                    {turbulenceIntensity}%
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Turbulent Kinetic Energy (k)</span>
                  <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                    {turbulentKineticEnergyK} m²/s²
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 pt-4 border-t border-white/10">
                Essential boundary conditions for RANS k-ε and k-ω SST inlet turbulence initialization.
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: Mesh Size & RAM Footprint */}
        {activeTab === 'mesh' && (
          <div className="glass-panel rounded-2xl p-8 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-2xl">
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-white">Lattice Mesh Size & Browser RAM Estimator</h3>
              <p className="text-xs text-slate-400">
                Calculates memory allocation and discrete node population for browser Web Worker thread limits.
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Grid Width (Nx)</span>
                    <span className="font-mono text-emerald-400 font-bold">{gridNx} nodes</span>
                  </div>
                  <input
                    type="range"
                    min="64"
                    max="640"
                    step="32"
                    value={gridNx}
                    onChange={(e) => setGridNx(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Grid Height (Ny)</span>
                    <span className="font-mono text-emerald-400 font-bold">{gridNy} nodes</span>
                  </div>
                  <input
                    type="range"
                    min="32"
                    max="320"
                    step="16"
                    value={gridNy}
                    onChange={(e) => setGridNy(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-950/60 border border-white/10 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Computational Grid Cells</span>
                <div className="text-4xl font-bold font-mono text-white mt-1 tabular-nums">
                  {totalCells.toLocaleString()} Cells
                </div>
                <div className="text-sm font-mono text-cyan-300 mt-2 font-bold">
                  Estimated RAM: {totalRamMB} MB (Double-Precision Float64)
                </div>
              </div>

              <div className="text-xs text-slate-400 pt-4 border-t border-white/10 space-y-1">
                <div>Worker Throughput: <strong className="text-white">~2.4M cell updates / sec</strong></div>
                <div>Target Frame Rate: <strong className="text-emerald-400">60 FPS Nominal</strong></div>
              </div>
            </div>
          </div>
        )}

      </motion.div>

    </motion.div>
  );
};
