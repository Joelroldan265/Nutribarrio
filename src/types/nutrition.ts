/**
 * Nutribarrio v1.0.2 Pro - Definiciones de Tipos y Modelos de Datos Escalables
 * Autorizado por: Ing. Joel Roldán Gómez
 */

export interface MacroNutrients {
  protein: number; // en gramos (g)
  carbs: number;   // en gramos (g)
  fats: number;    // en gramos (g)
  calories: number;// en kcal
}

export interface Ingredient {
  name: string;
  amount: string;
  baseGrams: number;
  estimatedCostMxn: number;
  proteinGrams: number;
}

export interface Meal {
  id: string;
  type: 'desayuno' | 'comida' | 'almuerzo' | 'snack' | 'cena';
  title: string;
  subtitle: string;
  description: string;
  prepTimeMinutes: number;
  servings: number; // Factor de porciones para batch cooking (1x, 2x, 3x)
  estimatedCostMxn: number;
  macros: MacroNutrients;
  imageUrl: string;
  imageAlt: string;
  isCompleted: boolean;
  ingredients: Ingredient[];
  tianguisTip: string;
  recipeSteps: string[];
  alternativeMeals?: AlternativeMeal[];
}

export interface AlternativeMeal {
  id: string;
  title: string;
  subtitle: string;
  macros: MacroNutrients;
  estimatedCostMxn: number;
  prepTimeMinutes: number;
  imageUrl: string;
  ingredients: Ingredient[];
  recipeSteps: string[];
  tianguisTip: string;
}

export interface DayPlan {
  dayId: string; // 'lunes', 'martes', etc.
  dayName: string; // 'Lunes', 'Martes', etc.
  shortName: string; // 'Lun', 'Mar', etc.
  dateString?: string;
  meals: Meal[];
  plannedProtein: number;
  plannedCalories: number;
  plannedCostMxn: number;
}

export type WeeklyMealPlan = Record<string, DayPlan>;

export interface DayLog {
  date: string; // formato YYYY-MM-DD
  dayName: string; // 'Lunes', 'Martes', etc.
  targetProtein: number;
  consumedProtein: number;
  targetCalories: number;
  consumedCalories: number;
  isCompliant: boolean;
  notes?: string;
}

export interface MarketItem {
  id: string;
  name: string;
  category: 'proteina' | 'carbohidratos' | 'verduras' | 'semillas_grasas';
  unit: string;
  priceTianguisMxn: number;
  priceSuperMxn: number;
  proteinPer100g: number;
  costPerGramProteinMxn: number;
  isPurchased: boolean;
  notes: string;
  recommendedWeeklyQty?: string;
  imageUrl?: string;
}

export interface UserProfile {
  name: string;
  weightKg: number;
  heightCm: number;
  age: number;
  gender: 'masculino' | 'femenino';
  activityLevel: 'sedentario' | 'moderado' | 'intenso' | 'atleta';
  goal: 'definicion' | 'recomposicion' | 'volumen_economico';
  proteinFactor: number; // ej: 2.0 g/kg
  dailyProteinTarget: number;
  dailyCalorieTarget: number;
  dailyBudgetLimitMxn: number;
}

export interface AppBenchmark {
  appName: string;
  badge: string;
  monthlyCost: string;
  offlinePwa: boolean;
  tianguisPricing: boolean;
  strictProteinDaily: boolean;
  planFirstApproach: boolean;
  automatedMarketList: boolean;
  privacyNoAds: boolean;
  summary: string;
}

