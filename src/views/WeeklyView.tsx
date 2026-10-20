import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  CalendarDays,
  Sparkles,
  ShoppingBag,
  RefreshCw,
  Clock,
  Dumbbell,
  DollarSign,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Info,
  ChevronRight,
  ShieldCheck,
  Sliders,
  Users,
  TrendingDown,
} from 'lucide-react';
import {
  DayLog,
  UserProfile,
  DayPlan,
  Meal,
  AlternativeMeal,
  OnboardingPlanConfig,
  BudgetConsumptionAnalysis,
} from '../types/nutrition';

interface WeeklyViewProps {
  weekLogs: DayLog[];
  weeklyPlan: Record<string, DayPlan>;
  userProfile: UserProfile;
  onOpenAboutModal: () => void;
  onUpdateDayMeal?: (dayId: string, mealIndex: number, newMeal: Meal) => void;
  onAutoGeneratePlan?: () => void;
  onSyncPlanToBasket?: () => void;
  onOpenSwapModal?: (meal: Meal, dayKey?: string, dayLabel?: string) => void;
  onOpenWizardModal?: () => void;
  onboardingConfig?: OnboardingPlanConfig;
  budgetAnalysis?: BudgetConsumptionAnalysis;
  onOpenOptimizerModal?: () => void;
  onApplyAllBudgetSuggestions?: () => void;
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({
  weekLogs,
  weeklyPlan,
  userProfile,
  onOpenAboutModal,
  onUpdateDayMeal,
  onAutoGeneratePlan,
  onSyncPlanToBasket,
  onOpenSwapModal,
  onOpenWizardModal,
  onboardingConfig,
  budgetAnalysis,
  onOpenOptimizerModal,
  onApplyAllBudgetSuggestions,
}) => {
  const [subTab, setSubTab] = useState<'planificador' | 'auditoria'>('planificador');
  const [selectedDayKey, setSelectedDayKey] = useState<string>('lunes');
  const [copiedPlan, setCopiedPlan] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const daysList = Object.values(weeklyPlan);
  const currentDayPlan = weeklyPlan[selectedDayKey] || daysList[0];

  // Adherence calculations for the audit tab
  const compliantDaysCount = weekLogs.filter((d) => d.consumedProtein >= d.targetProtein).length;
  const adherenceRate = Math.round((compliantDaysCount / weekLogs.length) * 100);
  const maxProteinVal = Math.max(...weekLogs.map((d) => Math.max(d.consumedProtein, d.targetProtein)), 160);

  // Weekly aggregate metrics for the 7 planned days
  const totalWeeklyPlannedCost = daysList.reduce((acc, d) => acc + d.plannedCostMxn, 0);
  const averageWeeklyProtein = Math.round(
    daysList.reduce((acc, d) => acc + d.plannedProtein, 0) / (daysList.length || 7)
  );

  const handleCopyWeeklyMenu = () => {
    let text = `📅 *PLAN SEMANAL NUTRIBARRIO v1.1.0 Pro*\n`;
    text += `*Ing. Joel Roldán Gómez • AI Studio* • Control Estricto Diario\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    daysList.forEach((day) => {
      text += `🍗 *${day.dayName.toUpperCase()}* (${day.plannedProtein}g P | ~$${day.plannedCostMxn} MXN):\n`;
      day.meals.forEach((m) => {
        text += ` • ${m.type.toUpperCase()}: ${m.title} (+${m.macros.protein}g P)\n`;
      });
      text += `\n`;
    });

    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💰 Presupuesto Semanal Total: ~$${totalWeeklyPlannedCost} MXN\n`;
    text += `🎯 Promedio Diario: ${averageWeeklyProtein}g P (Umbral Mínimo: ${userProfile.dailyProteinTarget}g)\n`;
    text += `📲 _Planificado con Nutribarrio PWA_`;

    navigator.clipboard.writeText(text);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2500);
  };

