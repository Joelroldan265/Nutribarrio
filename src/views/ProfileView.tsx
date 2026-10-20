import React, { useState } from 'react';
import {
  UserCheck,
  ShieldCheck,
  Award,
  Download,
  RotateCcw,
  Sliders,
  DollarSign,
  Dumbbell,
  CheckCircle,
  ExternalLink,
  Smartphone,
  Cpu,
  Share2,
} from 'lucide-react';
import { UserProfile, OnboardingPlanConfig } from '../types/nutrition';
import { Users, Calendar, Sparkles, Droplets } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { calculateHydrationTarget } from '../utils/waterTracker';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetData: () => void;
  onOpenInstallModal: () => void;
  onOpenAboutModal: () => void;
  onOpenABCDEModal?: () => void;
  onOpenWizardModal?: () => void;
  onboardingConfig?: OnboardingPlanConfig;
  onOpenWaterModal?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  onResetData,
  onOpenInstallModal,
  onOpenAboutModal,
  onOpenABCDEModal,
  onOpenWizardModal,
  onboardingConfig,
  onOpenWaterModal,
}) => {
  const isOnline = useOnlineStatus();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const [weight, setWeight] = useState(userProfile.weightKg);
  const [proteinFactor, setProteinFactor] = useState(userProfile.proteinFactor);
  const [goal, setGoal] = useState(userProfile.goal);
  const [dailyBudget, setDailyBudget] = useState(userProfile.dailyBudgetLimitMxn);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Auto calculate protein target
  const calculatedProteinTarget = Math.round(weight * proteinFactor);

  const handleSave = () => {
    onUpdateProfile({
      ...userProfile,
      weightKg: weight,
      proteinFactor: proteinFactor,
      goal: goal,
      dailyBudgetLimitMxn: dailyBudget,
      dailyProteinTarget: calculatedProteinTarget,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nutribarrio v1.0.2 Pro',
          text: 'Control estricto de proteína diaria y canasta básica mexicana. Desarrollado por Ing. Joel Roldán Gómez.',
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or not supported
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <div className="space-y-4 pb-28 text-left animate-fade-in">
      {/* Official Authorship & Certification Card (Featured Prominently) */}
      <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950/40 border border-emerald-800/40 p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <ShieldCheck className="w-36 h-36 text-emerald-400" />
        </div>

        <div className="flex items-center gap-2 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-2">
          <Award className="w-4 h-4" />
          <span>Certificación Oficial de Autoría y Arquitectura</span>
        </div>

        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          Nutribarrio
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono">
            v1.0.2 Pro
          </span>
        </h2>

        {/* Signature & Engineer identity */}
        <div className="mt-3 p-3.5 rounded-2xl bg-stone-950/90 border border-stone-800 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-0.5 flex-shrink-0 shadow-md">
              <div className="w-full h-full bg-stone-900 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <p className="text-[11px] text-stone-400">Autoría y Diseño de Software:</p>
              <h3 className="text-sm font-extrabold text-white">
                Ing. Joel Roldán Gómez
              </h3>
              <p className="text-[10px] text-emerald-400 font-medium">
                Arquitecto de Sistemas & Nutrición de Precisión
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
            <span>Sello: <strong className="text-stone-300">AUTORIZADO OFICIAL</strong></span>
            <button
              onClick={onOpenAboutModal}
              className="text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Ver Manifiesto Nutricional →
            </button>
          </div>
        </div>

        {/* ABCDE Clinical Diagnostic Trigger Card */}
        {onOpenABCDEModal && (
          <div
            onClick={onOpenABCDEModal}
            className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-stone-900 border border-emerald-700/50 hover:border-emerald-500 cursor-pointer transition group shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono font-black text-xs flex items-center justify-center border border-emerald-500/30">
                  ABCDE
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Evaluación Clínica ABCDE
                  </h4>
                  <p className="text-[10px] text-stone-300">
                    Antropometría, Bioquímica, Clínica, Dietética y Economía
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-600 text-white shadow-sm">
                Realizar →
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Family Size & Weekly Budget Configuration Card */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 p-5 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Plan Semanal & Presupuesto Familiar
            </h3>
          </div>
          {onOpenWizardModal && (
            <button
              onClick={onOpenWizardModal}
              className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Modificar Cuestionario</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800/80">
            <span className="text-[10px] text-stone-400 block">Comensales:</span>
            <p className="text-sm font-bold text-white mt-0.5">
              {onboardingConfig?.userType === 'familia'
                ? `Familia (${onboardingConfig.peopleCount} personas)`
                : '1 persona (Individual)'}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800/80">
            <span className="text-[10px] text-stone-400 block">Presupuesto Semanal:</span>
            <p className="text-sm font-bold text-amber-400 font-mono mt-0.5">
              ${onboardingConfig?.weeklyBudgetMxn || 750} MXN
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800/80">
            <span className="text-[10px] text-stone-400 block">Días Programados:</span>
            <p className="text-sm font-bold text-white mt-0.5">
              {onboardingConfig?.plannedDays?.length || 7} días seleccionados
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800/80">
            <span className="text-[10px] text-stone-400 block">Estrategia de Menú:</span>
            <p className="text-xs font-bold text-emerald-300 mt-0.5">
              {onboardingConfig?.repetitionPreference === 'nuevo_cada_dia'
                ? '✨ Algo nuevo cada día'
                : onboardingConfig?.repetitionPreference === 'mismo_cada_dia'
                ? '📦 Batch Cooking'
                : '⚖️ Rotación 2 días'}
            </p>
          </div>
        </div>

        {onboardingConfig?.allergies && onboardingConfig.allergies.length > 0 && !onboardingConfig.allergies.includes('ninguno') && (
          <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-900/40 text-[11px] text-rose-300 flex items-center justify-between">
            <span>Alergias excluidas: <strong>{onboardingConfig.allergies.join(', ')}</strong></span>
            <span className="text-[10px] text-rose-400">Protegido</span>
          </div>
        )}
      </div>

      {/* Biometric Calculator & Protein Multiplier */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Calculadora de Precisión Metabólica
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            Fórmula Roldán
          </span>
        </div>

        {/* Weight control */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-stone-300 font-medium">Peso Corporal Actual:</span>
            <span className="text-base font-black text-white font-mono">{weight} kg</span>
          </div>
          <input
            type="range"
            min="45"
            max="120"
            step="1"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-stone-950 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-1">
            <span>45 kg</span>
            <span>70 kg</span>
            <span>120 kg</span>
          </div>
        </div>

        {/* Multiplier control */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-stone-300 font-medium">Factor de Proteína Diaria:</span>
            <span className="text-base font-black text-amber-400 font-mono">
              {proteinFactor.toFixed(1)} g / kg
            </span>
          </div>
          <input
            type="range"
            min="1.6"
            max="2.4"
            step="0.1"
            value={proteinFactor}
            onChange={(e) => setProteinFactor(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-950 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-1">
            <span>1.6g (Mantenimiento)</span>
            <span>2.0g (Hipertrofia Pro)</span>
            <span>2.4g (Déficit Agresivo)</span>
          </div>
        </div>

        {/* Calculated Result Banner */}
        <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-400 block">Tu Umbral Mínimo No Negociable:</span>
            <span className="text-xs text-stone-300 font-medium">
              {weight} kg × {proteinFactor.toFixed(1)} g/kg =
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {calculatedProteinTarget}g
            </span>
            <span className="text-[10px] text-stone-400 block">por día (24h)</span>
          </div>
        </div>

        {/* Goal Selector */}
        <div>
          <label className="text-xs font-semibold text-stone-300 block mb-1.5">
            Objetivo Actual de Composición Corporal:
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { id: 'definicion', label: 'Definición' },
              { id: 'recomposicion', label: 'Recomposición' },
              { id: 'volumen_economico', label: 'Volumen Tianguis' },
            ].map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGoal(g.id as any)}
                className={`py-2 px-2 rounded-xl text-center font-bold border transition text-[11px] ${
                  goal === g.id
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                    : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Budget Slider */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-stone-300 font-medium">Presupuesto Máximo Diario:</span>
            <span className="text-sm font-black text-amber-400 font-mono">${dailyBudget} MXN</span>
          </div>
          <input
            type="range"
            min="60"
            max="250"
            step="10"
            value={dailyBudget}
            onChange={(e) => setDailyBudget(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-950 rounded-lg"
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 active:scale-95 transition flex items-center justify-center gap-2"
        >
          {savedSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 text-white" />
              <span>¡Parámetros Guardados y Sincronizados!</span>
            </>
          ) : (
            <span>Guardar Configuración Personal</span>
          )}
        </button>
      </div>

      {/* Daily Hydration Target & Physical Activity Card */}
      {(() => {
        const { targetMl, targetGlasses, activityExtraMl, proteinExtraMl } = calculateHydrationTarget(
          userProfile,
          onboardingConfig
        );
        return (
          <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-sky-950/40 border border-sky-800/40 p-5 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-950 border border-sky-800/50 flex items-center justify-center text-sky-400">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Meta de Hidratación por Nivel Físico
                  </h3>
                  <span className="text-[10px] text-sky-400 font-mono">
                    Nivel: {userProfile.activityLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              {onOpenWaterModal && (
                <button
                  onClick={onOpenWaterModal}
                  className="px-2.5 py-1 rounded-xl bg-sky-900/60 hover:bg-sky-800/70 text-sky-300 border border-sky-700/50 text-xs font-bold transition active:scale-95"
                >
                  Ver Cronograma
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800">
                <span className="text-[10px] text-stone-400 block">Cuota Diaria Total:</span>
                <p className="text-xl font-black text-sky-400 font-mono mt-0.5">
                  {targetGlasses} Vasos{' '}
                  <span className="text-xs font-normal text-stone-300">({targetMl} ml)</span>
                </p>
                <span className="text-[10px] text-stone-400">~35 ml / kg base</span>
              </div>

              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800">
                <span className="text-[10px] text-stone-400 block">Ajustes Automáticos:</span>
                <p className="text-xs font-bold text-emerald-400 mt-1">
                  +{activityExtraMl} ml por actividad
                </p>
                {proteinExtraMl > 0 && (
                  <p className="text-[10px] text-amber-300 mt-0.5">
                    +{proteinExtraMl} ml aclaramiento proteico
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* PWA Standalone & System Status Card */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Estado de Progressive Web App (PWA)
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
            <span className="text-stone-400">Modo de Instalación:</span>
            <span className="font-semibold text-emerald-400">
              {isInstalled ? 'Standalone (Instalada)' : 'Navegador Web / PWA Lista'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
            <span className="text-stone-400">Service Worker & Caché:</span>
            <span className="font-semibold text-emerald-400">Activo (v1.1.0 Offline)</span>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
            <span className="text-stone-400">Conectividad de Red:</span>
            <span className={`font-semibold ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isOnline ? 'En Línea' : 'Sin Conexión (Operando de Caché)'}
            </span>
          </div>
        </div>

        {/* PWA Action buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onOpenInstallModal}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 active:scale-95 transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instalar PWA</span>
          </button>

          <button
            onClick={handleShareApp}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 active:scale-95 transition"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Compartir App</span>
          </button>
        </div>
      </div>

      {/* Production Deployment & Data Management */}
      <div className="p-4 rounded-3xl bg-stone-900/60 border border-stone-800/80 flex items-center justify-between text-xs">
        <div>
          <p className="font-bold text-stone-300">Reiniciar Datos Locales</p>
          <p className="text-[10px] text-stone-500">Restaura los menús y la canasta básica inicial</p>
        </div>
        <button
          onClick={onResetData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-rose-950/60 hover:text-rose-300 text-stone-400 text-xs font-semibold border border-stone-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer</span>
        </button>
      </div>
    </div>
  );
};
