/**
 * Nutribarrio v1.0.2 Pro - Motor Inteligente de Planificación Semanal y Lista de Compras Dinámica
 * Autorizado por: Ing. Joel Roldán Gómez
 */

import {
  OnboardingPlanConfig,
  UserProfile,
  DayPlan,
  Meal,
  MarketItem,
  Ingredient,
  BudgetConsumptionAnalysis,
  BudgetAdjustmentSuggestion,
} from '../types/nutrition';
import { INITIAL_MEALS } from '../data/initialData';

/**
 * Recetario extendido clasificado por tipo, dieta, alérgenos y equipamiento
 */
export interface RecipeDefinition extends Meal {
  cuisine: string[];
  equipmentNeeded: string[];
  allergens: string[]; // 'huevo', 'lacteos', 'mariscos', 'mani_cacahuate', 'gluten', 'soya'
  dietCompat: Array<'sin_restricciones' | 'vegetariano' | 'vegano' | 'bajo_carbos' | 'solo_proteinas'>;
}

export const EXTENDED_RECIPE_POOL: RecipeDefinition[] = [
  // DESAYUNOS
  {
    ...INITIAL_MEALS[0],
    id: 'rec-desayuno-huevos-mexicana',
    cuisine: ['mexicana', 'latina', 'rapido_facil', 'familiar', 'picante'],
    equipmentNeeded: ['fogones_gas', 'parrilla_comal'],
    allergens: ['huevo', 'lacteos'],
    dietCompat: ['sin_restricciones', 'vegetariano', 'bajo_carbos', 'solo_proteinas'],
  },
  {
    id: 'rec-desayuno-chilaquiles-requeson',
    type: 'desayuno',
    title: 'Chilaquiles Rojos con Huevos al Comal y Requesón',
    subtitle: 'Energía sostenida, salsa casera de epazote y proteína láctea de bajo costo',
    description: 'Tortillas de nixtamal horneadas al comal con caldillo rojo de jitomate, 3 huevos tiernos y 60g de requesón artesanal.',
    prepTimeMinutes: 18,
    servings: 1,
    estimatedCostMxn: 26,
    macros: { protein: 37, carbs: 46, fats: 18, calories: 494 },
    imageUrl: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Chilaquiles rojos con huevo',
    isCompleted: false,
    tianguisTip: 'Hornea las tortillas sobrantes de días anteriores al comal en lugar de usar totopos fritos comerciales.',
    ingredients: [
      { name: 'Huevos de rancho', amount: '3 piezas', baseGrams: 150, estimatedCostMxn: 7.5, proteinGrams: 18 },
      { name: 'Requesón artesanal de tianguis', amount: '60g', baseGrams: 60, estimatedCostMxn: 4.5, proteinGrams: 8 },
      { name: 'Tortillas de nixtamal', amount: '3 piezas', baseGrams: 75, estimatedCostMxn: 3.0, proteinGrams: 4.5 },
      { name: 'Frijoles negros de la olla', amount: '80g cocidos', baseGrams: 80, estimatedCostMxn: 3.0, proteinGrams: 5 },
      { name: 'Jitomate, cebolla y chile', amount: 'Para salsa roja', baseGrams: 100, estimatedCostMxn: 5.0, proteinGrams: 1.5 },
    ],
    recipeSteps: [
      'Corta tortillas en triángulos y tuéstalas al comal sin aceite hasta dorar.',
      'Licúa jitomate asado con chile y un diente de ajo; hierve 4 minutos.',
      'Monta los totopos con salsa, corona con 3 huevos y espolvorea el requesón.',
    ],
    cuisine: ['mexicana', 'latina', 'reconfortante', 'familiar'],
    equipmentNeeded: ['fogones_gas', 'licuadora', 'parrilla_comal'],
    allergens: ['huevo', 'lacteos'],
    dietCompat: ['sin_restricciones', 'vegetariano'],
  },
  {
    id: 'rec-desayuno-omelette-nopales',
    type: 'desayuno',
    title: 'Omelette de Requesón con Nopales Asados al Orégano',
    subtitle: 'Bajo en carbohidratos, altísima saciedad y fibra prebiótica',
    description: '3 huevos batidos rellenos de 70g de requesón artesanal fresco, acompañados de 2 nopales tiernos asados al comal con salsa verde.',
    prepTimeMinutes: 12,
    servings: 1,
    estimatedCostMxn: 21,
    macros: { protein: 35, carbs: 14, fats: 16, calories: 340 },
    imageUrl: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Omelette con nopales',
    isCompleted: false,
    tianguisTip: 'El nopal cuesta ~$10 pesos por 5 piezas en el tianguis. Es la mejor fibra soluble para controlar glucosa.',
    ingredients: [
      { name: 'Huevos de rancho', amount: '3 piezas', baseGrams: 150, estimatedCostMxn: 7.5, proteinGrams: 18 },
      { name: 'Requesón artesanal de tianguis', amount: '70g', baseGrams: 70, estimatedCostMxn: 5.0, proteinGrams: 10 },
      { name: 'Nopales tiernos', amount: '2 piezas medianas', baseGrams: 120, estimatedCostMxn: 3.5, proteinGrams: 2.5 },
      { name: 'Tortillas de nixtamal', amount: '1 pieza', baseGrams: 25, estimatedCostMxn: 1.0, proteinGrams: 1.5 },
      { name: 'Jitomate y cebolla', amount: 'Al gusto', baseGrams: 50, estimatedCostMxn: 4.0, proteinGrams: 1 },
    ],
    recipeSteps: [
      'Asa los nopales en el comal con sal y orégano seco hasta cambiar de color.',
      'Bate los 3 huevos y viértelos en sartén antiadherente.',
      'Rellena con el requesón artesanal, dobla y sirve junto a los nopales.',
    ],
    cuisine: ['mexicana', 'rapido_facil', 'reconfortante'],
    equipmentNeeded: ['fogones_gas', 'parrilla_comal'],
    allergens: ['huevo', 'lacteos'],
    dietCompat: ['sin_restricciones', 'vegetariano', 'bajo_carbos', 'solo_proteinas'],
  },
  {
    id: 'rec-desayuno-tofu-vegano-frijol',
    type: 'desayuno',
    title: 'Revoltillo de Garbanzo y Frijol con Nopal y Aguacate (100% Vegano)',
    subtitle: 'Proteína vegetal de tianguis, cero colesterol y hierro biodisponible',
    description: 'Garbanzos y frijoles negros machacados con cúrcuma, cebolla, jitomate y nopal asado, servidos con 3 tortillas de maíz y 1/4 de aguacate.',
    prepTimeMinutes: 14,
    servings: 1,
    estimatedCostMxn: 19,
    macros: { protein: 28, carbs: 54, fats: 11, calories: 427 },
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Revoltillo vegano con frijoles y aguacate',
    isCompleted: false,
    tianguisTip: 'Los garbanzos secos a granel rinden el triple al hidratar y cocer en casa.',
    ingredients: [
      { name: 'Garbanzos cocidos de mercado', amount: '150g', baseGrams: 150, estimatedCostMxn: 5.5, proteinGrams: 13 },
      { name: 'Frijoles negros de la olla', amount: '120g', baseGrams: 120, estimatedCostMxn: 4.0, proteinGrams: 9 },
      { name: 'Nopales tiernos', amount: '2 piezas', baseGrams: 100, estimatedCostMxn: 3.5, proteinGrams: 2 },
      { name: 'Tortillas de nixtamal', amount: '3 piezas', baseGrams: 75, estimatedCostMxn: 3.0, proteinGrams: 4.5 },
      { name: 'Aguacate Hass de tianguis', amount: '1/4 pieza', baseGrams: 40, estimatedCostMxn: 3.0, proteinGrams: 1 },
    ],
    recipeSteps: [
      'Saltea cebolla y jitomate con una pizca de comino y cúrcuma.',
      'Agrega los garbanzos y frijoles; machaca ligeramente con tenedor.',
      'Sirve caliente con nopal asado y aguacate.',
    ],
    cuisine: ['mexicana', 'latina', 'familiar'],
    equipmentNeeded: ['fogones_gas', 'parrilla_comal'],
    allergens: [],
    dietCompat: ['sin_restricciones', 'vegetariano', 'vegano'],
  },

  // COMIDAS / ALMUERZOS
  {
    ...INITIAL_MEALS[1],
    id: 'rec-comida-pechuga-asada-nopal',
    cuisine: ['mexicana', 'latina', 'rapido_facil', 'familiar'],
    equipmentNeeded: ['fogones_gas', 'parrilla_comal'],
    allergens: [],
    dietCompat: ['sin_restricciones', 'bajo_carbos', 'solo_proteinas'],
  },
  {
    id: 'rec-comida-tinga-pollo-tostadas',
    type: 'comida',
    title: 'Tinga de Pollo Casera en Tostadas con Frijol y Lechuga',
    subtitle: 'El rey del Batch Cooking: rinde para toda la familia por pocos pesos',
    description: '150g de pechuga de pollo deshebrada en caldillo de jitomate con chipotle y cebolla en juliana, montada en tostadas de comal con frijoles refritos.',
    prepTimeMinutes: 20,
    servings: 1,
    estimatedCostMxn: 39,
    macros: { protein: 50, carbs: 52, fats: 13, calories: 525 },
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Tostadas de tinga de pollo',
    isCompleted: false,
    tianguisTip: 'Cuece 1 kilo de pechuga entera con hueso ($95 MXN). El caldo te sirve de base para sopas y la carne rinde 6 porciones.',
    ingredients: [
      { name: 'Pechuga de pollo fresca', amount: '160g cruda (140g cocida)', baseGrams: 160, estimatedCostMxn: 22.0, proteinGrams: 44 },
      { name: 'Tortillas de nixtamal (tostadas)', amount: '3 piezas', baseGrams: 75, estimatedCostMxn: 3.5, proteinGrams: 4.5 },
      { name: 'Frijoles negros de la olla', amount: '100g machacados', baseGrams: 100, estimatedCostMxn: 3.5, proteinGrams: 6 },
      { name: 'Jitomate, cebolla y chipotle', amount: 'Para recaudo', baseGrams: 100, estimatedCostMxn: 6.0, proteinGrams: 1.5 },
      { name: 'Lechuga fresca de tianguis', amount: 'Al gusto', baseGrams: 50, estimatedCostMxn: 2.0, proteinGrams: 0.5 },
    ],
    recipeSteps: [
      'Hierve la pechuga con ajo, cebolla y sal; deshebra finamente.',
      'Sofríe cebolla en tiras, agrega el recaudo de jitomate colado y el pollo.',
      'Unta frijoles en las tostadas calientes, coloca la tinga y lechuga picada.',
    ],
    cuisine: ['mexicana', 'latina', 'reconfortante', 'familiar'],
    equipmentNeeded: ['fogones_gas', 'olla_presion', 'licuadora'],
    allergens: [],
    dietCompat: ['sin_restricciones', 'solo_proteinas'],
  },
  {
    id: 'rec-comida-alambre-pechuga-pimientos',
    type: 'comida',
    title: 'Alambre de Pechuga con Pimientos, Cebolla y Queso Fresco',
    subtitle: 'Fusión rápida de alto valor biológico y sabor callejero sin excesos de grasa',
    description: '150g de pechuga en fajitas salteada a fuego vivo con pimiento morrón, cebolla blanca y 40g de requesón/queso fresco, con 3 tortillas de comal.',
    prepTimeMinutes: 15,
    servings: 1,
    estimatedCostMxn: 38,
    macros: { protein: 49, carbs: 38, fats: 12, calories: 456 },
    imageUrl: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Alambre de pechuga',
    isCompleted: false,
    tianguisTip: 'Los pimientos en tianguis suelen rematarse al final del día ($15 el montón de 3 piezas).',
    ingredients: [
      { name: 'Pechuga de pollo fresca', amount: '160g en cubos', baseGrams: 160, estimatedCostMxn: 22.0, proteinGrams: 44 },
      { name: 'Pimientos y cebolla de tianguis', amount: '100g picados', baseGrams: 100, estimatedCostMxn: 6.0, proteinGrams: 1.5 },
      { name: 'Requesón artesanal de tianguis', amount: '40g', baseGrams: 40, estimatedCostMxn: 3.5, proteinGrams: 5 },
      { name: 'Tortillas de nixtamal', amount: '3 piezas', baseGrams: 75, estimatedCostMxn: 3.0, proteinGrams: 4.5 },
      { name: 'Limón y cilantro', amount: 'Al gusto', baseGrams: 30, estimatedCostMxn: 2.0, proteinGrams: 0 },
    ],
    recipeSteps: [
      'Saltea la pechuga en sartén bien caliente con sal y pimienta 5 minutos.',
      'Incorpora los pimientos y cebolla hasta acitronar.',
      'Apaga el fuego, mezcla con requesón o queso fresco y acompaña con tortillas.',
    ],
    cuisine: ['mexicana', 'rapido_facil', 'latina'],
    equipmentNeeded: ['fogones_gas', 'freidora_aire', 'parrilla_comal'],
    allergens: ['lacteos'],
    dietCompat: ['sin_restricciones', 'bajo_carbos', 'solo_proteinas'],
  },
  {
    id: 'rec-comida-cazuela-lentejas-huevos-veggie',
    type: 'comida',
    title: 'Plato Potente de Lentejas Guisadas con 3 Huevos Duros y Requesón',
    subtitle: 'Poder anabólico vegetal con aminoácidos completos de mercado',
    description: '1 taza y media de lentejas caseras calientes con recaudo de jitomate y cilantro, coronadas con 3 huevos duros y 60g de requesón artesanal.',
    prepTimeMinutes: 18,
    servings: 1,
    estimatedCostMxn: 24,
    macros: { protein: 46, carbs: 62, fats: 16, calories: 576 },
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Lentejas con huevos duros',
    isCompleted: false,
    tianguisTip: 'Las lentejas tienen más hierro por peso que la carne roja cuando se combinan con vitamina C (limón).',
    ingredients: [
      { name: 'Lentejas cocidas de mercado', amount: '260g cocidas', baseGrams: 260, estimatedCostMxn: 7.0, proteinGrams: 20 },
      { name: 'Huevos de rancho', amount: '3 piezas', baseGrams: 150, estimatedCostMxn: 7.5, proteinGrams: 18 },
      { name: 'Requesón artesanal de tianguis', amount: '60g', baseGrams: 60, estimatedCostMxn: 4.5, proteinGrams: 8 },
      { name: 'Jitomate, cebolla y cilantro', amount: 'Para caldillo', baseGrams: 80, estimatedCostMxn: 4.0, proteinGrams: 1 },
      { name: 'Tortillas de nixtamal', amount: '2 piezas', baseGrams: 50, estimatedCostMxn: 2.0, proteinGrams: 3 },
    ],
    recipeSteps: [
      'Calienta las lentejas con su caldillo bien condimentado con epazote o cilantro.',
      'Pica los huevos cocidos en mitades y ponlos sobre las lentejas.',
      'Añade el requesón fresco y rocía bastante jugo de limón fresco.',
    ],
    cuisine: ['mexicana', 'latina', 'reconfortante', 'familiar'],
    equipmentNeeded: ['fogones_gas', 'olla_presion'],
    allergens: ['huevo', 'lacteos'],
    dietCompat: ['sin_restricciones', 'vegetariano'],
  },

  // SNACKS / COLACIONES
  {
    ...INITIAL_MEALS[2],
    id: 'rec-snack-avena-platano-pepitas',
    cuisine: ['familiar', 'reconfortante', 'rapido_facil'],
    equipmentNeeded: ['fogones_gas', 'microondas'],
    allergens: ['lacteos'],
    dietCompat: ['sin_restricciones', 'vegetariano'],
  },
  {
    id: 'rec-snack-licuado-cacahuate-avena',
    type: 'snack',
    title: 'Licuado Proteico de Barrio (Avena, Leche y Cacahuate Natural)',
    subtitle: 'Listo en 90 segundos para llevar al trabajo o entrenamiento',
    description: '300ml de leche fresca, 50g de avena entera a granel, 30g de cacahuate natural sin sal y 1 plátano tabasco.',
    prepTimeMinutes: 3,
    servings: 1,
    estimatedCostMxn: 16,
    macros: { protein: 26, carbs: 56, fats: 15, calories: 463 },
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Licuado de avena y cacahuate',
    isCompleted: false,
    tianguisTip: 'Los cacahuates naturales a granel son la fuente de grasa cardiosaludable y proteína más económica de México ($30 el medio kilo).',
    ingredients: [
      { name: 'Leche entera fresca / pasteurizada', amount: '300ml', baseGrams: 300, estimatedCostMxn: 6.5, proteinGrams: 10 },
      { name: 'Avena en hojuelas a granel', amount: '50g secos', baseGrams: 50, estimatedCostMxn: 1.5, proteinGrams: 7 },
      { name: 'Cacahuate natural a granel', amount: '30g', baseGrams: 30, estimatedCostMxn: 2.5, proteinGrams: 8 },
      { name: 'Plátano tabasco', amount: '1 pieza', baseGrams: 110, estimatedCostMxn: 3.5, proteinGrams: 1.2 },
    ],
    recipeSteps: [
      'Agrega leche, avena, cacahuate y plátano a la licuadora con hielo.',
      'Licúa a velocidad alta durante 45 segundos y sirve frío.',
    ],
    cuisine: ['rapido_facil', 'latina'],
    equipmentNeeded: ['licuadora'],
    allergens: ['lacteos', 'mani_cacahuate'],
    dietCompat: ['sin_restricciones', 'vegetariano'],
  },
  {
    id: 'rec-snack-tazon-requeson-fruta-semillas',
    type: 'snack',
    title: 'Tazón de Requesón Artesanal con Fruta de Temporada y Pepitas',
    subtitle: 'Proteína pura de suero lácteo sin azúcar añadida',
    description: '120g de requesón artesanal fresco del tianguis con plátano o papaya en cubos, canela molida y 15g de pepitas de calabaza.',
    prepTimeMinutes: 3,
    servings: 1,
    estimatedCostMxn: 17,
    macros: { protein: 22, carbs: 28, fats: 7, calories: 263 },
    imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Tazón de requesón con fruta',
    isCompleted: false,
    tianguisTip: 'El requesón tiene apenas 3g de grasa por 100g y cuesta ~$40 el medio kilo en cremerías de mercado.',
    ingredients: [
      { name: 'Requesón artesanal de tianguis', amount: '120g', baseGrams: 120, estimatedCostMxn: 9.0, proteinGrams: 16 },
      { name: 'Pepitas de calabaza tostadas', amount: '15g', baseGrams: 15, estimatedCostMxn: 3.0, proteinGrams: 4.5 },
      { name: 'Plátano tabasco', amount: '1 pieza', baseGrams: 110, estimatedCostMxn: 3.5, proteinGrams: 1.2 },
      { name: 'Canela en polvo', amount: 'Al gusto', baseGrams: 2, estimatedCostMxn: 0.5, proteinGrams: 0 },
    ],
    recipeSteps: [
      'Sirve el requesón en un tazón.',
      'Decora con fruta en rebanadas y espolvorea pepitas tostadas y canela.',
    ],
    cuisine: ['rapido_facil', 'familiar'],
    equipmentNeeded: [],
    allergens: ['lacteos'],
    dietCompat: ['sin_restricciones', 'vegetariano', 'bajo_carbos', 'solo_proteinas'],
  },

  // CENAS
  {
    ...INITIAL_MEALS[3],
    id: 'rec-cena-tacos-atun-frijol',
    cuisine: ['mexicana', 'rapido_facil', 'latina'],
    equipmentNeeded: ['fogones_gas', 'parrilla_comal'],
    allergens: ['pescado', 'mariscos'],
    dietCompat: ['sin_restricciones', 'solo_proteinas'],
  },
  {
    id: 'rec-cena-huevos-cocidos-ensalada-nopal',
    type: 'cena',
    title: 'Ensalada de Nopales Curados con 3 Huevos Cocidos y Requesón',
    subtitle: 'Digestión ligera nocturna y reparación muscular limpia',
    description: '3 huevos duros rebanados sobre una cama fresca de nopales con jitomate, cebolla morada, orégano, 50g de requesón fresco y 2 tostadas de maíz.',
    prepTimeMinutes: 12,
    servings: 1,
    estimatedCostMxn: 22,
    macros: { protein: 35, carbs: 24, fats: 16, calories: 380 },
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Ensalada de nopales con huevo',
    isCompleted: false,
    tianguisTip: 'Hierve 6 huevos el domingo para tener cenas instantáneas entre semana.',
    ingredients: [
      { name: 'Huevos de rancho', amount: '3 piezas', baseGrams: 150, estimatedCostMxn: 7.5, proteinGrams: 18 },
      { name: 'Requesón artesanal de tianguis', amount: '50g', baseGrams: 50, estimatedCostMxn: 4.0, proteinGrams: 7 },
      { name: 'Nopales tiernos', amount: '2 piezas cocidas', baseGrams: 120, estimatedCostMxn: 3.5, proteinGrams: 2.5 },
      { name: 'Tortillas de nixtamal (tostadas)', amount: '2 piezas', baseGrams: 50, estimatedCostMxn: 2.5, proteinGrams: 3 },
      { name: 'Jitomate, cebolla y orégano', amount: 'Al gusto', baseGrams: 60, estimatedCostMxn: 4.5, proteinGrams: 1 },
    ],
    recipeSteps: [
      'Pica los nopales hervidos y mezcla con jitomate, cebolla y orégano.',
      'Coloca los huevos cocidos en cuartos.',
      'Corona con requesón fresco desmoronado y acompaña con tostadas.',
    ],
    cuisine: ['mexicana', 'rapido_facil', 'reconfortante'],
    equipmentNeeded: ['fogones_gas'],
    allergens: ['huevo', 'lacteos'],
    dietCompat: ['sin_restricciones', 'vegetariano', 'bajo_carbos', 'solo_proteinas'],
  },
  {
    id: 'rec-cena-fajitas-pollo-comal-verduras',
    type: 'cena',
    title: 'Fajitas de Pollo al Comal con Calabacitas y Tortilla',
    subtitle: 'Proteína magra nocturna de rápida asimilación',
    description: '140g de pechuga de pollo en tiras asadas al comal con calabacita criolla en rodajas y 2 tortillas de nixtamal recién infladas.',
    prepTimeMinutes: 15,
    servings: 1,
    estimatedCostMxn: 32,
    macros: { protein: 42, carbs: 28, fats: 8, calories: 352 },
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Fajitas de pollo al comal',
    isCompleted: false,
    tianguisTip: 'Las calabacitas criollas del tianguis se cuecen en 4 minutos al comal conservando todo su potasio.',
    ingredients: [
      { name: 'Pechuga de pollo fresca', amount: '140g cruda', baseGrams: 140, estimatedCostMxn: 19.5, proteinGrams: 39 },
      { name: 'Calabacitas criollas', amount: '1 pieza grande (120g)', baseGrams: 120, estimatedCostMxn: 4.0, proteinGrams: 2 },
      { name: 'Tortillas de nixtamal', amount: '2 piezas', baseGrams: 50, estimatedCostMxn: 2.0, proteinGrams: 3 },
      { name: 'Salsa verde de molcajete', amount: 'Al gusto', baseGrams: 50, estimatedCostMxn: 3.5, proteinGrams: 0.5 },
      { name: 'Limón y sal', amount: 'Al gusto', baseGrams: 20, estimatedCostMxn: 1.0, proteinGrams: 0 },
    ],
    recipeSteps: [
      'Asa la pechuga en tiras en comal caliente con sal de grano.',
      'Coloca las rodajas de calabacita a un lado hasta dorar.',
      'Sirve caliente con tortillas de comal y salsa verde fresca.',
    ],
    cuisine: ['mexicana', 'rapido_facil', 'latina'],
    equipmentNeeded: ['fogones_gas', 'parrilla_comal'],
    allergens: [],
    dietCompat: ['sin_restricciones', 'bajo_carbos', 'solo_proteinas'],
  },
];

