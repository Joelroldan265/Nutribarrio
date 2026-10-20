import React, { useState, useMemo } from 'react';
import {
  X,
  ChefHat,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  Dumbbell,
  DollarSign,
  Share2,
  Calendar,
  Flame,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Plus,
  RefreshCw,
  Search,
  Check,
  ShoppingBag,
} from 'lucide-react';
import { MarketItem, Meal } from '../types/nutrition';
import {
  matchPantryRecipes,
  generateCreativeRecipeFromPantry,
  formatRecipeToWhatsApp,
  PantryRecipe,
} from '../utils/pantryRecipeGenerator';

interface PantryRecipeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketItems: MarketItem[];
  onTogglePantryItem: (itemId: string) => void;
  onApplyRecipeToToday: (recipe: Meal, mealType?: Meal['type']) => void;
  onApplyRecipeToFutureDay?: (recipe: Meal, targetDayKey: string) => void;
}

export const PantryRecipeGeneratorModal: React.FC<PantryRecipeGeneratorModalProps> = ({
  isOpen,
  onClose,
  marketItems,
  onTogglePantryItem,
  onApplyRecipeToToday,
  onApplyRecipeToFutureDay,
}) => {
  const [activeTab, setActiveTab] = useState<'exactas' | 'casi_listas' | 'creativo'>('exactas');
  const [selectedMealType, setSelectedMealType] = useState<Meal['type'] | 'todas'>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);
  const [copiedRecipeId, setCopiedRecipeId] = useState<string | null>(null);

  // Creative Generator States
  const [selectedPantryIds, setSelectedPantryIds] = useState<string[]>([]);
  const [customGeneratedRecipe, setCustomGeneratedRecipe] = useState<PantryRecipe | null>(null);
  const [creativeMealType, setCreativeMealType] = useState<Meal['type']>('comida');

  // Day target picker state for assignment
  const [targetDayForRecipe, setTargetDayForRecipe] = useState<Record<string, string>>({});

  // Purchased / Available items in pantry
  const purchasedItems = useMemo(
    () => marketItems.filter((item) => item.isPurchased),
    [marketItems]
  );

  // Initialize selected pantry items for creative generator
  React.useEffect(() => {
    if (purchasedItems.length > 0 && selectedPantryIds.length === 0) {
      setSelectedPantryIds(purchasedItems.slice(0, 3).map((i) => i.id));
    }
  }, [purchasedItems]);

  // Matched recipes from catalog
  const allMatched = useMemo(() => {
    return matchPantryRecipes(marketItems, {
      mealType: selectedMealType,
      searchQuery,
    });
  }, [marketItems, selectedMealType, searchQuery]);

  const exactMatches = useMemo(() => allMatched.filter((r) => r.isExactMatch), [allMatched]);
  const nearMatches = useMemo(
    () => allMatched.filter((r) => !r.isExactMatch && r.missingIngredients.length <= 2),
    [allMatched]
  );

  if (!isOpen) return null;

  const handleCopyRecipe = (recipe: PantryRecipe) => {
    const text = formatRecipeToWhatsApp(recipe);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedRecipeId(recipe.id);
      setTimeout(() => setCopiedRecipeId(null), 2500);
    }
  };

  const handleToggleCreativeItem = (id: string) => {
    setSelectedPantryIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleGenerateCreative = () => {
    const items = marketItems.filter((i) => selectedPantryIds.includes(i.id));
    if (items.length === 0) return;
    const generated = generateCreativeRecipeFromPantry(items, creativeMealType);
    setCustomGeneratedRecipe(generated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-800/40 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-inner">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Recetas con mi Despensa
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                  Canasta Básica
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Platillos generados con los {purchasedItems.length} insumos marcados en tu inventario
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Quick Interactive Pantry Bar */}
          <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-bold text-white">
                  Insumos en tu Despensa ({purchasedItems.length} de {marketItems.length})
                </span>
              </div>
              <span className="text-[10px] text-stone-400">
                Toca para marcar o desmarcar lo que tienes
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {marketItems.map((item) => {
                return (
                  <button
                    key={item.id}
                    onClick={() => onTogglePantryItem(item.id)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border flex items-center gap-1 transition-all ${
                      item.isPurchased
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/70 font-bold'
                        : 'bg-stone-900 text-stone-500 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    {item.isPurchased ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex p-1 bg-stone-950 border border-stone-800 rounded-2xl">
            <button
              onClick={() => setActiveTab('exactas')}
              className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'exactas'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% de mi Despensa ({exactMatches.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('casi_listas')}
              className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'casi_listas'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Falta 1 Insumo ({nearMatches.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('creativo')}
              className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'creativo'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generador Creativo</span>
            </button>
          </div>

          {/* Filter & Search Bar for catalog tabs */}
          {activeTab !== 'creativo' && (
            <div className="flex gap-2 flex-wrap items-center justify-between">
              {/* Meal Type Filter */}
              <div className="flex gap-1 overflow-x-auto pb-1 text-xs no-scrollbar">
                {(['todas', 'desayuno', 'comida', 'snack', 'cena'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedMealType(type)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold capitalize transition border ${
                      selectedMealType === type
                        ? 'bg-stone-100 text-stone-900 border-white'
                        : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative flex-1 min-w-[140px]">
                <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar receta o ingrediente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* TAB 1: EXACT MATCH RECIPES */}
          {activeTab === 'exactas' && (
            <div className="space-y-3">
              {exactMatches.length === 0 ? (
                <div className="p-8 text-center rounded-3xl bg-stone-950 border border-stone-800 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-stone-900 flex items-center justify-center text-stone-500">
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    No hay recetas 100% completas con los insumos marcados
                  </h3>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Marca más ingredientes en la barra superior (ej: Tortillas, Huevos o Frijoles) o explora la pestaña "Falta 1 Insumo".
                  </p>
                  <button
                    onClick={() => setActiveTab('casi_listas')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                  >
                    Ver recetas que requieren 1 solo ingrediente extra
                  </button>
                </div>
              ) : (
                exactMatches.map((recipe) => (
                  <RecipePantryCard
                    key={recipe.id}
                    recipe={recipe}
                    isExpanded={expandedRecipeId === recipe.id}
                    onToggleExpand={() =>
                      setExpandedRecipeId(expandedRecipeId === recipe.id ? null : recipe.id)
                    }
                    onCopy={() => handleCopyRecipe(recipe)}
                    isCopied={copiedRecipeId === recipe.id}
                    onApplyToToday={() => {
                      onApplyRecipeToToday(recipe, recipe.type);
                      onClose();
                    }}
                    onApplyToFutureDay={
                      onApplyRecipeToFutureDay
                        ? (dayKey) => {
                            onApplyRecipeToFutureDay(recipe, dayKey);
                            onClose();
                          }
                        : undefined
                    }
                  />
                ))
              )}
            </div>
          )}

          {/* TAB 2: NEAR MATCH RECIPES (FALTA 1 INGREDIENTE) */}
          {activeTab === 'casi_listas' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/40 text-xs text-amber-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  Platillos deliciosos que puedes preparar con lo que tienes más 1 ingrediente económico de tianguis o tiendita de la esquina.
                </span>
              </div>

              {nearMatches.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-400">
                  No se encontraron coincidencias cercanas.
                </div>
              ) : (
                nearMatches.map((recipe) => (
                  <RecipePantryCard
                    key={recipe.id}
                    recipe={recipe}
                    isExpanded={expandedRecipeId === recipe.id}
                    onToggleExpand={() =>
                      setExpandedRecipeId(expandedRecipeId === recipe.id ? null : recipe.id)
                    }
                    onCopy={() => handleCopyRecipe(recipe)}
                    isCopied={copiedRecipeId === recipe.id}
                    onApplyToToday={() => {
                      onApplyRecipeToToday(recipe, recipe.type);
                      onClose();
                    }}
                    onApplyToFutureDay={
                      onApplyRecipeToFutureDay
                        ? (dayKey) => {
                            onApplyRecipeToFutureDay(recipe, dayKey);
                            onClose();
                          }
                        : undefined
                    }
                  />
                ))
              )}
            </div>
          )}

          {/* TAB 3: CREATIVE PANTRY COMBINER ENGINE */}
          {activeTab === 'creativo' && (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-stone-900 to-stone-900 border border-indigo-700/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">
                    Generador de Recetas a la Medida
                  </h3>
                </div>
                <p className="text-xs text-stone-300">
                  Selecciona de 1 a 4 ingredientes que quieras usar de tu alacena y el motor calculará proporciones exactas, macros y preparación al comal.
                </p>

                {/* Insumo pickers */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-stone-400 block">
                    Selecciona ingredientes para combinar:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {purchasedItems.map((item) => {
                      const isSelected = selectedPantryIds.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleToggleCreativeItem(item.id)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                              : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {item.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Meal Type for Generation */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-800 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-stone-400">Tipo de comida:</span>
                    <select
                      value={creativeMealType}
                      onChange={(e) => setCreativeMealType(e.target.value as Meal['type'])}
                      className="bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-1 text-xs text-white font-bold capitalize focus:outline-none focus:border-indigo-500"
                    >
                      <option value="desayuno">Desayuno</option>
                      <option value="comida">Comida</option>
                      <option value="snack">Snack</option>
                      <option value="cena">Cena</option>
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateCreative}
                    disabled={selectedPantryIds.length === 0}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-950/50 active:scale-95 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Generar Receta Nueva</span>
                  </button>
                </div>
              </div>

              {/* Display Generated Recipe */}
              {customGeneratedRecipe && (
                <div className="space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      ¡Receta Creada Exclusivamente con tu Despensa!
                    </span>
                  </div>

                  <RecipePantryCard
                    recipe={customGeneratedRecipe}
                    isExpanded={true}
                    onToggleExpand={() => {}}
                    onCopy={() => handleCopyRecipe(customGeneratedRecipe)}
                    isCopied={copiedRecipeId === customGeneratedRecipe.id}
                    onApplyToToday={() => {
                      onApplyRecipeToToday(customGeneratedRecipe, customGeneratedRecipe.type);
                      onClose();
                    }}
                    onApplyToFutureDay={
                      onApplyRecipeToFutureDay
                        ? (dayKey) => {
                            onApplyRecipeToFutureDay(customGeneratedRecipe, dayKey);
                            onClose();
                          }
                        : undefined
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/70 flex items-center justify-between gap-2 text-xs">
          <div className="text-stone-400">
            {purchasedItems.length} insumos disponibles en tu despensa
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// Child component for rendering an individual recipe card
interface RecipePantryCardProps {
  recipe: PantryRecipe;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onCopy: () => void;
  isCopied: boolean;
  onApplyToToday: () => void;
  onApplyToFutureDay?: (dayKey: string) => void;
}

const RecipePantryCard: React.FC<RecipePantryCardProps> = ({
  recipe,
  isExpanded,
  onToggleExpand,
  onCopy,
  isCopied,
  onApplyToToday,
  onApplyToFutureDay,
}) => {
  const [showDaySelector, setShowDaySelector] = useState(false);

  return (
    <div className="rounded-2xl bg-stone-950 border border-stone-800/80 hover:border-stone-700 transition overflow-hidden">
      <div className="p-3.5 sm:p-4 flex gap-3.5">
        {/* Thumbnail */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-stone-900 flex-shrink-0">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <span className="absolute bottom-1 left-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-950/90 text-stone-300 font-mono">
            {recipe.type}
          </span>
        </div>

        {/* Header Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-1">
              <h3 className="text-sm font-bold text-white line-clamp-1">
                {recipe.title}
              </h3>
              {recipe.isExactMatch ? (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40 flex-shrink-0">
                  100% Despensa
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/40 flex-shrink-0">
                  Falta {recipe.missingIngredients.length}
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
              {recipe.subtitle}
            </p>
          </div>

          {/* Key Badges */}
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-800/30">
              <Dumbbell className="w-3 h-3" />
              {recipe.macros.protein}g Proteína
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-stone-300 bg-stone-900 px-2 py-0.5 rounded-lg border border-stone-800">
              <Flame className="w-3 h-3 text-amber-400" />
              {recipe.macros.calories} kcal
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-300 bg-stone-900 px-2 py-0.5 rounded-lg border border-stone-800">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              ${recipe.estimatedCostMxn} MXN
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-stone-400">
              <Clock className="w-3 h-3" />
              {recipe.prepTimeMinutes}m
            </span>
          </div>
        </div>
      </div>

      {/* Ingredients Overview */}
      <div className="px-3.5 sm:px-4 py-2 border-t border-stone-900 bg-stone-900/40 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
          <span className="text-[10px] text-stone-400 font-semibold uppercase">Insumos:</span>
          {recipe.ingredients.map((ing, idx) => {
            const isMissing = recipe.missingIngredients.includes(ing.name);
            return (
              <span
                key={idx}
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  isMissing
                    ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                    : 'bg-stone-900 text-stone-300 border border-stone-800'
                }`}
              >
                {isMissing ? '⚠️ ' : '✓ '}
                {ing.name}
              </span>
            );
          })}
        </div>

        <button
          onClick={onToggleExpand}
          className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition flex-shrink-0"
          title="Ver receta completa"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Recipe Detail */}
      {isExpanded && (
        <div className="p-3.5 sm:p-4 border-t border-stone-800 space-y-3 bg-stone-950/90 text-xs animate-fade-in">
          {/* Ingredients with portions */}
          <div>
            <h4 className="font-bold text-white mb-1.5">Ingredientes para 1 porción:</h4>
            <div className="space-y-1">
              {recipe.ingredients.map((ing, idx) => {
                const isMissing = recipe.missingIngredients.includes(ing.name);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-0.5 text-stone-300"
                  >
                    <span className="flex items-center gap-1.5">
                      {isMissing ? (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span className={isMissing ? 'text-amber-300 font-medium' : ''}>
                        {ing.name}
                      </span>
                    </span>
                    <span className="font-mono text-stone-400">
                      {ing.amount} ({ing.proteinGrams}g prot)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Steps */}
          {recipe.recipeSteps && recipe.recipeSteps.length > 0 && (
            <div>
              <h4 className="font-bold text-white mb-1.5">Preparación al comal / sartén:</h4>
              <ol className="space-y-1 list-decimal list-inside text-stone-300 text-[11px] leading-relaxed">
                {recipe.recipeSteps.map((step, idx) => (
                  <li key={idx} className="pl-1">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Tianguis Tip */}
          {recipe.tianguisTip && (
            <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-[11px]">
              <strong className="text-amber-400 block mb-0.5">Tip del Tianguis:</strong>
              {recipe.tianguisTip}
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 border-t border-stone-800 flex items-center justify-between gap-2 flex-wrap">
            <button
              onClick={onCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 font-bold text-xs transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isCopied ? '¡Copiado a WhatsApp!' : 'Copiar Receta'}</span>
            </button>

            <div className="flex items-center gap-2">
              {onApplyToFutureDay && (
                <div className="relative">
                  <button
                    onClick={() => setShowDaySelector(!showDaySelector)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs border border-stone-700 transition"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Programar Día</span>
                  </button>

                  {showDaySelector && (
                    <div className="absolute right-0 bottom-full mb-1 w-36 bg-stone-900 border border-stone-700 rounded-xl shadow-xl overflow-hidden z-20">
                      {[
                        { key: 'lunes', label: 'Lunes' },
                        { key: 'martes', label: 'Martes' },
                        { key: 'miercoles', label: 'Miércoles' },
                        { key: 'jueves', label: 'Jueves' },
                        { key: 'viernes', label: 'Viernes' },
                        { key: 'sabado', label: 'Sábado' },
                        { key: 'domingo', label: 'Domingo' },
                      ].map((d) => (
                        <button
                          key={d.key}
                          onClick={() => {
                            setShowDaySelector(false);
                            onApplyToFutureDay(d.key);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-stone-200 hover:bg-stone-800 hover:text-white transition"
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={onApplyToToday}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md active:scale-95 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Usar en Menú de Hoy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
