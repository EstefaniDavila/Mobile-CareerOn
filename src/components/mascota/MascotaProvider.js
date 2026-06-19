// MascotaProvider.js
import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MASCOTAS, ETAPAS, getMascotaEmoji, getMascotaImage, getRandomFrase } from './mascotaData';
import studentService from '../../services/student';
import NetInfo from '@react-native-community/netinfo';

const MascotaContext = createContext();

// Mensajes inteligentes contextuales basados en datos reales del usuario
const MENSAJES_CONTEXTUALES = {
  alto_match: (score) => [
    `¡Wow! Hay un empleo con ${score}% de compatibilidad contigo 🔥`,
    `¡Este trabajo fue hecho para ti! ${score}% match IA 💜`,
    `¡No lo dejes escapar! ${score}% de compatibilidad 🎯`,
    `¡Tu perfil encaja perfecto con ese empleo! ${score}% 🌟`,
  ],
  monedas: (coins) => [
    `💰 Tienes ${coins} monedas. ¡Sigue así!`,
    `🪙 ${coins} monedas en el banco. ¡Imparable!`,
    `✨ ${coins} monedas acumuladas. ¡Tú puedes más!`,
  ],
  perfil_incompleto: [
    '📝 Completa tu perfil para mejores recomendaciones de IA',
    '✨ Un perfil completo = más matches perfectos para ti',
    '🎯 ¡Mejora tu perfil y el match IA subirá mucho!',
    '💡 Agrega más habilidades para destacar ante reclutadores',
  ],
  aplicaciones: (n) => [
    `💼 ¡Llevas ${n} aplicaciones hoy! ¡Así se hace!`,
    `🚀 ${n} postulaciones. ¡El trabajo ideal llegará!`,
    `🏆 ¡${n} aplicaciones! Eres muy activo/a hoy`,
  ],
  racha: (days) => [
    `🔥 ¡${days} días de racha! ¡Absolutamente imparable!`,
    `⚡ ¡Racha de ${days} días! ¡No te detengas ahora!`,
    `🔥 ${days} días seguidos. ¡Eres una máquina!`,
  ],
  animo: [
    '¡Eres un crack! Cada día estás más cerca de tu meta 💪',
    '¡Tu próximo trabajo te está esperando! 🌟',
    '¡Sigue así! El éxito está a la vuelta de la esquina 🎉',
    '¿Revisaste tus nuevas recomendaciones de hoy? 👀',
    '¡Completa tu perfil y verás más matches perfectos! ✨',
    '¡Cada aplicación te acerca más a tu empleo ideal! 🚀',
    '¡El esfuerzo de hoy es el éxito de mañana! 💫',
  ],
};

const getRandomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function MascotaProvider({ children }) {
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [hasSelectedMascota, setHasSelectedMascota] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isVideoDownloadEnabled, setIsVideoDownloadEnabled] = useState(false);

  // Datos REALES del usuario (leídos desde el backend vía AsyncStorage)
  const [realCoins, setRealCoins] = useState(0);
  const [realStreak, setRealStreak] = useState(0);
  const [realCareerScore, setRealCareerScore] = useState(0);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [userName, setUserName] = useState('');

  // Datos locales de sesión
  const [dailyActions, setDailyActions] = useState({
    post: false, apply: 0, interview: 0, course: 0, skill: 0,
  });
  const [showEvolution, setShowEvolution] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);

  // Contexto externo para mensajes inteligentes
  const [bestMatchJob, setBestMatchJob] = useState(null);
  const [jobsDialogTrigger, setJobsDialogTrigger] = useState(0);
  
  // Estados para la pantalla de postulaciones y IA
  const [applicationsDialogTrigger, setApplicationsDialogTrigger] = useState(0);
  const [applicationsStats, setApplicationsStats] = useState({ won: 0, review: 0, lost: 0 });
  const [iaDialogTrigger, setIaDialogTrigger] = useState(0);
  const [skillsDialogTrigger, setSkillsDialogTrigger] = useState(0);
  const [celebration, setCelebration] = useState({ visible: false, type: 'default' });

  const [mascotaStatus, setMascotaStatus] = useState('normal'); // 'normal', 'hungry', 'sleeping'

  // Efecto para calcular si tiene hambre basado en el tiempo o acciones
  useEffect(() => {
    if (mascotaStatus === 'sleeping') return; // No interrumpir el sueño
    // Si la racha es muy baja o faltan acciones, podríamos ponerle hambre
    if (dailyActions.apply === 0 && realStreak < 2) {
      setMascotaStatus('hungry');
    } else {
      setMascotaStatus('normal');
    }
  }, [dailyActions, realStreak, mascotaStatus]);
  const [appliedCount, setAppliedCount] = useState(0);
  
  const isInitialMount = useRef(true);

  useEffect(() => {
    loadData();
    
    // Escuchar el estado de red
    const unsubscribe = NetInfo.addEventListener(async state => {
      const isDemoOffline = await AsyncStorage.getItem('@is_demo_offline');
      if (isDemoOffline === 'true') {
        setIsOffline(true);
      } else {
        setIsOffline(!state.isConnected);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (isOffline) {
      setCurrentMessage({
        text: "¡Oops! Parece que perdimos la señal 📡. No te preocupes, puedes seguir explorando y guardaré tus postulaciones en mi mochila.",
        keepOpen: true
      });
    } else {
      syncOfflineQueue();
    }
  }, [isOffline]);

  const syncOfflineQueue = async () => {
    try {
      const queueStr = await AsyncStorage.getItem('@offline_queue_applications');
      if (queueStr) {
        const queue = JSON.parse(queueStr);
        if (queue.length > 0) {
          console.log("🔄 Sincronizando cola offline:", queue.length, "postulaciones");
          for (let jobId of queue) {
             await studentService.applyToJob(jobId);
          }
          await AsyncStorage.removeItem('@offline_queue_applications');
          
          if (!isVideoDownloadEnabled) {
            setCurrentMessage({
              text: `¡La conexión ha vuelto! He sincronizado ${queue.length} postulaciones que guardé en mi mochila 🎒. ¡Ah! Y recuerda activar la descarga de videos.`,
              keepOpen: true
            });
          } else {
            setCurrentMessage({
              text: `¡La conexión ha vuelto! He enviado tus ${queue.length} postulaciones pendientes 🎒✨.`,
              keepOpen: true
            });
          }
          return;
        }
      }
    } catch (e) {
      console.log("Error sincronizando cola offline:", e);
    }
    
    // Fallback normal si no había nada en la cola
    if (!isVideoDownloadEnabled) {
      setCurrentMessage({
        text: "¡Conexión restaurada! Oye, recuerda que puedes activar la descarga de videos para verlos sin internet.",
        keepOpen: true
      });
    } else {
      setCurrentMessage({
        text: "¡La conexión ha vuelto! Todo está sincronizado.",
        keepOpen: true
      });
    }
  };

  const toggleDemoOfflineMode = async (value) => {
    await AsyncStorage.setItem('@is_demo_offline', String(value));
    setIsOffline(value);
  };

  const loadData = async () => {
    try {
      const savedMascota = await AsyncStorage.getItem('@mascota_selected');
      const savedSelected = await AsyncStorage.getItem('@mascota_hasSelected');
      const videoConfig = await AsyncStorage.getItem('@video_download_enabled');
      
      if (videoConfig) {
        setIsVideoDownloadEnabled(videoConfig === 'true');
      }
      const savedDaily = await AsyncStorage.getItem('@mascota_daily');

      if (savedMascota) setSelectedMascota(JSON.parse(savedMascota));
      if (savedSelected) setHasSelectedMascota(JSON.parse(savedSelected));
      if (savedDaily) setDailyActions(JSON.parse(savedDaily));

      // Leer datos REALES del usuario (guardados en el login como fallback rápido)
      const userRaw = await AsyncStorage.getItem('@user');
      let localUser = null;
      if (userRaw) {
        localUser = JSON.parse(userRaw);
        setRealCoins(localUser.coins_balance || 0);
        setRealStreak(localUser.current_cycle || 0);
        setRealCareerScore(localUser.career_score || 0);
        setProfileCompleted(localUser.profile_completed || false);
        setUserName(localUser.name ? localUser.name.split(' ')[0] : '');
      }

      // Revisar flag de demo
      const isDemoOffline = await AsyncStorage.getItem('@is_demo_offline');
      if (isDemoOffline === 'true') {
        setIsOffline(true);
        return; // Evitar llamadas a red si es demo offline
      }

      // Sincronizar en background con la base de datos para tener la data más reciente
      try {
        const result = await studentService.getProfile();
        if (result.success && result.data && result.data.data) {
          const remoteUser = result.data.data.user;
          const remoteCoins = result.data.data.coins;
          
          if (remoteUser) {
            setRealCoins(remoteCoins || remoteUser.coins_balance || 0);
            setRealStreak(remoteUser.streak_count || remoteUser.current_cycle || 0);
            setRealCareerScore(remoteUser.career_score || 0);
            
            // Actualizar AsyncStorage para la próxima vez
            if (localUser) {
              const updatedUser = { ...localUser, ...remoteUser, coins_balance: remoteCoins };
              await AsyncStorage.setItem('@user', JSON.stringify(updatedUser));
            }
          }
        }
      } catch (apiError) {
        console.log('Error sincronizando perfil con backend (usando caché):', apiError);
      }

    } catch (error) {
      console.log('Error loading mascota data:', error);
    }
  };

  // Simular que la mascota le da hambre periódicamente
  useEffect(() => {
    if (!hasSelectedMascota) return;
    
    // Cada 40 segundos hay una probabilidad de que le dé hambre
    const hungerInterval = setInterval(() => {
      setMascotaStatus(currentStatus => {
        if (currentStatus === 'normal' && Math.random() < 0.4) {
          setCurrentMessage({
            text: '¡Gruarr! 🦁 Mi pancita hace ruido... ¡Tengo mucha hambre! ¿Me das de comer? 🍖',
            type: 'hunger',
            keepOpen: true
          });
          return 'hungry';
        }
        return currentStatus;
      });
    }, 40000);
    
    return () => clearInterval(hungerInterval);
  }, [hasSelectedMascota]);

  // Llamar después del login para refrescar los datos reales
  const refreshUserData = async () => {
    await loadData();
  };

  // Notificar a la mascota cuándo hay un empleo con match alto (desde JobsScreen)
  const notifyBestMatch = useCallback((job) => {
    setBestMatchJob(job);
    setJobsDialogTrigger(prev => prev + 1); // Forzar trigger de diálogo
  }, []);

  const notifyApplications = (data) => {
    if (isOffline) return; // No notificar si estamos offline
    if (data.won > 0) {
      setCurrentMessage("¡Felicidades! Tienes postulaciones ganadoras 🎉. ¡Tu perfil está brillando!");
    } else if (data.review > 0) {
      setCurrentMessage(`Tienes ${data.review} postulaciones en revisión o entrevista. ¡Mantente atento! 👀`);
    } else if (data.pending > 0) {
      setCurrentMessage(`Hay ${data.pending} postulaciones esperando. La paciencia es clave, ¡no te rindas! 💪`);
    } else if (data.lost > 0) {
      setCurrentMessage("No te desanimes por los rechazos. Cada 'no' te acerca al 'sí' correcto. ¡Sigue mejorando tu perfil! 🌟");
    }
  };

  const notifyOfflineQueued = () => {
    setCurrentMessage("¡No te preocupes! He guardado tu postulación en mi mochila 🎒. Apenas recuperemos la señal, la enviaré volando 🚀.");
  };

  // Notificar a la mascota que entró a la pantalla de IA
  const notifyIA = useCallback(() => {
    setIaDialogTrigger(prev => prev + 1);
  }, []);

  // Notificar a la mascota que entró a la pantalla de Skills
  const notifySkills = useCallback(() => {
    setSkillsDialogTrigger(prev => prev + 1);
  }, []);

  const triggerCelebration = useCallback((type = 'default') => {
    setCelebration({ visible: true, type });
    setTimeout(() => {
      setCelebration({ visible: false, type: 'default' });
    }, 3000); // Se oculta tras 3 segundos
  }, []);
  
  const toggleVideoDownload = async () => {
    const newVal = !isVideoDownloadEnabled;
    setIsVideoDownloadEnabled(newVal);
    await AsyncStorage.setItem('@video_download_enabled', newVal.toString());
    setCurrentMessage(newVal ? "¡Genial! A partir de ahora descargaré los videos para que los veas sin internet." : "Descarga de videos desactivada.");
  };

  // Notificar cuando el usuario aplica a un trabajo
  const notifyApplied = useCallback(() => {
    const newCount = appliedCount + 1;
    setAppliedCount(newCount);

    const newDaily = { ...dailyActions, apply: (dailyActions.apply || 0) + 1 };
    setDailyActions(newDaily);
    AsyncStorage.setItem('@mascota_daily', JSON.stringify(newDaily));

    // Mostrar mensaje cada 3 aplicaciones
    if (newCount % 3 === 0) {
      const msg = getRandomFrom(MENSAJES_CONTEXTUALES.aplicaciones(newCount));
      setCurrentMessage({ text: msg, type: 'apply' });
      setTimeout(() => setCurrentMessage(null), 4000);
    }
  }, [appliedCount, dailyActions]);

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('@mascota_daily', JSON.stringify(dailyActions));
      if (selectedMascota) {
        await AsyncStorage.setItem('@mascota_selected', JSON.stringify(selectedMascota));
      }
      await AsyncStorage.setItem('@mascota_hasSelected', JSON.stringify(hasSelectedMascota));
    } catch (error) {
      console.error("Error loading mascota data:", error);
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
    setCurrentMessage({
      text: `¡Soy ${tipo.name}! Cuidaré de ti en tu camino laboral 🎉`,
      type: 'welcome',
    });
    setTimeout(() => setCurrentMessage(null), 5000);
  };

  const updateMascotaName = async (newName) => {
    if (!selectedMascota) return;
    const updatedMascota = { ...selectedMascota, nombre: newName };
    setSelectedMascota(updatedMascota);
    await AsyncStorage.setItem('@mascota_selected', JSON.stringify(updatedMascota));
  };

  // La etapa de la mascota se basa en el career_score REAL del backend
  const getCurrentEtapa = () => {
    const points = realCareerScore + (dailyActions.apply * 5);
    const etapasList = Object.values(ETAPAS);
    return etapasList.filter(e => points >= e.minPoints).pop() || ETAPAS.HUEVO;
  };

  const getCurrentEmoji = () => {
    if (!selectedMascota) return '🥚';
    if (mascotaStatus === 'sleeping') return '😴';
    const etapa = getCurrentEtapa();
    return getMascotaEmoji(selectedMascota.tipo, etapa.id);
  };

  const getCurrentImage = () => {
    if (!selectedMascota) return null;
    const etapa = getCurrentEtapa();
    return getMascotaImage(selectedMascota.tipo, etapa.id, mascotaStatus);
  };

  // Generar frase inteligente usando datos reales del usuario
  const generarFrase = useCallback(() => {
    const random = Math.random();

    if (random < 0.20 && realStreak > 1) {
      return getRandomFrom(MENSAJES_CONTEXTUALES.racha(realStreak));
    } else if (random < 0.35 && bestMatchJob && bestMatchJob.match_score > 70) {
      return getRandomFrom(MENSAJES_CONTEXTUALES.alto_match(bestMatchJob.match_score));
    } else if (random < 0.50 && realCoins > 0) {
      return getRandomFrom(MENSAJES_CONTEXTUALES.monedas(realCoins));
    } else if (random < 0.65 && !profileCompleted) {
      return getRandomFrom(MENSAJES_CONTEXTUALES.perfil_incompleto);
    } else if (random < 0.80 && appliedCount > 0) {
      return getRandomFrom(MENSAJES_CONTEXTUALES.aplicaciones(appliedCount));
    } else {
      return getRandomFrom(MENSAJES_CONTEXTUALES.animo);
    }
  }, [realStreak, bestMatchJob, realCoins, profileCompleted, appliedCount]);

  // Actualizar monedas y score con valores absolutos
  const updateRewards = async (rewards) => {
    try {
      setRealCoins(rewards.coins_balance);
      setRealCareerScore(rewards.career_score);
      
      const userRaw = await AsyncStorage.getItem('@user');
      if (userRaw) {
        const user = JSON.parse(userRaw);
        user.coins_balance = rewards.coins_balance;
        user.career_score = rewards.career_score;
        await AsyncStorage.setItem('@user', JSON.stringify(user));
      }
    } catch (error) {
      console.log('Error saving rewards:', error);
    }
  };

  // Añadir monedas y score incrementalmente
  const addRewards = async (pointsToAdd, coinsToAdd) => {
    try {
      const newCoins = realCoins + coinsToAdd;
      const newScore = realCareerScore + pointsToAdd;
      
      setRealCoins(newCoins);
      setRealCareerScore(newScore);
      
      const userRaw = await AsyncStorage.getItem('@user');
      if (userRaw) {
        const user = JSON.parse(userRaw);
        user.coins_balance = newCoins;
        user.career_score = newScore;
        await AsyncStorage.setItem('@user', JSON.stringify(user));
      }
    } catch (error) {
      console.log('Error adding rewards:', error);
    }
  };

  // Interactividad: Alimentar
  const feedMascota = async () => {
    if (realCoins >= 10) {
      const newCoins = realCoins - 10;
      const newScore = realCareerScore + 10;
      
      setRealCoins(newCoins);
      setRealCareerScore(newScore);
      setMascotaStatus('normal'); // Ya no tiene hambre
      setCurrentMessage("¡Qué rico! 🍎 +10 XP");
      
      const userRaw = await AsyncStorage.getItem('@user');
      if (userRaw) {
        const user = JSON.parse(userRaw);
        user.coins_balance = newCoins;
        user.career_score = newScore;
        await AsyncStorage.setItem('@user', JSON.stringify(user));
      }
      return true;
    } else {
      setCurrentMessage('¡Necesitas 10 monedas para alimentarme! 🥺');
      return false;
    }
  };

  const spendCoins = async (amount) => {
    if (realCoins >= amount) {
      const newCoins = realCoins - amount;
      setRealCoins(newCoins);
      
      const userRaw = await AsyncStorage.getItem('@user');
      if (userRaw) {
        const user = JSON.parse(userRaw);
        user.coins_balance = newCoins;
        await AsyncStorage.setItem('@user', JSON.stringify(user));
      }
      return true;
    }
    return false;
  };

  // Interactividad: Dormir / Despertar (Toggle)
  const sleepMascota = async () => {
    if (mascotaStatus === 'sleeping') {
      // Despertar
      setMascotaStatus('normal');
      setCurrentMessage("¡Buenos días! ☀️ Estoy listo para ayudarte hoy.");
    } else {
      // Dormir
      setMascotaStatus('sleeping');
      setCurrentMessage({
        text: `¡Hola ${userName || 'Abigail'}, bienvenido! No olvides despertarme para ayudarte.`,
        keepOpen: true
      });
      const resetDaily = { apply: 0, login: true };
      setDailyActions(resetDaily);
      await AsyncStorage.setItem('@mascota_daily', JSON.stringify(resetDaily));
    }
  };

  const currentEtapa = getCurrentEtapa();
  const currentEmoji = getCurrentEmoji();
  const points = realCareerScore + (dailyActions.apply * 5);
  const nextEtapa = Object.values(ETAPAS).find(e => e.id === currentEtapa.id + 1);
  const pointsToNext = nextEtapa ? nextEtapa.minPoints - points : 0;
  const progressToNext = nextEtapa
    ? Math.min(((points - currentEtapa.minPoints) / (nextEtapa.minPoints - currentEtapa.minPoints)) * 100, 100)
    : 100;

  const value = {
      hasSelectedMascota,
      selectedMascota,
      points,
      streak: realStreak,
      coins: realCoins,
      careerScore: realCareerScore,
      profileCompleted,
      userName,
      currentEtapa,
      nextEtapa,
      currentEmoji,
      currentImage: getCurrentImage(),
      mascotaStatus,
      bestMatchJob,
      jobsDialogTrigger,
      applicationsDialogTrigger,
      applicationsStats,
      iaDialogTrigger,
      skillsDialogTrigger,
      pointsToNext,
      progressToNext,
      dailyActions,
      showEvolution,
      currentMessage,
      celebration,
      seleccionarMascota,
      updateMascotaName,
      generarFrase,
      setCurrentMessage,
      notifyBestMatch,
      notifyApplications,
      notifyIA,
      notifySkills,
      notifyApplied,
      notifyOfflineQueued,
      triggerCelebration,
      updateRewards,
      addRewards,
      refreshUserData,
      feedMascota,
      sleepMascota,
      spendCoins,
      MASCOTAS,
      ETAPAS,
      isOffline,
      isVideoDownloadEnabled,
      toggleVideoDownload,
      toggleDemoOfflineMode,
  };

  return (
    <MascotaContext.Provider value={value}>
      {children}
    </MascotaContext.Provider>
  );
}

export const useMascota = () => useContext(MascotaContext);