/**
 * Calcula calorías y requerimiento estricto de proteína diaria con fórmulas científicas
 */
export function calculateNutritionTargets(config: OnboardingPlanConfig) {
  const { weightKg, heightCm, age, gender, activityLevel, planGoals } = config;

  // Fórmula Mifflin-St Jeor (BMR)
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr += gender === 'hombre' ? 5 : -161;

  // Factor de actividad
  const activityFactors: Record<string, number> = {
    sedentario: 1.2,
    poco_activo: 1.375,
    activo: 1.55,
    muy_activo: 1.725,
    atleta: 1.9,
  };
  const factor = activityFactors[activityLevel] || 1.4;
  let calories = Math.round(bmr * factor);

  // Ajuste según metas principales
  const hasAdelgazar = planGoals.includes('adelgazar');
  const hasMusculo = planGoals.includes('musculo');

  if (hasAdelgazar && !hasMusculo) {
    calories -= 400; // Déficit moderado sostenible
  } else if (hasMusculo && !hasAdelgazar) {
    calories += 300; // Superávit magro limpio
  }

  // Factor de proteína estricta por kg (Doctrina Ing. Joel Roldán: Mínimo diario garantizado)
  let proteinFactor = 1.8;
  if (hasMusculo || config.dietaryNeed === 'solo_proteinas') {
    proteinFactor = 2.2;
  } else if (hasAdelgazar) {
    proteinFactor = 2.0; // Preservación máxima de masa magra en déficit
  }

  const dailyProteinTarget = Math.round(weightKg * proteinFactor);

  // Presupuesto diario por persona
  const activeDaysCount = Math.max(1, config.plannedDays?.length || 7);
  const peopleCount = Math.max(1, config.peopleCount || 1);
  const dailyBudgetLimitMxn = Math.round(config.weeklyBudgetMxn / (activeDaysCount * peopleCount));

  return {
    dailyProteinTarget,
    dailyCalorieTarget: Math.max(1500, calories),
    proteinFactor,
    dailyBudgetLimitMxn,
  };
}

