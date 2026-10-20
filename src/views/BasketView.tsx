import React, { useState } from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  Circle,
  Tag,
  DollarSign,
  TrendingDown,
  Sparkles,
  Search,
  Filter,
  Layers,
  Award,
} from 'lucide-react';
import { MarketItem, OnboardingPlanConfig, DayPlan } from '../types/nutrition';
import { Users, Calendar, Sliders, ChefHat } from 'lucide-react';

interface BasketViewProps {
  marketItems: MarketItem[];
  onToggleItem: (id: string) => void;
  onOpenExportModal?: () => void;
  onboardingConfig?: OnboardingPlanConfig;
  onOpenWizardModal?: () => void;
  onSyncPlanToBasket?: () => void;
  onOpenPantryChefModal?: () => void;
}

export const BasketView: React.FC<BasketViewProps> = ({
  marketItems,
  onToggleItem,
  onOpenExportModal,
  onboardingConfig,
  onOpenWizardModal,
  onSyncPlanToBasket,
  onOpenPantryChefModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTabSub, setActiveTabSub] = useState<'lista' | 'costo_gramo'>('lista');

  const peopleCount = onboardingConfig?.peopleCount || 1;
  const plannedDaysCount = onboardingConfig?.plannedDays?.length || 7;
  const weeklyBudget = onboardingConfig?.weeklyBudgetMxn || 750;

  // Filtered items with dynamic scaled quantities and prices
  const filteredItems = marketItems.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Dynamic budget calculations directly from the consolidated market items
  const totalTianguisCost = marketItems.reduce((acc, item) => acc + item.priceTianguisMxn, 0);
  const totalSuperCost = marketItems.reduce((acc, item) => acc + item.priceSuperMxn, 0);
  const totalSavings = Math.max(0, totalSuperCost - totalTianguisCost);
  const savingsPercent = totalSuperCost > 0 ? Math.round((totalSavings / totalSuperCost) * 100) : 38;

  const purchasedCount = marketItems.filter((i) => i.isPurchased).length;
  const purchasedCost = marketItems
    .filter((i) => i.isPurchased)
    .reduce((acc, item) => acc + item.priceTianguisMxn, 0);

  const isWithinBudget = totalTianguisCost <= weeklyBudget;
  const budgetDiff = Math.abs(weeklyBudget - totalTianguisCost);
  const budgetPercentUsed = Math.min(100, Math.round((totalTianguisCost / weeklyBudget) * 100));

  // Sort by lowest cost per gram of protein for the cost matrix tab
  const proteinEfficiencyList = [...marketItems].sort(
    (a, b) => a.costPerGramProteinMxn - b.costPerGramProteinMxn
  );

  return (
    <div className="space-y-4 pb-24 text-left animate-fade-in">
      {/* Family Size & Budget Gauge Bar */}
      <div className="p-3.5 rounded-3xl bg-stone-900 border border-stone-800 space-y-3 shadow-lg">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                Lista de Compras Semanal ({peopleCount} {peopleCount === 1 ? 'persona' : 'personas'})
              </span>
              <span className="text-[10px] text-stone-400">
                Calculada con los platillos programados para {plannedDaysCount} días
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onSyncPlanToBasket && (
              <button
                onClick={onSyncPlanToBasket}
                className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition"
                title="Re-calcular insumos desde los platillos de la semana"
              >
                Re-Calcular
              </button>
            )}

            {onOpenWizardModal && (
              <button
                onClick={onOpenWizardModal}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
              >
                <Sliders className="w-3 h-3 text-amber-300" />
                <span>Ajustar</span>
              </button>
            )}
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className="p-2.5 rounded-2xl bg-stone-950 border border-stone-800/80 space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-stone-300 font-medium">
              Presupuesto Semanal Asignado: <strong className="text-white font-mono">${weeklyBudget} MXN</strong>
            </span>
            <span className={`font-bold font-mono ${isWithinBudget ? 'text-emerald-400' : 'text-amber-400'}`}>
              ${totalTianguisCost} MXN ({budgetPercentUsed}%)
            </span>
          </div>

          <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
            <div
              className={`h-full transition-all duration-500 ${
                isWithinBudget ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, budgetPercentUsed)}%` }}
            />
          </div>

          <div className="text-[10px] flex items-center justify-between">
            {isWithinBudget ? (
              <span className="text-emerald-400 font-semibold">
                ✓ Te sobran ${budgetDiff} MXN de tu presupuesto semanal.
              </span>
            ) : (
              <span className="text-amber-400 font-semibold">
                ⚠️ Excede presupuesto por ${budgetDiff} MXN. ¡Aprovecha compras a granel!
              </span>
            )}
            <span className="text-stone-400 font-mono">
              ~${Math.round(totalTianguisCost / (peopleCount * plannedDaysCount))} MXN/día por persona
            </span>
          </div>
        </div>
      </div>

      {/* Market Economy Header & Savings Hero */}
      <div className="rounded-3xl bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 p-5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
              Canasta Básica del Tianguis (CDMX / México)
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/40">
            MXN Pesos
          </span>
        </div>

        {/* Total Weekly Budget Comparison */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-700/50">
            <span className="text-[10px] font-semibold text-emerald-300 block">Total Tianguis / Mercado</span>
            <p className="text-2xl font-black text-white font-mono mt-0.5">
              ${totalTianguisCost}{' '}
              <span className="text-xs font-normal text-emerald-400">MXN</span>
            </p>
            <span className="text-[10px] text-emerald-400/90 font-medium">Insumos para los {plannedDaysCount} días</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800">
            <span className="text-[10px] font-semibold text-stone-300 block">Mismo pedido en Supermercado</span>
            <p className="text-2xl font-black text-stone-300 font-mono mt-0.5 line-through">
              ${totalSuperCost}{' '}
              <span className="text-xs font-normal">MXN</span>
            </p>
            <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              Ahorras ${totalSavings} MXN ({savingsPercent}%)
            </span>
          </div>
        </div>

        {/* Checklist progress tracker & WhatsApp Export */}
        <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between text-xs gap-3 flex-wrap">
          <div>
            <span className="text-stone-300 font-medium">Artículos comprados en el mercado:</span>
            <p className="text-sm font-bold text-white mt-0.5">
              {purchasedCount} de {marketItems.length} insumos adquiridos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-stone-300 block">Gasto actual</span>
              <span className="text-base font-black text-emerald-400 font-mono">
                ${purchasedCost} MXN
              </span>
            </div>

            {onOpenExportModal && (
              <button
                onClick={onOpenExportModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/50 active:scale-95 transition"
                title="Llevar la lista a WhatsApp con casillas"
              >
                <span>WhatsApp</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chef de Despensa Callout Card */}
      {onOpenPantryChefModal && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-stone-900 to-stone-900 border border-emerald-600/50 shadow-xl flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-inner">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-300 uppercase tracking-wider block">
                  Chef de Despensa • Canasta Básica
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-mono">
                  {purchasedCount} disponibles
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Genera platillos nuevos con los ingredientes que ya compraste sin gastar nada más.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenPantryChefModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/50 active:scale-95 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generar Recetas</span>
          </button>
        </div>
      )}

      {/* Sub-tab selection: Interactive List vs Protein Efficiency Matrix */}
      <div className="flex p-1 bg-stone-900 border border-stone-800 rounded-2xl">
        <button
          onClick={() => setActiveTabSub('lista')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTabSub === 'lista'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          Lista de Compras del Mercado
        </button>
        <button
          onClick={() => setActiveTabSub('costo_gramo')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTabSub === 'costo_gramo'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Matriz de Costo por Gramo de Proteína</span>
        </button>
      </div>

      {activeTabSub === 'lista' ? (
        <>
          {/* Search & Categories */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar insumo (ej: requesón, pollo, avena...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'proteina', label: 'Proteína Barata' },
                { id: 'carbohidratos', label: 'Carbos Complejos' },
                { id: 'verduras', label: 'Verduras del Tianguis' },
                { id: 'semillas_grasas', label: 'Semillas & Grasas' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-[11px] font-bold border transition ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                      : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Checklist Items */}
          <div className="space-y-2.5">
            {filteredItems.map((item) => {
              return (
                <div
                  key={item.id}
                  onClick={() => onToggleItem(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    item.isPurchased
                      ? 'bg-stone-900/40 border-stone-800/50 opacity-70'
                      : 'bg-stone-900 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      className={`p-1 rounded-lg flex-shrink-0 transition ${
                        item.isPurchased
                          ? 'text-emerald-400 bg-emerald-950/60'
                          : 'text-stone-500 hover:text-stone-300'
                      }`}
                    >
                      {item.isPurchased ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    {/* Fresh Ingredient Photo */}
                    {item.imageUrl && (
                      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-stone-950 flex-shrink-0 border border-stone-800">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className={`w-full h-full object-cover transition-transform duration-300 ${
                            item.isPurchased ? 'grayscale opacity-60' : 'hover:scale-105'
                          }`}
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-xs font-bold font-display ${
                            item.isPurchased ? 'line-through text-stone-500' : 'text-white'
                          }`}
                        >
                          {item.name}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          ({item.unit})
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                        {item.notes}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-400">
                        <span className="font-semibold text-emerald-400 font-mono">
                          {item.proteinPer100g}g P / 100g
                        </span>
                        <span>·</span>
                        <span className="font-mono text-stone-400">
                          ${item.costPerGramProteinMxn} MXN/g
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black text-amber-400 font-mono">
                      ${item.priceTianguisMxn}{' '}
                      <span className="text-[10px] font-normal text-stone-400">MXN</span>
                    </p>
                    <span className="text-[10px] text-stone-500 line-through">
                      Súper: ${item.priceSuperMxn}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Protein-Per-Peso Matrix (Analysis by Ing. Joel Roldán) */
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-xs">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Índice de Eficiencia Económica Nutricional
            </h4>
            <p className="text-stone-300 leading-relaxed">
              Ordenado de <strong className="text-white">menor a mayor costo por gramo de proteína</strong>. Estos son los alimentos que construyen más músculo por cada peso invertido en el tianguis.
            </p>
          </div>

          <div className="space-y-2">
            {proteinEfficiencyList.map((item, rank) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      rank === 0
                        ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                        : rank === 1
                        ? 'bg-stone-300 text-stone-950'
                        : rank === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    #{rank + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white">{item.name}</p>
                    <p className="text-[10px] text-stone-400">
                      {item.unit} • ${item.priceTianguisMxn} MXN en tianguis
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black text-emerald-400 font-mono">
                    ${item.costPerGramProteinMxn.toFixed(2)} MXN
                  </p>
                  <span className="text-[10px] text-stone-400">por gramo de proteína</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
