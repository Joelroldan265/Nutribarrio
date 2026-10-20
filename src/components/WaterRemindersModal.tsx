import React, { useState } from 'react';
import {
  X,
  Droplets,
  Bell,
  BellRing,
  Clock,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  Check,
  Volume2,
} from 'lucide-react';
import { DailyWaterTracker, WaterReminder, UserProfile } from '../types/nutrition';
import { requestWebNotificationPermission, triggerWaterNotification } from '../utils/waterTracker';

interface WaterRemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
  waterTracker: DailyWaterTracker;
  userProfile: UserProfile;
  onToggleReminder: (reminderId: string) => void;
  onToggleRemindersEnabled: (enabled: boolean) => void;
}

export const WaterRemindersModal: React.FC<WaterRemindersModalProps> = ({
  isOpen,
  onClose,
  waterTracker,
  userProfile,
  onToggleReminder,
  onToggleRemindersEnabled,
}) => {
  const [notificationPermission, setNotificationPermission] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const handleEnableNotifications = async () => {
    const granted = await requestWebNotificationPermission();
    if (granted) {
      setNotificationPermission('granted');
      onToggleRemindersEnabled(true);
      triggerWaterNotification(
        '💧 ¡Recordatorios de Nutribarrio Activados!',
        `Programados para tu nivel ${waterTracker.activityLevel.toUpperCase()}. Tu meta diaria es ${waterTracker.targetGlasses} vasos (${waterTracker.targetMl} ml).`
      );
    } else {
      setNotificationPermission('denied');
      onToggleRemindersEnabled(false);
    }
  };

  const handleTestNotification = () => {
    triggerWaterNotification(
      '💧 Momento de Hidratarte - Nutribarrio Pro',
      'Bebe 1 vaso de agua fresca (250 ml). Mantiene tu rendimiento muscular y acelera la síntesis proteica.'
    );
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2500);
  };

  const activityLabels: Record<string, { label: string; extra: string; color: string }> = {
    sedentario: {
      label: 'Sedentario / Oficina',
      extra: 'Meta base (sin pérdidas por sudoración)',
      color: 'text-stone-400 bg-stone-900 border-stone-800',
    },
    moderado: {
      label: 'Moderadamente Activo',
      extra: '+500 ml (+2 vasos) por actividad regular',
      color: 'text-sky-400 bg-sky-950/60 border-sky-800/50',
    },
    intenso: {
      label: 'Entrenamiento Intenso',
      extra: '+1,000 ml (+4 vasos) por transpiración y tasa metabólica',
      color: 'text-blue-400 bg-blue-950/60 border-blue-800/50',
    },
    atleta: {
      label: 'Atleta de Alto Desempeño',
      extra: '+1,500 ml (+6 vasos) por alta sudoración y transporte de creatina/proteína',
      color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50',
    },
  };

  const currentActMeta =
    activityLabels[waterTracker.activityLevel] || activityLabels.moderado;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
      <div className="w-full max-w-xl max-h-[92vh] overflow-y-auto bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col justify-between">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-300 hover:text-white transition"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-800/40 flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                <span>Protocolo de Hidratación Inteligente</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Recordatorios por Nivel de Actividad
            </h2>
            <p className="text-xs text-stone-300 mt-1">
              La hidratación se calibra automáticamente según tu peso ({userProfile.weightKg} kg) y tu nivel físico ({userProfile.activityLevel.toUpperCase()}).
            </p>
          </div>

          {/* Activity Target Hero Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-950/60 via-stone-900 to-stone-950 border border-sky-700/40 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-stone-800 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-sky-900/60 border border-sky-600/40 flex items-center justify-center text-sky-400">
                  <Droplets className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] block">Meta Total Calculada:</span>
                  <span className="text-xl font-black text-sky-400 font-mono">
                    {waterTracker.targetGlasses} Vasos{' '}
                    <span className="text-xs font-normal text-stone-300">
                      ({waterTracker.targetMl} ml)
                    </span>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-stone-400 text-[10px] block">Progreso actual:</span>
                <span className="text-base font-bold text-white font-mono">
                  {waterTracker.consumedGlasses} / {waterTracker.targetGlasses}
                </span>
              </div>
            </div>

            {/* Activity Level Badge & Breakdown */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-stone-950/80 border border-stone-800 text-xs">
              <div>
                <span className="text-[10px] text-stone-400 block font-mono">Nivel Registrado:</span>
                <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  {currentActMeta.label}
                </span>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg border ${currentActMeta.color}`}>
                {currentActMeta.extra}
              </span>
            </div>

            {/* Notification Permission & Toggle Bar */}
            <div className="pt-1 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {waterTracker.remindersEnabled ? (
                  <BellRing className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Bell className="w-4 h-4 text-stone-400" />
                )}
                <div>
                  <span className="text-xs font-bold text-white block">
                    Alertas del Navegador
                  </span>
                  <span className="text-[10px] text-stone-400 block">
                    {waterTracker.remindersEnabled
                      ? 'Notificaciones activas durante tu jornada'
                      : 'Activa para recibir toques periódicos'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {waterTracker.remindersEnabled && (
                  <button
                    onClick={handleTestNotification}
                    disabled={testSent}
                    className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition flex items-center gap-1"
                    title="Envía una notificación de prueba"
                  >
                    <Volume2 className="w-3 h-3 text-sky-400" />
                    <span>{testSent ? '¡Enviada!' : 'Probar'}</span>
                  </button>
                )}

                <button
                  onClick={handleEnableNotifications}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    waterTracker.remindersEnabled
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/50'
                      : 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-950/50'
                  }`}
                >
                  {waterTracker.remindersEnabled ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Activas</span>
                    </>
                  ) : (
                    <span>Activar Alertas</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Smart Timeline Checklist */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Cronograma Personalizado de Tomas ({waterTracker.reminders.length})</span>
              </h3>
              <span className="text-[10px] text-stone-400 font-mono">
                Cada 2-3 hrs según actividad
              </span>
            </div>

            <div className="space-y-2">
              {waterTracker.reminders.map((rem) => {
                return (
                  <div
                    key={rem.id}
                    onClick={() => onToggleReminder(rem.id)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                      rem.completed
                        ? 'bg-sky-950/20 border-sky-800/40 opacity-70'
                        : 'bg-stone-950 border-stone-800 hover:border-sky-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                          rem.completed
                            ? 'bg-sky-600 border-sky-500 text-white'
                            : 'border-stone-700 bg-stone-900 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/40">
                            {rem.time}
                          </span>
                          <span
                            className={`text-xs font-bold truncate ${
                              rem.completed ? 'line-through text-stone-400' : 'text-stone-100'
                            }`}
                          >
                            {rem.label}
                          </span>
                          <span className="text-[10px] font-mono text-stone-400">
                            ({rem.glasses} {rem.glasses === 1 ? 'vaso' : 'vasos'} • {rem.glasses * 250} ml)
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                          {rem.tip}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Electrolytes from Tianguis - Wisdom Card */}
          <div className="p-3.5 rounded-2xl bg-amber-950/25 border border-amber-800/40 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-900/50 border border-amber-700/50 flex items-center justify-center text-amber-400 flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-amber-300">
                Hidratación Económica de Barrio (Ing. Joel Roldán Gómez)
              </span>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              <strong>El Suero de Barrio ($3 MXN vs $35 de marcas comerciales):</strong> 1 litro de agua + jugo de 2 limones criollos + 1/4 cucharadita de sal de grano de tianguis (rica en magnesio y oligoelementos) + 1 pizca de bicarbonato. Aporta los electrolitos exactos requeridos para soportar entrenamientos intensos sin azúcar refinada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
