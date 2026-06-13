// mascotaData.js

export const MASCOTAS = {
  PENGUIN: {
    id: 'penguin',
    name: 'Pingüino',
    emoji: '🐧',
    color: '#1C3B5E',
    description: 'Frío pero amigable, ¡te ayudará a mantener la calma!',
  },
  CAT: {
    id: 'cat',
    name: 'Gato',
    emoji: '🐱',
    color: '#F5A623',
    description: 'Curioso y ágil, perfecto para aprender rápido.',
  },
  RABBIT: {
    id: 'rabbit',
    name: 'Conejo',
    emoji: '🐰',
    color: '#E8A0BF',
    description: 'Saltarín y energético, ¡nunca te dejará rendirte!',
  },
  LION: {
    id: 'lion',
    name: 'León',
    emoji: '🦁',
    color: '#D4A017',
    description: 'Valiente y líder, ¡te hará sentir poderoso!',
  },
};

export const ETAPAS = {
  HUEVO: { id: 1, name: 'Huevo', emoji: '🥚', minPoints: 0, color: '#9CA3AF' },
  BEBE: { id: 2, name: 'Bebé', emoji: '🐣', minPoints: 100, color: '#F59E0B' },
  JOVEN: { id: 3, name: 'Joven', emoji: '🌟', minPoints: 300, color: '#5B34F2' },
  ADULTO: { id: 4, name: 'Adulto', emoji: '⭐', minPoints: 600, color: '#0F6C7A' },
  LEGENDARIO: { id: 5, name: 'Legendario', emoji: '✨', minPoints: 1000, color: '#F25F63' },
};

export const getMascotaEmoji = (tipo, etapaId) => {
  const emojis = {
    penguin: { 1: '🥚', 2: '🐧', 3: '🐧', 4: '🐧', 5: '👑🐧' },
    cat: { 1: '🥚', 2: '🐱', 3: '😺', 4: '😸', 5: '👑🐱' },
    rabbit: { 1: '🥚', 2: '🐰', 3: '🐇', 4: '🐇', 5: '👑🐰' },
    lion: { 1: '🥚', 2: '🦁', 3: '🦁', 4: '🦁', 5: '👑🦁' },
  };
  return emojis[tipo]?.[etapaId] || '🥚';
};

export const FRASES = {
  animo: [
    "¡Tú puedes! Cada paso cuenta 🚀",
    "No te rindas, el éxito está cerca 💪",
    "¡Qué orgullo verte crecer! 🌱",
    "Sigue así, vas por buen camino 🌟",
    "¡Eres increíble! 💖",
  ],
  racha: [
    "¡{streak} días seguidos! 🔥",
    "Racha de {streak} días, ¡qué máquina! 💪",
  ],
  nivel: [
    "¡EVOLUCIONASTE al nivel {level}! 🎉",
    "¡Vamos por más! 🚀",
  ],
  postular: [
    "¡Hay un nuevo empleo para ti! 👔",
    "¡Postúlate ya! 🎯",
  ],
  publicar: [
    "¡Comparte tu logro! 📢",
    "¡Presume tu éxito! 🏆",
  ],
};

export const getRandomFrase = (categoria, params = {}) => {
  const frasesCategoria = FRASES[categoria] || FRASES.animo;
  let frase = frasesCategoria[Math.floor(Math.random() * frasesCategoria.length)];
  Object.keys(params).forEach(key => {
    frase = frase.replace(`{${key}}`, params[key]);
  });
  return frase;
};