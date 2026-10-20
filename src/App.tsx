/**
 * Nutribarrio v1.0.2 Pro - Progressive Web App
 * Diseñado y Autorizado por: Ing. Joel Roldán Gómez
 * Especialidad: Control Estricto de Proteína Diaria & Economía de Canasta Básica
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { TodayView } from './views/TodayView';
import { WeeklyView } from './views/WeeklyView';
import { BasketView } from './views/BasketView';
import { ProfileView } from './views/ProfileView';
import { MealDetailModal } from './components/MealDetailModal';
import { AddFoodModal } from './components/AddFoodModal';
import { InstallModal } from './components/InstallModal';
import { AboutModal } from './components/AboutModal';
import { BenchmarkModal } from './components/BenchmarkModal';
import { MealSwapModal } from './components/MealSwapModal';
import { ExportShareModal } from './components/ExportShareModal';
import { ABCDEAssessmentModal } from './components/ABCDEAssessmentModal';
import { OnboardingWizardModal } from './components/OnboardingWizardModal';
import { BudgetOptimizerModal } from './components/BudgetOptimizerModal';
import { WaterRemindersModal } from './components/WaterRemindersModal';
import { PantryRecipeGeneratorModal } from './components/PantryRecipeGeneratorModal';
import {
  INITIAL_MEALS,
  INITIAL_WEEK_LOGS,
  INITIAL_MARKET_ITEMS,
  INITIAL_PROFILE,
  INITIAL_WEEKLY_PLAN,
  INITIAL_ONBOARDING_CONFIG,
} from './data/initialData';
import {
  Meal,
  AlternativeMeal,
  MarketItem,
  DayLog,
  UserProfile,
  DayPlan,
  OnboardingPlanConfig,
  BudgetAdjustmentSuggestion,
  DailyWaterTracker,
} from './types/nutrition';
import {
  calculateNutritionTargets,
  generateSmartWeeklyPlan,
  generateSingleDayPlan,
  generateWeeklyGroceryList,
  analyzeConsumptionAndSuggestBudgetAdjustments,
  applyBudgetSuggestion,
  applyAllBudgetSuggestions,
} from './utils/planGenerator';
import {
  getInitialDailyWaterTracker,
  calculateHydrationTarget,
  generateSmartWaterReminders,
} from './utils/waterTracker';

export default function App() {
  // Navigation State with URL parameter support
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab') as NavTab;
      if (['hoy', 'semanal', 'canasta', 'perfil'].includes(tabParam)) {
        return tabParam;
      }
    }
    return 'hoy';
  });

  // Onboarding & Household Budget Plan Configuration State
  const [onboardingConfig, setOnboardingConfig] = useState<OnboardingPlanConfig>(() => {
    const saved = localStorage.getItem('nutribarrio_onboarding_config');
    return saved ? JSON.parse(saved) : INITIAL_ONBOARDING_CONFIG;
  });

  // Persistent / Local State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nutribarrio_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [meals, setMeals] = useState<Meal[]>(() => {
    const saved = localStorage.getItem('nutribarrio_meals');
    return saved ? JSON.parse(saved) : INITIAL_MEALS;
  });

  const [weeklyPlan, setWeeklyPlan] = useState<Record<string, DayPlan>>(() => {
    const saved = localStorage.getItem('nutribarrio_weekly_plan');
    return saved ? JSON.parse(saved) : INITIAL_WEEKLY_PLAN;
  });

  const [weekLogs, setWeekLogs] = useState<DayLog[]>(() => {
    const saved = localStorage.getItem('nutribarrio_week_logs');
    return saved ? JSON.parse(saved) : INITIAL_WEEK_LOGS;
  });

  const [marketItems, setMarketItems] = useState<MarketItem[]>(() => {
    const saved = localStorage.getItem('nutribarrio_market_items');
    if (saved) {
      return JSON.parse(saved);
    }
    // Generate dynamically from current weekly plan and onboarding config
    return generateWeeklyGroceryList(INITIAL_WEEKLY_PLAN, INITIAL_ONBOARDING_CONFIG);
  });

  const [extraProtein, setExtraProtein] = useState<number>(() => {
    const saved = localStorage.getItem('nutribarrio_extra_protein');
    return saved ? Number(saved) : 0;
  });

  const [extraCalories, setExtraCalories] = useState<number>(() => {
    const saved = localStorage.getItem('nutribarrio_extra_calories');
    return saved ? Number(saved) : 0;
  });

  // Daily Water Tracker state (per-day persistence)
  const [waterTracker, setWaterTracker] = useState<DailyWaterTracker>(() => {
    const todayDate = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem('nutribarrio_water_tracker');
    if (saved) {
      try {
        const parsed: DailyWaterTracker = JSON.parse(saved);
        if (parsed.date === todayDate) {
          return parsed;
        }
      } catch (e) {
        console.warn('Error reading water tracker from storage:', e);
      }
    }
    return getInitialDailyWaterTracker(INITIAL_PROFILE, INITIAL_ONBOARDING_CONFIG);
  });

  // Modals
  const [selectedMealDetail, setSelectedMealDetail] = useState<Meal | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isABCDEModalOpen, setIsABCDEModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isOptimizerModalOpen, setIsOptimizerModalOpen] = useState(false);
  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false);
  const [isPantryGeneratorOpen, setIsPantryGeneratorOpen] = useState(false);
  const [swapModalConfig, setSwapModalConfig] = useState<{
    isOpen: boolean;
    meal: Meal | null;
    dayKey?: string;
    dayLabel?: string;
  }>({
    isOpen: false,
    meal: null,
    dayKey: undefined,
    dayLabel: undefined,
  });

  // Sync water tracker to localStorage
  useEffect(() => {
    localStorage.setItem('nutribarrio_water_tracker', JSON.stringify(waterTracker));
  }, [waterTracker]);

  // Recalculate water targets and reminders dynamically when profile activity or weight changes
  useEffect(() => {
    const { targetMl, targetGlasses } = calculateHydrationTarget(userProfile, onboardingConfig);
    let mappedActivity: 'sedentario' | 'moderado' | 'intenso' | 'atleta' = 'moderado';
    const rawAct = (onboardingConfig?.activityLevel || userProfile.activityLevel || 'moderado').toLowerCase();
    if (rawAct === 'sedentario') mappedActivity = 'sedentario';
    else if (rawAct === 'atleta') mappedActivity = 'atleta';
    else if (rawAct === 'intenso' || rawAct === 'muy_activo' || rawAct === 'activo') mappedActivity = 'intenso';
    else mappedActivity = 'moderado';

    setWaterTracker((prev) => {
      const newReminders = generateSmartWaterReminders(mappedActivity, targetGlasses);
      // Preserve completed state of matching reminders
      const mergedReminders = newReminders.map((nr) => {
        const existing = prev.reminders.find((er) => er.id === nr.id);
        return existing ? { ...nr, completed: existing.completed } : nr;
      });

      return {
        ...prev,
        targetGlasses,
        targetMl,
        activityLevel: mappedActivity,
        reminders: mergedReminders,
      };
    });
  }, [userProfile.weightKg, userProfile.activityLevel, onboardingConfig.activityLevel, userProfile.dailyProteinTarget]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('nutribarrio_onboarding_config', JSON.stringify(onboardingConfig));
  }, [onboardingConfig]);

  useEffect(() => {
    localStorage.setItem('nutribarrio_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('nutribarrio_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('nutribarrio_weekly_plan', JSON.stringify(weeklyPlan));
  }, [weeklyPlan]);

  useEffect(() => {
    localStorage.setItem('nutribarrio_market_items', JSON.stringify(marketItems));
  }, [marketItems]);

  useEffect(() => {
    localStorage.setItem('nutribarrio_extra_protein', String(extraProtein));
    localStorage.setItem('nutribarrio_extra_calories', String(extraCalories));
  }, [extraProtein, extraCalories]);

  // Synchronize today's protein in weekLogs whenever meals, servings or extraProtein change
  useEffect(() => {
    const todayCompletedMeals = meals.filter((m) => m.isCompleted);
    const todayConsumedProtein = Math.round(
      todayCompletedMeals.reduce((acc, m) => acc + (m.macros.protein * (m.servings || 1)), 0) + extraProtein
    );
    const todayConsumedCalories = Math.round(
      todayCompletedMeals.reduce((acc, m) => acc + (m.macros.calories * (m.servings || 1)), 0) + extraCalories
    );

    setWeekLogs((prev) => {
      const updated = [...prev];
      const todayIndex = updated.length - 1;
      if (todayIndex >= 0) {
        updated[todayIndex] = {
          ...updated[todayIndex],
          targetProtein: userProfile.dailyProteinTarget,
          consumedProtein: todayConsumedProtein,
          consumedCalories: todayConsumedCalories,
          isCompliant: todayConsumedProtein >= userProfile.dailyProteinTarget,
        };
      }
      localStorage.setItem('nutribarrio_week_logs', JSON.stringify(updated));
      return updated;
    });
  }, [meals, extraProtein, extraCalories, userProfile.dailyProteinTarget]);

  // Dynamic Budget & Consumption Analysis
  const budgetAnalysis = useMemo(() => {
    const consumedMeals = meals.filter((m) => m.isCompleted);
    return analyzeConsumptionAndSuggestBudgetAdjustments(
      consumedMeals,
      weeklyPlan,
      onboardingConfig,
      userProfile
    );
  }, [meals, weeklyPlan, onboardingConfig, userProfile]);

  // Save new plan config from wizard
  const handleSaveOnboardingConfig = (newConfig: OnboardingPlanConfig) => {
    setOnboardingConfig(newConfig);

    // 1. Recalculate precision nutritional metrics
    const targets = calculateNutritionTargets(newConfig);
    const updatedProfile: UserProfile = {
      ...userProfile,
      weightKg: newConfig.weightKg,
      heightCm: newConfig.heightCm,
      age: newConfig.age,
      gender: newConfig.gender === 'mujer' ? 'femenino' : 'masculino',
      activityLevel:
        newConfig.activityLevel === 'sedentario'
          ? 'sedentario'
          : newConfig.activityLevel === 'atleta'
          ? 'atleta'
          : newConfig.activityLevel === 'muy_activo'
          ? 'intenso'
          : 'moderado',
      dailyProteinTarget: targets.dailyProteinTarget,
      dailyCalorieTarget: targets.dailyCalorieTarget,
      proteinFactor: targets.proteinFactor,
      dailyBudgetLimitMxn: targets.dailyBudgetLimitMxn,
    };
    setUserProfile(updatedProfile);

    // 2. Generate customized weekly plan
    const newWeeklyPlan = generateSmartWeeklyPlan(newConfig);
    setWeeklyPlan(newWeeklyPlan);

    // 3. Set today's meals from the first planned day
    const firstActiveDayKey = newConfig.plannedDays[0] || 'lunes';
    if (newWeeklyPlan[firstActiveDayKey]) {
      setMeals(newWeeklyPlan[firstActiveDayKey].meals);
    }

    // 4. Generate consolidated shopping list for the market
    const newMarketItems = generateWeeklyGroceryList(newWeeklyPlan, newConfig);
    setMarketItems(newMarketItems);

    // Open weekly plan or basket so user sees result immediately
    setActiveTab('semanal');
  };

  // Handlers
  const handleToggleMeal = (mealId: string) => {
    setMeals((prev) =>
      prev.map((meal) => {
        if (meal.id === mealId) {
          const nextState = !meal.isCompleted;
          if (selectedMealDetail && selectedMealDetail.id === mealId) {
            setSelectedMealDetail({ ...meal, isCompleted: nextState });
          }
          return { ...meal, isCompleted: nextState };
        }
        return meal;
      })
    );
  };

  const handleUpdateServings = (mealId: string, servings: number) => {
    setMeals((prev) =>
      prev.map((meal) => (meal.id === mealId ? { ...meal, servings } : meal))
    );
  };

  const handleOpenSwapModal = (meal: Meal, dayKey?: string, dayLabel?: string) => {
    setSwapModalConfig({
      isOpen: true,
      meal,
      dayKey,
      dayLabel,
    });
  };

  const handleSwapMeal = (
    originalMealId: string,
    alternative: AlternativeMeal,
    targetDayKey?: string
  ) => {
    const dayKeyToUpdate = targetDayKey || swapModalConfig.dayKey;

    // 1. If targetDayKey is specified and exists in weeklyPlan, update that day
    if (dayKeyToUpdate && weeklyPlan[dayKeyToUpdate]) {
      setWeeklyPlan((prev) => {
        const currentDay = prev[dayKeyToUpdate];
        if (!currentDay) return prev;

        const updatedMeals = currentDay.meals.map((m) => {
          if (m.id === originalMealId) {
            return {
              ...m,
              title: alternative.title,
              subtitle: alternative.subtitle,
              macros: alternative.macros,
              estimatedCostMxn: alternative.estimatedCostMxn,
              prepTimeMinutes: alternative.prepTimeMinutes,
              imageUrl: alternative.imageUrl,
              ingredients: alternative.ingredients,
              recipeSteps: alternative.recipeSteps,
              tianguisTip: alternative.tianguisTip,
            };
          }
          return m;
        });

        const plannedProtein = updatedMeals.reduce((acc, m) => acc + m.macros.protein, 0);
        const plannedCalories = updatedMeals.reduce((acc, m) => acc + m.macros.calories, 0);
        const plannedCostMxn = updatedMeals.reduce(
          (acc, m) => acc + (m.estimatedCostMxn * (onboardingConfig.peopleCount || 1)),
          0
        );

        const nextPlan = {
          ...prev,
          [dayKeyToUpdate]: {
            ...currentDay,
            meals: updatedMeals,
            plannedProtein,
            plannedCalories,
            plannedCostMxn,
          },
        };

        const nextMarket = generateWeeklyGroceryList(nextPlan, onboardingConfig);
        setMarketItems(nextMarket);
        return nextPlan;
      });
    }

    // 2. Also update `meals` if target day matches today or wasn't explicitly different
    const dayKeys = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const todayKey = dayKeys[new Date().getDay()];

    if (!dayKeyToUpdate || dayKeyToUpdate === todayKey) {
      setMeals((prev) =>
        prev.map((meal) => {
          if (meal.id === originalMealId) {
            return {
              ...meal,
              title: alternative.title,
              subtitle: alternative.subtitle,
              macros: alternative.macros,
              estimatedCostMxn: alternative.estimatedCostMxn,
              prepTimeMinutes: alternative.prepTimeMinutes,
              imageUrl: alternative.imageUrl,
              ingredients: alternative.ingredients,
              recipeSteps: alternative.recipeSteps,
              tianguisTip: alternative.tianguisTip,
            };
          }
          return meal;
        })
      );
    }
  };

  const handleRegenerateDayPlan = (dayKey: string) => {
    const newDayPlan = generateSingleDayPlan(dayKey, onboardingConfig);
    setWeeklyPlan((prev) => {
      const updated = {
        ...prev,
        [dayKey]: newDayPlan,
      };
      const nextMarket = generateWeeklyGroceryList(updated, onboardingConfig);
      setMarketItems(nextMarket);
      return updated;
    });
  };

  const handleCopyMealsToDay = (sourceMeals: Meal[], targetDayKey: string) => {
    setWeeklyPlan((prev) => {
      const existingDay = prev[targetDayKey];
      if (!existingDay) return prev;

      const clonedMeals = sourceMeals.map((m, idx) => ({
        ...m,
        id: `copy-${targetDayKey}-${idx}-${Date.now()}`,
        isCompleted: false,
      }));

      const plannedProtein = clonedMeals.reduce((acc, m) => acc + m.macros.protein, 0);
      const plannedCalories = clonedMeals.reduce((acc, m) => acc + m.macros.calories, 0);
      const plannedCostMxn = clonedMeals.reduce(
        (acc, m) => acc + (m.estimatedCostMxn * (onboardingConfig.peopleCount || 1)),
        0
      );

      const updated = {
        ...prev,
        [targetDayKey]: {
          ...existingDay,
          meals: clonedMeals,
          plannedProtein,
          plannedCalories,
          plannedCostMxn,
        },
      };
      const nextMarket = generateWeeklyGroceryList(updated, onboardingConfig);
      setMarketItems(nextMarket);
      return updated;
    });
  };

  const handleUpdateDayServings = (dayKey: string, mealId: string, servings: number) => {
    setWeeklyPlan((prev) => {
      const currentDay = prev[dayKey];
      if (!currentDay) return prev;

      const updatedMeals = currentDay.meals.map((m) =>
        m.id === mealId ? { ...m, servings } : m
      );

      return {
        ...prev,
        [dayKey]: {
          ...currentDay,
          meals: updatedMeals,
        },
      };
    });
  };

  const handleApplyPantryRecipeToToday = (recipe: Meal, preferredType?: Meal['type']) => {
    const targetType = preferredType || recipe.type;
    setMeals((prev) => {
      const existingIndex = prev.findIndex((m) => m.type === targetType);
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          title: recipe.title,
          subtitle: recipe.subtitle,
          description: recipe.description,
          macros: recipe.macros,
          estimatedCostMxn: recipe.estimatedCostMxn,
          prepTimeMinutes: recipe.prepTimeMinutes,
          imageUrl: recipe.imageUrl,
          imageAlt: recipe.imageAlt || recipe.title,
          ingredients: recipe.ingredients,
          recipeSteps: recipe.recipeSteps,
          tianguisTip: recipe.tianguisTip,
          isCompleted: false,
        };
        return copy;
      } else {
        return [
          ...prev,
          {
            ...recipe,
            id: `pantry-today-${Date.now()}`,
            isCompleted: false,
          },
        ];
      }
    });
  };

  const handleApplyPantryRecipeToFutureDay = (recipe: Meal, targetDayKey: string) => {
    setWeeklyPlan((prev) => {
      const currentDay = prev[targetDayKey];
      if (!currentDay) return prev;

      const existingIndex = currentDay.meals.findIndex((m) => m.type === recipe.type);
      let updatedMeals = [...currentDay.meals];

      if (existingIndex >= 0) {
        updatedMeals[existingIndex] = {
          ...updatedMeals[existingIndex],
          title: recipe.title,
          subtitle: recipe.subtitle,
          description: recipe.description,
          macros: recipe.macros,
          estimatedCostMxn: recipe.estimatedCostMxn,
          prepTimeMinutes: recipe.prepTimeMinutes,
          imageUrl: recipe.imageUrl,
          imageAlt: recipe.imageAlt || recipe.title,
          ingredients: recipe.ingredients,
          recipeSteps: recipe.recipeSteps,
          tianguisTip: recipe.tianguisTip,
        };
      } else {
        updatedMeals.push({
          ...recipe,
          id: `pantry-${targetDayKey}-${Date.now()}`,
          isCompleted: false,
        });
      }

      const plannedProtein = updatedMeals.reduce((acc, m) => acc + m.macros.protein, 0);
      const plannedCalories = updatedMeals.reduce((acc, m) => acc + m.macros.calories, 0);
      const plannedCostMxn = updatedMeals.reduce(
        (acc, m) => acc + m.estimatedCostMxn * (onboardingConfig.peopleCount || 1),
        0
      );

      const nextPlan = {
        ...prev,
        [targetDayKey]: {
          ...currentDay,
          meals: updatedMeals,
          plannedProtein,
          plannedCalories,
          plannedCostMxn,
        },
      };

      const nextMarket = generateWeeklyGroceryList(nextPlan, onboardingConfig);
      setMarketItems(nextMarket);
      return nextPlan;
    });
  };

  const handleAutoGeneratePlan = () => {
    const updatedPlan = generateSmartWeeklyPlan(onboardingConfig);
    setWeeklyPlan(updatedPlan);

    // Regenerate shopping list automatically
    const updatedMarket = generateWeeklyGroceryList(updatedPlan, onboardingConfig);
    setMarketItems(updatedMarket);
  };

  const handleSyncPlanToBasket = () => {
    const updatedMarket = generateWeeklyGroceryList(weeklyPlan, onboardingConfig);
    setMarketItems(updatedMarket);
    setActiveTab('canasta');
  };

  const handleAddProtein = (proteinGrams: number, calories: number) => {
    setExtraProtein((prev) => Math.round(prev + proteinGrams));
    setExtraCalories((prev) => Math.round(prev + calories));
  };

  const handleToggleMarketItem = (itemId: string) => {
    setMarketItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isPurchased: !item.isPurchased } : item
      )
    );
  };

  // Budget Optimization Handlers
  const handleApplyBudgetSuggestion = (suggestion: BudgetAdjustmentSuggestion) => {
    const { updatedPlan, updatedGroceryList } = applyBudgetSuggestion(
      weeklyPlan,
      suggestion,
      onboardingConfig
    );
    setWeeklyPlan(updatedPlan);
    setMarketItems(updatedGroceryList);
  };

  const handleApplyAllBudgetSuggestions = (suggestions: BudgetAdjustmentSuggestion[]) => {
    const { updatedPlan, updatedGroceryList } = applyAllBudgetSuggestions(
      weeklyPlan,
      suggestions,
      onboardingConfig
    );
    setWeeklyPlan(updatedPlan);
    setMarketItems(updatedGroceryList);
  };

  const handleResetData = () => {
    if (window.confirm('¿Deseas restablecer todos los datos del menú, canasta básica y configuración familiar a sus valores iniciales?')) {
      localStorage.clear();
      setOnboardingConfig(INITIAL_ONBOARDING_CONFIG);
      setMeals(INITIAL_MEALS);
      setWeeklyPlan(INITIAL_WEEKLY_PLAN);
      setWeekLogs(INITIAL_WEEK_LOGS);
      setMarketItems(INITIAL_MARKET_ITEMS);
      setUserProfile(INITIAL_PROFILE);
      setExtraProtein(0);
      setExtraCalories(0);
    }
  };

  // Daily Water Tracker Handlers
  const handleAddWaterGlass = (count: number = 1) => {
    setWaterTracker((prev) => ({
      ...prev,
      consumedGlasses: Math.max(0, prev.consumedGlasses + count),
    }));
  };

  const handleSubtractWaterGlass = () => {
    setWaterTracker((prev) => ({
      ...prev,
      consumedGlasses: Math.max(0, prev.consumedGlasses - 1),
    }));
  };

  const handleResetWater = () => {
    if (window.confirm('¿Deseas reiniciar el contador de agua del día a cero?')) {
      setWaterTracker((prev) => ({
        ...prev,
        consumedGlasses: 0,
        reminders: prev.reminders.map((r) => ({ ...r, completed: false })),
      }));
    }
  };

  const handleToggleWaterReminder = (reminderId: string) => {
    setWaterTracker((prev) => ({
      ...prev,
      reminders: prev.reminders.map((r) =>
        r.id === reminderId ? { ...r, completed: !r.completed } : r
      ),
    }));
  };

  const handleToggleWaterRemindersEnabled = (enabled: boolean) => {
    setWaterTracker((prev) => ({
      ...prev,
      remindersEnabled: enabled,
    }));
  };

  // Calculate pending protein for bottom navigation badge
  const completedProteinTotal =
    meals.filter((m) => m.isCompleted).reduce((acc, m) => acc + (m.macros.protein * (m.servings || 1)), 0) + extraProtein;
  const pendingProtein = Math.max(0, userProfile.dailyProteinTarget - completedProteinTotal);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Sticky Header with Developer Badge, PWA status, Benchmark, Savings & ABCDE */}
      <Header
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        onOpenBenchmarkModal={() => setIsBenchmarkModalOpen(true)}
        onOpenABCDEModal={() => setIsABCDEModalOpen(true)}
        onOpenWizardModal={() => setIsOnboardingModalOpen(true)}
        onboardingConfig={onboardingConfig}
        onOpenOptimizerModal={() => setIsOptimizerModalOpen(true)}
        savingsMxn={budgetAnalysis.potentialWeeklySavingsMxn}
        onOpenWaterModal={() => setIsWaterModalOpen(true)}
        waterGlasses={{ consumed: waterTracker.consumedGlasses, target: waterTracker.targetGlasses }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 pt-4">
        {activeTab === 'hoy' && (
          <TodayView
            meals={meals}
            userProfile={userProfile}
            extraProtein={extraProtein}
            extraCalories={extraCalories}
            onToggleMeal={handleToggleMeal}
            onOpenMealDetail={(meal) => setSelectedMealDetail(meal)}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            onOpenAboutModal={() => setIsAboutModalOpen(true)}
            onOpenBenchmarkModal={() => setIsBenchmarkModalOpen(true)}
            onOpenSwapModal={(meal) => handleOpenSwapModal(meal)}
            onUpdateServings={handleUpdateServings}
            onOpenWizardModal={() => setIsOnboardingModalOpen(true)}
            onboardingConfig={onboardingConfig}
            budgetAnalysis={budgetAnalysis}
            onOpenOptimizerModal={() => setIsOptimizerModalOpen(true)}
            waterTracker={waterTracker}
            onAddWaterGlass={handleAddWaterGlass}
            onSubtractWaterGlass={handleSubtractWaterGlass}
            onResetWater={handleResetWater}
            onOpenWaterRemindersModal={() => setIsWaterModalOpen(true)}
            weeklyPlan={weeklyPlan}
            onOpenSwapModalForDay={handleOpenSwapModal}
            onRegenerateDayPlan={handleRegenerateDayPlan}
            onCopyMealsToDay={handleCopyMealsToDay}
            onUpdateDayServings={handleUpdateDayServings}
            onOpenPantryChefModal={() => setIsPantryGeneratorOpen(true)}
          />
        )}

        {activeTab === 'semanal' && (
          <WeeklyView
            weekLogs={weekLogs}
            weeklyPlan={weeklyPlan}
            userProfile={userProfile}
            onOpenAboutModal={() => setIsAboutModalOpen(true)}
            onAutoGeneratePlan={handleAutoGeneratePlan}
            onSyncPlanToBasket={handleSyncPlanToBasket}
            onOpenSwapModal={(meal, dayKey, dayLabel) => handleOpenSwapModal(meal, dayKey, dayLabel)}
            onOpenWizardModal={() => setIsOnboardingModalOpen(true)}
            onboardingConfig={onboardingConfig}
            budgetAnalysis={budgetAnalysis}
            onOpenOptimizerModal={() => setIsOptimizerModalOpen(true)}
            onApplyAllBudgetSuggestions={() =>
              handleApplyAllBudgetSuggestions(budgetAnalysis.suggestions)
            }
          />
        )}

        {activeTab === 'canasta' && (
          <BasketView
            marketItems={marketItems}
            onToggleItem={handleToggleMarketItem}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onboardingConfig={onboardingConfig}
            onOpenWizardModal={() => setIsOnboardingModalOpen(true)}
            onSyncPlanToBasket={handleSyncPlanToBasket}
            onOpenPantryChefModal={() => setIsPantryGeneratorOpen(true)}
          />
        )}

        {activeTab === 'perfil' && (
          <ProfileView
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            onResetData={handleResetData}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
            onOpenAboutModal={() => setIsAboutModalOpen(true)}
            onOpenABCDEModal={() => setIsABCDEModalOpen(true)}
            onOpenWizardModal={() => setIsOnboardingModalOpen(true)}
            onboardingConfig={onboardingConfig}
            onOpenWaterModal={() => setIsWaterModalOpen(true)}
          />
        )}

        {/* Discreet Signature: Ing. Joel Roldan Gomez AI Studio */}
        <div className="w-full text-center py-8 text-xs text-stone-500 font-mono flex items-center justify-center gap-2 select-none border-t border-stone-900/60 mt-6">
          <span className="text-stone-400 font-medium">Nutribarrio v1.1.0 Pro</span>
          <span aria-hidden="true" className="text-stone-700">·</span>
          <span className="text-stone-300 font-semibold tracking-wide">ING. JOEL ROLDÁN GÓMEZ</span>
          <span aria-hidden="true" className="text-stone-700">·</span>
          <span className="text-emerald-400 font-bold tracking-wider">AI STUDIO</span>
        </div>
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        pendingProtein={pendingProtein}
      />

      {/* Modals */}
      <OnboardingWizardModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        config={onboardingConfig}
        onSaveConfig={handleSaveOnboardingConfig}
      />

      <BudgetOptimizerModal
        isOpen={isOptimizerModalOpen}
        onClose={() => setIsOptimizerModalOpen(false)}
        analysis={budgetAnalysis}
        userProfile={userProfile}
        config={onboardingConfig}
        onApplySuggestion={handleApplyBudgetSuggestion}
        onApplyAllSuggestions={handleApplyAllBudgetSuggestions}
      />

      <WaterRemindersModal
        isOpen={isWaterModalOpen}
        onClose={() => setIsWaterModalOpen(false)}
        waterTracker={waterTracker}
        userProfile={userProfile}
        onToggleReminder={handleToggleWaterReminder}
        onToggleRemindersEnabled={handleToggleWaterRemindersEnabled}
      />

      <MealDetailModal
        meal={selectedMealDetail}
        onClose={() => setSelectedMealDetail(null)}
        onToggleComplete={handleToggleMeal}
      />

      <AddFoodModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddProtein={handleAddProtein}
      />

      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      <BenchmarkModal
        isOpen={isBenchmarkModalOpen}
        onClose={() => setIsBenchmarkModalOpen(false)}
      />

      <MealSwapModal
        meal={swapModalConfig.meal}
        isOpen={swapModalConfig.isOpen}
        onClose={() =>
          setSwapModalConfig({
            isOpen: false,
            meal: null,
            dayKey: undefined,
            dayLabel: undefined,
          })
        }
        onSwap={handleSwapMeal}
        dayLabel={swapModalConfig.dayLabel}
        targetDayKey={swapModalConfig.dayKey}
      />

      <ExportShareModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        marketItems={marketItems}
        meals={meals}
      />

      <ABCDEAssessmentModal
        isOpen={isABCDEModalOpen}
        onClose={() => setIsABCDEModalOpen(false)}
        userProfile={userProfile}
        meals={meals}
        extraProtein={extraProtein}
      />

      <PantryRecipeGeneratorModal
        isOpen={isPantryGeneratorOpen}
        onClose={() => setIsPantryGeneratorOpen(false)}
        marketItems={marketItems}
        onTogglePantryItem={handleToggleMarketItem}
        onApplyRecipeToToday={handleApplyPantryRecipeToToday}
        onApplyRecipeToFutureDay={handleApplyPantryRecipeToFutureDay}
      />
    </div>
  );
}