/**
 * Filtra el recetario según alergias, alimentos odiados, dieta y equipo
 */
export function filterRecipe(
  recipe: RecipeDefinition,
  config: OnboardingPlanConfig
): boolean {
  // 1. Filtrar por necesidad dietaria
  if (config.dietaryNeed !== 'sin_restricciones') {
    if (!recipe.dietCompat.includes(config.dietaryNeed)) {
      return false;
    }
  }

  // 2. Filtrar por alergias
  if (config.allergies && !config.allergies.includes('ninguno')) {
    const hasAllergen = recipe.allergens.some((a) => config.allergies.includes(a));
    if (hasAllergen) return false;
  }

  // 3. Filtrar por alimentos odiados (si coinciden en nombre o ingredientes)
  if (config.dislikedFoods && config.dislikedFoods.length > 0) {
    const dislikedLower = config.dislikedFoods.map((f) => f.toLowerCase().trim());
    const titleLower = recipe.title.toLowerCase();
    const descLower = recipe.description.toLowerCase();
    const ingredientNames = recipe.ingredients.map((i) => i.name.toLowerCase()).join(' ');

    const containsDisliked = dislikedLower.some(
      (disliked) =>
        disliked.length > 2 &&
        (titleLower.includes(disliked) || descLower.includes(disliked) || ingredientNames.includes(disliked))
    );
    if (containsDisliked) return false;
  }

  return true;
}

