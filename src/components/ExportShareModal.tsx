import React, { useState } from 'react';
import { X, Share2, Copy, Check, ShoppingBag, ExternalLink, MessageCircle } from 'lucide-react';
import { MarketItem, Meal } from '../types/nutrition';

interface ExportShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketItems: MarketItem[];
  meals: Meal[];
}

export const ExportShareModal: React.FC<ExportShareModalProps> = ({
  isOpen,
  onClose,
  marketItems,
  meals,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate clean WhatsApp markdown formatted list
  const totalTianguis = marketItems.reduce((acc, i) => acc + i.priceTianguisMxn, 0);
  const unpurchasedItems = marketItems.filter((i) => !i.isPurchased);

  const generateWhatsAppText = () => {
    let text = `🛒 *LISTA DE COMPRAS PARA EL TIANGUIS / MERCADO*\n`;
    text += `*Nutribarrio v1.0.2 Pro* • Ing. Joel Roldán Gómez\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    text += `📍 *INSUMOS PENDIENTES POR COMPRAR:*\n`;
    (unpurchasedItems.length > 0 ? unpurchasedItems : marketItems).forEach((item) => {
      text += `[ ] *${item.name}* (${item.unit})\n`;
      text += `    ↳ ~$${item.priceTianguisMxn} MXN | ${item.proteinPer100g}g P/100g\n`;
    });

    text += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💰 *Presupuesto Estimado Tianguis:* ~$${totalTianguis} MXN\n`;
    text += `🍗 *Meta Diaria Estricta:* Proteína asegurada sin intermediarios caros.\n`;
    text += `📲 _Generado con Nutribarrio PWA_`;

    return text;
  };

  const handleCopy = () => {
    const text = generateWhatsAppText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppSend = () => {
    const text = generateWhatsAppText();
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md max-h-[85vh] overflow-y-auto bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>Exportación Rápida a WhatsApp</span>
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          Lleva tu Lista al Tianguis
        </h3>
        <p className="text-xs text-stone-400 mb-4">
          Exporta los insumos pendientes con casillas formateadas para tachar directamente desde tu celular.
        </p>

        {/* Text Preview */}
        <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-xs font-mono text-stone-300 whitespace-pre-wrap max-h-56 overflow-y-auto mb-4 select-all">
          {generateWhatsAppText()}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleWhatsAppSend}
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 active:scale-98 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Abrir y Enviar por WhatsApp</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-2 border border-stone-700 active:scale-98 transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">¡Texto Copiado al Portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-400" />
                <span>Copiar Texto Formateado</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
