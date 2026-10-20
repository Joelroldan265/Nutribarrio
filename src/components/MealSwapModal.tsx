import React, { useMemo } from 'react';
import { X, RefreshCw, Dumbbell, Flame, DollarSign, Clock, Check, Sparkles, Calendar } from 'lucide-react';
import { Meal, AlternativeMeal } from '../types/nutrition';
import { EXTENDED_RECIPE_POOL } from '../utils/planGenerator';

interface MealSwapModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  onSwap: (originalMealId: string, alternative: AlternativeMeal, targetDayKey?: string) => void;
  dayLabel?: string;
  targetDayKey?: string;
}

export const MealSwapModal: React.FC<MealSwapModalProps> = ({
  meal,
  isOpen,
  onClose,
  onSwap,
  dayLabel,
  targetDayKey,
}) => {
  if (!isOpen || !meal) return null;

  // Determine available alternatives: existing alternatives + pool matches
  const availableAlternatives: AlternativeMeal[] = useMemo(() => {
    const list: AlternativeMeal[] = [...(meal.alternativeMeals || [])];

    // If fewer than 2 alternatives, supplement with recipes from EXTENDED_RECIPE_POOL
    const normalizedType = meal.type === 'almuerzo' ? 'comida' : meal.type;
    const poolMatches = EXTENDED_RECIPE_POOL.filter(
      (r) =>
        (r.type === normalizedType || (normalizedType === 'comida' && r.type === 'almuerzo')) &&
        r.title.toLowerCase() !== meal.title.toLowerCase()
    );

    poolMatches.forEach((rec) => {
      // Avoid duplicates
      if (!list.some((existing) => existing.title.toLowerCase() === rec.title.toLowerCase())) {
        list.push({
          id: `pool-alt-${rec.id}`,
          title: rec.title,
          subtitle: rec.subtitle,
          macros: rec.macros,
          estimatedCostMxn: rec.estimatedCostMxn,
          prepTimeMinutes: rec.prepTimeMinutes,
          imageUrl: rec.imageUrl,
          ingredients: rec.ingredients,
          recipeSteps: rec.recipeSteps,
          tianguisTip: rec.tianguisTip,
        });
      }
    });

    return list;
  }, [meal]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>Intercambiador Inteligente de Platillo</span>
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          Alternativas con Insumos del Tianguis
        </h3>

        {/* Day Context Pill */}
        {dayLabel && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/70 border border-emerald-800/40 text-emerald-300 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cambiando menú para: <strong>{dayLabel}</strong></span>
          </div>
        )}

        <p className="text-xs text-stone-400 mb-4">
          Platillo actual: <strong className="text-stone-200">{meal.title}</strong> ({meal.macros.protein}g P • ${meal.estimatedCostMxn} MXN)
        </p>

        {availableAlternatives.length === 0 ? (
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-center text-xs text-stone-400">
            No se encontraron alternativas directas para este tipo de platillo.
          </div>
        ) : (
          <div className="space-y-3">
            {availableAlternatives.map((alt) => (
              <div
                key={alt.id}
                className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 hover:border-emerald-600/60 transition group space-y-3"
              >
                <div className="flex gap-3">
                  <img
                    src={alt.imageUrl}
                    alt={alt.title}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-stone-900"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {alt.title}
                    </h4>
                    <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                      {alt.subtitle}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono">
                      <span className="text-emerald-400 font-bold">
                        +{alt.macros.protein}g P
                      </span>
                      <span className="text-stone-400">
                        {alt.macros.calories} kcal
                      </span>
                      <span className="text-amber-400 font-bold">
                        ~${alt.estimatedCostMxn} MXN
                      </span>
                      <span className="text-stone-500">
                        {alt.prepTimeMinutes} min
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ingredients preview */}
                {alt.ingredients && alt.ingredients.length > 0 && (
                  <div className="text-[10px] text-stone-400 bg-stone-900/60 p-2 rounded-xl">
                    <span className="text-stone-300 font-semibold block mb-0.5">Insumos del tianguis:</span>
                    {alt.ingredients.map((ing) => `${ing.name} (${ing.amount})`).join(' • ')}
                  </div>
                )}

                {/* Tianguis Tip */}
                {alt.tianguisTip && (
                  <p className="text-[10px] text-emerald-400/90 italic bg-emerald-950/30 border border-emerald-900/30 p-2 rounded-xl">
                    💡 {alt.tianguisTip}
                  </p>
                )}

                {/* Swap Button */}
                <button
                  onClick={() => {
                    onSwap(meal.id, alt, targetDayKey);
                    onClose();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    Intercambiar por este Menú {dayLabel ? `para ${dayLabel}` : ''}
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