  const handleSyncClick = () => {
    if (onSyncPlanToBasket) {
      onSyncPlanToBasket();
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 2500);
    }
  };

  return (
    <div className="space-y-4 pb-24 text-left animate-fade-in">
      {/* Top Toggle: Planificador de Menús vs. Auditoría de Racha */}
      <div className="flex p-1 bg-stone-900 border border-stone-800 rounded-2xl">
        <button
          onClick={() => setSubTab('planificador')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'planificador'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Planificador Semanal</span>
        </button>
        <button
          onClick={() => setSubTab('auditoria')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'auditoria'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Auditoría de Proteína</span>
        </button>
      </div>

      {subTab === 'planificador' ? (
        /* ============================================================ */
        /* TAB 1: PROGRAMADOR Y PLANIFICADOR SEMANAL DE COMIDAS         */
        /* ============================================================ */
        <div className="space-y-4">
          {/* Family & Budget Config Callout Bar */}
          <div className="p-3 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-3 text-xs flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-white block">
                  {onboardingConfig?.userType === 'familia'
                    ? `Familia (${onboardingConfig.peopleCount} personas)`
                    : 'Usuario Individual (1 comensal)'}
                </span>
                <span className="text-[10px] text-stone-400 block">
                  Presupuesto Semanal Asignado: <strong className="text-amber-400 font-mono">${onboardingConfig?.weeklyBudgetMxn || 750} MXN</strong>
                </span>
              </div>
            </div>

            {onOpenWizardModal && (
              <button
                onClick={onOpenWizardModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 active:scale-95 transition"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Ajustar Personas y Presupuesto</span>
              </button>
            )}
          </div>

          {/* Hero Banner: Programación Semanal de Alto Rendimiento */}
          <div className="rounded-3xl bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 p-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
                  Planificación Hacia Adelante ({daysList.length} Días)
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/40">
                {onboardingConfig?.repetitionPreference === 'nuevo_cada_dia'
                  ? 'Máxima Variedad'
                  : onboardingConfig?.repetitionPreference === 'mismo_cada_dia'
                  ? 'Batch Cooking Fijo'
                  : 'Rotación cada 2 días'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-700/50">
                <span className="text-[10px] font-semibold text-emerald-300 block">
                  Proteína / día por persona
                </span>
                <p className="text-2xl font-black text-white font-mono mt-0.5">
                  {averageWeeklyProtein}g{' '}
                  <span className="text-xs font-normal text-emerald-400">/ comensal</span>
                </p>
                <span className="text-[10px] text-emerald-400/90 font-medium">
                  {averageWeeklyProtein >= userProfile.dailyProteinTarget
                    ? '✓ Supera el umbral estricto'
                    : '⚠ Ajustar porciones'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800">
                <span className="text-[10px] font-semibold text-stone-300 block">
                  Costo Total Semanal ({onboardingConfig?.peopleCount || 1} pers)
                </span>
                <p className="text-2xl font-black text-amber-400 font-mono mt-0.5">
                  ${totalWeeklyPlannedCost}{' '}
                  <span className="text-xs font-normal text-stone-400">MXN</span>
                </p>
                <span className="text-[10px] font-mono text-stone-400 block mt-0.5">
                  {totalWeeklyPlannedCost <= (onboardingConfig?.weeklyBudgetMxn || 750) ? (
                    <span className="text-emerald-400 font-bold">
                      ✓ Dentro del presupuesto (${(onboardingConfig?.weeklyBudgetMxn || 750) - totalWeeklyPlannedCost} MXN libres)
                    </span>
                  ) : (
                    <span className="text-amber-400 font-bold">
                      Excede por ${totalWeeklyPlannedCost - (onboardingConfig?.weeklyBudgetMxn || 750)} MXN
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Action Bar: Auto-Generate, Sync & Export to WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={onAutoGeneratePlan}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 active:scale-95 transition"
                title="Re-generar menú balanceado según preferencias"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Re-Programar</span>
              </button>

              <button
                onClick={handleSyncClick}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 active:scale-95 transition"
                title="Calcular lista de compras del mercado exacta"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                <span>{syncSuccess ? '¡Canasta Lista!' : 'Sincronizar Canasta'}</span>
              </button>

              <button
                onClick={handleCopyWeeklyMenu}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/60 active:scale-95 transition"
                title="Copiar plan completo para WhatsApp"
              >
                {copiedPlan ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Automatic Budget Optimizer Card (Canasta Básica AI Engine) */}
          {budgetAnalysis && (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-stone-900 to-amber-950/40 border border-emerald-600/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-900/70 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
                    <Zap className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      Optimizador de Presupuesto Basado en tu Consumo
                      {budgetAnalysis.potentialWeeklySavingsMxn > 0 && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          -${budgetAnalysis.potentialWeeklySavingsMxn} MXN
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-stone-300 mt-0.5">
                      Analizamos tus comidas consumidas para sustituir insumos por opciones más eficientes del tianguis.
                    </p>
                  </div>
                </div>
              </div>

              {/* Metric pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-2xl bg-stone-950/80 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">Costo / g Proteína actual</span>
                  <span className="text-sm font-black text-white font-mono">
                    ${budgetAnalysis.averageCostPerGramProteinMxn} MXN
                  </span>
                </div>

                <div className="p-2.5 rounded-2xl bg-stone-950/80 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">Meta Tianguis Óptimo</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    ${budgetAnalysis.baselineTianguisCostPerGram} MXN/g
                  </span>
                </div>

                <div className="p-2.5 rounded-2xl bg-stone-950/80 border border-stone-800 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-stone-400 block">Ahorro Semanal Posible</span>
                  <span className="text-sm font-black text-amber-400 font-mono">
                    ${budgetAnalysis.potentialWeeklySavingsMxn} MXN
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {onOpenOptimizerModal && (
                  <button
                    onClick={onOpenOptimizerModal}
                    className="flex-1 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 active:scale-95 transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Ver Análisis y Sugerencias ({budgetAnalysis.suggestions.length})</span>
                  </button>
                )}

                {onApplyAllBudgetSuggestions && budgetAnalysis.suggestions.length > 0 && (
                  <button
                    onClick={onApplyAllBudgetSuggestions}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold shadow-md shadow-emerald-950/50 active:scale-95 transition flex items-center justify-center gap-1.5"
                    title="Aplica automáticamente los platillos más económicos del tianguis"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Optimizar Plan Automáticamente</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Horizontal Day Selector Pills */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Selecciona el Día a Programar:
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                {currentDayPlan.plannedProtein}g P • ${currentDayPlan.plannedCostMxn} MXN
              </span>
            </div>

            <p className="text-[11px] text-stone-400 mb-2">
              💡 Para cambiar el menú de <strong>Mañana</strong> o <strong>Pasado Mañana</strong>, selecciona el día en las fichas y pulsa <em>"Cambiar"</em> en el platillo deseado.
            </p>

            <div className="grid grid-cols-7 gap-1.5">
              {daysList.map((day) => {
                const isSelected = selectedDayKey === day.dayId;
                const isMet = day.plannedProtein >= userProfile.dailyProteinTarget;

                return (
                  <button
                    key={day.dayId}
                    onClick={() => setSelectedDayKey(day.dayId)}
                    className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center border transition-all text-center ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-950/60 scale-105'
                        : 'bg-stone-900 hover:bg-stone-850 text-stone-300 border-stone-800'
                    }`}
                  >
                    <span className="text-xs font-black">{day.shortName}</span>
                    <span
                      className={`text-[9px] font-mono font-bold mt-0.5 ${
                        isSelected
                          ? 'text-emerald-100'
                          : isMet
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {day.plannedProtein}g
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Meals for the Selected Day */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Menú Programado para el {currentDayPlan.dayName}
              </h3>
              <span className="text-xs text-stone-400 font-mono">
                {currentDayPlan.meals.length} comidas calibradas
              </span>
            </div>

            {currentDayPlan.meals.map((meal, idx) => (
              <div
                key={meal.id || idx}
                className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-stone-700 transition space-y-2.5"
              >
                <div className="flex gap-3">
                  <img
                    src={meal.imageUrl}
                    alt={meal.title}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-stone-950"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/40">
                          {meal.type}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate mt-0.5">
                          {meal.title}
                        </h4>
                      </div>

                      {/* Swap button */}
                      {onOpenSwapModal && (
                        <button
                          onClick={() => onOpenSwapModal(meal, currentDayPlan.dayId, currentDayPlan.dayName)}
                          className="flex items-center gap-1 text-[10px] text-stone-400 hover:text-emerald-300 bg-stone-950 px-2 py-1 rounded-lg border border-stone-800 transition flex-shrink-0"
                          title="Cambiar platillo de este día"
                        >
                          <RefreshCw className="w-3 h-3 text-emerald-400" />
                          <span>Cambiar</span>
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                      {meal.subtitle}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono">
                      <span className="text-emerald-400 font-bold">
                        +{meal.macros.protein}g P
                      </span>
                      <span className="text-stone-400">
                        {meal.macros.calories} kcal
                      </span>
                      <span className="text-amber-400 font-bold">
                        ~${meal.estimatedCostMxn} MXN
                      </span>
                      <span className="text-stone-500">
                        {meal.prepTimeMinutes} min
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ingredients Summary */}
                <div className="text-[10px] text-stone-400 bg-stone-950 p-2 rounded-xl flex items-center justify-between">
                  <span className="truncate pr-2">
                    {meal.ingredients.map((i) => i.name).join(' • ')}
                  </span>
                  <span className="text-stone-300 flex-shrink-0 font-mono font-semibold">
                    {meal.prepTimeMinutes} min prep
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Sync to Market Basket Trigger */}
          <div className="p-4 rounded-3xl bg-stone-900/80 border border-stone-800 flex items-center justify-between gap-3 text-xs">
            <div className="min-w-0">
              <p className="font-bold text-white flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                Sincronizar Canasta de Compras del Tianguis
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Calcula las cantidades exactas de huevos, pechuga y frijol para tus 7 días.
              </p>
            </div>
            <button
              onClick={handleSyncClick}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap shadow-md transition"
            >
              {syncSuccess ? '✓ ¡Actualizada!' : 'Sincronizar'}
            </button>
          </div>
        </div>
      ) : (
        /* ============================================================ */
        /* TAB 2: AUDITORÍA Y RACHA DE PROTEÍNA ESTRICTA               */
        /* ============================================================ */
        <div className="space-y-4">
          <div className="rounded-3xl bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 p-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
                  Auditoría Diaria de Proteína (Histórico)
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                Criterio Diario Rígido
              </span>
            </div>

            {/* Adherence Score */}
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white font-mono">
                    {compliantDaysCount}
                    <span className="text-xl text-stone-400 font-sans font-semibold">/7</span>
                  </span>
                  <span className="text-sm font-bold text-emerald-400">
                    Días Cumplidos
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-1">
                  Racha de disciplina: {compliantDaysCount} días superando el umbral proteico mínimo de {userProfile.dailyProteinTarget}g.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-stone-300 block">Tasa de Apego</span>
                <span className={`text-2xl font-black font-mono ${adherenceRate >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {adherenceRate}%
                </span>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-stone-300">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                  Gramos Reales Ingeridos
                </span>
                <span className="flex items-center gap-1.5 text-amber-400 font-mono text-[10px]">
                  <span className="w-2.5 h-0.5 bg-amber-400" />
                  Umbral Mínimo: {userProfile.dailyProteinTarget}g
                </span>
              </div>

              <div className="h-44 flex items-end justify-between gap-1.5 sm:gap-3 pt-6 pb-2 px-1 relative border-b border-stone-800">
                <div
                  className="absolute left-0 right-0 border-b-2 border-dashed border-amber-400/70 z-10 pointer-events-none"
                  style={{
                    bottom: `${(userProfile.dailyProteinTarget / maxProteinVal) * 85}%`,
                  }}
                >
                  <span className="absolute -top-3.5 right-1 text-[9px] font-mono font-bold text-amber-400 bg-stone-950 px-1 rounded">
                    Meta Mínima {userProfile.dailyProteinTarget}g
                  </span>
                </div>

                {weekLogs.map((log, idx) => {
                  const heightPercent = Math.min(100, Math.round((log.consumedProtein / maxProteinVal) * 85));
                  const isMet = log.consumedProtein >= log.targetProtein;

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center h-full justify-end"
                    >
                      <div className="w-full flex justify-center items-end relative h-full">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 relative ${
                            isMet
                              ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                              : 'bg-gradient-to-t from-amber-600 to-amber-500'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] mt-2 font-mono truncate text-stone-300">
                        {log.dayName.substring(0, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Scientific Rationale Card */}
          <div className="p-4 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  La Regla Científica de las 24 Horas
                </h3>
              </div>
              <button
                onClick={onOpenAboutModal}
                className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Info className="w-3 h-3" />
                <span>Leer Fundamento</span>
              </button>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Programar tus comidas de la semana por adelantado garantiza que nunca te falte la proteína del día. Sin improvisaciones en la calle, con presupuesto cerrado de tianguis y con el músculo protegido los 7 días.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
