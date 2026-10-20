import React, { useState } from 'react';
import {
  X,
  Users,
  User,
  Heart,
  DollarSign,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Utensils,
  Sparkles,
  ShoppingBag,
  ChefHat,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Layers,
  ShieldAlert,
  Sliders,
  Check,
} from 'lucide-react';
import { OnboardingPlanConfig, UserProfile } from '../types/nutrition';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: OnboardingPlanConfig;
  onSaveConfig: (newConfig: OnboardingPlanConfig) => void;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  // Local form state cloned from config
  const [form, setForm] = useState<OnboardingPlanConfig>(config);

  if (!isOpen) return null;

  // Helper toggle functions
  const toggleArrayItem = (field: keyof OnboardingPlanConfig, value: string) => {
    setForm((prev) => {
      const currentList = (prev[field] as string[]) || [];
      const exists = currentList.includes(value);
      const updated = exists ? currentList.filter((item) => item !== value) : [...currentList, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleFinish = () => {
    const finishedConfig = { ...form, isCompleted: true };
    onSaveConfig(finishedConfig);
    onClose();
  };

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

        {/* Step Indicator and Title */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
              Paso {step} de {totalSteps}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Configurador Nutribarrio Pro
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-stone-950 rounded-full mb-4 overflow-hidden border border-stone-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>

          {/* ======================================================== */}
          {/* PASO 1: PERSONAS Y MÉTRICAS BÁSICAS                      */}
          {/* ======================================================== */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  ¿Para quién cocinamos y métricas básicas?
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Podemos planificar solo para ti o para toda la familia con cantidades exactas de mercado.
                </p>
              </div>

              {/* Individual vs Familia */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, userType: 'individual', peopleCount: 1 })}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                    form.userType === 'individual'
                      ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-emerald-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Usuario Individual</h4>
                    <p className="text-[10px] text-stone-400">Cocino solo para mí</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, userType: 'familia', peopleCount: Math.max(2, form.peopleCount) })}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                    form.userType === 'familia'
                      ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Familia Completa</h4>
                    <p className="text-[10px] text-stone-400">Varias personas en casa</p>
                  </div>
                </button>
              </div>

              {/* Selector de número de personas */}
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-stone-300 font-semibold">¿Para cuántas personas cocinamos?</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    {form.peopleCount} {form.peopleCount === 1 ? 'persona' : 'personas'}
                  </span>
                </div>
                <div className="grid grid-cols-8 gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          peopleCount: num,
                          userType: num > 1 ? 'familia' : 'individual',
                        })
                      }
                      className={`py-2 rounded-xl font-mono text-xs font-bold border transition ${
                        form.peopleCount === num
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                          : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Métricas corporales principales */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">Sexo Biológico</label>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, gender: 'hombre' })}
                      className={`py-2 text-[11px] font-bold rounded-xl border ${
                        form.gender === 'hombre'
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-stone-950 text-stone-400 border-stone-800'
                      }`}
                    >
                      Hombre
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, gender: 'mujer' })}
                      className={`py-2 text-[11px] font-bold rounded-xl border ${
                        form.gender === 'mujer'
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-stone-950 text-stone-400 border-stone-800'
                      }`}
                    >
                      Mujer
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">Edad</label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">Estatura (cm)</label>
                  <input
                    type="number"
                    value={form.heightCm}
                    onChange={(e) => setForm({ ...form, heightCm: Number(e.target.value) })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    value={form.weightKg}
                    onChange={(e) => setForm({ ...form, weightKg: Number(e.target.value) })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Nivel de Ejercicio / Actividad */}
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                  ¿Haces ejercicio? (Nivel de actividad física):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs">
                  {[
                    { id: 'sedentario', label: 'Casi no (Sedentario)' },
                    { id: 'poco_activo', label: 'Poco activo (1-2 días)' },
                    { id: 'activo', label: 'Activo (3-4 días)' },
                    { id: 'muy_activo', label: 'Muy activo (5+ días)' },
                    { id: 'atleta', label: 'Atleta / Trabajo pesado' },
                  ].map((act) => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setForm({ ...form, activityLevel: act.id as any })}
                      className={`p-2 rounded-xl text-center border font-bold text-[10px] transition ${
                        form.activityLevel === act.id
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                          : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-white'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PASO 2: OBJETIVOS Y PUNTOS DE DOLOR                      */}
          {/* ======================================================== */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  ¿Para qué hacemos el plan y por qué es difícil hoy?
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Personalizamos el motor de recomendaciones a tus motivos reales.
                </p>
              </div>

              {/* Para qué hacemos el plan */}
              <div>
                <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                  ¿Para qué hacemos el plan? (Selecciona los que apliquen):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'adelgazar', label: '🔥 Adelgazar / Quemar grasa corporal' },
                    { id: 'musculo', label: '💪 Ganar masa muscular (Hipertrofia)' },
                    { id: 'dejar_decidir', label: '🧠 Dejar de decidir qué comer (Paz mental)' },
                    { id: 'gastar_menos', label: '💰 Gastar menos / Ahorro extremo' },
                    { id: 'alimentar_todos', label: '👨‍👩‍👧‍👦 Alimentar a toda la familia bien' },
                    { id: 'sano_barato', label: '🥗 Comer más sano y barato con tianguis' },
                  ].map((item) => {
                    const isSelected = form.planGoals.includes(item.id as any);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleArrayItem('planGoals', item.id)}
                        className={`p-3 rounded-2xl border text-left font-bold text-xs flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-md'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Por qué es difícil */}
              <div className="pt-2 border-t border-stone-800">
                <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                  ¿Por qué se te hace difícil hoy en día?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'diferente_gustos', label: '😤 Cada uno en casa quiere algo diferente' },
                    { id: 'aburrido_mismo', label: '🥱 Comer lo mismo siempre me aburre' },
                    { id: 'sin_materias_primas', label: '🛒 No sé comprar materias primas baratas' },
                    { id: 'sobra_plato', label: '🗑️ Se queda comida en el plato (Desperdicio)' },
                    { id: 'falta_tiempo', label: '⏱️ Falta de tiempo para cocinar diario' },
                  ].map((item) => {
                    const isSelected = form.painPoints.includes(item.id as any);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleArrayItem('painPoints', item.id)}
                        className={`p-3 rounded-2xl border text-left font-bold text-xs flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-md'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400 flex-shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PASO 3: COMIDAS A PLANIFICAR & NECESIDADES               */}
          {/* ======================================================== */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  ¿Qué comidas planificarás y qué necesidades tienes?
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Elige los momentos del día que quieres tener resueltos.
                </p>
              </div>

              {/* Comidas a planificar */}
              <div>
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block mb-2">
                  Comidas a incluir en el plan diario:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'desayuno', label: '🍳 Desayuno', desc: 'Arranque de energía' },
                    { id: 'almuerzo', label: '🍗 Almuerzo / Comida', desc: 'Platillo fuerte' },
                    { id: 'snack', label: '🍌 Snack / Colación', desc: 'Media tarde' },
                    { id: 'cena', label: '🌮 Cena', desc: 'Recuperación nocturna' },
                  ].map((item) => {
                    const isSelected = form.mealsToPlan.includes(item.id as any);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleArrayItem('mealsToPlan', item.id)}
                        className={`p-3 rounded-2xl border text-left transition ${
                          isSelected
                            ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-md'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        <span className="text-xs font-bold block">{item.label}</span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">{item.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Necesidades alimentarias */}
              <div className="pt-2 border-t border-stone-800">
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block mb-2">
                  Preferencia o Necesidad Alimentaria:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'sin_restricciones', label: '🥩 Sin Restricciones (Omnívoro)', desc: 'Pollo, huevo, atún, res y legumbres' },
                    { id: 'alto_proteinas', label: '⚡ Solo Proteínas / Alta Proteína', desc: 'Prioridad máxima a la masa magra' },
                    { id: 'bajo_carbos', label: '🥑 Bajo en Carbohidratos (Low Carb)', desc: 'Menos maíz y arroz, más verduras y grasas' },
                    { id: 'vegetariano', label: '🧀 Vegetariano', desc: 'Huevos, requesón, leche y legumbres' },
                    { id: 'vegano', label: '🌱 Vegano Estricto', desc: 'Frijoles, lentejas, semillas y avena' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setForm({ ...form, dietaryNeed: item.id as any })}
                      className={`p-3 rounded-2xl border text-left transition ${
                        form.dietaryNeed === item.id
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                          : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-bold block">{item.label}</span>
                      <span className="text-[10px] text-stone-300/80 block mt-0.5">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PASO 4: ALERGIAS Y ALIMENTOS QUE ODIAS                   */}
          {/* ======================================================== */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Alergias y Alimentos que Odias
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Los alimentos marcados serán completamente excluidos de tu menú y canasta de compras.
                </p>
              </div>

              {/* Fichas de Alérgenos */}
              <div>
                <label className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  ¿Alguna alergia o intolerancia?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'ninguno', label: '✅ Ninguno / Sin alergias' },
                    { id: 'lactosa', label: '🥛 Intolerancia a Lactosa' },
                    { id: 'gluten', label: '🌾 Gluten / Celíaco' },
                    { id: 'huevo', label: '🥚 Alergia al Huevo' },
                    { id: 'mariscos', label: '🦐 Mariscos' },
                    { id: 'pescado', label: '🐟 Pescado / Atún' },
                    { id: 'cacahuates_nueces', label: '🥜 Cacahuates / Nueces' },
                    { id: 'soya', label: '🌱 Soya' },
                  ].map((item) => {
                    const isSelected = form.allergies.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (item.id === 'ninguno') {
                            setForm({ ...form, allergies: ['ninguno'] });
                          } else {
                            const withoutNinguno = form.allergies.filter((a) => a !== 'ninguno');
                            const exists = withoutNinguno.includes(item.id);
                            const updated = exists
                              ? withoutNinguno.filter((a) => a !== item.id)
                              : [...withoutNinguno, item.id];
                            setForm({
                              ...form,
                              allergies: updated.length === 0 ? ['ninguno'] : updated,
                            });
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-center font-bold text-xs transition ${
                          isSelected
                            ? 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-md'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Alimentos que odias */}
              <div className="pt-2 border-t border-stone-800">
                <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                  ¿Qué alimentos odias o no te gustan? (Para no usarlos jamás):
                </label>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {[
                    'Hígado / Vísceras',
                    'Cebolla cruda',
                    'Picante extremo',
                    'Cilantro',
                    'Nopales con baba',
                    'Atún en lata',
                    'Brócoli',
                    'Plátano maduro',
                    'Ejotes',
                    'Avena caliente',
                  ].map((food) => {
                    const isSelected = form.dislikedFoods.includes(food);
                    return (
                      <button
                        key={food}
                        type="button"
                        onClick={() => toggleArrayItem('dislikedFoods', food)}
                        className={`px-3 py-1.5 rounded-xl border font-bold text-xs transition ${
                          isSelected
                            ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        {isSelected ? `✕ ${food}` : food}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PASO 5: TIPO DE COMIDA & EQUIPAMIENTO DE COCINA          */}
          {/* ======================================================== */}
          {step === 5 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Estilo de Comida y Equipamiento de tu Cocina
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Adaptamos las recetas a lo que realmente tienes en tu cocina de barrio.
                </p>
              </div>

              {/* Estilo Culinario */}
              <div>
                <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                  Tipo de comida preferida:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'mexicana', label: '🇲🇽 Mexicana Tradicional' },
                    { id: 'latina', label: '🍲 Latina Casera' },
                    { id: 'reconfortante', label: '🥘 Reconfortante (Caldos)' },
                    { id: 'rapido_facil', label: '⚡ Rápido y Fácil (<15m)' },
                    { id: 'familiar', label: '👨‍👩‍👦 Para toda la familia' },
                    { id: 'picante', label: '🌶️ Con buen picante' },
                    { id: 'mediterranea', label: '🫒 Mediterránea Barata' },
                    { id: 'asiatica', label: '🥢 Asiática Económica' },
                  ].map((item) => {
                    const isSelected = form.cuisineStyles.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleArrayItem('cuisineStyles', item.id)}
                        className={`p-2.5 rounded-xl border font-bold text-xs text-center transition ${
                          isSelected
                            ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-md'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Con qué cocinas (Equipamiento) */}
              <div className="pt-2 border-t border-stone-800">
                <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <ChefHat className="w-4 h-4 text-amber-400" />
                  ¿Con qué cocinas en tu casa? (Equipamiento disponible):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'fogones_gas', label: '🔥 Fogones / Estufa de gas' },
                    { id: 'parrilla_comal', label: '🍳 Comal / Sartén de hierro' },
                    { id: 'licuadora', label: '🌪️ Licuadora' },
                    { id: 'freidora_aire', label: '🍟 Freidora de Aire (Airfryer)' },
                    { id: 'olla_presion', label: '⏱️ Olla de Presión / Express' },
                    { id: 'microondas', label: '📻 Horno de Microondas' },
                    { id: 'horno_gas', label: '🥧 Horno de gas tradicional' },
                    { id: 'olla_lenta', label: '🍲 Olla de cocción lenta' },
                    { id: 'horno_lena', label: '🪵 Asador / Horno de leña' },
                  ].map((eq) => {
                    const isSelected = form.cookingEquipment.includes(eq.id);
                    return (
                      <button
                        key={eq.id}
                        type="button"
                        onClick={() => toggleArrayItem('cookingEquipment', eq.id)}
                        className={`p-2.5 rounded-xl border font-bold text-xs text-left transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{eq.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PASO 6: DÍAS, PRESUPUESTO SEMANAL Y REPETICIÓN           */}
          {/* ======================================================== */}
          {step === 6 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Días, Presupuesto Semanal y Repetición
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Alineamos las compras de la canasta básica a tu economía real.
                </p>
              </div>

              {/* Días a planificar */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-bold text-stone-300 uppercase tracking-wider">
                    ¿Qué días planificamos? ({form.plannedDays.length} días)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        plannedDays:
                          form.plannedDays.length === 7
                            ? ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']
                            : ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
                      })
                    }
                    className="text-[11px] text-emerald-400 font-bold hover:underline"
                  >
                    {form.plannedDays.length === 7 ? 'Solo Lun-Vie' : 'Toda la semana (7d)'}
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[
                    { id: 'lunes', label: 'Lun' },
                    { id: 'martes', label: 'Mar' },
                    { id: 'miercoles', label: 'Mié' },
                    { id: 'jueves', label: 'Jue' },
                    { id: 'viernes', label: 'Vie' },
                    { id: 'sabado', label: 'Sáb' },
                    { id: 'domingo', label: 'Dom' },
                  ].map((day) => {
                    const isSelected = form.plannedDays.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => toggleArrayItem('plannedDays', day.id)}
                        className={`py-2 rounded-xl text-xs font-bold border transition ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                            : 'bg-stone-950 text-stone-500 border-stone-800'
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Presupuesto Semanal en Pesos (MXN) */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Presupuesto Máximo Semanal (Tianguis):
                  </span>
                  <span className="text-xl font-black text-amber-400 font-mono">
                    ${form.weeklyBudgetMxn} <span className="text-xs font-normal">MXN</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="350"
                  max="3500"
                  step="50"
                  value={form.weeklyBudgetMxn}
                  onChange={(e) => setForm({ ...form, weeklyBudgetMxn: Number(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-stone-900 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>$350 MXN (1 pers)</span>
                  <span>$800 MXN (Pareja)</span>
                  <span>$1,500 MXN (Familia 3-4)</span>
                  <span>$3,500 MXN (Familia 6+)</span>
                </div>
                <p className="text-[11px] text-stone-400 pt-1">
                  Costo aproximado por persona al día: <strong className="text-emerald-400 font-mono">
                    ${Math.round(form.weeklyBudgetMxn / (form.peopleCount * (form.plannedDays.length || 7)))} MXN
                  </strong>
                </p>
              </div>

              {/* Estrategia de Variedad vs Repetición */}
              <div>
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block mb-2">
                  ¿Quieres que se repita la comida o prefieres variedad?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    {
                      id: 'nuevo_cada_dia',
                      label: '✨ Algo nuevo todos los días',
                      desc: 'Máxima variedad, ideal si te aburres rápido.',
                    },
                    {
                      id: 'un_poco_ambos',
                      label: '⚖️ Un poco de ambos (Recomendado)',
                      desc: 'Cocinas para 2 días (Batch cooking) y ahorras horas.',
                    },
                    {
                      id: 'mismo_cada_dia',
                      label: '📦 Lo mismo todos los días',
                      desc: 'Máximo ahorro y preparación en bloque los domingos.',
                    },
                  ].map((rep) => (
                    <button
                      key={rep.id}
                      type="button"
                      onClick={() => setForm({ ...form, repetitionPreference: rep.id as any })}
                      className={`p-3 rounded-2xl border text-left transition ${
                        form.repetitionPreference === rep.id
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                          : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-bold block">{rep.label}</span>
                      <span className="text-[10px] text-stone-300/80 block mt-0.5">{rep.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <span />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition ml-auto"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/60 active:scale-95 transition ml-auto"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Generar Plan y Lista de Compras</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
