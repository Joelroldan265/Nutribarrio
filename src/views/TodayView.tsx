import React, { useState } from 'react';
import {
  Dumbbell,
  Flame,
  CheckCircle2,
  Circle,
  Plus,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Info,
  RefreshCw,
  Users,
  Trophy,
  Sliders,
  TrendingDown,
  Droplets,
  Calendar,
  CalendarDays,
  Sun,
  Copy,
  Check,
  ChefHat,
} from 'lucide-react';
import {
  Meal,
  UserProfile,
  OnboardingPlanConfig,
  BudgetConsumptionAnalysis,
  DailyWaterTracker,
  DayPlan,
} from '../types/nutrition';
import { DailyWaterCard } from '../components/DailyWaterCard';

const DAY_KEYS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
const DAY_NAMES_ES: Record<string, string> = {
  domingo: 'Domingo',
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
};

const DAY_SHORT_NAMES_ES: Record<string, string> = {
  domingo: 'Dom',
  lunes: 'Lun',
  martes: 'Mar',
  miercoles: 'Mié',
  jueves: 'Jue',
  viernes: 'Vie',
  sabado: 'Sáb',
};

interface TodayViewProps {
  meals: Meal[];
  userProfile: UserProfile;
  extraProtein: number;
  extraCalories: number;
  onToggleMeal: (id: string) => void;
  onOpenMealDetail: (meal: Meal) => void;
  onOpenQuickAdd: () => void;
  onOpenAboutModal: () => void;
  onOpenBenchmarkModal: () => void;
  onOpenSwapModal: (meal: Meal) => void;
  onUpdateServings: (mealId: string, servings: number) => void;
  onOpenWizardModal?: () => void;
  onboardingConfig?: OnboardingPlanConfig;
  budgetAnalysis?: BudgetConsumptionAnalysis;
  onOpenOptimizerModal?: () => void;
  waterTracker?: DailyWaterTracker;
  onAddWaterGlass?: (count?: number) => void;
  onSubtractWaterGlass?: () => void;
  onResetWater?: () => void;
  onOpenWaterRemindersModal?: () => void;
  // Day Navigation & Tomorrow / Day-After Menu Modification:
  weeklyPlan?: Record<string, DayPlan>;
  onOpenSwapModalForDay?: (meal: Meal, dayKey: string, dayLabel: string) => void;
  onRegenerateDayPlan?: (dayKey: string) => void;
  onCopyMealsToDay?: (sourceMeals: Meal[], targetDayKey: string) => void;
  onUpdateDayServings?: (dayKey: string, mealId: string, servings: number) => void;
  onOpenPantryChefModal?: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  meals,
  userProfile,
  extraProtein,
  extraCalories,
  onToggleMeal,
  onOpenMealDetail,
  onOpenQuickAdd,
  onOpenAboutModal,
  onOpenBenchmarkModal,
  onOpenSwapModal,
  onUpdateServings,
  onOpenWizardModal,
  onboardingConfig,
  budgetAnalysis,
  onOpenOptimizerModal,
  waterTracker,
  onAddWaterGlass,
  onSubtractWaterGlass,
  onResetWater,
  onOpenWaterRemindersModal,
  weeklyPlan,
  onOpenSwapModalForDay,
  onRegenerateDayPlan,
  onCopyMealsToDay,
  onUpdateDayServings,
  onOpenPantryChefModal,
}) => {
  // Day Navigation State: 'hoy', 'manana', 'pasado_manana' or any specific dayId
  const [activeDayMode, setActiveDayMode] = useState<'hoy' | 'manana' | 'pasado_manana' | string>('hoy');
  const [copiedDayFeedback, setCopiedDayFeedback] = useState(false);

  // Compute today, tomorrow, and day-after keys based on current JS day
  const todayIdx = new Date().getDay();
  const todayKey = DAY_KEYS[todayIdx];
  const tomorrowKey = DAY_KEYS[(todayIdx + 1) % 7];
  const dayAfterKey = DAY_KEYS[(todayIdx + 2) % 7];

  // Resolve target key
  let resolvedDayKey = todayKey;
  let resolvedDayTitle = `Hoy (${DAY_NAMES_ES[todayKey]})`;
  let isFutureDay = false;

  if (activeDayMode === 'manana') {
    resolvedDayKey = tomorrowKey;
    resolvedDayTitle = `Mañana (${DAY_NAMES_ES[tomorrowKey]})`;
    isFutureDay = true;
  } else if (activeDayMode === 'pasado_manana') {
    resolvedDayKey = dayAfterKey;
    resolvedDayTitle = `Pasado Mañana (${DAY_NAMES_ES[dayAfterKey]})`;
    isFutureDay = true;
  } else if (activeDayMode !== 'hoy') {
    resolvedDayKey = activeDayMode;
    resolvedDayTitle = DAY_NAMES_ES[activeDayMode] || activeDayMode;
    isFutureDay = resolvedDayKey !== todayKey;
  }

  // Active meals to display
  const activeMeals: Meal[] = isFutureDay && weeklyPlan?.[resolvedDayKey]?.meals
    ? weeklyPlan[resolvedDayKey].meals
    : meals;

  // Calculate totals
  const completedMeals = isFutureDay ? activeMeals : activeMeals.filter((m) => m.isCompleted);
  const mealsProtein = completedMeals.reduce((acc, m) => acc + (m.macros.protein * (m.servings || 1)), 0);
  const totalProtein = Math.round(mealsProtein + (isFutureDay ? 0 : extraProtein));

  const mealsCalories = completedMeals.reduce((acc, m) => acc + (m.macros.calories * (m.servings || 1)), 0);
  const totalCalories = Math.round(mealsCalories + (isFutureDay ? 0 : extraCalories));

  const totalCarbs = completedMeals.reduce((acc, m) => acc + (m.macros.carbs * (m.servings || 1)), 0);
  const totalFats = completedMeals.reduce((acc, m) => acc + (m.macros.fats * (m.servings || 1)), 0);

  // Budget
  const dailySpentMxn = completedMeals.reduce((acc, m) => acc + (m.estimatedCostMxn * (m.servings || 1)), 0);
  const targetProtein = userProfile.dailyProteinTarget;
  const proteinPercent = Math.min(100, Math.round((totalProtein / targetProtein) * 100));
  const remainingProtein = Math.max(0, targetProtein - totalProtein);
  const isTargetAchieved = totalProtein >= targetProtein;

  // Cost per gram of protein efficiency
  const costPerGramToday = totalProtein > 0 ? (dailySpentMxn / totalProtein).toFixed(2) : '0.00';

  const handleTriggerSwap = (meal: Meal) => {
    if (isFutureDay && onOpenSwapModalForDay) {
      onOpenSwapModalForDay(meal, resolvedDayKey, resolvedDayTitle);
    } else {
      onOpenSwapModal(meal);
    }
  };

  const handleServingsChange = (mealId: string, newServings: number) => {
    if (isFutureDay && onUpdateDayServings) {
      onUpdateDayServings(resolvedDayKey, mealId, newServings);
    } else {
      onUpdateServings(mealId, newServings);
    }
  };

  const handleCopyTodayToActiveDay = () => {
    if (onCopyMealsToDay) {
      onCopyMealsToDay(meals, resolvedDayKey);
      setCopiedDayFeedback(true);
      setTimeout(() => setCopiedDayFeedback(false), 2500);
    }
  };

  return (
    <div className="space-y-4 pb-24 text-left animate-fade-in">
      {/* 1. Day Navigation Bar: HOY, MAÑANA, PASADO MAÑANA & Weekday Selector */}
      <div className="space-y-2">
        <div className="flex p-1 bg-stone-900 border border-stone-800 rounded-2xl gap-1 shadow-md">
          <button
            onClick={() => setActiveDayMode('hoy')}
            className={`flex-1 py-2 px-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeDayMode === 'hoy'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60 scale-[1.02]'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-300" />
            <span className="truncate">Hoy ({DAY_SHORT_NAMES_ES[todayKey]})</span>
          </button>

          <button
            onClick={() => setActiveDayMode('manana')}
            className={`flex-1 py-2 px-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeDayMode === 'manana'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-950/60 scale-[1.02]'
                : 'text-stone-400 hover:text-amber-300'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-300" />
            <span className="truncate">Mañana ({DAY_SHORT_NAMES_ES[tomorrowKey]})</span>
          </button>

          <button
            onClick={() => setActiveDayMode('pasado_manana')}
            className={`flex-1 py-2 px-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeDayMode === 'pasado_manana'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-950/60 scale-[1.02]'
                : 'text-stone-400 hover:text-sky-300'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5 text-sky-300" />
            <span className="truncate">Pasado Mañana</span>
          </button>
        </div>

        {/* Quick Weekday Mini Pills */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 px-1 scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 whitespace-nowrap mr-1">
            Días:
          </span>
          {DAY_KEYS.map((key) => {
            const isToday = key === todayKey;
            const isTomorrow = key === tomorrowKey;
            const isCurrentActive = resolvedDayKey === key;

            return (
              <button
                key={key}
                onClick={() => {
                  if (key === todayKey) setActiveDayMode('hoy');
                  else if (key === tomorrowKey) setActiveDayMode('manana');
                  else if (key === dayAfterKey) setActiveDayMode('pasado_manana');
                  else setActiveDayMode(key);
                }}
                className={`py-1 px-2.5 rounded-lg text-[10px] font-bold font-mono transition-all border whitespace-nowrap ${
                  isCurrentActive
                    ? 'bg-stone-100 text-stone-900 border-white shadow-sm font-black'
                    : 'bg-stone-900/90 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                {DAY_SHORT_NAMES_ES[key]}
                {isToday && <span className="ml-0.5 text-emerald-400">•</span>}
                {isTomorrow && <span className="ml-0.5 text-amber-400">•</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Future Day Planification Banner (when viewing Mañana or Pasado Mañana) */}
      {isFutureDay && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-950/70 via-stone-900 to-stone-900 border border-amber-600/50 shadow-xl space-y-3 animate-fade-in">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider block">
                  Planificando Menú para {resolvedDayTitle}
                </span>
                <span className="text-[11px] text-stone-300 block">
                  Puedes sustituir platillos pulsando "Cambiar" o re-generar este día completo.
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions for this Day */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {onRegenerateDayPlan && (
              <button
                onClick={() => onRegenerateDayPlan(resolvedDayKey)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-900/40 hover:bg-amber-800/50 text-amber-200 border border-amber-700/60 text-xs font-bold active:scale-95 transition"
                title="Genera un menú alternativo balanceado para este día"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Re-generar Menú</span>
              </button>
            )}

            {onCopyMealsToDay && (
              <button
                onClick={handleCopyTodayToActiveDay}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-bold active:scale-95 transition"
                title="Copia el menú que tienes hoy hacia este día (ideal para batch cooking)"
              >
                {copiedDayFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">¡Copiado a este día!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-400" />
                    <span>Copiar Menú de Hoy</span>
                  </>
                )}
              </button>
            )}

            {onOpenPantryChefModal && (
              <button
                onClick={onOpenPantryChefModal}
                className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-700/50 text-xs font-bold active:scale-95 transition"
                title="Explora recetas que puedes cocinar con lo que ya tienes en despensa"
              >
                <ChefHat className="w-3.5 h-3.5 text-amber-300" />
                <span>Chef Despensa</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Smart Planner & Budget Callout Banner (when on Hoy) */}
      {!isFutureDay && onOpenWizardModal && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-stone-900 to-amber-950/40 border border-emerald-700/50 shadow-lg flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>
                {onboardingConfig?.isCompleted
                  ? `Plan: ${onboardingConfig.peopleCount} ${onboardingConfig.peopleCount === 1 ? 'persona' : 'personas'} • $${onboardingConfig.weeklyBudgetMxn} MXN/sem`
                  : 'Configurador Nutribarrio Pro'}
              </span>
            </div>
            <p className="text-[11px] text-stone-300 truncate mt-0.5">
              {onboardingConfig?.isCompleted
                ? `Cocina para ${onboardingConfig.peopleCount} comensales con insumos de mercado y presupuesto asignado.`
                : 'Define presupuesto semanal, personas, metas, alergias y equipo de cocina en 6 pasos.'}
            </p>
          </div>
          <button
            onClick={onOpenWizardModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/50 active:scale-95 transition flex-shrink-0"
          >
            <Sliders className="w-3 h-3 text-amber-300" />
            <span>{onboardingConfig?.isCompleted ? 'Ajustar' : 'Comenzar'}</span>
          </button>
        </div>
      )}

      {/* Strict Daily Protein Target Card (Featured Hero) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 p-5 shadow-2xl">
        <div
          className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
            isTargetAchieved ? 'bg-emerald-500/20' : 'bg-amber-500/15'
          }`}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${isFutureDay ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-pulse'}`} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
                {isFutureDay ? `Proteína Programada para ${resolvedDayTitle}` : 'Control Estricto de Proteína Diaria'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenBenchmarkModal}
                className="text-[10px] font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-800/40"
              >
                <Trophy className="w-3 h-3 text-amber-400" />
                <span className="hidden xs:inline">Benchmark</span>
              </button>
              <button
                onClick={onOpenAboutModal}
                className="text-[10px] text-stone-400 hover:text-stone-200 flex items-center gap-0.5 bg-stone-800 px-2 py-0.5 rounded-full"
              >
                <Info className="w-3 h-3" />
                <span>Doctrina</span>
              </button>
            </div>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                {totalProtein}
              </span>
              <span className="text-xl sm:text-2xl font-semibold text-stone-400 font-mono">
                /{targetProtein}
              </span>
              <span className="text-xs font-bold text-stone-400 ml-1.5">gramos</span>
            </div>
            <div className="text-right">
              <span
                className={`text-sm font-bold font-mono px-2.5 py-1 rounded-xl ${
                  isTargetAchieved
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                    : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                }`}
              >
                {proteinPercent}% {isFutureDay ? 'programado' : ''}
              </span>
            </div>
          </div>

          {/* Precision Progress Bar */}
          <div className="w-full h-3 rounded-full bg-stone-800 overflow-hidden p-0.5 mb-3 border border-stone-700/50">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isTargetAchieved
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                  : 'bg-gradient-to-r from-amber-500 to-amber-400'
              }`}
              style={{ width: `${proteinPercent}%` }}
            />
          </div>

          {/* Macro Breakdown & Budget Metrics */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-stone-800/60 text-center">
            <div className="p-2 rounded-2xl bg-stone-950/60 border border-stone-800/40">
              <span className="text-[10px] text-stone-400 block font-medium">Calorías</span>
              <span className="text-xs font-bold font-mono text-stone-200">
                {totalCalories} <span className="text-[9px] text-stone-500">kcal</span>
              </span>
            </div>
            <div className="p-2 rounded-2xl bg-stone-950/60 border border-stone-800/40">
              <span className="text-[10px] text-stone-400 block font-medium">Carbos</span>
              <span className="text-xs font-bold font-mono text-stone-200">
                {totalCarbs}g
              </span>
            </div>
            <div className="p-2 rounded-2xl bg-stone-950/60 border border-stone-800/40">
              <span className="text-[10px] text-stone-400 block font-medium">Grasas</span>
              <span className="text-xs font-bold font-mono text-stone-200">
                {totalFats}g
              </span>
            </div>
            <div className="p-2 rounded-2xl bg-amber-950/30 border border-amber-800/40">
              <span className="text-[10px] text-amber-300 block font-medium">
                {isFutureDay ? 'Costo Día' : 'Gasto Hoy'}
              </span>
              <span className="text-xs font-bold font-mono text-amber-400">
                ${dailySpentMxn} <span className="text-[9px] text-amber-500">MXN</span>
              </span>
            </div>
          </div>

          {/* Efficiency & Guidance Message */}
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-stone-800/60">
            <span className="text-stone-300">
              {isTargetAchieved ? (
                <strong className="text-emerald-400 font-bold">
                  ✓ {isFutureDay ? 'Plan óptimo garantizado' : 'Umbral proteico alcanzado'}: síntesis muscular activada
                </strong>
              ) : (
                <span>
                  Faltan <strong className="text-amber-400 font-bold">{remainingProtein}g</strong> de proteína para la meta
                </span>
              )}
            </span>
            <span className="text-[11px] text-stone-400 font-mono bg-stone-950 px-2 py-0.5 rounded-lg border border-stone-800">
              ${costPerGramToday} MXN / g Prot
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Budget Optimizer Callout (when on Hoy) */}
      {!isFutureDay && budgetAnalysis && budgetAnalysis.potentialWeeklySavingsMxn > 0 && onOpenOptimizerModal && (
        <div
          onClick={onOpenOptimizerModal}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-900 to-emerald-950/40 border border-amber-600/50 shadow-md flex items-center justify-between gap-3 cursor-pointer hover:border-amber-500 transition group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-900/60 border border-amber-500/40 flex items-center justify-center text-amber-300 flex-shrink-0">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider block truncate group-hover:text-amber-200">
                Ahorro Detectado: -${budgetAnalysis.potentialWeeklySavingsMxn} MXN/semana
              </span>
              <span className="text-[10px] text-stone-300 block truncate">
                Basado en tu consumo de hoy. Sustituye platillos por insumos de canasta básica.
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
            Ver Ajustes →
          </span>
        </div>
      )}

      {/* Daily Water Counter & Smart Hydration Reminders Card (only on Hoy) */}
      {!isFutureDay && waterTracker && onAddWaterGlass && onSubtractWaterGlass && onResetWater && onOpenWaterRemindersModal && (
        <DailyWaterCard
          waterTracker={waterTracker}
          userProfile={userProfile}
          onAddGlass={onAddWaterGlass}
          onSubtractGlass={onSubtractWaterGlass}
          onResetWater={onResetWater}
          onOpenRemindersModal={onOpenWaterRemindersModal}
        />
      )}

      {/* Header for Meals, Batch Cooking and Quick Add Action */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{isFutureDay ? `Menú Programado para ${resolvedDayTitle}` : 'Menú de Barrio de Hoy'}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
              {activeMeals.length} comidas
            </span>
          </h2>
          <p className="text-xs text-stone-300">
            {isFutureDay
              ? 'Toca "Cambiar Platillo" en cualquier comida para sustituirla con insumos de mercado.'
              : `${completedMeals.length} de ${activeMeals.length} comidas completadas hoy`}
          </p>
        </div>

        {!isFutureDay && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {onOpenPantryChefModal && (
              <button
                onClick={onOpenPantryChefModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 text-xs font-bold border border-emerald-700/50 active:scale-95 transition shadow-sm"
                title="Generar recetas nuevas con los insumos que ya tienes en tu despensa"
              >
                <ChefHat className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Chef</span> Despensa
              </button>
            )}

            <button
              onClick={onOpenQuickAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Extra</span>
            </button>
          </div>
        )}
      </div>

      {/* Meals List with 1-Click Swap & Portions */}
      <div className="space-y-3">
        {activeMeals.map((meal) => {
          const currentServings = meal.servings || 1;
          const displayProtein = meal.macros.protein * currentServings;
          const displayCalories = meal.macros.calories * currentServings;
          const displayCost = meal.estimatedCostMxn * currentServings;

          return (
            <div
              key={meal.id}
              className={`group relative overflow-hidden rounded-3xl border transition-all duration-200 ${
                meal.isCompleted && !isFutureDay
                  ? 'bg-stone-900/90 border-stone-800'
                  : 'bg-stone-900/60 border-stone-800/60 hover:border-stone-700'
              }`}
            >
              <div className="p-3.5 sm:p-4 flex gap-3.5">
                {/* Meal Thumbnail */}
                <div
                  onClick={() => onOpenMealDetail(meal)}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-stone-950 flex-shrink-0 cursor-pointer shadow-md"
                >
                  <img
                    src={meal.imageUrl}
                    alt={meal.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-stone-950/20" />
                  <span className="absolute bottom-1 left-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-950/90 text-stone-300 font-mono">
                    {meal.type}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h3
                        onClick={() => onOpenMealDetail(meal)}
                        className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1 cursor-pointer"
                      >
                        {meal.title}
                      </h3>

                      {/* Prominent Swap Button */}
                      <button
                        onClick={() => handleTriggerSwap(meal)}
                        className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 hover:text-white bg-emerald-950/80 hover:bg-emerald-900 px-2.5 py-1 rounded-xl border border-emerald-700/60 transition active:scale-95 flex-shrink-0 shadow-sm"
                        title="Cambiar platillo por otra alternativa de mercado"
                      >
                        <RefreshCw className="w-3 h-3 text-emerald-400" />
                        <span>Cambiar</span>
                      </button>
                    </div>

                    <p
                      onClick={() => onOpenMealDetail(meal)}
                      className="text-[11px] text-stone-300 line-clamp-1 mt-0.5 cursor-pointer"
                    >
                      {meal.subtitle}
                    </p>
                  </div>

                  {/* Batch Cooking Portion Multiplier & Controls */}
                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-stone-800/80 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 text-[11px] font-extrabold font-mono">
                        +{displayProtein}g P
                      </span>
                      <span className="text-[11px] text-stone-300 font-mono">
                        {displayCalories} kcal
                      </span>
                      <span className="text-[11px] text-amber-400 font-mono">
                        ~${displayCost}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Portion Controls: 1x, 2x, 3x */}
                      <div className="flex items-center rounded-lg bg-stone-950 border border-stone-800 p-0.5 text-[10px]">
                        <button
                          onClick={() => handleServingsChange(meal.id, Math.max(1, currentServings - 1))}
                          className="px-1.5 py-0.5 text-stone-400 hover:text-white"
                          title="Menos porciones"
                        >
                          -
                        </button>
                        <span className="px-1 text-stone-200 font-mono font-bold">
                          {currentServings}x
                        </span>
                        <button
                          onClick={() => handleServingsChange(meal.id, Math.min(6, currentServings + 1))}
                          className="px-1.5 py-0.5 text-stone-400 hover:text-white"
                          title="Más porciones (Batch Cooking)"
                        >
                          +
                        </button>
                      </div>

                      {/* Completion Checkbox Button (Only on Hoy) */}
                      {!isFutureDay ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleMeal(meal.id);
                          }}
                          className={`p-1.5 rounded-xl transition-all active:scale-90 ${
                            meal.isCompleted
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                              : 'bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white border border-stone-700'
                          }`}
                          title={meal.isCompleted ? 'Desmarcar' : 'Completar ingesta'}
                        >
                          {meal.isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleTriggerSwap(meal)}
                          className="text-[10px] text-amber-300 font-semibold bg-amber-950/60 px-2 py-1 rounded-lg border border-amber-800/50 hover:bg-amber-900/60 transition"
                          title="Cambiar este platillo de mañana"
                        >
                          Editar Menú
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Extra Logged Protein Banner (Hoy) */}
      {!isFutureDay && extraProtein > 0 && (
        <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-between text-xs">
          <span className="text-stone-300">
            Ingestas adicionales registradas: <strong className="text-emerald-400 font-bold">+{extraProtein}g P</strong> ({extraCalories} kcal)
          </span>
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-900/40 px-2 py-0.5 rounded">
            Sumado
          </span>
        </div>
      )}
    </div>
  );
};
