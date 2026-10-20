/**
 * Nutribarrio v1.0.2 Pro - Motor de Hidratación Inteligente y Recordatorios por Nivel de Actividad
 * Autorizado por: Ing. Joel Roldán Gómez
 */

import { UserProfile, OnboardingPlanConfig, DailyWaterTracker, WaterReminder } from '../types/nutrition';

export const GLASS_VOLUME_ML = 250; // 1 vaso estándar en México = 250 ml

/**
 * Calcula la meta diaria de hidratación en ml y número de vasos,
 * ponderada por peso corporal, requerimiento hiperproteico y nivel de actividad física.
 */
export function calculateHydrationTarget(
  userProfile: UserProfile,
  config?: OnboardingPlanConfig
): { targetMl: number; targetGlasses: number; activityExtraMl: number; proteinExtraMl: number } {
  const weight = userProfile.weightKg || config?.weightKg || 70;
  const activity = (config?.activityLevel || userProfile.activityLevel || 'moderado').toLowerCase();

  // 1. Requerimiento hídrico base clínico: 35 ml por kg de peso
  const baseMl = weight * 35;

  // 2. Extra por nivel de actividad física registrada (pérdidas por sudoración y respiración)
  let activityExtraMl = 500; // default moderado
  if (activity === 'sedentario') {
    activityExtraMl = 0;
  } else if (activity === 'poco_activo' || activity === 'moderado') {
    activityExtraMl = 500; // 2 vasos extra
  } else if (activity === 'activo' || activity === 'intenso' || activity === 'muy_activo') {
    activityExtraMl = 1000; // 4 vasos extra
  } else if (activity === 'atleta') {
    activityExtraMl = 1500; // 6 vasos extra
  }

  // 3. Extra por dieta hiperproteica (>1.8g/kg o >120g/día) para aclaramiento renal de urea
  const isHighProtein = userProfile.dailyProteinTarget >= 120 || userProfile.proteinFactor >= 1.8;
  const proteinExtraMl = isHighProtein ? 250 : 0; // 1 vaso extra

  // Total acumulado redondeado a múltiplos de 250ml
  const rawTotal = baseMl + activityExtraMl + proteinExtraMl;
  const targetGlasses = Math.max(6, Math.ceil(rawTotal / GLASS_VOLUME_ML));
  const targetMl = targetGlasses * GLASS_VOLUME_ML;

  return { targetMl, targetGlasses, activityExtraMl, proteinExtraMl };
}

/**
 * Genera el cronograma inteligente de tomas diarias de agua
 * adaptado al nivel de actividad física del usuario.
 */
