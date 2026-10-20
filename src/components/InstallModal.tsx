import React from 'react';
import { X, Download, Share, PlusSquare, CheckCircle, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isIOS, isInstalled, install } = usePWAInstall();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-0.5 shadow-lg">
            <div className="w-full h-full bg-stone-900 rounded-[10px] flex items-center justify-center">
              <img src="/icon.svg" alt="Nutribarrio" className="w-9 h-9" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
              Instalar Nutribarrio
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PWA Standalone
              </span>
            </h3>
            <p className="text-xs text-stone-400">Versión 1.0.2 Pro • Por Ing. Joel Roldán Gómez</p>
          </div>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed mb-4">
          Nutribarrio está optimizada como una Progressive Web App de ultra bajo consumo y funciona <strong className="text-emerald-400">100% offline</strong> en el mercado o tianguis, sin gastar datos móviles.
        </p>

        {isInstalled ? (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-700/40 flex items-center gap-2.5 text-emerald-300 text-xs font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>¡La aplicación ya se encuentra instalada en este dispositivo!</span>
          </div>
        ) : isInstallable ? (
          <div className="space-y-3">
            <button
              onClick={async () => {
                await install();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/60 active:scale-95 transition"
            >
              <Download className="w-4 h-4" />
              Instalar en Pantalla de Inicio
            </button>
            <p className="text-[11px] text-stone-400 text-center">
              Sin descargas de tiendas externas. Instalación directa y segura.
            </p>
          </div>
        ) : isIOS ? (
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
            <p className="text-xs font-semibold text-white flex items-center gap-1.5">
              <span>Instrucciones para iPhone / iPad (Safari):</span>
            </p>
            <ol className="text-xs text-stone-300 space-y-2 list-none">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Toca el botón <strong className="text-emerald-400 inline-flex items-center gap-1"><Share className="w-3.5 h-3.5 inline" /> Compartir</strong> en la barra inferior de Safari.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Desliza hacia abajo y selecciona <strong className="text-emerald-400 inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 inline" /> Agregar a Inicio</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center text-[10px] font-bold">3</span>
                <span>Presiona <strong>"Agregar"</strong> arriba a la derecha. ¡Listo!</span>
              </li>
            </ol>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300 space-y-2">
            <p className="font-semibold text-white">Instalación manual desde el navegador:</p>
            <p className="text-stone-400">
              Abre el menú de opciones de tu navegador (los tres puntos verticales ⋮) y selecciona <strong>"Agregar a la pantalla principal"</strong> o <strong>"Instalar aplicación"</strong>.
            </p>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Certificado por Ing. Joel Roldán Gómez
          </span>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