/**
 * Generador Inteligente del Plan Semanal con rotación y porciones calibradas
 */
export function generateSmartWeeklyPlan(
  config: OnboardingPlanConfig
): Record<string, DayPlan> {
  const daysKeys = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const shortNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const peopleCount = Math.max(1, config.peopleCount || 1);
  const mealsToPlan = config.mealsToPlan?.length
    ? config.mealsToPlan
    : ['desayuno', 'almuerzo', 'cena', 'snack'];

  // Agrupar recetas por tipo
  const pool = EXTENDED_RECIPE_POOL.filter((r) => filterRecipe(r, config));

  const breakfasts = pool.filter((r) => r.type === 'desayuno');
  const lunches = pool.filter((r) => r.type === 'comida');
  const snacks = pool.filter((r) => r.type === 'snack');
  const dinners = pool.filter((r) => r.type === 'cena');

  // Fallback si los filtros fueron muy restrictivos
  const safeBreakfasts = breakfasts.length > 0 ? breakfasts : EXTENDED_RECIPE_POOL.filter((r) => r.type === 'desayuno');
  const safeLunches = lunches.length > 0 ? lunches : EXTENDED_RECIPE_POOL.filter((r) => r.type === 'comida');
  const safeSnacks = snacks.length > 0 ? snacks : EXTENDED_RECIPE_POOL.filter((r) => r.type === 'snack');
  const safeDinners = dinners.length > 0 ? dinners : EXTENDED_RECIPE_POOL.filter((r) => r.type === 'cena');

  const generatedPlan: Record<string, DayPlan> = {};

  daysKeys.forEach((key, dayIdx) => {
    // Si el día no está seleccionado en plannedDays, aún creamos estructura pero marcamos sin comidas o con mínimas
    const isDayPlanned = config.plannedDays?.includes(key) ?? true;

    // Lógica de repetición
    let bIdx = 0;
    let lIdx = 0;
    let sIdx = 0;
    let dIdx = 0;

    if (config.repetitionPreference === 'nuevo_cada_dia') {
      bIdx = dayIdx % safeBreakfasts.length;
      lIdx = dayIdx % safeLunches.length;
      sIdx = dayIdx % safeSnacks.length;
      dIdx = dayIdx % safeDinners.length;
    } else if (config.repetitionPreference === 'un_poco_ambos') {
      // Rotar cada 2 días (Batch cooking clásico)
      const batchIdx = Math.floor(dayIdx / 2);
      bIdx = batchIdx % safeBreakfasts.length;
      lIdx = batchIdx % safeLunches.length;
      sIdx = batchIdx % safeSnacks.length;
      dIdx = batchIdx % safeDinners.length;
    } else {
      // 'mismo_cada_dia': misma comida todos los días
      bIdx = 0;
      lIdx = 0;
      sIdx = 0;
      dIdx = 0;
    }

    const dayMeals: Meal[] = [];

    if (mealsToPlan.includes('desayuno')) {
      const bRecipe = safeBreakfasts[bIdx];
      dayMeals.push({
        ...bRecipe,
        id: `plan-${key}-desayuno`,
        servings: peopleCount,
      });
    }

    if (mealsToPlan.includes('almuerzo')) {
      const lRecipe = safeLunches[lIdx];
      dayMeals.push({
        ...lRecipe,
        id: `plan-${key}-almuerzo`,
        servings: peopleCount,
      });
    }

    if (mealsToPlan.includes('snack')) {
      const sRecipe = safeSnacks[sIdx];
      dayMeals.push({
        ...sRecipe,
        id: `plan-${key}-snack`,
        servings: peopleCount,
      });
    }

    if (mealsToPlan.includes('cena')) {
      const dRecipe = safeDinners[dIdx];
      dayMeals.push({
        ...dRecipe,
        id: `plan-${key}-cena`,
        servings: peopleCount,
      });
    }

    // Totales diarios por persona
    const plannedProteinPerPerson = dayMeals.reduce((acc, m) => acc + m.macros.protein, 0);
    const plannedCaloriesPerPerson = dayMeals.reduce((acc, m) => acc + m.macros.calories, 0);
    // Costo total del día para el número de personas
    const plannedCostDay = dayMeals.reduce((acc, m) => acc + (m.estimatedCostMxn * peopleCount), 0);

    generatedPlan[key] = {
      dayId: key,
      dayName: dayNames[dayIdx],
      shortName: shortNames[dayIdx],
      meals: dayMeals,
      plannedProtein: plannedProteinPerPerson,
      plannedCalories: plannedCaloriesPerPerson,
      plannedCostMxn: plannedCostDay,
    };
  });

  return generatedPlan;
}

/**
 * Genera o regenera un menú optimizado para un día específico (ej. Mañana o Pasado Mañana)
 * manteniendo compatibilidad con alergias, equipamiento, comensales y presupuesto.
 */
