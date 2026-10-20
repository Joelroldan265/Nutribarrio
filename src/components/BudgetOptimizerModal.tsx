import React, { useState } from 'react';
import {
  X,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Check,
  Award,
  Zap,
  ShoppingBag,
} from 'lucide-react';
import {
  BudgetConsumptionAnalysis,
  BudgetAdjustmentSuggestion,
  UserProfile,
  OnboardingPlanConfig,
} from '../types/nutrition';

interface BudgetOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: BudgetConsumptionAnalysis;
  userProfile: UserProfile;
  config: OnboardingPlanConfig;
  onApplySuggestion: (suggestion: BudgetAdjustmentSuggestion) => void;
  onApplyAllSuggestions: (suggestions: BudgetAdjustmentSuggestion[]) => void;
}

export const BudgetOptimizerModal: React.FC<BudgetOptimizerModalProps> = ({
  isOpen,
  onClose,
  analysis,
  userProfile,
  config,
  onApplySuggestion,
  onApplyAllSuggestions,
}) => {
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [allApplied, setAllApplied] = useState(false);

  if (!isOpen) return null;

  const handleApplySingle = (sug: BudgetAdjustmentSuggestion) => {
    onApplySuggestion(sug);
    setAppliedIds((prev) => [...prev, sug.id]);
  };

  const handleApplyAll = () => {
    onApplyAllSuggestions(analysis.suggestions);
    setAllApplied(true);
    setAppliedIds(analysis.suggestions.map((s) => s.id));
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  const peopleCount = config.peopleCount || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col justify-between">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          {/* Header Title */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                Optimizador Presupuestal de Barrio
              </span>
              <span className="text-[10px] text-stone-400">Canasta Básica México</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Ajustes Automáticos al Plan Semanal
            </h2>
            <p className="text-xs text-stone-300 mt-1">
              Analizamos tus comidas consumidas y las proyectadas para maximizar tu ahorro en tianguis sin perder ni un solo gramo de proteína diaria.
            </p>
          </div>

          {/* Diagnostic Hero Summary Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-stone-950 via-stone-900 to-emerald-950/40 border border-emerald-800/40 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-stone-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] block">Ahorro Semanal Disponible:</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    ${analysis.potentialWeeklySavingsMxn} MXN
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-stone-400 text-[10px] block">Costo / gramo proteína:</span>
                <span className="text-sm font-bold text-white font-mono">
                  ${analysis.averageCostPerGramProteinMxn} MXN{' '}
                  <span className="text-[10px] text-stone-400 font-normal">
                    (Meta: ${analysis.baselineTianguisCostPerGram})
                  </span>
                </span>
              </div>
            </div>

            {/* Economic Diagnostic Alert */}
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2.5 border ${
                analysis.status === 'alerta_sobregasto'
                  ? 'bg-amber-950/50 text-amber-200 border-amber-800/50'
                  : 'bg-emerald-950/40 text-emerald-200 border-emerald-800/40'
              }`}
            >
              {analysis.status === 'alerta_sobregasto' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="text-[11px] leading-relaxed">
                <strong>Diagnóstico: </strong>
                {analysis.economicDiagnosis}
              </div>
            </div>

            {/* Bulk Master Optimization Button */}
            {analysis.suggestions.length > 0 && !allApplied && (
              <button
                onClick={handleApplyAll}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs shadow-lg shadow-emerald-950/60 active:scale-98 transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>
                  Aplicar Todas las Optimizaciones (Ahorrar ${analysis.potentialWeeklySavingsMxn} MXN)
                </span>
              </button>
            )}

            {allApplied && (
              <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-600 text-emerald-200 text-xs font-bold text-center flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>¡Plan semanal y lista de compras optimizados exitosamente!</span>
              </div>
            )}
          </div>

          {/* Suggestions List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Sugerencias Concretas de Sustitución ({analysis.suggestions.length})</span>
              </h3>
              <span className="text-[10px] text-stone-400 font-mono">
                Porciones para {peopleCount} {peopleCount === 1 ? 'persona' : 'personas'}
              </span>
            </div>

            {analysis.suggestions.length === 0 ? (
              <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-1.5">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-white">¡Plan 100% Optimizado al Tianguis!</p>
                <p className="text-[11px] text-stone-400">
                  Tu menú actual ya utiliza los insumos más económicos y nutritivos de la canasta básica mexicana.
                </p>
              </div>
            ) : (
              analysis.suggestions.map((sug) => {
                const isApplied = appliedIds.includes(sug.id) || sug.applied;

                return (
                  <div
                    key={sug.id}
                    className={`p-3.5 rounded-2xl border transition space-y-2.5 ${
                      isApplied
                        ? 'bg-stone-950/50 border-emerald-800/40 opacity-70'
                        : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    {/* Suggestion Top Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-stone-900 text-stone-300 border border-stone-800">
                          {sug.dayName} • {sug.mealType.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[11px] font-black text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/40">
                        Ahorras ${sug.savingsMxn} MXN
                      </span>
                    </div>

                    {/* Comparison: Current vs Suggested */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {/* Current */}
                      <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800/80 space-y-1">
                        <span className="text-[10px] text-stone-400 block">Platillo Actual:</span>
                        <p className="text-xs font-semibold text-stone-300 line-through truncate">
                          {sug.currentMealTitle}
                        </p>
                        <div className="flex justify-between text-[10px] font-mono text-stone-400">
                          <span>${sug.currentCostMxn} MXN</span>
                          <span>{sug.currentProteinGrams}g P</span>
                        </div>
                      </div>

                      {/* Suggested */}
                      <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/50 space-y-1">
                        <span className="text-[10px] text-emerald-400 font-bold block">
                          Sustitución de Canasta Básica:
                        </span>
                        <p className="text-xs font-bold text-white truncate">
                          {sug.suggestedMeal.title}
                        </p>
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-emerald-300 font-bold">
                            ${sug.suggestedMeal.estimatedCostMxn * peopleCount} MXN
                          </span>
                          <span className="text-emerald-300 font-bold">
                            {sug.suggestedMeal.macros.protein}g P (
                            {sug.proteinDiff >= 0 ? `+${sug.proteinDiff}g` : `${sug.proteinDiff}g`})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rationale explanation */}
                    <p className="text-[11px] text-stone-300 leading-tight">
                      💡 {sug.rationale}
                    </p>

                    {/* Action button */}
                    <div className="flex justify-end pt-1">
                      {isApplied ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 font-mono">
                          <Check className="w-3.5 h-3.5" />
                          <span>Ajuste Aplicado</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApplySingle(sug)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-emerald-600 text-stone-200 hover:text-white font-bold text-xs transition active:scale-95 border border-stone-700"
                        >
                          <span>Aplicar este Ajuste</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Ing. Joel Roldán Tianguis Wisdom Card */}
          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/30 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-900/40 border border-amber-700/50 flex items-center justify-center text-amber-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-[11px] leading-relaxed text-stone-300">
              <strong className="text-amber-400 block mb-0.5">
                Principio Económico del Ing. Joel Roldán Gómez:
              </strong>
              {analysis.tianguisHeroIngredientTip}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
