import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MascotaContext = createContext();

// Niveles de evolución
const LEVELS = [
  { id: 1, name: 'HuevOn', minPoints: 0, image: '🥚', color: '#FFD700', emoji: '🥚', evolutionMessage: '¡Tu huevo necesita calor! Sigue participando.' },
  { id: 2, name: 'Learning', minPoints: 100, image: '🐣', color: '#FFA500', emoji: '🐣', evolutionMessage: '¡Ha nacido Learning! Tu dedicación está dando frutos.' },
  { id: 3, name: 'SkillBird', minPoints: 300, image: '🐦', color: '#5B34F2', emoji: '🐦', evolutionMessage: '¡SkillBird ha crecido! Sigue así, vas por buen camino.' },
  { id: 4, name: 'CareerOn', minPoints: 600, image: '🦉', color: '#0F6C7A', emoji: '🦉', evolutionMessage: '¡CareerOn es un sabio! Tu esfuerzo te está llevando lejos.' },
  { id: 5, name: 'MasterFénix', minPoints: 1000, image: '🔥', color: '#F25F63', emoji: '🔥', evolutionMessage: '¡LEYENDA! MasterFénix ha renacido. Eres un ejemplo.' },
];

export function MascotaProvider({ children }) {
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastActionDate, setLastActionDate] = useState(null);
  const [dailyActions, setDailyActions] = useState({
    post: false,
    apply: 0,
    interview: 0,
  });
  const [showEvolution, setShowEvolution] = useState(false);
  const [evolutionMessage, setEvolutionMessage] = useState('');

  // Cargar datos guardados
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedPoints = await AsyncStorage.getItem('@mascota_points');
      const savedStreak = await AsyncStorage.getItem('@mascota_streak');
      const savedDate = await AsyncStorage.getItem('@mascota_lastDate');
      const savedDaily = await AsyncStorage.getItem('@mascota_daily');

      if (savedPoints) setPoints(parseInt(savedPoints));
      if (savedStreak) setStreak(parseInt(savedStreak));
      if (savedDate) setLastActionDate(savedDate);
      if (savedDaily) setDailyActions(JSON.parse(savedDaily));

      // Verificar racha diaria
      checkStreak();
    } catch (error) {
      console.log('Error loading mascota data:', error);
    }
  };

  const checkStreak = () => {
    const today = new Date().toDateString();
    if (lastActionDate !== today) {
      // Resetear acciones diarias
      setDailyActions({ post: false, apply: 0, interview: 0 });
    }
  };

  const saveData = async (newPoints, newStreak, newDaily) => {
    try {
      await AsyncStorage.setItem('@mascota_points', newPoints.toString());
      await AsyncStorage.setItem('@mascota_streak', newStreak.toString());
      await AsyncStorage.setItem('@mascota_lastDate', new Date().toDateString());
      await AsyncStorage.setItem('@mascota_daily', JSON.stringify(newDaily));
    } catch (error) {
      console.log('Error saving mascota data:', error);
    }
  };

  const checkEvolution = (oldPoints, newPoints) => {
    const oldLevel = LEVELS.filter(l => oldPoints >= l.minPoints).pop() || LEVELS[0];
    const newLevel = LEVELS.filter(l => newPoints >= l.minPoints).pop() || LEVELS[0];
    
    if (newLevel.id > oldLevel.id) {
      setEvolutionMessage(newLevel.evolutionMessage);
      setShowEvolution(true);
      setTimeout(() => setShowEvolution(false), 5000);
    }
  };

  const addPoints = async (action, amount) => {
    const today = new Date().toDateString();
    let canAdd = true;
    let newDaily = { ...dailyActions };
    let newPoints = points;
    let newStreak = streak;

    // Validar límites diarios
    switch (action) {
      case 'post':
        if (dailyActions.post) canAdd = false;
        else newDaily.post = true;
        break;
      case 'apply':
        if (dailyActions.apply >= 3) canAdd = false;
        else newDaily.apply += 1;
        break;
      case 'interview':
        if (dailyActions.interview >= 2) canAdd = false;
        else newDaily.interview += 1;
        break;
    }

    if (canAdd) {
      newPoints += amount;
      
      // Actualizar racha si es primera acción del día
      if (lastActionDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActionDate === yesterday.toDateString()) {
          newStreak += 1;
          // Bonus por racha
          newPoints += 10;
        } else {
          newStreak = 1;
        }
        setLastActionDate(today);
      }
      
      setPoints(newPoints);
      setStreak(newStreak);
      setDailyActions(newDaily);
      saveData(newPoints, newStreak, newDaily);
      checkEvolution(points, newPoints);
      
      return { success: true, newPoints, newStreak };
    }
    
    return { success: false, message: 'Límite diario alcanzado' };
  };

  const getCurrentLevel = () => {
    return LEVELS.filter(l => points >= l.minPoints).pop() || LEVELS[0];
  };

  const getNextLevel = () => {
    const current = getCurrentLevel();
    return LEVELS.find(l => l.id === current.id + 1);
  };

  const pointsToNextLevel = () => {
    const next = getNextLevel();
    if (!next) return 0;
    return next.minPoints - points;
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progressToNext = nextLevel ? (points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints) * 100 : 100;

  return (
    <MascotaContext.Provider value={{
      points,
      streak,
      currentLevel,
      nextLevel,
      progressToNext,
      pointsToNextLevel: pointsToNextLevel(),
      addPoints,
      showEvolution,
      evolutionMessage,
      setShowEvolution,
      dailyActions,
    }}>
      {children}
    </MascotaContext.Provider>
  );
}

export const useMascota = () => useContext(MascotaContext);