export function generateSingleDayPlan(
  dayKey: string,
  config: OnboardingPlanConfig,
  variationSeed: number = Math.floor(Math.random() * 20) + 1
): DayPlan {
  const dayNamesMap: Record<string, { full: string; short: string }> = {
    lunes: { full: 'Lunes', short: 'Lun' },
    martes: { full: 'Martes', short: 'Mar' },
    miercoles: { full: 'Miércoles', short: 'Mié' },
    jueves: { full: 'Jueves', short: 'Jue' },
    viernes: { full: 'Viernes', short: 'Vie' },
    sabado: { full: 'Sábado', short: 'Sáb' },
    domingo: { full: 'Domingo', short: 'Dom' },
  };

  const dayInfo = dayNamesMap[dayKey] || { full: dayKey, short: dayKey.slice(0, 3) };
  const peopleCount = Math.max(1, config.peopleCount || 1);
  const mealsToPlan = config.mealsToPlan?.length
    ? config.mealsToPlan
    : ['desayuno', 'almuerzo', 'cena', 'snack'];

  const pool = EXTENDED_RECIPE_POOL.filter((r) => filterRecipe(r, config));

  const breakfasts = pool.filter((r) => r.type === 'desayuno');
  const lunches = pool.filter((r) => r.type === 'comida');
  const snacks = pool.filter((r) => r.type === 'snack');
  const dinners = pool.filter((r) => r.type === 'cena');

  const safeBreakfasts = breakfasts.length > 0 ? breakfasts : EXTENDED_RECIPE_POOL.filter((r) => r.type === 'desayuno');
  const safeLunches = lunches.length > 0 ? lunches : EXTENDED_RECIPE_POOL.filter((r) => r.type === 'comida');
  const safeSnacks = snacks.length > 0 ? snacks : EXTENDED_RECIPE_POOL.filter((r) => r.type === 'snack');
  const safeDinners = dinners.length > 0 ? dinners : EXTENDED_RECIPE_POOL.filter((r) => r.type === 'cena');

  const bRecipe = safeBreakfasts[variationSeed % safeBreakfasts.length];
  const lRecipe = safeLunches[(variationSeed + 1) % safeLunches.length];
  const sRecipe = safeSnacks[(variationSeed + 2) % safeSnacks.length];
  const dRecipe = safeDinners[(variationSeed + 3) % safeDinners.length];

  const dayMeals: Meal[] = [];

  if (mealsToPlan.includes('desayuno')) {
    dayMeals.push({
      ...bRecipe,
      id: `plan-${dayKey}-desayuno-${Date.now()}`,
      servings: peopleCount,
    });
  }

  if (mealsToPlan.includes('almuerzo')) {
    dayMeals.push({
      ...lRecipe,
      id: `plan-${dayKey}-almuerzo-${Date.now()}`,
      servings: peopleCount,
    });
  }

  if (mealsToPlan.includes('snack')) {
    dayMeals.push({
      ...sRecipe,
      id: `plan-${dayKey}-snack-${Date.now()}`,
      servings: peopleCount,
    });
  }

  if (mealsToPlan.includes('cena')) {
    dayMeals.push({
      ...dRecipe,
      id: `plan-${dayKey}-cena-${Date.now()}`,
      servings: peopleCount,
    });
  }

  const plannedProtein = dayMeals.reduce((acc, m) => acc + m.macros.protein, 0);
  const plannedCalories = dayMeals.reduce((acc, m) => acc + m.macros.calories, 0);
  const plannedCostMxn = dayMeals.reduce((acc, m) => acc + (m.estimatedCostMxn * peopleCount), 0);

  return {
    dayId: dayKey,
    dayName: dayInfo.full,
    shortName: dayInfo.short,
    meals: dayMeals,
    plannedProtein,
    plannedCalories,
    plannedCostMxn,
  };
}

/**
 * Genera la lista de compras del mercado CONSOLIDADA Y DINÁMICA según los platillos
 * realmente programados en la semana y el número de comensales.
 */
