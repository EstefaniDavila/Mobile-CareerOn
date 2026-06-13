// MascotaProvider.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MASCOTAS, ETAPAS, getMascotaEmoji, getRandomFrase } from './mascotaData';

const MascotaContext = createContext();

export function MascotaProvider({ children }) {
  // Estado de la mascota
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastActionDate, setLastActionDate] = useState(null);
  const [dailyActions, setDailyActions] = useState({
    post: false,
    apply: 0,
    interview: 0,
    course: 0,
    skill: 0,
  });
  const [showEvolution, setShowEvolution] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [hasSelectedMascota, setHasSelectedMascota] = useState(false);

  // Cargar datos guardados
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedMascota = await AsyncStorage.getItem('@mascota_selected');
      const savedPoints = await AsyncStorage.getItem('@mascota_points');
      const savedStreak = await AsyncStorage.getItem('@mascota_streak');
      const savedDate = await AsyncStorage.getItem('@mascota_lastDate');
      const savedDaily = await AsyncStorage.getItem('@mascota_daily');
      const savedSelected = await AsyncStorage.getItem('@mascota_hasSelected');

      if (savedMascota) setSelectedMascota(JSON.parse(savedMascota));
      if (savedPoints) setPoints(parseInt(savedPoints));
      if (savedStreak) setStreak(parseInt(savedStreak));
      if (savedDate) setLastActionDate(savedDate);
      if (savedDaily) setDailyActions(JSON.parse(savedDaily));
      if (savedSelected) setHasSelectedMascota(JSON.parse(savedSelected));

      checkStreak();
    } catch (error) {
      console.log('Error loading mascota data:', error);
    }
  };

  const checkStreak = () => {
    const today = new Date().toDateString();
    if (lastActionDate !== today) {
      setDailyActions({ post: false, apply: 0, interview: 0, course: 0, skill: 0 });
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('@mascota_points', points.toString());
      await AsyncStorage.setItem('@mascota_streak', streak.toString());
      await AsyncStorage.setItem('@mascota_lastDate', new Date().toDateString());
      await AsyncStorage.setItem('@mascota_daily', JSON.stringify(dailyActions));
      if (selectedMascota) {
        await AsyncStorage.setItem('@mascota_selected', JSON.stringify(selectedMascota));
      }
      await AsyncStorage.setItem('@mascota_hasSelected', JSON.stringify(hasSelectedMascota));
    } catch (error) {
      console.log('Error saving mascota data:', error);
    }
  };

  const seleccionarMascota = async (tipo) => {
    const nuevaMascota = {
      tipo: tipo.id,
      nombre: tipo.name,
      emoji: tipo.emoji,
      color: tipo.color,
    };
    setSelectedMascota(nuevaMascota);
    setHasSelectedMascota(true);
    await saveData();
    
    // Mostrar mensaje de bienvenida
    setCurrentMessage({
      text: `¡Soy ${tipo.name}! Cuidaré de ti en tu camino laboral 🎉`,
      type: 'welcome',
    });
    setTimeout(() => setCurrentMessage(null), 5000);
  };

  const getCurrentEtapa = () => {
    const etapasList = Object.values(ETAPAS);
    return etapasList.filter(e => points >= e.minPoints).pop() || ETAPAS.HUEVO;
  };

  const getCurrentEmoji = () => {
    if (!selectedMascota) return '🥚';
    const etapa = getCurrentEtapa();
    return getMascotaEmoji(selectedMascota.tipo, etapa.id);
  };

  const checkEvolution = (oldPoints) => {
    const oldEtapa = Object.values(ETAPAS).filter(e => oldPoints >= e.minPoints).pop() || ETAPAS.HUEVO;
    const newEtapa = getCurrentEtapa();
    
    if (newEtapa.id > oldEtapa.id) {
      setShowEvolution(true);
      setCurrentMessage({
        text: getRandomFrase('nivel', { level: newEtapa.name }),
        type: 'evolution',
      });
      setTimeout(() => setShowEvolution(false), 5000);
      setTimeout(() => setCurrentMessage(null), 6000);
    }
  };

  const addPoints = async (action, amount, metadata = {}) => {
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
      case 'course':
        if (dailyActions.course >= 2) canAdd = false;
        else newDaily.course += 1;
        break;
      case 'skill':
        if (dailyActions.skill >= 2) canAdd = false;
        else newDaily.skill += 1;
        break;
    }

    if (canAdd) {
      newPoints += amount;
      
      // Actualizar racha
      if (lastActionDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActionDate === yesterday.toDateString()) {
          newStreak += 1;
          newPoints += 10; // Bonus por racha
          
          // Mostrar mensaje de racha
          setCurrentMessage({
            text: getRandomFrase('racha', { streak: newStreak }),
            type: 'streak',
          });
          setTimeout(() => setCurrentMessage(null), 4000);
        } else {
          newStreak = 1;
        }
        setLastActionDate(today);
      }
      
      const oldPoints = points;
      setPoints(newPoints);
      setStreak(newStreak);
      setDailyActions(newDaily);
      saveData();
      checkEvolution(oldPoints);
      
      return { success: true, newPoints, newStreak };
    }
    
    return { success: false, message: 'Límite diario alcanzado' };
  };

  // Generar frase contextual
  const generarFrase = () => {
    const random = Math.random();
    const etapa = getCurrentEtapa();
    
    if (random < 0.3 && streak > 0) {
      return getRandomFrase('racha', { streak });
    } else if (random < 0.5) {
      return getRandomFrase('animo');
    } else if (random < 0.7) {
      return getRandomFrase('postular');
    } else if (random < 0.85) {
      return getRandomFrase('publicar');
    } else {
      return getRandomFrase('animo');
    }
  };

  const currentEtapa = getCurrentEtapa();
  const currentEmoji = getCurrentEmoji();
  const nextEtapa = Object.values(ETAPAS).find(e => e.id === currentEtapa.id + 1);
  const pointsToNext = nextEtapa ? nextEtapa.minPoints - points : 0;
  const progressToNext = nextEtapa ? (points - currentEtapa.minPoints) / (nextEtapa.minPoints - currentEtapa.minPoints) * 100 : 100;

  return (
    <MascotaContext.Provider value={{
      hasSelectedMascota,
      selectedMascota,
      points,
      streak,
      currentEtapa,
      nextEtapa,
      currentEmoji,
      pointsToNext,
      progressToNext,
      dailyActions,
      showEvolution,
      currentMessage,
      seleccionarMascota,
      addPoints,
      generarFrase,
      setCurrentMessage,
      MASCOTAS,
      ETAPAS,
    }}>
      {children}
    </MascotaContext.Provider>
  );
}

export const useMascota = () => useContext(MascotaContext);