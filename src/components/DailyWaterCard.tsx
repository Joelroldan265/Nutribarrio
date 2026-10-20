import React from 'react';
import {
  Droplets,
  Plus,
  Minus,
  RotateCcw,
  Bell,
  Sparkles,
  Zap,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { DailyWaterTracker, UserProfile } from '../types/nutrition';

interface DailyWaterCardProps {
  waterTracker: DailyWaterTracker;
  userProfile: UserProfile;
  onAddGlass: (count?: number) => void;
  onSubtractGlass: () => void;
  onResetWater: () => void;
  onOpenRemindersModal: () => void;
}

export const DailyWaterCard: React.FC<DailyWaterCardProps> = ({
  waterTracker,
  userProfile,
  onAddGlass,
  onSubtractGlass,
  onResetWater,
  onOpenRemindersModal,
}) => {
  const { consumedGlasses, targetGlasses, glassVolumeMl, targetMl } = waterTracker;
  const consumedMl = consumedGlasses * glassVolumeMl;
  const progressPercent = Math.min(100, Math.round((consumedGlasses / targetGlasses) * 100));
  const isGoalReached = consumedGlasses >= targetGlasses;

  const activityBadges: Record<string, { label: string; text: string }> = {
    sedentario: {
      label: 'Sedentario',
      text: 'Meta base (sin pérdidas por sudor)',
    },
    moderado: {
      label: 'Moderado',
      text: '+500 ml por actividad diaria regular',
    },
    intenso: {
      label: 'Intenso',
      text: '+1,000 ml por transpiración y fatiga',
    },
    atleta: {
      label: 'Atleta Pro',
      text: '+1,500 ml por síntesis proteica y sudoración',
    },
  };

  const currentBadge =
    activityBadges[waterTracker.activityLevel] || activityBadges.moderado;

  // Próximo recordatorio pendiente
  const nextReminder = waterTracker.reminders.find((r) => !r.completed);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 p-5 shadow-2xl space-y-4">
      {/* Background glow when goal reached */}
      <div
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
          isGoalReached ? 'bg-sky-500/20' : 'bg-sky-900/10'
        }`}
      />

      <div className="relative z-10 space-y-3.5">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-950 border border-sky-800/50 flex items-center justify-center text-sky-400">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300 block">
                Hidratación Celular Diaria
              </span>
              <span className="text-[10px] text-sky-400 font-mono">
                {currentBadge.label} • {currentBadge.text}
              </span>
            </div>
          </div>

          <button
            onClick={onOpenRemindersModal}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-xl bg-sky-950/80 hover:bg-sky-900/90 text-sky-300 border border-sky-700/50 transition active:scale-95 shadow-sm"
            title="Ver recordatorios inteligentes por horario"
          >
            <Bell className="w-3.5 h-3.5 text-sky-400" />
            <span>Recordatorios</span>
          </button>
        </div>

        {/* Counter and Visual Fill Bar */}
        <div className="grid grid-cols-2 gap-3 items-center">
          <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
            <span className="text-[10px] text-stone-400 block font-medium">
              Vasos de Agua Hoy (250 ml c/u)
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-sky-400 font-mono">
                {consumedGlasses}
              </span>
              <span className="text-sm font-bold text-stone-400 font-mono">
                / {targetGlasses} vasos
              </span>
            </div>
            <span className="text-[10px] text-stone-400 font-mono block">
              {consumedMl} ml de {targetMl} ml meta
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-800/40 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] text-stone-400">Cumplimiento</span>
              <span className="font-mono font-bold text-sky-300">{progressPercent}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-950 rounded-full h-3 overflow-hidden border border-sky-900/40 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-600 via-sky-400 to-emerald-400 transition-all duration-300 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-stone-400 pt-0.5">
              {isGoalReached ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ¡Meta lograda!
                </span>
              ) : (
                <span>Faltan {Math.max(0, targetGlasses - consumedGlasses)} vasos</span>
              )}
              <span className="font-mono">~35 ml/kg</span>
            </div>
          </div>
        </div>

        {/* Visual Glass Dots indicator */}
        <div className="p-2.5 rounded-2xl bg-stone-950/60 border border-stone-800/80 flex items-center justify-center gap-1.5 flex-wrap">
          {Array.from({ length: targetGlasses }).map((_, idx) => {
            const isFilled = idx < consumedGlasses;
            return (
              <button
                key={idx}
                onClick={() => onAddGlass(idx + 1 > consumedGlasses ? 1 : -1)}
                className={`w-5 h-7 rounded-md border flex items-center justify-center transition-all ${
                  isFilled
                    ? 'bg-sky-500 border-sky-300 text-white shadow-sm shadow-sky-500/50 scale-105'
                    : 'bg-stone-900/80 border-stone-700/60 text-stone-600 hover:border-sky-700'
                }`}
                title={`Vaso ${idx + 1} (${(idx + 1) * 250} ml)`}
              >
                <Droplets className={`w-3 h-3 ${isFilled ? 'text-white' : 'text-stone-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Action Controls: +1 Vaso, +Botella 500ml, -1 Vaso, Reset */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => onAddGlass(1)}
            className="col-span-2 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white text-xs font-bold shadow-md shadow-sky-950/60 active:scale-95 transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+1 Vaso (250 ml)</span>
          </button>

          <button
            onClick={() => onAddGlass(2)}
            className="py-2.5 px-2 rounded-2xl bg-stone-800 hover:bg-stone-700 text-sky-300 border border-stone-700 text-xs font-bold active:scale-95 transition flex items-center justify-center gap-1"
            title="Agregar 2 vasos (botella de 500 ml)"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>+500 ml</span>
          </button>

          <div className="flex gap-1.5">
            <button
              onClick={onSubtractGlass}
              disabled={consumedGlasses <= 0}
              className="flex-1 py-2.5 rounded-2xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 border border-stone-700/80 text-xs font-bold active:scale-95 transition flex items-center justify-center disabled:opacity-40"
              title="Restar 1 vaso"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={onResetWater}
              className="py-2.5 px-2.5 rounded-2xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-700/80 text-xs active:scale-95 transition flex items-center justify-center"
              title="Reiniciar contador del día"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Next Smart Reminder Prompt or Tianguis Tip */}
        {nextReminder ? (
          <div
            onClick={onOpenRemindersModal}
            className="p-2.5 rounded-2xl bg-sky-950/30 border border-sky-800/40 hover:border-sky-600/60 transition cursor-pointer flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800/50 flex-shrink-0">
                {nextReminder.time}
              </span>
              <span className="text-[11px] text-stone-300 truncate">
                Próxima toma: <strong>{nextReminder.label}</strong> ({nextReminder.glasses * 250} ml)
              </span>
            </div>
            <span className="text-[10px] text-sky-400 font-bold flex-shrink-0">
              Ver horario →
            </span>
          </div>
        ) : (
          <div className="p-2.5 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-[11px]">
              ¡Excelente disciplina hídrica! Todas las tomas programadas del día han sido registradas.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
