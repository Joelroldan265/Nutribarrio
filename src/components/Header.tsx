import React from 'react';
import { ShieldCheck, Wifi, WifiOff, Download, Sparkles, Sliders, TrendingDown, Droplets } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { OnboardingPlanConfig } from '../types/nutrition';

interface HeaderProps {
  onOpenInstallModal?: () => void;
  onOpenAboutModal?: () => void;
  onOpenBenchmarkModal?: () => void;
  onOpenABCDEModal?: () => void;
  onOpenWizardModal?: () => void;
  onboardingConfig?: OnboardingPlanConfig;
  onOpenOptimizerModal?: () => void;
  savingsMxn?: number;
  onOpenWaterModal?: () => void;
  waterGlasses?: { consumed: number; target: number };
}

export const Header: React.FC<HeaderProps> = ({
  onOpenInstallModal,
  onOpenAboutModal,
  onOpenBenchmarkModal,
  onOpenABCDEModal,
  onOpenWizardModal,
  onboardingConfig,
  onOpenOptimizerModal,
  savingsMxn,
  onOpenWaterModal,
  waterGlasses,
}) => {
  const isOnline = useOnlineStatus();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else if (onOpenInstallModal) {
      onOpenInstallModal();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-950/85 backdrop-blur-xl border-b border-stone-800/80 px-4 py-2.5 transition-all">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Developer Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-0.5 shadow-lg shadow-emerald-950/50 flex items-center justify-center">
              <div className="w-full h-full bg-stone-900 rounded-[10px] flex items-center justify-center overflow-hidden">
                <img src="/icon.svg" alt="Nutribarrio Logo" className="w-8 h-8 object-contain" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-stone-950">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Nutribarrio
                <span className="text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  v1.1.0 Pro
                </span>
              </h1>
            </div>
            <p className="text-[11px] font-medium text-emerald-400/90 truncate flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <span className="text-stone-300">Firma:</span>{' '}
              <strong className="text-emerald-300 font-semibold">Ing. Joel Roldán Gómez</strong>
              <span className="text-stone-500">•</span>
              <span className="text-amber-400 font-bold text-[10px] tracking-wider">AISTUDIO</span>
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Online/Offline Status */}
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border ${
              isOnline
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                : 'bg-amber-950/40 text-amber-300 border-amber-800/40'
            }`}
            title={isOnline ? 'Conexión activa' : 'Modo Offline (Caché activa)'}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>Offline</span>
              </>
            )}
          </div>

          {/* In-app PWA install trigger button */}
          {!isInstalled && (isInstallable || isIOS) && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/50 active:scale-95 transition"
              title="Instalar App en tu pantalla de inicio"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Instalar</span>
            </button>
          )}

          {/* Smart Plan Setup & Family Budget Wizard */}
          {onOpenWizardModal && (
            <button
              onClick={onOpenWizardModal}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/50 active:scale-95 transition"
              title="Configurar Presupuesto, Personas, Metas y Menús"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden xs:inline">
                {onboardingConfig?.isCompleted ? 'Ajustar Plan' : 'Planificar'}
              </span>
            </button>
          )}

          {/* Budget Optimization Trigger Badge */}
          {onOpenOptimizerModal && (savingsMxn ?? 0) > 0 && (
            <button
              onClick={onOpenOptimizerModal}
              className="flex items-center gap-1 px-2 py-1 text-xs font-black rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 active:scale-95 transition"
              title="Ahorro detectado en plan semanal según canasta básica"
            >
              <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-[11px]">-${savingsMxn}</span>
            </button>
          )}

          {/* Water Hydration Quick Indicator & Modal Trigger */}
          {onOpenWaterModal && waterGlasses && (
            <button
              onClick={onOpenWaterModal}
              className="flex items-center gap-1 px-2 py-1 text-xs font-black rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30 active:scale-95 transition"
              title="Contador de agua y recordatorios inteligentes"
            >
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-mono text-[11px]">
                {waterGlasses.consumed}/{waterGlasses.target}
              </span>
            </button>
          )}

          {/* ABCDE Nutritional Assessment */}
          {onOpenABCDEModal && (
            <button
              onClick={onOpenABCDEModal}
              className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 active:scale-95 transition"
              title="Evaluación Nutricional Clínica ABCDE"
            >
              <span className="text-[10px] font-black uppercase font-mono px-1">ABCDE</span>
            </button>
          )}

          {/* Benchmark vs Leading Apps */}
          {onOpenBenchmarkModal && (
            <button
              onClick={onOpenBenchmarkModal}
              className="p-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 active:scale-95 transition"
              title="Auditoría Competitiva vs Mealbird, MacroFactor y MyFitnessPal"
            >
              <span className="text-[10px] font-black uppercase font-mono px-1">BENCH</span>
            </button>
          )}

          {/* Philosophy / About trigger */}
          {onOpenAboutModal && (
            <button
              onClick={onOpenAboutModal}
              className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 active:scale-95 transition"
              title="Filosofía Nutricional y Certificación"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
