// mascotaData.js

// Tipos de mascotas disponibles
export const MASCOTAS = {
  PENGUIN: {
    id: 'penguin',
    name: 'Pingüino',
    emoji: '🐧',
    color: '#1C3B5E',
    lightColor: '#4A90E2',
    description: 'Frío pero amigable, ¡te ayudará a mantener la calma!',
  },
  CAT: {
    id: 'cat',
    name: 'Gato',
    emoji: '🐱',
    color: '#F5A623',
    lightColor: '#FFD700',
    description: 'Curioso y ágil, perfecto para aprender rápido.',
  },
  RABBIT: {
    id: 'rabbit',
    name: 'Conejo',
    emoji: '🐰',
    color: '#E8A0BF',
    lightColor: '#F4C2C2',
    description: 'Saltarín y energético, ¡nunca te dejará rendirte!',
  },
  LION: {
    id: 'lion',
    name: 'León',
    emoji: '🦁',
    color: '#D4A017',
    lightColor: '#F4A460',
    description: 'Valiente y líder, ¡te hará sentir poderoso!',
  },
};

// Etapas de evolución
export const ETAPAS = {
  HUEVO: { id: 1, name: 'Huevo', emoji: '🥚', minPoints: 0, factor: 1 },
  BEBE: { id: 2, name: 'Bebé', emoji: '🐣', minPoints: 100, factor: 1.2 },
  JOVEN: { id: 3, name: 'Joven', emoji: '🌟', minPoints: 300, factor: 1.5 },
  ADULTO: { id: 4, name: 'Adulto', emoji: '⭐', minPoints: 600, factor: 2 },
  LEGENDARIO: { id: 5, name: 'Legendario', emoji: '✨', minPoints: 1000, factor: 3 },
};

// Frases motivadoras (20+)
export const FRASES = {
  // Frases de ánimo
  animo: [
    "¡Tú puedes! Cada paso cuenta 🚀",
    "No te rindas, el éxito está cerca 💪",
    "¡Qué orgullo verte crecer! 🌱",
    "Sigue así, vas por buen camino 🌟",
    "Hoy es un gran día para aprender algo nuevo 📚",
    "¡Eres increíble! No lo olvides 💖",
    "Cada error es una lección, sigue adelante 🎯",
    "¡WOW! Me dejas sin palabras 🤯",
    "Tu esfuerzo de hoy es el éxito de mañana ⏰",
    "¡Vamos por más! Tú puedes lograrlo 🔥",
  ],
  
  // Sugerencias de skills que faltan
  skill: [
    "¿Has visto tu roadmap? Te falta {skill} 👀",
    "¡Aprendamos {skill} juntos! Te va a encantar 📖",
    "{skill} está muy demandada en el mercado 💼",
    "Completar {skill} te dará +30 puntos 🎁",
    "¡Manos a la obra! {skill} te espera 🛠️",
  ],
  
  // Sugerencias de postulación
  postular: [
    "¡Hay un nuevo empleo que te queda perfecto! 👔",
    "¿Ya viste las ofertas de hoy? Hay una para ti 💼",
    "¡Postúlate ya! No dejes pasar esta oportunidad 🎯",
    "Este trabajo busca alguien como tú ✨",
    "¡A por todas! Esta oferta te está esperando 🚀",
  ],
  
  // Sugerencias de publicar logro
  publicar: [
    "¡Cuéntale al mundo tu logro! Te dará +20 puntos 📢",
    "¿Terminaste algo nuevo? ¡Presume tu éxito! 🏆",
    "Tu progreso inspira a otros, ¡compártelo! 💬",
    "¡Un logro al día mantiene la racha viva! 🔥",
    "La comunidad quiere saber de ti, ¡publica algo! 📝",
  ],
  
  // Reacciones a racha
  racha: [
    "¡{streak} días seguidos! Eres imparable 🔥",
    "Racha de {streak} días, ¡qué máquina! 💪",
    "¡Llevas {streak} días brillando! ✨",
    "Tu constancia es inspiradora, {streak} días 🏆",
  ],
  
  // Al subir de nivel
  nivel: [
    "¡EVOLUCIONASTE! Ahora soy más fuerte contigo 🦸",
    "Nivel {level} alcanzado, ¡vamos por más! 🎉",
    "Tu dedicación me hace crecer, gracias 🌈",
    "¡SIGAMOS! El próximo nivel te espera 🚀",
  ],
};

// Emojis por etapa y mascota
export const getMascotaEmoji = (tipo, etapa) => {
  const emojis = {
    [MASCOTAS.PENGUIN.id]: {
      [ETAPAS.HUEVO.id]: '🥚',
      [ETAPAS.BEBE.id]: '🐧',
      [ETAPAS.JOVEN.id]: '🐧',
      [ETAPAS.ADULTO.id]: '🐧',
      [ETAPAS.LEGENDARIO.id]: '👑🐧',
    },
    [MASCOTAS.CAT.id]: {
      [ETAPAS.HUEVO.id]: '🥚',
      [ETAPAS.BEBE.id]: '🐱',
      [ETAPAS.JOVEN.id]: '😺',
      [ETAPAS.ADULTO.id]: '😸',
      [ETAPAS.LEGENDARIO.id]: '👑🐱',
    },
    [MASCOTAS.RABBIT.id]: {
      [ETAPAS.HUEVO.id]: '🥚',
      [ETAPAS.BEBE.id]: '🐰',
      [ETAPAS.JOVEN.id]: '🐇',
      [ETAPAS.ADULTO.id]: '🐇',
      [ETAPAS.LEGENDARIO.id]: '👑🐰',
    },
    [MASCOTAS.LION.id]: {
      [ETAPAS.HUEVO.id]: '🥚',
      [ETAPAS.BEBE.id]: '🦁',
      [ETAPAS.JOVEN.id]: '🦁',
      [ETAPAS.ADULTO.id]: '🦁',
      [ETAPAS.LEGENDARIO.id]: '👑🦁',
    },
  };
  return emojis[tipo]?.[etapa] || '🥚';
};

// Generar frase aleatoria
export const getRandomFrase = (categoria, params = {}) => {
  const frasesCategoria = FRASES[categoria] || FRASES.animo;
  let frase = frasesCategoria[Math.floor(Math.random() * frasesCategoria.length)];
  
  // Reemplazar placeholders
  Object.keys(params).forEach(key => {
    frase = frase.replace(`{${key}}`, params[key]);
  });
  
  return frase;
};