export function generateWeeklyGroceryList(
  weeklyPlan: Record<string, DayPlan>,
  config: OnboardingPlanConfig
): MarketItem[] {
  const peopleCount = Math.max(1, config.peopleCount || 1);
  const activeDays = config.plannedDays?.length ? config.plannedDays : Object.keys(weeklyPlan);

  // Diccionario de consolidación por clave de ingrediente
  interface ConsolidatedIng {
    name: string;
    category: 'proteina' | 'carbohidratos' | 'verduras' | 'semillas_grasas';
    totalGrams: number;
    countMentions: number;
    priceTianguisMxn: number;
    priceSuperMxn: number;
    proteinPer100g: number;
    unitFormat: string;
    notes: string;
  }

  const map = new Map<string, ConsolidatedIng>();

  activeDays.forEach((dayKey) => {
    const day = weeklyPlan[dayKey];
    if (!day || !day.meals) return;

    day.meals.forEach((meal) => {
      meal.ingredients.forEach((ing) => {
        const lowerName = ing.name.toLowerCase();
        let key = 'otro';
        let category: 'proteina' | 'carbohidratos' | 'verduras' | 'semillas_grasas' = 'verduras';
        let proteinPer100g = 2;
        let tianguisPricePer100g = 3.0; // MXN
        let superPricePer100g = 5.0; // MXN
        let displayName = ing.name;
        let unitFormat = 'gramos';
        let notes = 'Comprar en tianguis local';

        if (lowerName.includes('huevo')) {
          key = 'huevo_rancho';
          category = 'proteina';
          displayName = 'Huevos de rancho';
          proteinPer100g = 13;
          tianguisPricePer100g = 5.0; // ~$2.50 por pieza (~50g)
          superPricePer100g = 8.5; // ~$4.20 por pieza
          unitFormat = 'piezas';
          notes = 'Pedir por cono de 30 piezas para máximo ahorro ($75 MXN/cono)';
        } else if (lowerName.includes('pechuga') || lowerName.includes('pollo')) {
          key = 'pechuga_pollo';
          category = 'proteina';
          displayName = 'Pechuga de pollo fresca con hueso';
          proteinPer100g = 28;
          tianguisPricePer100g = 9.5; // ~$95 MXN/kg
          superPricePer100g = 16.0; // ~$160 MXN/kg
          unitFormat = 'kg';
          notes = 'Pedir con hueso en pollería de mercado; usar el hueso para caldo';
        } else if (lowerName.includes('requesón') || lowerName.includes('requeson')) {
          key = 'requeson_artesanal';
          category = 'proteina';
          displayName = 'Requesón artesanal de rancho';
          proteinPer100g = 12;
          tianguisPricePer100g = 8.0; // ~$80 MXN/kg
          superPricePer100g = 15.0; // ~$150 MXN/kg
          unitFormat = 'kg';
          notes = 'Comprar fresco en cremería de mercado; cero grasa y alto suero';
        } else if (lowerName.includes('atún') || lowerName.includes('atun')) {
          key = 'atun_en_agua';
          category = 'proteina';
          displayName = 'Latas de atún en agua (baja soya)';
          proteinPer100g = 24;
          tianguisPricePer100g = 12.8; // ~$18 por lata 140g
          superPricePer100g = 21.0;
          unitFormat = 'latas';
          notes = 'Comprar en tienda de abarrotes del tianguis por paquete de 4';
        } else if (lowerName.includes('frijol')) {
          key = 'frijol_negro';
          category = 'carbohidratos';
          displayName = 'Frijol negro a granel';
          proteinPer100g = 22; // seco
          tianguisPricePer100g = 3.6; // ~$36 MXN/kg
          superPricePer100g = 5.8;
          unitFormat = 'kg';
          notes = 'Cocer en olla express con epazote y cebolla el domingo';
        } else if (lowerName.includes('lenteja')) {
          key = 'lentejas';
          category = 'carbohidratos';
          displayName = 'Lentejas a granel';
          proteinPer100g = 25;
          tianguisPricePer100g = 3.2; // ~$32 MXN/kg
          superPricePer100g = 5.4;
          unitFormat = 'kg';
          notes = 'Hierro vegetal de absorción rápida; rinde 4 veces su peso seco';
        } else if (lowerName.includes('tortilla') || lowerName.includes('tostada')) {
          key = 'tortilla_nixtamal';
          category = 'carbohidratos';
          displayName = 'Tortillas de nixtamal de tortillería';
          proteinPer100g = 6;
          tianguisPricePer100g = 2.2; // ~$22 MXN/kg
          superPricePer100g = 3.8;
          unitFormat = 'kg';
          notes = 'Calcio altamente biodisponible por nixtamalización tradicional';
        } else if (lowerName.includes('avena')) {
          key = 'avena_hojuelas';
          category = 'carbohidratos';
          displayName = 'Avena en hojuelas a granel';
          proteinPer100g = 14;
          tianguisPricePer100g = 2.4; // ~$24 MXN/kg
          superPricePer100g = 6.5;
          unitFormat = 'kg';
          notes = 'En materias primas a granel ahorras 63% vs caja de marca';
        } else if (lowerName.includes('leche')) {
          key = 'leche_entera';
          category = 'proteina';
          displayName = 'Leche entera fresca / pasteurizada';
          proteinPer100g = 3.4;
          tianguisPricePer100g = 2.5; // ~$25 MXN/litro
          superPricePer100g = 3.4;
          unitFormat = 'litros';
          notes = 'Aporta 34g de proteína completa por litro';
        } else if (lowerName.includes('nopal')) {
          key = 'nopales_frescos';
          category = 'verduras';
          displayName = 'Nopales tiernos del tianguis';
          proteinPer100g = 2;
          tianguisPricePer100g = 2.0; // ~$20 MXN/kg o 5 piezas por $10
          superPricePer100g = 4.5;
          unitFormat = 'piezas';
          notes = 'Pedir limpios sin espinas para preparar directo al comal';
        } else if (lowerName.includes('jitomate') || lowerName.includes('cebolla') || lowerName.includes('chile')) {
          key = 'verduras_basicas';
          category = 'verduras';
          displayName = 'Jitomate saladette, cebolla y chiles verdes';
          proteinPer100g = 1.2;
          tianguisPricePer100g = 2.8; // ~$28 MXN/kg mixto
          superPricePer100g = 4.8;
          unitFormat = 'kg';
          notes = 'Base para todos los recaudos, salsas y huevos a la mexicana';
        } else if (lowerName.includes('plátano') || lowerName.includes('platano')) {
          key = 'platano_tabasco';
          category = 'verduras';
          displayName = 'Plátano tabasco de tianguis';
          proteinPer100g = 1.3;
          tianguisPricePer100g = 2.0; // ~$20 MXN/kg
          superPricePer100g = 3.6;
          unitFormat = 'kg';
          notes = 'Potasio puro y carbohidrato de rápida absorción matutina';
        } else if (lowerName.includes('cacahuate')) {
          key = 'cacahuate_natural';
          category = 'semillas_grasas';
          displayName = 'Cacahuate natural pelado sin sal a granel';
          proteinPer100g = 26;
          tianguisPricePer100g = 6.0; // ~$60 MXN/kg
          superPricePer100g = 13.0;
          unitFormat = 'gramos';
          notes = 'La grasa insaturada con más proteína de bajo costo';
        } else if (lowerName.includes('pepita')) {
          key = 'pepitas_calabaza';
          category = 'semillas_grasas';
          displayName = 'Pepitas de calabaza tostadas a granel';
          proteinPer100g = 30;
          tianguisPricePer100g = 16.0; // ~$160 MXN/kg
          superPricePer100g = 28.0;
          unitFormat = 'gramos';
          notes = 'Cargadas de zinc, magnesio y triptófano';
        } else {
          key = 'varios_verduras_especias';
          category = 'verduras';
          displayName = 'Hierbas, limones, ajo y recaudos frescos';
          proteinPer100g = 1.0;
          tianguisPricePer100g = 2.5;
          superPricePer100g = 4.5;
          unitFormat = 'atados';
          notes = 'Cilantro fresco, epazote, orégano y limones con semilla';
        }

        const baseGrams = (ing.baseGrams || 50) * peopleCount;

        if (map.has(key)) {
          const existing = map.get(key)!;
          existing.totalGrams += baseGrams;
          existing.countMentions += 1;
        } else {
          map.set(key, {
            name: displayName,
            category,
            totalGrams: baseGrams,
            countMentions: 1,
            priceTianguisMxn: tianguisPricePer100g,
            priceSuperMxn: superPricePer100g,
            proteinPer100g,
            unitFormat,
            notes,
          });
        }
      });
    });
  });

  // Convertir a MarketItem con unidades legibles
  const result: MarketItem[] = [];

  map.forEach((item, id) => {
    let unitLabel = '';
    let totalTianguisCost = 0;
    let totalSuperCost = 0;

    if (item.unitFormat === 'piezas' && id === 'huevo_rancho') {
      const piezas = Math.round(item.totalGrams / 50);
      const conos = (piezas / 30).toFixed(1);
      unitLabel = `${piezas} piezas (${conos} ${Number(conos) > 1 ? 'conos' : 'cono'})`;
      totalTianguisCost = Math.round(piezas * 2.5); // $2.50 por huevo en tianguis
      totalSuperCost = Math.round(piezas * 4.2);
    } else if (item.unitFormat === 'piezas' && id === 'nopales_frescos') {
      const piezas = Math.max(4, Math.round(item.totalGrams / 50));
      unitLabel = `${piezas} piezas medianas`;
      totalTianguisCost = Math.round((piezas / 5) * 10);
      totalSuperCost = Math.round(totalTianguisCost * 1.8);
    } else if (item.unitFormat === 'latas') {
      const latas = Math.max(2, Math.round(item.totalGrams / 140));
      unitLabel = `${latas} latas (140g c/u)`;
      totalTianguisCost = latas * 18;
      totalSuperCost = latas * 24;
    } else if (item.unitFormat === 'litros') {
      const litros = (item.totalGrams / 1000).toFixed(1);
      unitLabel = `${litros} litros`;
      totalTianguisCost = Math.round(Number(litros) * 25);
      totalSuperCost = Math.round(Number(litros) * 34);
    } else if (item.unitFormat === 'kg') {
      const kilos = (item.totalGrams / 1000).toFixed(2);
      unitLabel = `${kilos} kg`;
      totalTianguisCost = Math.round((item.totalGrams / 100) * item.priceTianguisMxn);
      totalSuperCost = Math.round((item.totalGrams / 100) * item.priceSuperMxn);
    } else {
      unitLabel = `${Math.round(item.totalGrams)} gramos`;
      totalTianguisCost = Math.round((item.totalGrams / 100) * item.priceTianguisMxn);
      totalSuperCost = Math.round((item.totalGrams / 100) * item.priceSuperMxn);
    }

    const costPerGram =
      item.proteinPer100g > 0
        ? Number((item.priceTianguisMxn / item.proteinPer100g).toFixed(2))
        : 0.8;

    result.push({
      id: `dyn-market-${id}`,
      name: item.name,
      category: item.category,
      unit: unitLabel,
      priceTianguisMxn: Math.max(10, totalTianguisCost),
      priceSuperMxn: Math.max(15, totalSuperCost),
      proteinPer100g: item.proteinPer100g,
      costPerGramProteinMxn: costPerGram,
      isPurchased: false,
      notes: item.notes,
      recommendedWeeklyQty: unitLabel,
    });
  });

  // Ordenar: primero proteínas, luego carbohidratos, verduras y grasas
  const orderPriority: Record<string, number> = {
    proteina: 1,
    carbohidratos: 2,
    verduras: 3,
    semillas_grasas: 4,
  };

  return result.sort((a, b) => (orderPriority[a.category] || 99) - (orderPriority[b.category] || 99));
}

/**
 * Analiza las comidas consumidas por el usuario y genera sugerencias automáticas
 * para optimizar el plan semanal basándose en los precios de la canasta básica mexicana.
 */
