import React from 'react';
import { X, ShieldCheck, Award, Zap, AlertTriangle, HeartHandshake } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Badge */}
        <div className="flex items-center gap-2 mb-3 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Ingeniería Nutricional Aplicada</span>
        </div>

        <h2 className="text-xl font-black text-white tracking-tight mb-1">
          Nutribarrio <span className="text-emerald-400">v1.1.0 Pro</span>
        </h2>
        <p className="text-xs text-stone-400 mb-4 pb-3 border-b border-stone-800">
          Diseñado, Autorizado y Desarrollado por el <strong className="text-stone-200">Ing. Joel Roldán Gómez</strong> • <span className="text-amber-400 font-bold">AI Studio</span>
        </p>

        {/* Philosophy */}
        <div className="space-y-4 text-xs text-stone-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
            <h4 className="font-bold text-emerald-300 flex items-center gap-1.5 mb-1 text-sm">
              <Zap className="w-4 h-4 text-emerald-400" />
              Principio 1: Cero Promedios Semanales Engañosos
            </h4>
            <p className="text-stone-300">
              En fitness comercial abunda el error de promediar la proteína: <em>"Si hoy comí 80g pero el domingo como 220g, el promedio me da 150g"</em>. <strong>Esto es una falacia fisiológica</strong>. La síntesis proteica muscular (MPS) opera en ventanas de 24 horas gatilladas por el umbral de leucina (~2.5g a 3g por ingesta). El músculo no almacena aminoácidos libres para mañana: si hoy estás en déficit, hoy catabolizas tejido magro.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5 mb-1 text-sm">
              <HeartHandshake className="w-4 h-4 text-amber-400" />
              Principio 2: Soberanía Nutricional y Canasta Básica
            </h4>
            <p className="text-stone-300">
              No necesitas suplementos importados de $1,400 MXN ni cortes caros para construir masa muscular de élite. La canasta básica de Latinoamérica y los mercados sobre ruedas (tianguis) ofrecen las fuentes más biodisponibles del planeta: <strong>huevo de granja, requesón artesanal, pechuga con hueso, frijol negro de la olla y atún en agua</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Ficha Técnica del Sistema v1.1.0 Pro
            </h4>
            <ul className="space-y-1 text-stone-400">
              <li>• <strong>Planificador Temporal:</strong> Navegación y cambio directo de menús para <em>Hoy</em>, <em>Mañana</em> y <em>Pasado Mañana</em> con sincronización a canasta.</li>
              <li>• <strong>Optimizador Presupuestal:</strong> Auditoría de comidas consumidas y sustitución automática por insumos más eficientes de la canasta básica mexicana.</li>
              <li>• <strong>Hidratación Inteligente:</strong> Contador diario de vasos de agua con recordatorios cronometrados según nivel de actividad física (sedentario a atleta).</li>
              <li>• <strong>Onboarding Familiar:</strong> Calibración de comensales, alergias, alimentos vetados, presupuesto semanal y equipamiento de cocina.</li>
              <li>• <strong>Arquitectura:</strong> Progressive Web App (PWA) Standalone 100% Offline con almacenamiento local.</li>
            </ul>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-stone-800 flex items-center justify-between">
          <div className="text-[11px] text-stone-400">
            Firma oficial: <span className="text-emerald-400 font-semibold">Ing. Joel Roldán Gómez</span> • <span className="text-amber-400 font-bold">AI Studio</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
