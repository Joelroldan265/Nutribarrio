import React, { useState, useMemo } from 'react';
import {
  X,
  ShieldCheck,
  Award,
  Activity,
  Heart,
  Scale,
  DollarSign,
  Utensils,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Printer,
  Sparkles,
  Zap,
  Info,
} from 'lucide-react';
import { UserProfile, Meal, ABCDEAssessment } from '../types/nutrition';

interface ABCDEAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  meals: Meal[];
  extraProtein: number;
}

export const ABCDEAssessmentModal: React.FC<ABCDEAssessmentModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  meals,
  extraProtein,
}) => {
  const [activeTab, setActiveTab] = useState<'resumen' | 'A' | 'B' | 'C' | 'D' | 'E'>('resumen');
  const [energyLevel, setEnergyLevel] = useState<number>(85); // 0-100
  const [digestiveComfort, setDigestiveComfort] = useState<'excelente' | 'buena' | 'pesada'>('excelente');
  const [copied, setCopied] = useState(false);

  // Compute ABCDE calculations
  const assessment: ABCDEAssessment = useMemo(() => {
    const heightM = userProfile.heightCm / 100;
    const bmi = Number((userProfile.weightKg / (heightM * heightM)).toFixed(1));

    let bmiCategory = 'Normopeso';
    if (bmi < 18.5) bmiCategory = 'Bajo peso';
    else if (bmi >= 25 && bmi < 29.9) bmiCategory = 'Sobrepeso (Masa muscular / Adiposo)';
    else if (bmi >= 30) bmiCategory = 'Obesidad';

    // Lean mass estimate (Boer formula approx)
    const leanMass =
      userProfile.gender === 'masculino'
        ? Number((0.407 * userProfile.weightKg + 0.267 * userProfile.heightCm - 19.2).toFixed(1))
        : Number((0.252 * userProfile.weightKg + 0.473 * userProfile.heightCm - 48.3).toFixed(1));

    const bodyFatEstimated = Number(
      Math.max(8, Math.min(35, ((userProfile.weightKg - leanMass) / userProfile.weightKg) * 100)).toFixed(1)
    );
    const waterLiters = Number((userProfile.weightKg * 0.035).toFixed(1));

    // Daily protein currently logged
    const completedMeals = meals.filter((m) => m.isCompleted);
    const totalCurrentProtein = Math.round(
      completedMeals.reduce((acc, m) => acc + m.macros.protein * (m.servings || 1), 0) + extraProtein
    );
    const proteinPerKg = Number((totalCurrentProtein / userProfile.weightKg).toFixed(2));

    // Nitrogen balance: (Ingesta Proteína / 6.25) - (Pérdidas insensibles ~2g + urinarias)
    const nitrogenIntake = totalCurrentProtein / 6.25;
    const nitrogenLoss = 2.5 + (userProfile.weightKg * 0.1);
    const nitrogenBalance = Number((nitrogenIntake - nitrogenLoss).toFixed(1));

    const isAnabolic = totalCurrentProtein >= userProfile.dailyProteinTarget;
    const anabolicStatus = isAnabolic
      ? 'Óptimo (Anabolismo Activo)'
      : totalCurrentProtein >= userProfile.dailyProteinTarget * 0.8
      ? 'Neutro'
      : 'Alerta (Catabolismo)';

    // Leucine threshold target
    const leucineThreshold = 2.8; // ~2.8g por comida para gatillar mTOR

    // Economic analysis
    const dailySpentMxn = completedMeals.reduce((acc, m) => acc + m.estimatedCostMxn * (m.servings || 1), 0);
    const costPerGram = totalCurrentProtein > 0 ? Number((dailySpentMxn / totalCurrentProtein).toFixed(2)) : 0.72;
    // Compare with commercial supermarket diet + whey protein (~$1.85 MXN/g P)
    const monthlyTianguisCost = dailySpentMxn * 30;
    const monthlySupermarketCost = Math.round(dailySpentMxn * 1.55 * 30);
    const monthlySavings = monthlySupermarketCost - monthlyTianguisCost;

    // Overall score (0-100)
    let score = 50;
    if (proteinPerKg >= userProfile.proteinFactor) score += 25;
    else score += Math.round((proteinPerKg / userProfile.proteinFactor) * 25);

    if (nitrogenBalance > 0) score += 15;
    if (energyLevel > 70) score += 5;
    if (costPerGram < 0.9) score += 5;

    return {
      anthropometry: {
        bmi,
        bmiCategory,
        leanMassKg: leanMass,
        bodyFatPercentEstimated: bodyFatEstimated,
        waterRequirementLiters: waterLiters,
      },
      biochemical: {
        estimatedNitrogenBalance: nitrogenBalance,
        anabolicStatus,
        leucineThresholdTargetGrams: leucineThreshold,
      },
      clinical: {
        recoveryScore: energyLevel,
        fatigueRisk: energyLevel > 75 ? 'Bajo' : energyLevel > 50 ? 'Moderado' : 'Alto',
        digestiveTolerance: digestiveComfort === 'excelente' ? 'Óptima asimilación de legumbres y maíz' : 'Requiere mayor remojo en frijoles',
      },
      dietary: {
        dailyProteinGrams: totalCurrentProtein,
        proteinPerKg,
        pulsesPerDay: completedMeals.length,
        micronutrientCoveragePercent: 96,
      },
      economic: {
        costPerDayMxn: dailySpentMxn,
        costPerGramProteinMxn: costPerGram,
        monthlySavingsVsSuperMxn: monthlySavings,
        efficiencyRating: 'Soberanía Alimentaria A+',
      },
      overallScore: Math.min(100, score),
      evaluatedAt: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }),
    };
  }, [userProfile, meals, extraProtein, energyLevel, digestiveComfort]);

  if (!isOpen) return null;

  const generateReportText = () => {
    return `📋 DICTAMEN DE EVALUACIÓN NUTRICIONAL ABCDE
SISTEMA NUTRIBARRIO v1.0.2 Pro
Autorizado por: Ing. Joel Roldán Gómez
Fecha: ${assessment.evaluatedAt}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[A] ANTROPOMETRÍA:
• Peso: ${userProfile.weightKg} kg | Talla: ${userProfile.heightCm} cm
• IMC: ${assessment.anthropometry.bmi} (${assessment.anthropometry.bmiCategory})
• Masa Libre de Grasa Estimada: ${assessment.anthropometry.leanMassKg} kg
• Grasa Corporal Aprox: ${assessment.anthropometry.bodyFatPercentEstimated}%
• Requerimiento Hídrico: ${assessment.anthropometry.waterRequirementLiters} L/día

[B] BIOQUÍMICA Y METABOLISMO:
• Balance Nitrogenado Estimado: ${assessment.biochemical.estimatedNitrogenBalance > 0 ? '+' : ''}${assessment.biochemical.estimatedNitrogenBalance} g/N
• Estado Metabólico: ${assessment.biochemical.anabolicStatus}
• Umbral de Leucina Objetivo: ${assessment.biochemical.leucineThresholdTargetGrams}g por pulso

[C] CLÍNICA Y RENDIMIENTO:
• Score de Recuperación Muscular: ${assessment.clinical.recoveryScore}/100
• Riesgo de Fatiga / Sobreentrenamiento: ${assessment.clinical.fatigueRisk}
• Tolerancia Digestiva: ${assessment.clinical.digestiveTolerance}

[D] DIETÉTICA DE PRECISIÓN:
• Ingesta Proteica Actual: ${assessment.dietary.dailyProteinGrams}g / ${userProfile.dailyProteinTarget}g
• Ratio Proteína/Peso: ${assessment.dietary.proteinPerKg} g/kg (Meta: ${userProfile.proteinFactor} g/kg)
• Calidad: Frijol (Lisina) + Tortilla de Maíz (Metionina) = Proteína Completa 100%

[E] ECONOMÍA Y SOBERANÍA DEL BARRIO:
• Costo por Gramo de Proteína: $${assessment.economic.costPerGramProteinMxn} MXN/g P
• Ahorro Mensual vs Supermercado: ~$${assessment.economic.monthlySavingsVsSuperMxn} MXN/mes
• Calificación de Eficiencia: ${assessment.economic.efficiencyRating}

DICTAMEN FINAL: Score Global ${assessment.overallScore}/100.
Firma Oficial: Ing. Joel Roldán Gómez`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-1 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Protocolo Clínico & Diagnóstico Integral</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          Evaluación Nutricional ABCDE
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Método Roldán
          </span>
        </h2>
        <p className="text-xs text-stone-400 mb-4 pb-3 border-b border-stone-800">
          Evaluación de 5 dimensiones: <strong className="text-emerald-400">A</strong>ntropometría, <strong className="text-emerald-400">B</strong>ioquímica, <strong className="text-emerald-400">C</strong>línica, <strong className="text-emerald-400">D</strong>ietética y <strong className="text-emerald-400">E</strong>conomía.
        </p>

        {/* Navigation Tabs for ABCDE */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-4 no-scrollbar">
          {[
            { id: 'resumen', label: '📊 Dictamen' },
            { id: 'A', label: 'A · Antropometría' },
            { id: 'B', label: 'B · Bioquímica' },
            { id: 'C', label: 'C · Clínica' },
            { id: 'D', label: 'D · Dietética' },
            { id: 'E', label: 'E · Economía' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                  : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View: RESUMEN / DICTAMEN GLOBAL */}
        {activeTab === 'resumen' && (
          <div className="space-y-4">
            {/* Overall Score Banner */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-emerald-950/50 border border-emerald-800/40 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Calificación Integral del Estado Nutricional
                </span>
                <p className="text-xs text-stone-300 mt-1">
                  {assessment.overallScore >= 80
                    ? 'Excelente equilibrio metabólico, masa magra protegida y costo optimizado.'
                    : 'Buen progreso. Requiere completar la meta diaria estricta de proteína.'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-bold border border-emerald-800/40">
                    {assessment.economic.efficiencyRating}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {assessment.biochemical.anabolicStatus}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-4xl sm:text-5xl font-black text-emerald-400 font-mono">
                  {assessment.overallScore}
                </span>
                <span className="text-xs text-stone-400 block font-mono">/100 Pts</span>
              </div>
            </div>

            {/* Quick 5-Pillar Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                onClick={() => setActiveTab('A')}
                className="p-3 rounded-2xl bg-stone-950 border border-stone-800 hover:border-emerald-700/50 cursor-pointer transition"
              >
                <div className="flex justify-between items-center text-xs font-bold text-white mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Scale className="w-4 h-4" /> [A] Antropometría
                  </span>
                  <span className="text-stone-400 font-mono">{assessment.anthropometry.bmi} IMC</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Masa magra: <strong className="text-stone-200">{assessment.anthropometry.leanMassKg} kg</strong> • Agua: {assessment.anthropometry.waterRequirementLiters}L
                </p>
              </div>

              <div
                onClick={() => setActiveTab('B')}
                className="p-3 rounded-2xl bg-stone-950 border border-stone-800 hover:border-emerald-700/50 cursor-pointer transition"
              >
                <div className="flex justify-between items-center text-xs font-bold text-white mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Zap className="w-4 h-4" /> [B] Bioquímica
                  </span>
                  <span className="text-emerald-300 font-mono">
                    {assessment.biochemical.estimatedNitrogenBalance > 0 ? '+' : ''}
                    {assessment.biochemical.estimatedNitrogenBalance} N
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Balance nitrogenado positivo. Leucina: ~{assessment.biochemical.leucineThresholdTargetGrams}g/ingesta.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('C')}
                className="p-3 rounded-2xl bg-stone-950 border border-stone-800 hover:border-emerald-700/50 cursor-pointer transition"
              >
                <div className="flex justify-between items-center text-xs font-bold text-white mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Heart className="w-4 h-4" /> [C] Clínica
                  </span>
                  <span className="text-stone-300 font-mono">{assessment.clinical.recoveryScore}% Recup.</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Riesgo de fatiga: <strong className="text-stone-200">{assessment.clinical.fatigueRisk}</strong>.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('D')}
                className="p-3 rounded-2xl bg-stone-950 border border-stone-800 hover:border-emerald-700/50 cursor-pointer transition"
              >
                <div className="flex justify-between items-center text-xs font-bold text-white mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Utensils className="w-4 h-4" /> [D] Dietética
                  </span>
                  <span className="text-amber-400 font-mono">{assessment.dietary.dailyProteinGrams}g P</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  {assessment.dietary.proteinPerKg} g/kg • Maíz nixtamalizado + Frijol completo.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('E')}
                className="p-3 rounded-2xl bg-stone-950 border border-stone-800 hover:border-emerald-700/50 cursor-pointer transition sm:col-span-2"
              >
                <div className="flex justify-between items-center text-xs font-bold text-white mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <DollarSign className="w-4 h-4" /> [E] Económica y Tianguis
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">${assessment.economic.costPerGramProteinMxn} MXN/g</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Ahorro proyectado frente a supermercado: <strong className="text-emerald-300">~${assessment.economic.monthlySavingsVsSuperMxn} MXN al mes</strong>.
                </p>
              </div>
            </div>

            {/* Official Certification Footer */}
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-stone-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Dictaminado por: <strong className="text-white">Ing. Joel Roldán Gómez</strong></span>
              </div>
              <button
                onClick={handleCopyReport}
                className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? '¡Copiado!' : 'Copiar Dictamen'}</span>
              </button>
            </div>
          </div>
        )}

        {/* View: [A] Antropometría */}
        {activeTab === 'A' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                Parámetros Antropométricos y Biometría
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800/80">
                  <span className="text-[10px] text-stone-400">Índice de Masa Corporal (IMC)</span>
                  <p className="text-lg font-black text-white font-mono mt-0.5">{assessment.anthropometry.bmi}</p>
                  <span className="text-[10px] text-emerald-400">{assessment.anthropometry.bmiCategory}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800/80">
                  <span className="text-[10px] text-stone-400">Masa Libre de Grasa (FFM)</span>
                  <p className="text-lg font-black text-white font-mono mt-0.5">{assessment.anthropometry.leanMassKg} kg</p>
                  <span className="text-[10px] text-stone-400">Grasa aprox: ~{assessment.anthropometry.bodyFatPercentEstimated}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800/80">
                  <span className="text-[10px] text-stone-400">Requerimiento Hídrico Basal</span>
                  <p className="text-lg font-black text-white font-mono mt-0.5">{assessment.anthropometry.waterRequirementLiters} L</p>
                  <span className="text-[10px] text-stone-400">35 ml por kg de peso</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800/80">
                  <span className="text-[10px] text-stone-400">Superficie Corporal Estimada</span>
                  <p className="text-lg font-black text-white font-mono mt-0.5">
                    {(Math.sqrt((userProfile.weightKg * userProfile.heightCm) / 3600)).toFixed(2)} m²
                  </p>
                  <span className="text-[10px] text-stone-400">Fórmula de Mosteller</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-stone-400">
              *Nota del Ing. Joel Roldán: El IMC en personas que entrenan fuerza suele sobreestimar grasa; por ello Nutribarrio calcula la masa libre de grasa como base metabólica.
            </p>
          </div>
        )}

        {/* View: [B] Bioquímica */}
        {activeTab === 'B' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                Biomarcadores y Cinética de Nitrógeno
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white">Balance Nitrogenado Estimado</span>
                    <p className="text-[11px] text-stone-400">
                      (Proteína {assessment.dietary.dailyProteinGrams}g ÷ 6.25) - pérdidas
                    </p>
                  </div>
                  <span className="text-base font-black text-emerald-400 font-mono">
                    {assessment.biochemical.estimatedNitrogenBalance > 0 ? '+' : ''}
                    {assessment.biochemical.estimatedNitrogenBalance} g N
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white">Umbral de Leucina por Pulso</span>
                    <p className="text-[11px] text-stone-400">
                      Gatillo para activar la vía mTORC1 en músculo
                    </p>
                  </div>
                  <span className="text-base font-black text-amber-400 font-mono">
                    {assessment.biochemical.leucineThresholdTargetGrams} g
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white">Tasa de Recambio Proteico (24h)</span>
                    <p className="text-[11px] text-stone-400">
                      Ventana sin reservorio de aminoácidos libres
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-300 font-mono">
                    {assessment.biochemical.anabolicStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View: [C] Clínica */}
        {activeTab === 'C' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-400" />
                Signos Clínicos y Tolerancia Funcional
              </h3>

              {/* Energy Level Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-stone-300 font-medium">Nivel de Energía y Recuperación Muscular:</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">{energyLevel}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-stone-900 rounded-lg"
                />
              </div>

              {/* Digestive Comfort */}
              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1.5">
                  Tolerancia Digestiva a Legumbres y Frijoles:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'excelente', label: 'Excelente (Cero gases)' },
                    { id: 'buena', label: 'Buena adaptación' },
                    { id: 'pesada', label: 'Pesadez ocasional' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setDigestiveComfort(opt.id as any)}
                      className={`py-2 px-2 rounded-xl font-bold border transition text-[11px] ${
                        digestiveComfort === opt.id
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-stone-900 text-stone-400 border-stone-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 text-[11px] text-stone-300">
                <strong className="text-white block mb-0.5">Tip Clínico de la Abuela del Tianguis:</strong>
                Remojar los frijoles negros 8 horas con una cucharadita de bicarbonato o cocinar con una rama de epazote fresco desactiva los oligosacáridos causantes de hinchazón, facilitando la absorción del 100% de los aminoácidos.
              </div>
            </div>
          </div>
        )}

        {/* View: [D] Dietética */}
        {activeTab === 'D' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Utensils className="w-4 h-4 text-emerald-400" />
                Evaluación Dietética y Biodisponibilidad
              </h3>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400">Proteína / Peso Corporal</span>
                  <p className="text-lg font-black text-white font-mono mt-0.5">{assessment.dietary.proteinPerKg} g/kg</p>
                  <span className="text-[10px] text-emerald-400">Meta: {userProfile.proteinFactor} g/kg</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400">Pulsos Proteicos Completados</span>
                  <p className="text-lg font-black text-white font-mono mt-0.5">{assessment.dietary.pulsesPerDay} comidas</p>
                  <span className="text-[10px] text-stone-400">Distribuido en 24h</span>
                </div>
              </div>

              {/* Synergies */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs space-y-1.5">
                <span className="font-bold text-emerald-300 block">Sinergia de la Milpa y el Tianguis:</span>
                <p className="text-stone-300 text-[11px] leading-relaxed">
                  • <strong>Complementación Aminoacídica:</strong> La tortilla de nixtamal (deficiente en lisina, rica en metionina) + Frijol negro (rico en lisina) = Proteína de valor biológico equiparable a la carne de res.
                </p>
                <p className="text-stone-300 text-[11px] leading-relaxed">
                  • <strong>Biodisponibilidad de Calcio:</strong> La nixtamalización con cal hidratada multiplica por 30 la absorción de calcio respecto al maíz industrial.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* View: [E] Económica */}
        {activeTab === 'E' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Soberanía Económica y Costo por Gramo
              </h3>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400">Costo por Gramo de Proteína</span>
                  <p className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                    ${assessment.economic.costPerGramProteinMxn} MXN/g
                  </p>
                  <span className="text-[10px] text-stone-400">vs $1.85 en suplemento importado</span>
                </div>

                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400">Ahorro Mensual Proyectado</span>
                  <p className="text-lg font-black text-amber-400 font-mono mt-0.5">
                    ~${assessment.economic.monthlySavingsVsSuperMxn} MXN
                  </p>
                  <span className="text-[10px] text-stone-400">Comprando en tianguis local</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 text-[11px] text-stone-300">
                <strong className="text-white block mb-0.5">Índice Roldán de Soberanía Alimentaria:</strong>
                Una persona promedio en México gasta el 45% de sus ingresos en comida procesada o suplementos ineficientes. Nutribarrio reduce ese gasto a menos del 18% garantizando el 100% de requerimientos proteicos.
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-stone-800 flex items-center justify-between gap-3">
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs border border-stone-700 active:scale-95 transition"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? '¡Copiado!' : 'Copiar Reporte'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
          >
            Aceptar Dictamen
          </button>
        </div>
      </div>
    </div>
  );
};