export function analyzeConsumptionAndSuggestBudgetAdjustments(
  consumedMeals: Meal[],
  weeklyPlan: Record<string, DayPlan>,
  config: OnboardingPlanConfig,
  userProfile: UserProfile
): BudgetConsumptionAnalysis {
  const peopleCount = Math.max(1, config.peopleCount || 1);
  const plannedDays = config.plannedDays?.length ? config.plannedDays : Object.keys(weeklyPlan);
  const weeklyBudget = config.weeklyBudgetMxn || 750;

  // 1. Métricas de lo consumido
  const totalConsumedProteinGrams = Math.round(
    consumedMeals.reduce((acc, m) => acc + (m.macros.protein * (m.servings || 1)), 0)
  );
  const totalConsumedCostMxn = Math.round(
    consumedMeals.reduce((acc, m) => acc + (m.estimatedCostMxn * (m.servings || 1)), 0)
  );

  const averageCostPerGramProteinMxn =
    totalConsumedProteinGrams > 0
      ? Number((totalConsumedCostMxn / totalConsumedProteinGrams).toFixed(2))
      : 0.65;

  const baselineTianguisCostPerGram = 0.45; // Costo meta de referencia en tianguis

  // 2. Costo total proyectado de la semana actual
  const currentWeeklyTotalCost = plannedDays.reduce((acc, dayKey) => {
    const day = weeklyPlan[dayKey];
    return acc + (day ? day.plannedCostMxn : 0);
  }, 0);

  const projectedOverspendMxn = Math.max(0, currentWeeklyTotalCost - weeklyBudget);

  // 3. Generar sugerencias automáticas de reemplazo por canasta básica
  const suggestions: BudgetAdjustmentSuggestion[] = [];

  // Mapeo de reemplazos de alta eficiencia basados en la canasta básica
  const economicReplacements: Record<string, Meal> = {
    cena_lentejas: {
      id: 'rec-cena-lentejas-ahorro',
      type: 'cena',
      title: 'Cazuela Caliente de Lentejas con Huevos Cocidos y Requesón',
      subtitle: 'Sustitución económica: Ahorra 35% vs atún o res con 38g de proteína completa',
      description: 'Lentejas cocidas a granel con jitomate, cebolla y cilantro, coronadas con 2 huevos cocidos y 50g de requesón fresco de tianguis.',
      prepTimeMinutes: 15,
      servings: peopleCount,
      estimatedCostMxn: 18,
      macros: { protein: 38, carbs: 46, fats: 9, calories: 417 },
      imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Cazuela de lentejas',
      isCompleted: false,
      tianguisTip: '1 kg de lentejas secas rinde 8 comidas abundantes por solo $32 MXN.',
      ingredients: [
        { name: 'Lentejas cocidas a granel', amount: '240g cocidas', baseGrams: 240, estimatedCostMxn: 6.0, proteinGrams: 18 },
        { name: 'Huevos de rancho', amount: '2 piezas', baseGrams: 100, estimatedCostMxn: 5.0, proteinGrams: 12 },
        { name: 'Requesón artesanal de tianguis', amount: '50g', baseGrams: 50, estimatedCostMxn: 4.0, proteinGrams: 7 },
        { name: 'Tortillas de nixtamal', amount: '1 pieza', baseGrams: 25, estimatedCostMxn: 1.0, proteinGrams: 1.5 },
        { name: 'Jitomate, cebolla y cilantro', amount: 'Al gusto', baseGrams: 40, estimatedCostMxn: 2.0, proteinGrams: 0.5 },
      ],
      recipeSteps: ['Calentar las lentejas', 'Agregar huevos en cuartos y requesón', 'Servir caliente'],
    },
    cena_ensalada_nopal: {
      id: 'rec-cena-nopal-ahorro',
      type: 'cena',
      title: 'Ensalada de Nopales Curados con 3 Huevos Cocidos y Requesón',
      subtitle: 'Fibra soluble y proteína pura de tianguis con mínima inversión',
      description: '3 huevos duros rebanados sobre nopales tiernos cocidos con orégano, 50g de requesón fresco y 2 tostadas al comal.',
      prepTimeMinutes: 12,
      servings: peopleCount,
      estimatedCostMxn: 20,
      macros: { protein: 35, carbs: 22, fats: 15, calories: 363 },
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Ensalada de nopales con huevo',
      isCompleted: false,
      tianguisTip: '5 nopales por $10 MXN en el tianguis. Excelente saciedad nocturna.',
      ingredients: [
        { name: 'Huevos de rancho', amount: '3 piezas', baseGrams: 150, estimatedCostMxn: 7.5, proteinGrams: 18 },
        { name: 'Requesón artesanal de tianguis', amount: '50g', baseGrams: 50, estimatedCostMxn: 4.0, proteinGrams: 7 },
        { name: 'Nopales tiernos', amount: '2 piezas', baseGrams: 120, estimatedCostMxn: 3.5, proteinGrams: 2.5 },
        { name: 'Tortillas de nixtamal (tostadas)', amount: '2 piezas', baseGrams: 50, estimatedCostMxn: 2.5, proteinGrams: 3 },
        { name: 'Jitomate y cebolla', amount: 'Al gusto', baseGrams: 50, estimatedCostMxn: 2.5, proteinGrams: 1 },
      ],
      recipeSteps: ['Mezclar nopales con recaudo', 'Montar con huevos y requesón'],
    },
    comida_tinga_batch: {
      id: 'rec-comida-tinga-ahorro',
      type: 'comida',
      title: 'Tostadas de Tinga con Pechuga Deshebrada y Frijoles de la Olla',
      subtitle: 'Batch Cooking Familiar: Rinde doble aprovechando caldo y pechuga con hueso',
      description: 'Pechuga deshebrada en caldillo de jitomate sobre frijoles negros machacados y tostadas horneadas.',
      prepTimeMinutes: 20,
      servings: peopleCount,
      estimatedCostMxn: 32,
      macros: { protein: 48, carbs: 50, fats: 11, calories: 491 },
      imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Tostadas de tinga',
      isCompleted: false,
      tianguisTip: 'Comprar la pechuga entera con hueso en pollería ($90/kg vs $160/kg en supermercado).',
      ingredients: [
        { name: 'Pechuga de pollo fresca', amount: '150g cruda', baseGrams: 150, estimatedCostMxn: 20.0, proteinGrams: 42 },
        { name: 'Tortillas de nixtamal (tostadas)', amount: '3 piezas', baseGrams: 75, estimatedCostMxn: 3.5, proteinGrams: 4.5 },
        { name: 'Frijoles negros de la olla', amount: '100g', baseGrams: 100, estimatedCostMxn: 3.5, proteinGrams: 6 },
        { name: 'Jitomate, cebolla y chipotle', amount: 'Al gusto', baseGrams: 80, estimatedCostMxn: 5.0, proteinGrams: 1 },
      ],
      recipeSteps: ['Guisar pechuga deshebrada con jitomate', 'Montar sobre frijol y tostada'],
    },
    snack_licuado_cacahuate: {
      id: 'rec-snack-licuado-ahorro',
      type: 'snack',
      title: 'Licuado de Avena a Granel, Leche y Cacahuate Natural',
      subtitle: 'La grasa saludable y proteína más barata de Latinoamérica ($15 MXN total)',
      description: '300ml de leche, 50g de avena a granel, 30g de cacahuates sin sal y 1 plátano tabasco.',
      prepTimeMinutes: 3,
      servings: peopleCount,
      estimatedCostMxn: 15,
      macros: { protein: 26, carbs: 56, fats: 15, calories: 463 },
      imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Licuado de avena y cacahuate',
      isCompleted: false,
      tianguisTip: 'El cacahuate a granel en tianguis cuesta $30 el medio kilo y aporta 26g de proteína por cada 100g.',
      ingredients: [
        { name: 'Leche entera fresca', amount: '300ml', baseGrams: 300, estimatedCostMxn: 6.5, proteinGrams: 10 },
        { name: 'Avena en hojuelas a granel', amount: '50g', baseGrams: 50, estimatedCostMxn: 1.5, proteinGrams: 7 },
        { name: 'Cacahuate natural a granel', amount: '30g', baseGrams: 30, estimatedCostMxn: 2.5, proteinGrams: 8 },
        { name: 'Plátano tabasco', amount: '1 pieza', baseGrams: 110, estimatedCostMxn: 3.5, proteinGrams: 1.2 },
      ],
      recipeSteps: ['Licuar todo con hielo durante 45 segundos'],
    },
  };

  // Recorremos los días para identificar platillos que admiten optimización
  plannedDays.forEach((dayKey) => {
    const day = weeklyPlan[dayKey];
    if (!day || !day.meals) return;

    day.meals.forEach((meal, mealIdx) => {
      // Si la cena usa atún en lata o cortes costosos (> $25 MXN por porción)
      if (meal.type === 'cena' && meal.estimatedCostMxn >= 24 && !meal.title.includes('Lentejas')) {
        const replacement = economicReplacements.cena_lentejas;
        const unitSavings = Math.max(4, meal.estimatedCostMxn - replacement.estimatedCostMxn);
        const totalFamilySavings = unitSavings * peopleCount;

        suggestions.push({
          id: `sug-${dayKey}-cena`,
          dayId: dayKey,
          dayName: day.dayName,
          mealIndex: mealIdx,
          mealType: 'cena',
          currentMealId: meal.id,
          currentMealTitle: meal.title,
          currentCostMxn: meal.estimatedCostMxn * peopleCount,
          currentProteinGrams: meal.macros.protein,
          suggestedMeal: { ...replacement, id: `sug-meal-${dayKey}-${mealIdx}`, servings: peopleCount },
          savingsMxn: totalFamilySavings,
          proteinDiff: replacement.macros.protein - meal.macros.protein,
          rationale: `Sustituir insumos procesados por Lentejas a granel con Huevo y Requesón ahorra $${totalFamilySavings} MXN y aumenta +${Math.max(0, replacement.macros.protein - meal.macros.protein)}g de proteína limpia.`,
          applied: false,
        });
      }

      // Si la comida rebasa $36 MXN por porción
      if (meal.type === 'comida' && meal.estimatedCostMxn > 37 && !meal.title.includes('Tinga') && !meal.title.includes('Lentejas')) {
        const replacement = economicReplacements.comida_tinga_batch;
        const unitSavings = Math.max(5, meal.estimatedCostMxn - replacement.estimatedCostMxn);
        const totalFamilySavings = unitSavings * peopleCount;

        suggestions.push({
          id: `sug-${dayKey}-comida`,
          dayId: dayKey,
          dayName: day.dayName,
          mealIndex: mealIdx,
          mealType: 'comida',
          currentMealId: meal.id,
          currentMealTitle: meal.title,
          currentCostMxn: meal.estimatedCostMxn * peopleCount,
          currentProteinGrams: meal.macros.protein,
          suggestedMeal: { ...replacement, id: `sug-meal-${dayKey}-${mealIdx}`, servings: peopleCount },
          savingsMxn: totalFamilySavings,
          proteinDiff: replacement.macros.protein - meal.macros.protein,
          rationale: `Preparar Pechuga con Hueso y Frijol de la Olla ahorra $${totalFamilySavings} MXN al aprovechar caldo casero y frijoles a granel.`,
          applied: false,
        });
      }

      // Si el snack rebasa $18 MXN
      if (meal.type === 'snack' && meal.estimatedCostMxn > 18 && !meal.title.includes('Licuado')) {
        const replacement = economicReplacements.snack_licuado_cacahuate;
        const unitSavings = Math.max(3, meal.estimatedCostMxn - replacement.estimatedCostMxn);
        const totalFamilySavings = unitSavings * peopleCount;

        suggestions.push({
          id: `sug-${dayKey}-snack`,
          dayId: dayKey,
          dayName: day.dayName,
          mealIndex: mealIdx,
          mealType: 'snack',
          currentMealId: meal.id,
          currentMealTitle: meal.title,
          currentCostMxn: meal.estimatedCostMxn * peopleCount,
          currentProteinGrams: meal.macros.protein,
          suggestedMeal: { ...replacement, id: `sug-meal-${dayKey}-${mealIdx}`, servings: peopleCount },
          savingsMxn: totalFamilySavings,
          proteinDiff: replacement.macros.protein - meal.macros.protein,
          rationale: `El cacahuate natural a granel con avena y leche baja el costo a solo $${replacement.estimatedCostMxn * peopleCount} MXN aportando 26g de proteína de rápida absorción.`,
          applied: false,
        });
      }
    });
  });

  const potentialWeeklySavingsMxn = suggestions.reduce((acc, s) => acc + s.savingsMxn, 0);

  // Diagnóstico cualitativo
  let status: 'optimo' | 'moderado' | 'alerta_sobregasto' = 'optimo';
  let economicDiagnosis = '¡Tu planeación es sumamente eficiente! Estás aprovechando al máximo los insumos del mercado y tianguis.';

  if (projectedOverspendMxn > 0) {
    status = 'alerta_sobregasto';
    economicDiagnosis = `Tu plan proyecta un gasto de $${currentWeeklyTotalCost} MXN, excediendo tu presupuesto de $${weeklyBudget} MXN por $${projectedOverspendMxn} MXN. Aplicar los ajustes sugeridos te ahorrará hasta $${potentialWeeklySavingsMxn} MXN de inmediato.`;
  } else if (potentialWeeklySavingsMxn > 40) {
    status = 'moderado';
    economicDiagnosis = `Estás dentro de tu presupuesto semanal, pero puedes optimizar $${potentialWeeklySavingsMxn} MXN adicionales reemplazando insumos empacados por alimentos a granel de la canasta básica.`;
  }

  const tianguisHeroIngredientTip =
    'El huevo de rancho comprado por cono de 30 ($75 MXN) y el requesón artesanal fresco ($40 el 1/2 kg) son las fuentes de proteína de mayor biodisponibilidad y menor costo en México ($0.38 a $0.45 MXN por gramo de proteína).';

  return {
    totalConsumedCostMxn,
    totalConsumedProteinGrams,
    averageCostPerGramProteinMxn,
    baselineTianguisCostPerGram,
    status,
    weeklyProjectedCostMxn: currentWeeklyTotalCost,
    weeklyBudgetLimitMxn: weeklyBudget,
    projectedOverspendMxn,
    potentialWeeklySavingsMxn,
    suggestions: suggestions.slice(0, 5), // Top 5 mejores sugerencias
    economicDiagnosis,
    tianguisHeroIngredientTip,
  };
}

