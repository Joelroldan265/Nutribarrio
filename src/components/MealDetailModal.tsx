import React from 'react';
import { X, Clock, Flame, Dumbbell, DollarSign, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import { Meal } from '../types/nutrition';

interface MealDetailModalProps {
  meal: Meal | null;
  onClose: () => void;
  onToggleComplete: (mealId: string) => void;
}

export const MealDetailModal: React.FC<MealDetailModalProps> = ({
  meal,
  onClose,
  onToggleComplete,
}) => {
  if (!meal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl relative text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-950/70 text-stone-300 hover:text-white backdrop-blur-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-56 w-full overflow-hidden rounded-t-3xl bg-stone-950">
          <img
            src={meal.imageUrl}
            alt={meal.imageAlt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
          
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/90 text-stone-950 font-mono">
                {meal.type}
              </span>
              <h2 className="text-xl font-extrabold text-white mt-1 leading-snug">
                {meal.title}
              </h2>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs text-stone-400 font-medium">Costo aprox.</span>
              <p className="text-lg font-black text-amber-400 leading-none">
                ${meal.estimatedCostMxn} <span className="text-xs font-normal">MXN</span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Macro Badges Grid */}
          <div className="grid grid-cols-4 gap-2 bg-stone-950 p-3 rounded-2xl border border-stone-800">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-medium">
                <Dumbbell className="w-3 h-3" />
                <span>Proteína</span>
              </div>
              <p className="text-base font-black text-white mt-0.5">{meal.macros.protein}g</p>
            </div>
            <div className="text-center border-l border-stone-800">
              <span className="text-xs text-amber-400 font-medium">Carbos</span>
              <p className="text-base font-black text-white mt-0.5">{meal.macros.carbs}g</p>
            </div>
            <div className="text-center border-l border-stone-800">
              <span className="text-xs text-stone-400 font-medium">Grasas</span>
              <p className="text-base font-black text-white mt-0.5">{meal.macros.fats}g</p>
            </div>
            <div className="text-center border-l border-stone-800">
              <div className="flex items-center justify-center gap-1 text-rose-400 text-xs font-medium">
                <Flame className="w-3 h-3" />
                <span>Calorías</span>
              </div>
              <p className="text-base font-black text-white mt-0.5">{meal.macros.calories}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-stone-300 leading-relaxed">
            {meal.description}
          </p>

          {/* Tianguis Tip */}
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/40 flex items-start gap-3">
            <ShoppingBag className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-amber-300 font-semibold block mb-0.5">Tip del Tianguis (Ing. Joel Roldán):</strong>
              <p className="text-stone-300 leading-relaxed">{meal.tianguisTip}</p>
            </div>
          </div>

          {/* Ingredients Breakdown with Costs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2.5 flex items-center gap-1.5">
              <span>Ingredientes y Costo Individual</span>
            </h4>
            <div className="space-y-1.5">
              {meal.ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-stone-950/70 border border-stone-800/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="font-medium text-stone-200">{ing.name}</span>
                    <span className="text-[11px] text-stone-400">({ing.amount})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-emerald-400">+{ing.proteinGrams}g P</span>
                    <span className="text-stone-400 text-xs">${ing.estimatedCostMxn.toFixed(1)} MXN</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preparation Steps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>Preparación Rápida ({meal.prepTimeMinutes} min)</span>
            </h4>
            <div className="space-y-2">
              {meal.recipeSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-300">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button: Toggle Consumed */}
          <div className="pt-2">
            <button
              onClick={() => {
                onToggleComplete(meal.id);
                onClose();
              }}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95 ${
                meal.isCompleted
                  ? 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-emerald-950/60'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{meal.isCompleted ? 'Desmarcar como Consumida' : 'Marcar como Consumida (+ ' + meal.macros.protein + 'g Proteína)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