export function generateSmartWaterReminders(
  activityLevel: 'sedentario' | 'moderado' | 'intenso' | 'atleta',
  targetGlasses: number
): WaterReminder[] {
  if (activityLevel === 'atleta') {
    return [
      {
        id: 'rem-atleta-1',
        time: '07:00',
        label: 'Despertar y Activación Renal',
        glasses: 2,
        tip: 'Toma 2 vasos (500 ml) con una pizca de sal de grano de tianguis para reactivar la volemia matutina.',
        completed: false,
      },
      {
        id: 'rem-atleta-2',
        time: '09:30',
        label: 'Pre-Entreno y Carga Hídrica',
        glasses: 2,
        tip: 'Hidrata los tejidos conectivos antes de comenzar el esfuerzo intenso.',
        completed: false,
      },
      {
        id: 'rem-atleta-3',
        time: '11:45',
        label: 'Intra-Entreno / Post-Sesión',
        glasses: 3,
        tip: 'Repone 750 ml a sorbos continuos. El músculo es 75% agua; sin hidratación la fuerza cae 15%.',
        completed: false,
      },
      {
        id: 'rem-atleta-4',
        time: '14:00',
        label: 'Soporte Digestivo de Comida',
        glasses: 2,
        tip: 'Acompaña tu comida fuerte. Facilita la hidrólisis y transporte de aminoácidos.',
        completed: false,
      },
      {
        id: 'rem-atleta-5',
        time: '16:30',
        label: 'Ventana de Recuperación Anabólica',
        glasses: 2,
        tip: 'Excelente momento para un vaso de agua fresca de jamaica sin azúcar con chía a granel.',
        completed: false,
      },
      {
        id: 'rem-atleta-6',
        time: '19:00',
        label: 'Termorregulación y Volemia',
        glasses: 2,
        tip: 'Mantiene la presión arterial estable y previene calambres nocturnos.',
        completed: false,
      },
      {
        id: 'rem-atleta-7',
        time: '21:00',
        label: 'Cierre Nocturno Moderado',
        glasses: 1,
        tip: '1 vaso final 1 hora antes de dormir para no interrumpir los ciclos de sueño profundo.',
        completed: false,
      },
    ];
  }

  if (activityLevel === 'intenso') {
    return [
      {
        id: 'rem-intenso-1',
        time: '07:30',
        label: 'Despertar Metabólico',
        glasses: 2,
        tip: '500 ml para cortar el ayuno nocturno e hidratar el tracto digestivo.',
        completed: false,
      },
      {
        id: 'rem-intenso-2',
        time: '10:00',
        label: 'Mitad de Mañana y Claridad Mental',
        glasses: 2,
        tip: 'Previene la cefalea tensional y fatiga inducida por deshidratación subclínica.',
        completed: false,
      },
      {
        id: 'rem-intenso-3',
        time: '13:00',
        label: 'Pre-Comida y Motilidad',
        glasses: 2,
        tip: 'Prepara el estómago para procesar la proteína del almuerzo.',
        completed: false,
      },
      {
        id: 'rem-intenso-4',
        time: '16:00',
        label: 'Peri-Entreno / Tarde Activa',
        glasses: 2,
        tip: 'Consumo continuo a sorbos durante la actividad física.',
        completed: false,
      },
      {
        id: 'rem-intenso-5',
        time: '18:30',
        label: 'Recuperación Muscular',
        glasses: 2,
        tip: 'Agua de limón con pepino y chía. Electrolitos naturales de tianguis.',
        completed: false,
      },
      {
        id: 'rem-intenso-6',
        time: '21:00',
        label: 'Cierre Nocturno',
        glasses: 1,
        tip: 'Último vaso para sellar tu meta diaria sin desvelos por nicturia.',
        completed: false,
      },
    ];
  }

  if (activityLevel === 'moderado') {
    return [
      {
        id: 'rem-mod-1',
        time: '08:00',
        label: 'Despertar y Arranque',
        glasses: 2,
        tip: '2 vasos al iniciar el día para reactivar riñones y circulación sanguínea.',
        completed: false,
      },
      {
        id: 'rem-mod-2',
        time: '11:00',
        label: 'Carga de Media Mañana',
        glasses: 2,
        tip: 'Mantén una botella o vaso en tu mesa de trabajo o área laboral.',
        completed: false,
      },
      {
        id: 'rem-mod-3',
        time: '14:00',
        label: 'Almuerzo Equilibrado',
        glasses: 2,
        tip: 'Acompaña tu comida con agua pura o agua de sabor natural sin azúcar refinada.',
        completed: false,
      },
      {
        id: 'rem-mod-4',
        time: '17:00',
        label: 'Impulso Vespertino',
        glasses: 2,
        tip: 'Sustituye antojos por un vaso de agua fresca con unas gotas de limón.',
        completed: false,
      },
      {
        id: 'rem-mod-5',
        time: '20:30',
        label: 'Hidratación Nocturna',
        glasses: 1,
        tip: 'Completa tu cuota diaria con calma antes de tu cena ligera.',
        completed: false,
      },
    ];
  }

  // Sedentario
  return [
    {
      id: 'rem-sed-1',
      time: '08:30',
      label: 'Despertar Matutino',
      glasses: 2,
      tip: '2 vasos para despertar el metabolismo y lubricar articulaciones.',
      completed: false,
    },
    {
      id: 'rem-sed-2',
      time: '11:30',
      label: 'Pausa Activa e Hidratación',
      glasses: 2,
      tip: 'Ponte de pie, estira las piernas y bebe tu vaso de agua fresca.',
      completed: false,
    },
    {
      id: 'rem-sed-3',
      time: '14:30',
      label: 'Comida del Día',
      glasses: 2,
      tip: 'Agua natural para facilitar una digestión ligera y sin pesadez.',
      completed: false,
    },
    {
      id: 'rem-sed-4',
      time: '17:30',
      label: 'Media Tarde',
      glasses: 1,
      tip: 'Mantiene la saciedad entre comidas y evita picar alimentos procesados.',
      completed: false,
    },
    {
      id: 'rem-sed-5',
      time: '20:30',
      label: 'Cierre del Día',
      glasses: 1,
      tip: 'Último vaso para cumplir tu objetivo diario de hidratación.',
      completed: false,
    },
  ];
}

/**
 * Inicializa o recupera el tracker de hidratación del día
 */
export function getInitialDailyWaterTracker(
  userProfile: UserProfile,
  config?: OnboardingPlanConfig
): DailyWaterTracker {
  const todayDate = new Date().toISOString().split('T')[0];
  const { targetMl, targetGlasses } = calculateHydrationTarget(userProfile, config);

  let mappedActivity: 'sedentario' | 'moderado' | 'intenso' | 'atleta' = 'moderado';
  const rawAct = (config?.activityLevel || userProfile.activityLevel || 'moderado').toLowerCase();
  if (rawAct === 'sedentario') mappedActivity = 'sedentario';
  else if (rawAct === 'atleta') mappedActivity = 'atleta';
  else if (rawAct === 'intenso' || rawAct === 'muy_activo' || rawAct === 'activo') mappedActivity = 'intenso';
  else mappedActivity = 'moderado';

  const reminders = generateSmartWaterReminders(mappedActivity, targetGlasses);

  return {
    date: todayDate,
    consumedGlasses: 0,
    glassVolumeMl: GLASS_VOLUME_ML,
    targetGlasses,
    targetMl,
    remindersEnabled: false,
    activityLevel: mappedActivity,
    reminders,
    tianguisElectrolyteTip:
      'Suero de Barrio del Ing. Joel Roldán: 1 litro de agua + jugo de 2 limones criollos + 1/4 cucharadita de sal de grano mexicana (contiene magnesio y potasio natural) + 1 cucharadita de miel de abeja o estevia. Costo: $3 pesos vs $35 de bebidas comerciales.',
  };
}

/**
 * Solicita permisos de notificación del navegador web
 */
export async function requestWebNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch {
    return false;
  }
}

/**
 * Envía una notificación de agua al usuario
 */
export function triggerWaterNotification(title: string, body: string): void {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: 'nutribarrio-water-reminder',
      });
    } catch (e) {
      console.warn('Notification error:', e);
    }
  }
}