/**
 * Aplica una sugerencia de ajuste presupuestal específica en el plan semanal
 */
export function applyBudgetSuggestion(
  weeklyPlan: Record<string, DayPlan>,
  suggestion: BudgetAdjustmentSuggestion,
  config: OnboardingPlanConfig
): { updatedPlan: Record<string, DayPlan>; updatedGroceryList: MarketItem[] } {
  const updatedPlan = { ...weeklyPlan };
  const day = updatedPlan[suggestion.dayId];

  if (day && day.meals && day.meals[suggestion.mealIndex]) {
    const newMeals = [...day.meals];
    newMeals[suggestion.mealIndex] = {
      ...suggestion.suggestedMeal,
      servings: config.peopleCount || 1,
    };

    const plannedProtein = newMeals.reduce((acc, m) => acc + m.macros.protein, 0);
    const plannedCalories = newMeals.reduce((acc, m) => acc + m.macros.calories, 0);
    const plannedCostMxn = newMeals.reduce(
      (acc, m) => acc + (m.estimatedCostMxn * (config.peopleCount || 1)),
      0
    );

    updatedPlan[suggestion.dayId] = {
      ...day,
      meals: newMeals,
      plannedProtein,
      plannedCalories,
      plannedCostMxn,
    };
  }

  const updatedGroceryList = generateWeeklyGroceryList(updatedPlan, config);

  return { updatedPlan, updatedGroceryList };
}

/**
 * Aplica TODAS las sugerencias de ahorro simultáneamente en el plan semanal
 */
export function applyAllBudgetSuggestions(
  weeklyPlan: Record<string, DayPlan>,
  suggestions: BudgetAdjustmentSuggestion[],
  config: OnboardingPlanConfig
): { updatedPlan: Record<string, DayPlan>; updatedGroceryList: MarketItem[] } {
  let currentPlan = { ...weeklyPlan };

  suggestions.forEach((sug) => {
    const res = applyBudgetSuggestion(currentPlan, sug, config);
    currentPlan = res.updatedPlan;
  });

  const updatedGroceryList = generateWeeklyGroceryList(currentPlan, config);
  return { updatedPlan: currentPlan, updatedGroceryList };
}

