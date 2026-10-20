import { MarketItem, Meal, Ingredient, MacroNutrients } from '../types/nutrition';

export interface PantryRecipe extends Meal {
  matchedIngredientsCount: number;
  totalIngredientsCount: number;
  isExactMatch: boolean;
  missingIngredients: string[];
  usedPantryItems: string[];
}

// Canonical ingredient keywords for reliable matching
export const PANTRY_KEYWORD_MAP: Record<string, string[]> = {
  huevo: ['huevo', 'huevos', 'blanquillo', 'yema', 'clara'],
  requeson: ['requesón', 'requeson', 'queso', 'queso fresco', 'panela'],
  pollo: ['pollo', 'pechuga', 'pechuga de pollo', 'deshebrada', 'tinga', 'filete de pechuga'],
  frijol: ['frijol', 'frijoles', 'frijoles negros', 'flor de mayo'],
  lenteja: ['lenteja', 'lentejas'],
  avena: ['avena', 'hojuelas de avena'],
  tortilla: ['tortilla', 'tortillas', 'nixtamal', 'tostada', 'tostadas', 'totopos'],
  nopal: ['nopal', 'nopales'],
  jitomate: ['jitomate', 'jitomates', 'tomate', 'salsa roja', 'recaudo'],
  cacahuate: ['cacahuate', 'cacahuates', 'crema de cacahuate', 'maní'],
  pepita: ['pepita', 'pepitas', 'semilla de calabaza'],
  platano: ['plátano', 'platano', 'plátano tabasco'],
  atun: ['atún', 'atun', 'lata de atún', 'atún en agua'],
  leche: ['leche', 'liconsa'],
  aguacate: ['aguacate'],
  calabacita: ['calabacita', 'calabacitas'],
};

// Universal Mexican basic seasoning staples assumed to be in any Mexican kitchen
export const BASIC_KITCHEN_STAPLES = [
  'agua',
  'sal',
  'sal de grano',
  'pimienta',
  'cebolla',
  'ajo',
  'diente de ajo',
  'limón',
  'limon',
  'aceite',
  'orégano',
  'oregano',
  'epazote',
  'cilantro',
  'chile',
  'chipotle',
  'comino',
  'canela',
];

export function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Checks if a recipe ingredient is satisfied by the user's purchased pantry items
 */
