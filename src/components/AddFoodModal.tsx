import React, { useState } from 'react';
import { X, Plus, Dumbbell, Flame, Sparkles } from 'lucide-react';
import { QUICK_ADD_ITEMS } from '../data/initialData';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProtein: (proteinGrams: number, calories: number, description: string) => void;
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  onAddProtein,
}) => {
  const [customName, setCustomName] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCalories, setCustomCalories] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(customProtein);
    const c = parseFloat(customCalories) || p * 4;
    if (!isNaN(p) && p > 0) {
      onAddProtein(p, c, customName || 'Alimento Personalizado');
      setCustomName('');
      setCustomProtein('');
      setCustomCalories('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md max-h-[85vh] overflow-y-auto bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Plus className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white">
            Registro Rápido de Proteína
          </h3>
        </div>
        <p className="text-xs text-stone-400 mb-4">
          Añade alimentos de la canasta básica mexicana para asegurar tu meta diaria estricta.
        </p>

        {/* Quick selection staples */}
        <div className="space-y-2 mb-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
            Insumos Populares del Tianguis
          </span>
          <div className="grid grid-cols-1 gap-2">
            {QUICK_ADD_ITEMS.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  onAddProtein(item.protein, item.calories, item.name);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-2xl bg-stone-950 hover:bg-stone-800/80 border border-stone-800/80 text-left transition group active:scale-[0.98]"
              >
                <div>
                  <p className="text-xs font-semibold text-stone-200 group-hover:text-emerald-300">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-stone-400">
                    {item.calories} kcal • ~${item.costMxn} MXN
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-800/50">
                    +{item.protein}g P
                  </span>
                  <Plus className="w-4 h-4 text-stone-400 group-hover:text-emerald-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <form onSubmit={handleCustomSubmit} className="pt-3 border-t border-stone-800 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
            O escribe un alimento a la medida
          </span>
          <div>
            <label className="text-[11px] text-stone-400 block mb-1">Descripción</label>
            <input
              type="text"
              placeholder="Ej: 3 claras de huevo o batido casero"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-stone-400 block mb-1">Proteína (g) *</label>
              <input
                type="number"
                step="0.5"
                required
                placeholder="Ej: 25"
                value={customProtein}
                onChange={(e) => setCustomProtein(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-stone-400 block mb-1">Calorías (kcal)</label>
              <input
                type="number"
                placeholder="Ej: 180"
                value={customCalories}
                onChange={(e) => setCustomCalories(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition active:scale-95"
          >
            Registrar Ingesta
          </button>
        </form>
      </div>
    </div>
  );
};