export interface ABCDEAssessment {
  anthropometry: {
    bmi: number;
    bmiCategory: string;
    leanMassKg: number;
    bodyFatPercentEstimated: number;
    waterRequirementLiters: number;
  };
  biochemical: {
    estimatedNitrogenBalance: number; // positivo = anabólico, negativo = catabólico
    anabolicStatus: 'Óptimo (Anabolismo Activo)' | 'Neutro' | 'Alerta (Catabolismo)';
    leucineThresholdTargetGrams: number;
  };
  clinical: {
    recoveryScore: number; // 0-100
    fatigueRisk: 'Bajo' | 'Moderado' | 'Alto';
    digestiveTolerance: string;
  };
  dietary: {
    dailyProteinGrams: number;
    proteinPerKg: number;
    pulsesPerDay: number;
    micronutrientCoveragePercent: number; // Hierro, Calcio nixtamalizado, Potasio, Zinc
  };
  economic: {
    costPerDayMxn: number;
    costPerGramProteinMxn: number;
    monthlySavingsVsSuperMxn: number;
    efficiencyRating: 'Soberanía Alimentaria A+' | 'Eficiente A' | 'Mejorable';
  };
  overallScore: number; // 0-100
  evaluatedAt: string;
}

export interface OnboardingPlanConfig {
  userType: 'individual' | 'familia';
  peopleCount: number; // para cuántos cocinamos (1 - 8)
  gender: 'hombre' | 'mujer';
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: 'sedentario' | 'poco_activo' | 'activo' | 'muy_activo' | 'atleta';
  planGoals: Array<'adelgazar' | 'musculo' | 'dejar_decidir' | 'gastar_menos' | 'alimentar_todos' | 'sano_barato'>;
  painPoints: Array<'diferente_gustos' | 'aburrido_mismo' | 'sin_materias_primas' | 'sobra_plato' | 'falta_tiempo'>;
  mealsToPlan: Array<'desayuno' | 'almuerzo' | 'cena' | 'snack'>;
  dietaryNeed: 'sin_restricciones' | 'vegetariano' | 'vegano' | 'bajo_carbos' | 'solo_proteinas';
  allergies: string[];
  dislikedFoods: string[];
  cuisineStyles: string[];
  cookingEquipment: string[];
  plannedDays: string[]; // ['lunes', 'martes', ...]
  weeklyBudgetMxn: number;
  repetitionPreference: 'nuevo_cada_dia' | 'mismo_cada_dia' | 'un_poco_ambos';
  isCompleted: boolean;
}

export interface BudgetAdjustmentSuggestion {
  id: string;
  dayId: string;
  dayName: string;
  mealIndex: number;
  mealType: 'desayuno' | 'comida' | 'snack' | 'cena';
  currentMealId: string;
  currentMealTitle: string;
  currentCostMxn: number;
  currentProteinGrams: number;
  suggestedMeal: Meal;
  savingsMxn: number;
  proteinDiff: number;
  rationale: string;
  applied: boolean;
}

export interface BudgetConsumptionAnalysis {
  totalConsumedCostMxn: number;
  totalConsumedProteinGrams: number;
  averageCostPerGramProteinMxn: number;
  baselineTianguisCostPerGram: number; // ~$0.42 MXN/g proteína óptima
  status: 'optimo' | 'moderado' | 'alerta_sobregasto';
  weeklyProjectedCostMxn: number;
  weeklyBudgetLimitMxn: number;
  projectedOverspendMxn: number;
  potentialWeeklySavingsMxn: number;
  suggestions: BudgetAdjustmentSuggestion[];
  economicDiagnosis: string;
  tianguisHeroIngredientTip: string;
}

export interface WaterReminder {
  id: string;
  time: string; // "07:30", "09:30", etc.
  label: string; // "Despertar Metabólico", "Pre-Entreno", etc.
  glasses: number;
  tip: string;
  completed: boolean;
}

export interface DailyWaterTracker {
  date: string; // YYYY-MM-DD
  consumedGlasses: number; // 1 vaso = 250 ml
  glassVolumeMl: number; // 250 ml default
  targetGlasses: number;
  targetMl: number;
  remindersEnabled: boolean;
  activityLevel: 'sedentario' | 'moderado' | 'intenso' | 'atleta';
  reminders: WaterReminder[];
  tianguisElectrolyteTip: string;
}


