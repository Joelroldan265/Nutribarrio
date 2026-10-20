import React from 'react';
import { X, Check, Minus, Trophy, Sparkles, ShieldCheck, Zap, DollarSign, WifiOff, ShoppingBag } from 'lucide-react';
import { COMPETITIVE_BENCHMARK } from '../data/initialData';

interface BenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BenchmarkModal: React.FC<BenchmarkModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-1 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Auditoría Competitiva & Benchmark 2026</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Nutribarrio vs. Las Mejores Apps del Mundo
        </h2>
        <p className="text-xs text-stone-400 mb-5">
          Análisis comparativo de arquitectura, economía, accesibilidad y rigor científico. Autorizado por el <strong className="text-stone-200">Ing. Joel Roldán Gómez</strong>.
        </p>

        {/* 6 Strategic Pillars of Nutribarrio */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-xs">
            <span className="font-bold text-emerald-300 flex items-center gap-1 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              1. Tianguis & Pesos MXN
            </span>
            <p className="text-[11px] text-stone-300">Precios reales de mercado local, no suscripciones en USD ni insumos gringos caros.</p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-xs">
            <span className="font-bold text-emerald-300 flex items-center gap-1 mb-1">
              <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
              2. PWA 100% Offline
            </span>
            <p className="text-[11px] text-stone-300">Funciona adentro de los tianguis techados sin gastar datos ni perder conexión.</p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-xs">
            <span className="font-bold text-emerald-300 flex items-center gap-1 mb-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              3. Umbral Diario 24h
            </span>
            <p className="text-[11px] text-stone-300">Cero promedios semanales que enmascaran el catabolismo del músculo.</p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-xs">
            <span className="font-bold text-emerald-300 flex items-center gap-1 mb-1">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              4. Lista a WhatsApp
            </span>
            <p className="text-[11px] text-stone-300">Exporta la lista consolidada en 1 tap con casillas para tachar en el mercado.</p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-xs">
            <span className="font-bold text-emerald-300 flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              5. Batch Cooking x1-x4
            </span>
            <p className="text-[11px] text-stone-300">Multiplica porciones automáticamente para cocinar una sola vez para 2 o 3 días.</p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-xs">
            <span className="font-bold text-emerald-300 flex items-center gap-1 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              6. Privacidad & Cero Spam
            </span>
            <p className="text-[11px] text-stone-300">Sin anuncios molestos ni venta de tus datos personales a aseguradoras.</p>
          </div>
        </div>

        {/* Detailed Benchmark Matrix Table */}
        <div className="overflow-x-auto rounded-2xl border border-stone-800 bg-stone-950 mb-5">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-900/80 text-stone-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Aplicación</th>
                <th className="py-2.5 px-2 text-center">Costo Mensual</th>
                <th className="py-2.5 px-2 text-center">Plan-First</th>
                <th className="py-2.5 px-2 text-center">Offline PWA</th>
                <th className="py-2.5 px-2 text-center">Canasta MXN</th>
                <th className="py-2.5 px-2 text-center">Proteína Estricta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/70 text-stone-300">
              {COMPETITIVE_BENCHMARK.map((app, idx) => {
                const isNutribarrio = idx === 0;
                return (
                  <tr
                    key={idx}
                    className={
                      isNutribarrio
                        ? 'bg-emerald-950/30 font-semibold text-white'
                        : 'hover:bg-stone-900/40'
                    }
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">{app.appName}</span>
                        {isNutribarrio && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500 text-stone-950 font-black">
                            LÍDER
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400 block">{app.badge}</span>
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-[11px]">
                      {isNutribarrio ? (
                        <span className="text-emerald-400 font-bold">$0 MXN (Libre)</span>
                      ) : (
                        app.monthlyCost
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {app.planFirstApproach ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 text-stone-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {app.offlinePwa ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 text-stone-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {app.tianguisPricing ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 text-stone-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {app.strictProteinDaily ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 text-stone-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Verdict */}
        <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-300 space-y-2">
          <p className="font-bold text-white flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            Dictamen del Ing. Joel Roldán Gómez:
          </p>
          <p className="leading-relaxed text-stone-300">
            "Nutribarrio no compite copiando a las apps extranjeras; las supera en su contexto real. Adoptamos la precisión plan-first de <strong>Mealbird</strong> y el rigor científico de <strong>MacroFactor</strong>, pero adaptados con costos del tianguis mexicano, tolerancia offline real y sin cobrar suscripciones mensuales abusivas."
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
          >
            Cerrar Comparativa
          </button>
        </div>
      </div>
    </div>
  );
};