export function isIngredientInPantry(
  ingredientName: string,
  pantryItems: MarketItem[]
): boolean {
  const normIng = normalizeText(ingredientName);

  // If it's a basic kitchen staple (water, salt, onion, garlic, oil, etc.), consider it available
  const isStaple = BASIC_KITCHEN_STAPLES.some((staple) =>
    normIng.includes(normalizeText(staple))
  );
  if (isStaple) return true;

  // Check matching against pantry items
  for (const pantryItem of pantryItems) {
    if (!pantryItem.isPurchased) continue;
    const normPantryName = normalizeText(pantryItem.name);

    // Direct substring match
    if (normIng.includes(normPantryName) || normPantryName.includes(normIng)) {
      return true;
    }

    // Check keyword map
    for (const [key, aliases] of Object.entries(PANTRY_KEYWORD_MAP)) {
      const pantryHasKey = aliases.some((alias) =>
        normPantryName.includes(normalizeText(alias))
      );
      const ingHasKey = aliases.some((alias) =>
        normIng.includes(normalizeText(alias))
      );

      if (pantryHasKey && ingHasKey) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Master catalog of 24 authentic Mexican canasta básica recipes designed to be made
 * exclusively with items from Mexican market/pantry items.
 */
export const CANASTA_BASICA_PANTRY_RECIPES: Meal[] = [
  // 1. Huevos a la Mexicana con Frijoles de la Olla
  {
    id: 'pantry-rec-huevos-mexicana',
    type: 'desayuno',
    title: 'Huevos a la Mexicana con Frijoles de la Olla y Tortillas',
    subtitle: 'El clásico indiscutible: 36g de proteína con insumos 100% de la canasta básica',
    description: '3 huevos revueltos con recaudo fresco de jitomate y cebolla al comal, servidos sobre 1 taza de frijoles negros de la olla y tortillas de nixtamal recién infladas.',
    prepTimeMinutes: 12,
    servings: 1,
    estimatedCostMxn: 18,
    macros: { protein: 36, carbs: 48, fats: 16, calories: 480 },
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Huevos a la mexicana con frijoles',
    isCompleted: false,
    tianguisTip: 'Para frijoles más suaves y digestivos, añade una rama de epazote fresco y sal solo al final de la cocción.',
    ingredients: [
      { name: 'Huevos de rancho', amount: '3 piezas', baseGrams: 150, estimatedCostMxn: 7.5, proteinGrams: 18 },
      { name: 'Frijoles negros de la olla', amount: '1 taza (200g)', baseGrams: 200, estimatedCostMxn: 5.0, proteinGrams: 12 },
      { name: 'Tortillas de nixtamal', amount: '3 piezas', baseGrams: 75, estimatedCostMxn: 3.0, proteinGrams: 4.5 },
      { name: 'Jitomate saladette y cebolla', amount: '1 pieza picada', baseGrams: 80, estimatedCostMxn: 2.5, proteinGrams: 1.5 },
    ],
    recipeSteps: [
      'Pica el jitomate y cebolla en cubitos.',
      'Sofríe 2 minutos en sartén o comal con unas gotas de aceite.',
      'Bate los huevos con sal de grano, incorpóralos y cocina a fuego medio hasta cuajar.',
      'Sirve con los frijoles negros calientes y tortillas de nixtamal.',
    ],
  },

  // 2. Omelette de Requesón con Nopales Asados al Orégano
  {
    id: 'pantry-rec-omelette-requeson-nopales',
    type: 'desayuno',
    title: 'Omelette de Requesón Fresco con Nopales Asados al Orégano',
    subtitle: 'Proteína pura de suero lácteo y fibra soluble hipoglucemiante',
    description: '3 huevos tiernos rellenos de 80g de requesón artesanal de mercado, acompañados de 2 nopales tiernos asados al comal con sal y orégano.',
    prepTimeMinutes: 10,
    servings: 1,
    estimatedCostMxn: 19,
    macros: { protein: 37, carbs: 12, fats: 17, calories: 349 },
    imageUrl: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Omelette con requesón y nopales',
    isCompleted: false,
    tianguisTip: 'El requesón de cremería de tianguis cuesta menos de la mitad que el queso panela y tiene mayor porcentaje de suero lácteo (leucina).',
    ingredients: [
      { name: 'Huevos de rancho', amount: '3 piezas', baseGrams: 150, estimatedCostMxn: 7.5, proteinGrams: 18 },
      { name: 'Requesón artesanal de tianguis', amount: '80g', baseGrams: 80, estimatedCostMxn: 5.5, proteinGrams: 11 },
      { name: 'Nopales tiernos', amount: '2 piezas medianas', baseGrams: 120, estimatedCostMxn: 3.5, proteinGrams: 2.5 },
      { name: 'Tortillas de nixtamal', amount: '2 piezas', baseGrams: 50, estimatedCostMxn: 2.0, proteinGrams: 3 },
      { name: 'Orégano seco y sal', amount: 'Al gusto', baseGrams: 5, estimatedCostMxn: 0.5, proteinGrams: 0 },
    ],
    recipeSteps: [
      'Haz cortes en cruz a los nopales y ásalos al comal bien caliente con orégano y sal de grano.',
      'Bate los 3 huevos en un tazón.',
      'Vierte en sartén a fuego medio; cuando empiece a cuajar, coloca el requesón al centro.',
      'Dobla por la mitad y sirve de inmediato con los nopales y tortillas calientes.',
    ],
  },

  // 3. Chilaquiles Rojos con Huevos y Frijol
  {
    id: 'pantry-rec-chilaquiles-rojos-huevo',
    type: 'desayuno',
    title: 'Chilaquiles Rojos Caseros con 3 Huevos al Comal y Frijoles',
    subtitle: 'El rey del comal: tortillas tostadas al comal sin freír para máximo anabolismo limpio',
    description: 'Tortillas de nixtamal de días anteriores tostadas al comal, bañadas en caldillo rojo de jitomate con ajo, acompañadas de 3 huevos al comal y frijoles negros.',
    prepTimeMinutes: 16,
    servings: 1,
    estimatedCostMxn: 21,
    macros: { protein: 38, carbs: 54, fats: 15, calories: 503 },
    imageUrl: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Chilaquiles rojos caseros',
    isCompleted: false,
    tianguisTip: 'Nunca tires las tortillas duras: cortadas en triángulos y tostadas al comal son mejores que los totopos embolsados y no absorben aceite rancio.',
    ingredients: [
      { name: 'Huevos de rancho', amount: '3 piezas', baseGrams: 150, estimatedCostMxn: 7.5, proteinGrams: 18 },
      { name: 'Tortillas de nixtamal', amount: '4 piezas', baseGrams: 100, estimatedCostMxn: 4.0, proteinGrams: 6 },
      { name: 'Frijoles negros de la olla', amount: '120g', baseGrams: 120, estimatedCostMxn: 3.5, proteinGrams: 7 },
      { name: 'Jitomate saladette maduro', amount: '2 piezas', baseGrams: 150, estimatedCostMxn: 4.5, proteinGrams: 1.5 },
      { name: 'Requesón artesanal de tianguis', amount: '40g', baseGrams: 40, estimatedCostMxn: 3.0, proteinGrams: 5.5 },
    ],
    recipeSteps: [
      'Corta las tortillas en triángulos y tuéstalas al comal seco hasta que queden crujientes.',
      'Asa los jitomates con ajo y cebolla; licúa y dale un hervor de 3 minutos.',
      'Prepara los 3 huevos al comal tiernos o estrellados.',
      'Baña los totopos con la salsa hirviendo, monta los huevos y espolvorea el requesón.',
    ],
  },

  // 4. Molletes de Requesón y Frijol con Huevo
  {
    id: 'pantry-rec-molletes-tortilla-requeson',
    type: 'desayuno',
    title: 'Molletes Rústicos de Maíz con Frijol Refrito, Requesón y Huevo',
    subtitle: 'Combinación perfecta de leguminosa, cereal y proteína láctea económica',
    description: 'Tortillas de nixtamal dobles con base de frijoles negros machacados, coronadas con abundante requesón artesanal gratinado al comal y 2 huevos pochados.',
    prepTimeMinutes: 12,
    servings: 1,
    estimatedCostMxn: 17,
    macros: { protein: 34, carbs: 44, fats: 14, calories: 438 },
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Molletes rústicos con requesón',
    isCompleted: false,
    tianguisTip: 'El requesón fresco colocado sobre comal caliente adquiere una costra dorada deliciosa similar al queso asadero pero sin saturación de grasa.',
    ingredients: [
      { name: 'Huevos de rancho', amount: '2 piezas', baseGrams: 100, estimatedCostMxn: 5.0, proteinGrams: 12 },
      { name: 'Requesón artesanal de tianguis', amount: '80g', baseGrams: 80, estimatedCostMxn: 5.5, proteinGrams: 11 },
      { name: 'Frijoles negros de la olla', amount: '120g machacados', baseGrams: 120, estimatedCostMxn: 3.5, proteinGrams: 7 },
      { name: 'Tortillas de nixtamal', amount: '3 piezas', baseGrams: 75, estimatedCostMxn: 3.0, proteinGrams: 4.5 },
    ],
    recipeSteps: [
      'Machaca los frijoles calientes en el sartén con un toque de cebolla picada.',
      'Unta generosamente los frijoles sobre las tortillas calientes.',
      'Cubre con el requesón artesanal y dora la base al comal.',
      'Corona con los huevos cocidos o estrellados.',
    ],
  },

  // 5. Pechuga de Pollo con Nopales Asados y Frijol
  {
    id: 'pantry-rec-pechuga-nopales-frijol',
    type: 'comida',
    title: 'Pechuga Asada al Comal con Nopales Tiernos y Frijoles de la Olla',
    subtitle: 'La piedra angular del culturismo barrial: 52g de proteína magra de alta asimilación',
    description: '160g de pechuga de pollo marinada con limón y ajo asada al comal de hierro, con 2 nopales asados con orégano y un tazón humeante de frijoles negros.',
    prepTimeMinutes: 20,
    servings: 1,
    estimatedCostMxn: 36,
    macros: { protein: 52, carbs: 42, fats: 9, calories: 457 },
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Pechuga asada con nopales y frijoles',
    isCompleted: false,
    tianguisTip: 'Pide al pollero la pechuga aplanada fina y no la sobrecocines: 3 minutos y medio por lado en comal humeante para mantener todo el jugo celular.',
    ingredients: [
      { name: 'Pechuga de pollo fresca', amount: '160g en crudo', baseGrams: 160, estimatedCostMxn: 22.0, proteinGrams: 44 },
      { name: 'Nopales tiernos', amount: '2 piezas', baseGrams: 120, estimatedCostMxn: 3.5, proteinGrams: 2.5 },
      { name: 'Frijoles negros de la olla', amount: '1 taza (150g)', baseGrams: 150, estimatedCostMxn: 4.5, proteinGrams: 9 },
      { name: 'Tortillas de nixtamal', amount: '2 piezas', baseGrams: 50, estimatedCostMxn: 2.0, proteinGrams: 3 },
      { name: 'Limón, ajo y sal', amount: 'Al gusto', baseGrams: 20, estimatedCostMxn: 2.0, proteinGrams: 0 },
    ],
    recipeSteps: [
      'Marina la pechuga 5 minutos con limón, ajo y sal de grano.',
      'Asa los nopales al comal de hierro hasta dorar.',
      'Asa la pechuga 3 minutos por lado a fuego alto para sellar los jugos.',
      'Acompaña con el caldo de frijoles negros y tortillas de comal.',
    ],
  },

  // 6. Entomatadas de Pollo Deshebrado con Frijoles
  {
    id: 'pantry-rec-entomatadas-pollo-deshebrado',
    type: 'comida',
    title: 'Entomatadas Caseras de Pechuga de Pollo con Salsa y Frijoles',
    subtitle: 'Comida reconfortante de fonda tradicional con 49g de proteína pura',
    description: '3 tortillas de maíz pasadas ligeramente por comal, rellenas de 140g de pechuga cocida deshebrada, bañadas en salsa casera de jitomate y acompañadas de frijoles.',
    prepTimeMinutes: 22,
    servings: 1,
    estimatedCostMxn: 34,
    macros: { protein: 49, carbs: 48, fats: 11, calories: 487 },
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Entomatadas de pollo caseras',
    isCompleted: false,
    tianguisTip: 'Cuece 1 kilo de pechuga entera los domingos; el caldo lo congelas y la carne deshebrada te salva 4 comidas durante la semana.',
    ingredients: [
      { name: 'Pechuga de pollo fresca', amount: '150g cruda (130g deshebrada)', baseGrams: 150, estimatedCostMxn: 20.0, proteinGrams: 41 },
      { name: 'Tortillas de nixtamal', amount: '3 piezas', baseGrams: 75, estimatedCostMxn: 3.0, proteinGrams: 4.5 },
      { name: 'Jitomate saladette maduro', amount: '3 piezas', baseGrams: 200, estimatedCostMxn: 5.0, proteinGrams: 2 },
      { name: 'Frijoles negros de la olla', amount: '100g', baseGrams: 100, estimatedCostMxn: 3.0, proteinGrams: 6 },
      { name: 'Cebolla y orégano', amount: 'Al gusto', baseGrams: 30, estimatedCostMxn: 1.5, proteinGrams: 0.5 },
    ],
    recipeSteps: [
      'Hierve el jitomate con cebolla y ajo; licúa y cocina con una pizca de orégano 5 minutos.',
      'Pasa las tortillas por el comal para suavizarlas.',
      'Rellena cada tortilla con pechuga deshebrada y enrolla.',
      'Baña con la salsa caliente de jitomate y acompaña con frijoles negros.',
    ],
  },

  // 7. Cazuela Caliente de Lentejas Guisadas con 3 Huevos Duros
  {
    id: 'pantry-rec-lentejas-huevos-requeson',
    type: 'comida',
    title: 'Cazuela Caliente de Lentejas Guisadas con 3 Huevos Duros y Requesón',
    subtitle: 'El superalimento del pueblo: hierro, leucina y proteína vegetal de costo mínimo',
    description: 'Tazón grande de lentejas criollas guisadas con recaudo casero de jitomate, coronadas con 3 huevos cocidos rebanados y 50g de requesón artesanal fresco.',
    prepTimeMinutes: 18,
    servings: 1,
    estimatedCostMxn: 23,
    macros: { protein: 44, carbs: 58, fats: 16, calories: 552 },
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Cazuela de lentejas con huevo y requesón',
    isCompleted: false,
    tianguisTip: '1 kilo de lenteja en grano rinde hasta 8 platos completos por $32 pesos. Acompáñala con limón para triplicar la absorción de hierro.',
    ingredients: [
      { name: 'Lentejas criollas en grano', amount: '220g cocidas', baseGrams: 220, estimatedCostMxn: 6.5, proteinGrams: 18 },
      { name: 'Huevos de rancho', amount: '3 piezas', baseGrams: 150, estimatedCostMxn: 7.5, proteinGrams: 18 },
      { name: 'Requesón artesanal de tianguis', amount: '50g', baseGrams: 50, estimatedCostMxn: 4.0, proteinGrams: 7 },
      { name: 'Jitomate saladette y cebolla', amount: 'Para recaudo', baseGrams: 80, estimatedCostMxn: 3.0, proteinGrams: 1 },
      { name: 'Tortillas de nixtamal', amount: '2 piezas', baseGrams: 50, estimatedCostMxn: 2.0, proteinGrams: 3 },
    ],
    recipeSteps: [
      'Calienta las lentejas con su caldillo especiado con comino y sal.',
      'Cuece los 3 huevos en agua hirviendo durante 9 minutos y pélalos en agua fría.',
      'Corta los huevos en cuartos y colócalos sobre el tazón de lentejas.',
      'Agrega el requesón fresco frío y disfruta con tortillas de maíz caliente.',
    ],
  },

  // 8. Tacos de Tinga de Pollo Rápida al Comal
  {
    id: 'pantry-rec-tacos-tinga-pollo',
    type: 'comida',
    title: 'Tacos de Pollo al Caldillo de Jitomate y Cebolla al Comal',
    subtitle: 'Comida rápida, económica y sin frituras: 48g de proteína magra',
    description: '150g de pechuga salteada con cebolla en juliana y caldillo de jitomate con orégano, servida en 4 tortillas de nixtamal con frijoles refritos.',
    prepTimeMinutes: 18,
    servings: 1,
    estimatedCostMxn: 33,
    macros: { protein: 48, carbs: 52, fats: 10, calories: 490 },
    imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Tacos de pollo con cebolla y jitomate',
    isCompleted: false,
    tianguisTip: 'Si no tienes pollo cocido previo, corta el filete crudo en cubos pequeños; se cocina en menos de 5 minutos en el sartén.',
    ingredients: [
      { name: 'Pechuga de pollo fresca', amount: '150g', baseGrams: 150, estimatedCostMxn: 20.0, proteinGrams: 41 },
      { name: 'Tortillas de nixtamal', amount: '4 piezas', baseGrams: 100, estimatedCostMxn: 4.0, proteinGrams: 6 },
      { name: 'Frijoles negros de la olla', amount: '80g', baseGrams: 80, estimatedCostMxn: 2.5, proteinGrams: 5 },
      { name: 'Jitomate saladette y cebolla', amount: '1 pieza de cada uno', baseGrams: 100, estimatedCostMxn: 4.0, proteinGrams: 1.5 },
    ],
    recipeSteps: [
      'Corta la pechuga en tiras delgadas.',
      'Sofríe la cebolla hasta acitronar, añade el jitomate picado y el pollo.',
      'Cocina a fuego medio tapado por 7 minutos hasta impregnar el sabor.',
      'Calienta las tortillas al comal, unta frijoles y forma 4 tacos jugosos.',
    ],
  },

  // 9. Licuado Proteico de Barrio (Avena, Plátano y Cacahuate)
  {
    id: 'pantry-rec-licuado-avena-cacahuate',
    type: 'snack',
    title: 'Licuado Anabólico de Barrio (Avena, Plátano, Cacahuate y Agua/Leche)',
    subtitle: 'El mejor sustituto de suplementos en polvo: 24g de proteína natural en 2 minutos',
    description: '60g de avena en hojuelas a granel, 30g de cacahuates naturales molidos, 1 plátano tabasco y canela en polvo licuados con agua o leche.',
    prepTimeMinutes: 3,
    servings: 1,
    estimatedCostMxn: 13,
    macros: { protein: 24, carbs: 58, fats: 15, calories: 463 },
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Licuado de avena con plátano y cacahuate',
    isCompleted: false,
    tianguisTip: 'Los cacahuates a granel sin sal son la fuente de grasa cardiosaludable y proteína vegetal más barata del mercado: $32 el medio kilo.',
    ingredients: [
      { name: 'Avena entera en hojuelas', amount: '60g', baseGrams: 60, estimatedCostMxn: 2.0, proteinGrams: 8.5 },
      { name: 'Cacahuate natural a granel', amount: '35g', baseGrams: 35, estimatedCostMxn: 3.0, proteinGrams: 9 },
      { name: 'Plátano tabasco', amount: '1 pieza grande', baseGrams: 120, estimatedCostMxn: 3.5, proteinGrams: 1.5 },
      { name: 'Canela en polvo y agua', amount: '350ml', baseGrams: 350, estimatedCostMxn: 1.0, proteinGrams: 0 },
    ],
    recipeSteps: [
      'Agrega al vaso de la licuadora la avena, los cacahuates y el plátano pelado.',
      'Añade agua fría o leche con cubos de hielo y canela al gusto.',
      'Licúa a velocidad máxima durante 60 segundos hasta que quede sedoso y cremoso.',
    ],
  },

  // 10. Tazón de Requesón Artesanal con Plátano y Pepitas Tostadas
  {
    id: 'pantry-rec-tazon-requeson-platano-pepitas',
    type: 'snack',
    title: 'Tazón de Requesón Artesanal con Plátano Tabasco y Pepitas Tostadas',
    subtitle: 'Postre anabólico de digestión rápida con zinc, magnesio y leucina',
    description: '140g de requesón fresco de cremería con rebanadas de plátano maduro, canela molida y 20g de pepitas de calabaza tostadas al comal.',
    prepTimeMinutes: 3,
    servings: 1,
    estimatedCostMxn: 16,
    macros: { protein: 26, carbs: 32, fats: 9, calories: 313 },
    imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Tazón de requesón con plátano y pepitas',
    isCompleted: false,
    tianguisTip: 'Las pepitas de calabaza tostadas al comal tienen 30g de proteína por 100g, superando a la carne de res.',
    ingredients: [
      { name: 'Requesón artesanal de tianguis', amount: '140g', baseGrams: 140, estimatedCostMxn: 9.5, proteinGrams: 19 },
      { name: 'Pepitas de calabaza tostadas', amount: '20g', baseGrams: 20, estimatedCostMxn: 3.5, proteinGrams: 6 },
      { name: 'Plátano tabasco', amount: '1 pieza', baseGrams: 110, estimatedCostMxn: 3.0, proteinGrams: 1.2 },
      { name: 'Canela en polvo', amount: 'Al gusto', baseGrams: 2, estimatedCostMxn: 0.5, proteinGrams: 0 },
    ],
    recipeSteps: [
      'Coloca el requesón artesanal en un tazón hondo.',
      'Corta el plátano tabasco en rodajas y distribúyelas sobre el requesón.',
      'Espolvorea las pepitas tostadas de calabaza y canela molida.',
    ],
  },

  // 11. Gachas Calientes de Avena con Cacahuate y Plátano
  {
    id: 'pantry-rec-avena-caliente-cacahuate',
    type: 'snack',
    title: 'Avena Caliente al Comal con Cacahuate Molido y Plátano',
    subtitle: 'Reconfortante, ultra económico y saciante para días fríos o pre-entrenamiento',
    description: 'Tazón espeso de avena cocida a fuego lento con canela, servida con plátano en trozos y cacahuates tostados crujientes.',
    prepTimeMinutes: 8,
    servings: 1,
    estimatedCostMxn: 12,
    macros: { protein: 20, carbs: 52, fats: 12, calories: 396 },
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Tazón de avena caliente con plátano',
    isCompleted: false,
    tianguisTip: 'La avena a granel cuesta $24 el kilo en los molinos de barrio vs $59 la de caja de supermercado.',
    ingredients: [
      { name: 'Avena entera en hojuelas', amount: '60g', baseGrams: 60, estimatedCostMxn: 2.0, proteinGrams: 8.5 },
      { name: 'Cacahuate natural a granel', amount: '30g', baseGrams: 30, estimatedCostMxn: 2.5, proteinGrams: 8 },
      { name: 'Plátano tabasco', amount: '1 pieza', baseGrams: 110, estimatedCostMxn: 3.0, proteinGrams: 1.2 },
      { name: 'Canela en polvo y sal', amount: '1 pizca', baseGrams: 5, estimatedCostMxn: 1.0, proteinGrams: 0 },
    ],
    recipeSteps: [
      'Hierve 1 taza y media de agua con canela.',
      'Añade la avena y una pizca de sal; baja el fuego y mueve 4 minutos.',
      'Sirve caliente, agrega el plátano picado y espolvorea los cacahuates.',
    ],
  },

  // 12. Tacos de Frijol Refrito con Requesón Fresco y Nopales
  {
    id: 'pantry-rec-tacos-frijol-requeson-nopal',
    type: 'cena',
    title: 'Tacos de Frijol de la Olla con Requesón Fresco y Nopal Asado',
    subtitle: 'Cena ligera, digestiva y de alto poder saciante: 31g de proteína vegetal-láctea',
    description: '3 tortillas de maíz infladas al comal con base de frijoles negros machacados con epazote, 70g de requesón artesanal fresco y tiritas de nopal asado con sal y limón.',
    prepTimeMinutes: 10,
    servings: 1,
    estimatedCostMxn: 16,
    macros: { protein: 31, carbs: 46, fats: 9, calories: 389 },
    imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Tacos de frijol con requesón y nopal',
    isCompleted: false,
    tianguisTip: 'El requesón antes de dormir aporta caseína y proteína de suero que liberan aminoácidos durante el sueño para la síntesis proteica nocturna.',
    ingredients: [
      { name: 'Requesón artesanal de tianguis', amount: '80g', baseGrams: 80, estimatedCostMxn: 5.5, proteinGrams: 11 },
      { name: 'Frijoles negros de la olla', amount: '150g', baseGrams: 150, estimatedCostMxn: 4.5, proteinGrams: 9 },
      { name: 'Nopales tiernos', amount: '2 piezas asadas', baseGrams: 120, estimatedCostMxn: 3.5, proteinGrams: 2.5 },
      { name: 'Tortillas de nixtamal', amount: '3 piezas', baseGrams: 75, estimatedCostMxn: 3.0, proteinGrams: 4.5 },
    ],
    recipeSteps: [
      'Asa los nopales al comal y córtalos en tiritas con sal y limón.',
      'Calienta y machaca los frijoles con un tenedor.',
      'Calienta las tortillas de nixtamal, unta frijoles, añade requesón fresco y nopal.',
    ],
  },

  // 13. Huevos Pochados en Sopa de Lentejas al Jitomate
  {
    id: 'pantry-rec-huevos-en-lentejas',
    type: 'cena',
    title: 'Huevos Ahogados en Sopa Espesa de Lentejas al Comal',
    subtitle: 'Cena cálida, cero pesadez gástrica y 35g de proteína completa',
    description: 'Caldillo humeante de lentejas cocidas con recaudo de jitomate y cebolla, donde se rompen 2 huevos enteros para pocharlos directo en el caldo hirviendo.',
    prepTimeMinutes: 12,
    servings: 1,
    estimatedCostMxn: 19,
    macros: { protein: 35, carbs: 44, fats: 12, calories: 424 },
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Huevos pochados en caldo de lentejas',
    isCompleted: false,
    tianguisTip: 'Cocinar los huevos directo en el caldo caliente de leguminosa mantiene las yemas tiernas y absorbe todo el recaudo tradicional.',
    ingredients: [
      { name: 'Lentejas criollas en grano', amount: '200g cocidas', baseGrams: 200, estimatedCostMxn: 6.0, proteinGrams: 16 },
      { name: 'Huevos de rancho', amount: '2 piezas', baseGrams: 100, estimatedCostMxn: 5.0, proteinGrams: 12 },
      { name: 'Jitomate saladette y cebolla', amount: '1 pieza', baseGrams: 80, estimatedCostMxn: 3.0, proteinGrams: 1 },
      { name: 'Tortillas de nixtamal', amount: '2 piezas', baseGrams: 50, estimatedCostMxn: 2.0, proteinGrams: 3 },
      { name: 'Requesón artesanal de tianguis', amount: '30g', baseGrams: 30, estimatedCostMxn: 2.0, proteinGrams: 4 },
    ],
    recipeSteps: [
      'Pon a hervir las lentejas con su caldillo de jitomate a fuego medio.',
      'Rompe con cuidado los 2 huevos directamente dentro del caldo.',
      'Tapa la olla 4 minutos hasta que la clara cuaje y la yema quede cremosa.',
      'Sirve caliente con un toque de requesón y tortillas.',
    ],
  },

  // 14. Ensalada de Nopales Curados con 3 Huevos Cocidos
  {
    id: 'pantry-rec-ensalada-nopales-huevo',
    type: 'cena',
    title: 'Ensalada Fresca de Nopales Curados con 3 Huevos Cocidos y Requesón',
    subtitle: 'Baja en carbohidratos, ultra saciante y rica en antioxidantes',
    description: '3 huevos duros rebanados sobre una ensalada fresca de nopales tiernos con jitomate, cebolla, orégano, 50g de requesón y 2 tostadas al comal.',
    prepTimeMinutes: 12,
    servings: 1,
    estimatedCostMxn: 21,
    macros: { protein: 35, carbs: 22, fats: 16, calories: 372 },
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Ensalada de nopales con huevo duro',
    isCompleted: false,
    tianguisTip: 'Para curar nopales en crudo sin babita: córtalos finos con sal de grano durante 20 minutos y enjuaga con agua fría.',
    ingredients: [
      { name: 'Huevos de rancho', amount: '3 piezas cocidas', baseGrams: 150, estimatedCostMxn: 7.5, proteinGrams: 18 },
      { name: 'Requesón artesanal de tianguis', amount: '50g', baseGrams: 50, estimatedCostMxn: 4.0, proteinGrams: 7 },
      { name: 'Nopales tiernos', amount: '2 piezas', baseGrams: 120, estimatedCostMxn: 3.5, proteinGrams: 2.5 },
      { name: 'Jitomate saladette y orégano', amount: '1 pieza', baseGrams: 80, estimatedCostMxn: 3.0, proteinGrams: 1 },
      { name: 'Tortillas de nixtamal (tostadas)', amount: '2 piezas', baseGrams: 50, estimatedCostMxn: 2.0, proteinGrams: 3 },
    ],
    recipeSteps: [
      'Hierve o asa los nopales y córtalos en cubos con el jitomate y cebolla.',
      'Agrega orégano seco, sal de grano y unas gotas de limón.',
      'Corona con los 3 huevos duros cortados a la mitad y el requesón fresco.',
      'Acompaña con tortillas tostadas al comal.',
    ],
  },
];

/**
 * Searches and scores recipes based strictly on the user's purchased pantry items.
 */
export function matchPantryRecipes(
  pantryItems: MarketItem[],
  options?: {
    mealType?: Meal['type'] | 'todas';
    onlyExactMatches?: boolean;
    searchQuery?: string;
  }
): PantryRecipe[] {
  const activePantry = pantryItems.filter((item) => item.isPurchased);

  const matched = CANASTA_BASICA_PANTRY_RECIPES.map((recipe) => {
    const totalIngredients = recipe.ingredients.length;
    const missing: string[] = [];
    const used: string[] = [];

    recipe.ingredients.forEach((ing) => {
      if (isIngredientInPantry(ing.name, activePantry)) {
        used.push(ing.name);
      } else {
        missing.push(ing.name);
      }
    });

    const matchedCount = used.length;
    const isExact = missing.length === 0;

    return {
      ...recipe,
      matchedIngredientsCount: matchedCount,
      totalIngredientsCount: totalIngredients,
      isExactMatch: isExact,
      missingIngredients: missing,
      usedPantryItems: used,
    } as PantryRecipe;
  });

  // Filter based on options
  let filtered = matched;

  if (options?.mealType && options.mealType !== 'todas') {
    filtered = filtered.filter((r) => r.type === options.mealType);
  }

  if (options?.onlyExactMatches) {
    filtered = filtered.filter((r) => r.isExactMatch);
  }

  if (options?.searchQuery) {
    const q = normalizeText(options.searchQuery);
    filtered = filtered.filter(
      (r) =>
        normalizeText(r.title).includes(q) ||
        normalizeText(r.subtitle).includes(q) ||
        r.ingredients.some((i) => normalizeText(i.name).includes(q))
    );
  }

  // Sort: Exact matches first, then by match ratio desc, then by protein desc
  filtered.sort((a, b) => {
    if (a.isExactMatch && !b.isExactMatch) return -1;
    if (!a.isExactMatch && b.isExactMatch) return 1;

    const ratioA = a.matchedIngredientsCount / Math.max(1, a.totalIngredientsCount);
    const ratioB = b.matchedIngredientsCount / Math.max(1, b.totalIngredientsCount);

    if (ratioB !== ratioA) {
      return ratioB - ratioA;
    }

    return b.macros.protein - a.macros.protein;
  });

  return filtered;
}

/**
 * Intelligent Dynamic Recipe Creator:
 * Synthesizes a completely NEW authentic Mexican recipe strictly from a selected combination
 * of pantry items (e.g. 2, 3 or 4 ingredients).
 */
export function generateCreativeRecipeFromPantry(
  selectedItems: MarketItem[],
  mealType: Meal['type'] = 'comida'
): PantryRecipe {
  if (selectedItems.length === 0) {
    throw new Error('Debes seleccionar al menos un insumo de tu despensa.');
  }

  // Identify core items present in selection
  const names = selectedItems.map((item) => normalizeText(item.name));
  const hasHuevo = names.some((n) => n.includes('huevo'));
  const hasRequeson = names.some((n) => n.includes('requeson'));
  const hasPollo = names.some((n) => n.includes('pollo') || n.includes('pechuga'));
  const hasFrijol = names.some((n) => n.includes('frijol'));
  const hasLenteja = names.some((n) => n.includes('lenteja'));
  const hasAvena = names.some((n) => n.includes('avena'));
  const hasTortilla = names.some((n) => n.includes('tortilla'));
  const hasNopal = names.some((n) => n.includes('nopal'));
  const hasJitomate = names.some((n) => n.includes('jitomate') || n.includes('tomate'));
  const hasCacahuate = names.some((n) => n.includes('cacahuate'));
  const hasPepita = names.some((n) => n.includes('pepita'));
  const hasPlatano = names.some((n) => n.includes('platano'));

  // Calculate dynamic macros and ingredients
  const ingredients: Ingredient[] = [];
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;
  let totalCalories = 0;
  let totalCost = 0;

  selectedItems.forEach((item) => {
    // Determine reasonable portion size for 1 person
    let grams = 100;
    let cost = item.priceTianguisMxn * 0.2;
    let amountDesc = '1 porción';

    const norm = normalizeText(item.name);
    if (norm.includes('huevo')) {
      grams = 150; // 3 huevos
      cost = 7.5;
      amountDesc = '3 piezas de rancho';
    } else if (norm.includes('pechuga') || norm.includes('pollo')) {
      grams = 160;
      cost = 22.0;
      amountDesc = '160g aplanada';
    } else if (norm.includes('requeson')) {
      grams = 80;
      cost = 5.5;
      amountDesc = '80g fresco';
    } else if (norm.includes('frijol')) {
      grams = 150;
      cost = 4.5;
      amountDesc = '150g cocidos';
    } else if (norm.includes('lenteja')) {
      grams = 200;
      cost = 6.0;
      amountDesc = '200g cocidas';
    } else if (norm.includes('avena')) {
      grams = 60;
      cost = 2.0;
      amountDesc = '60g hojuelas';
    } else if (norm.includes('tortilla')) {
      grams = 75;
      cost = 3.0;
      amountDesc = '3 piezas al comal';
    } else if (norm.includes('nopal')) {
      grams = 120;
      cost = 3.5;
      amountDesc = '2 piezas medianas';
    } else if (norm.includes('jitomate')) {
      grams = 100;
      cost = 3.0;
      amountDesc = '1 pieza para recaudo';
    } else if (norm.includes('cacahuate')) {
      grams = 30;
      cost = 2.5;
      amountDesc = '30g tostado';
    } else if (norm.includes('pepita')) {
      grams = 20;
      cost = 3.5;
      amountDesc = '20g tostadas';
    } else if (norm.includes('platano')) {
      grams = 110;
      cost = 3.5;
      amountDesc = '1 pieza tabasco';
    }

    const protein = Math.round(((item.proteinPer100g || 10) * grams) / 100);

    ingredients.push({
      name: item.name,
      amount: amountDesc,
      baseGrams: grams,
      estimatedCostMxn: Math.round(cost * 10) / 10,
      proteinGrams: protein,
    });

    totalProtein += protein;
    totalCost += cost;
  });

  // Calculate approximate carbs, fats & calories
  totalCarbs = Math.round(
    (hasTortilla ? 36 : 0) +
      (hasFrijol ? 32 : 0) +
      (hasLenteja ? 36 : 0) +
      (hasAvena ? 40 : 0) +
      (hasPlatano ? 28 : 0) +
      (hasJitomate ? 4 : 0) +
      (hasNopal ? 4 : 0)
  );

  totalFats = Math.round(
    (hasHuevo ? 14 : 0) +
      (hasRequeson ? 6 : 0) +
      (hasCacahuate ? 14 : 0) +
      (hasPepita ? 10 : 0) +
      (hasPollo ? 4 : 0) +
      3 // cooking oil baseline
  );

  totalCalories = totalProtein * 4 + totalCarbs * 4 + totalFats * 9;

  // Generate creative dish title & steps
  let title = 'Platillo Artesanal del Tianguis';
  let subtitle = 'Creado exclusivamente con insumos de tu despensa';
  let description = 'Combinación de alto valor biológico creada con ingredientes que ya tienes en casa.';
  const steps: string[] = [];
  let tip = 'Cocina con sal de grano y comal caliente para maximizar sabor sin agregar aceites ultraprocesados.';

  if (hasPollo && hasNopal && hasTortilla) {
    title = 'Tacos de Pechuga al Comal con Nopalitos Asados';
    subtitle = '50g de proteína magra directa del comal con cero grasa añadida';
    description = 'Filetes de pechuga sellados al comal con tiras de nopal asado con orégano y tortillas recién calientes.';
    steps.push('Asa los nopales al comal de hierro con orégano y sal hasta dorar.');
    steps.push('Sella la pechuga 3-4 minutos por lado para conservar sus jugos.');
    steps.push('Calienta las tortillas de nixtamal y monta tus tacos.');
    tip = 'El nopal en el comal aporta humedad natural que evita que la pechuga se reseque.';
  } else if (hasHuevo && hasFrijol && hasTortilla) {
    title = 'Huevos Ahogados en Frijol de la Olla con Tortillas de Comal';
    subtitle = 'Aminoácidos completos con el balance tradicional mexicano';
    description = 'Huevos al comal bañados con frijoles negros bien calientes y tortillas de nixtamal.';
    steps.push('Hierve los frijoles en sartén con un toque de epazote o cebolla.');
    steps.push('Prepara los huevos en sartén o comal con sal de grano.');
    steps.push('Sirve los frijoles de base, coloca los huevos encima y acompaña con tortillas calientes.');
    tip = 'La combinación de frijol con maíz genera una proteína completa con todos los aminoácidos esenciales.';
  } else if (hasLenteja && hasHuevo) {
    title = 'Cazuela de Lentejas Caseras con Huevos Pochados al Vapor';
    subtitle = 'Hierro vegetal + albúmina pura de huevo: nutrición deportiva económica';
    description = 'Tazón caliente de lentejas criollas con huevos cocidos y toque de hierbas de olor.';
    steps.push('Pon a calentar las lentejas criollas con su caldillo especiado.');
    steps.push('Cuece los huevos al término deseado (duros o pochados).');
    steps.push('Integra los huevos al tazón de lentejas y termina con un chorrito de jugo de limón.');
    tip = 'El limón eleva hasta 3 veces la absorción del hierro vegetal de la lenteja.';
  } else if (hasAvena && (hasPlatano || hasCacahuate)) {
    title = 'Tazón Anabólico de Avena con Plátano y Cacahuate Tostado';
    subtitle = 'Energía de asimilación lenta con grasas insaturadas de tianguis';
    description = 'Avena cocida o en batido espeso con plátano tabasco y cacahuates naturales crujientes.';
    steps.push('Cocina la avena con agua y canela durante 4 minutos a fuego bajo (o licúa en frío).');
    steps.push('Sirve en un tazón hondo y decora con rodajas de plátano tabasco.');
    steps.push('Espolvorea los cacahuates tostados para darle textura crujiente.');
    tip = 'El cacahuate sin sal es la grasa vegetal más barata y nutritiva de México.';
  } else if (hasHuevo && hasRequeson) {
    title = 'Revoltillo Suave de Huevo con Requesón Fresco de Mercado';
    subtitle = 'Doble fuente de proteína de altísimo valor biológico (BV 100)';
    description = 'Huevos revueltos a fuego bajo combinados con requesón artesanal cremoso.';
    steps.push('Bate los huevos con sal de grano.');
    steps.push('Vierte en sartén a fuego bajo; al cuajar a la mitad, incorpora el requesón fresco.');
    steps.push('Mueve suavemente 1 minuto y retira del fuego antes de que se seque.');
    tip = 'El requesón mantiene los huevos extra cremosos sin necesidad de crema o leche adicional.';
  } else {
    // Generic fallback generated dish with selected items
    const mainProteins = selectedItems.filter((i) => i.category === 'proteina').map((i) => i.name);
    const mainCarbs = selectedItems.filter((i) => i.category === 'carbohidratos').map((i) => i.name);
    const mainVeg = selectedItems.filter((i) => i.category === 'verduras').map((i) => i.name);

    title = `Guiso de Barrio con ${selectedItems.slice(0, 2).map((i) => i.name).join(' y ')}`;
    subtitle = `${totalProtein}g de proteína calculada exclusivamente con tu despensa`;
    description = `Platillo balanceado preparado al momento combinando ${selectedItems.map((i) => i.name).join(', ')}.`;
    steps.push('Prepara y sazona los ingredientes al comal o sartén.');
    steps.push('Cocina las proteínas a fuego medio con sal de grano.');
    steps.push('Acompaña con las guarniciones calientes y sirve de inmediato.');
  }

  const generatedId = `custom-pantry-${Date.now()}`;

  return {
    id: generatedId,
    type: mealType,
    title,
    subtitle,
    description,
    prepTimeMinutes: 15,
    servings: 1,
    estimatedCostMxn: Math.max(10, Math.round(totalCost)),
    macros: {
      protein: Math.max(15, totalProtein),
      carbs: Math.max(10, totalCarbs),
      fats: Math.max(5, totalFats),
      calories: Math.max(250, totalCalories),
    },
    imageUrl:
      hasPollo
        ? 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80'
        : hasHuevo
        ? 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80'
        : hasLenteja
        ? 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    imageAlt: title,
    isCompleted: false,
    tianguisTip: tip,
    ingredients,
    recipeSteps: steps,
    matchedIngredientsCount: selectedItems.length,
    totalIngredientsCount: selectedItems.length,
    isExactMatch: true,
    missingIngredients: [],
    usedPantryItems: selectedItems.map((i) => i.name),
  };
}

/**
 * Format a recipe to share via WhatsApp or clipboard
 */
export function formatRecipeToWhatsApp(recipe: Meal | PantryRecipe): string {
  let text = `🍳 *${recipe.title.toUpperCase()}*\n`;
  text += `_${recipe.subtitle}_\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `⚡ *MACROS:* ${recipe.macros.protein}g Proteína | ${recipe.macros.calories} kcal | $${recipe.estimatedCostMxn} MXN\n`;
  text += `⏱️ *Tiempo:* ${recipe.prepTimeMinutes} min | 🍽️ *Porciones:* ${recipe.servings || 1}\n\n`;

  text += `🛒 *INGREDIENTES (Canasta Básica):*\n`;
  recipe.ingredients.forEach((ing) => {
    text += `• ${ing.name} (${ing.amount}) - ${ing.proteinGrams}g proteína\n`;
  });

  if (recipe.recipeSteps && recipe.recipeSteps.length > 0) {
    text += `\n👨‍🍳 *PREPARACIÓN AL COMAL / SARTÉN:*\n`;
    recipe.recipeSteps.forEach((step, idx) => {
      text += `${idx + 1}. ${step}\n`;
    });
  }

  if (recipe.tianguisTip) {
    text += `\n💡 *TIP DEL TIANGUIS:*\n${recipe.tianguisTip}\n`;
  }

  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `_Nutribarrio v1.1.0 Pro • Ing. Joel Roldán Gómez • AI Studio_`;

  return text;
}
