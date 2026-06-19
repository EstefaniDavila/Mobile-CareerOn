import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Text, View, Animated, StyleSheet, Image, Dimensions, Modal, PanResponder } from 'react-native';
import { useMascota } from './MascotaProvider';
import MascotaModal from './MascotaModal';
import MascotaSelector from './MascotaSelector';

const { width } = Dimensions.get('window');

export default function MascotaIcon() {
  const { 
    hasSelectedMascota, 
    selectedMascota, 
    currentEmoji, 
    currentImage,
    currentEtapa,
    streak, 
    progressToNext,
    bestMatchJob,
    jobsDialogTrigger,
    applicationsDialogTrigger,
    applicationsStats,
    iaDialogTrigger,
    skillsDialogTrigger,
    userName,
    generarFrase,
    currentMessage,
    celebration,
    mascotaStatus,
    sleepMascota,
  } = useMascota();
  
  const [showModal, setShowModal] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleMessages, setBubbleMessages] = useState([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [currentDialogType, setCurrentDialogType] = useState(null);

  const bounceAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;
  
  // Animaciones de celebración
  const celebScaleAnim = useRef(new Animated.Value(0)).current;
  const celebSpinAnim = useRef(new Animated.Value(0)).current;

  // Animaciones de arrastre
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Solo iniciar el arrastre si se mueve más de 5 píxeles (para no interferir con los toques)
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      }
    })
  ).current;

  useEffect(() => {
    // Animación de flotar (arriba y abajo)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 1500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    // Animación de respirar (escalado suave tipo Duolingo)
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
        Animated.timing(breatheAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (mascotaStatus === 'sleeping') return;
    // Si se disparó el evento de la pantalla de empleos
    if (jobsDialogTrigger > 0 && bestMatchJob) {
      const intros = [
        `¡Hola ${userName || ''}! Bienvenida de nuevo 👋`,
        `¡Oh, volviste ${userName || ''}! Continuemos viendo empleos.`,
        `¿Lista para seguir buscando tu trabajo ideal, ${userName || ''}? 🚀`,
        `¡Qué gusto verte por aquí de nuevo, ${userName || ''}!`
      ];
      const randomIntro = intros[Math.floor(Math.random() * intros.length)];
      
      setBubbleMessages([
        randomIntro,
        "Vamos a ver qué tenemos de empleos hoy para ti...",
        `¡Te recomiendo este empleo de ${bestMatchJob.title} en ${bestMatchJob.company} porque se enfoca perfecto en tu carrera! 🚀`
      ]);
      setMessageIndex(0);
      setCurrentDialogType('jobs');
      setShowBubble(true);
    }
  }, [jobsDialogTrigger, bestMatchJob, userName, mascotaStatus]);

  useEffect(() => {
    if (mascotaStatus === 'sleeping') return;
    // Si se disparó el evento de la pantalla de aplicaciones
    if (applicationsDialogTrigger > 0 && applicationsStats) {
      let mensajeFinal = "Sigue aplicando y mejorando tus habilidades. ¡Pronto lo lograrás! 💪";
      
      if (applicationsStats.won > 0) {
        mensajeFinal = `¡Tienes ${applicationsStats.won} ${applicationsStats.won === 1 ? 'puesto' : 'puestos'} como GANADOR! 🎉 ¡Felicidades!`;
        if (applicationsStats.review > 0) {
          mensajeFinal += ` Y tienes ${applicationsStats.review} en revisión.`;
        }
      } else if (applicationsStats.review > 0) {
        mensajeFinal = `Tienes ${applicationsStats.review} ${applicationsStats.review === 1 ? 'postulación' : 'postulaciones'} en revisión. ¡Mucha suerte! 🤞`;
      } else if (applicationsStats.lost > 0) {
        mensajeFinal = "Oye, no te desanimes. Cada rechazo es una oportunidad para mejorar tus habilidades. ¡Pronto avanzarás! 🚀";
      }

      const intros = [
        `¡Hola ${userName || ''}! Veamos cómo van tus postulaciones...`,
        `¡De vuelta a tus postulaciones, ${userName || ''}! Veamos si hay suerte hoy 🍀`,
        `Revisando el estatus de tus aplicaciones... ¡Mucha suerte, ${userName || ''}!`
      ];
      const randomIntro = intros[Math.floor(Math.random() * intros.length)];

      setBubbleMessages([
        randomIntro,
        mensajeFinal
      ]);
      setMessageIndex(0);
      setCurrentDialogType('applications');
      setShowBubble(true);
    }
  }, [applicationsDialogTrigger, applicationsStats, userName, mascotaStatus]);

  useEffect(() => {
    if (mascotaStatus === 'sleeping') return;
    // Si se disparó el evento de la pantalla de IA
    if (iaDialogTrigger > 0) {
      const intros = [
        `¡Bienvenida al Coach de IA, ${userName || ''}! 🤖`,
        `¡Hola de nuevo ${userName || ''}! ¿Lista para prepararte con IA? 🚀`,
        `¡De vuelta con tu Coach personal! ¿En qué te ayudo hoy, ${userName || ''}?`
      ];
      const randomIntro = intros[Math.floor(Math.random() * intros.length)];

      setBubbleMessages([
        randomIntro,
        "Aquí puedes optimizar tu CV para que resalte más...",
        "O puedes hacer entrevistas simuladas conmigo. ¡Vamos a prepararte para triunfar! 🚀"
      ]);
      setMessageIndex(0);
      setCurrentDialogType('ia');
      setShowBubble(true);
    }
  }, [iaDialogTrigger, userName, mascotaStatus]);

  useEffect(() => {
    if (mascotaStatus === 'sleeping') return;
    // Si se disparó el evento de la pantalla de Skills
    if (skillsDialogTrigger > 0) {
      const intros = [
        `¡Hola ${userName || ''}! Bienvenida a tu zona de aprendizaje 📚`,
        `¡Excelente decisión volver a estudiar, ${userName || ''}! 🧠`,
        `¿Lista para ganar más monedas aprendiendo, ${userName || ''}? 🪙`
      ];
      const randomIntro = intros[Math.floor(Math.random() * intros.length)];

      setBubbleMessages([
        randomIntro,
        "Aquí puedes completar cursos interactivos y retos técnicos.",
        "¡Recuerda que cada reto y clase que termines te dará 20 monedas reales! 🪙 Empieza a aprender ya."
      ]);
      setMessageIndex(0);
      setCurrentDialogType('skills');
      setShowBubble(true);
    }
  }, [skillsDialogTrigger, userName, mascotaStatus]);

  useEffect(() => {
    if (!hasSelectedMascota || mascotaStatus === 'sleeping') return;
    
    const interval = setInterval(() => {
      if (!showBubble) {
        const frase = generarFrase();
        setBubbleMessages([frase]);
        setMessageIndex(0);
        setCurrentDialogType('random');
        setShowBubble(true);
        setTimeout(() => setShowBubble(false), 5000); // 5 segundos para auto-cerrar frases normales
      }
    }, 45000);
    
    return () => clearInterval(interval);
  }, [hasSelectedMascota, showBubble, mascotaStatus]);

  useEffect(() => {
    if (mascotaStatus === 'sleeping') {
      setBubbleMessages([`¡Hola ${userName || 'Abigail'}, bienvenido! No olvides despertarme para ayudarte.`]);
      setMessageIndex(0);
      setCurrentDialogType('context');
      setShowBubble(true);
    } else if (mascotaStatus === 'normal' && currentDialogType === 'context') {
      setShowBubble(false);
    }
  }, [mascotaStatus, userName, currentDialogType]);

  // Manejar animación de celebración
  useEffect(() => {
    if (celebration?.visible) {
      celebScaleAnim.setValue(0);
      celebSpinAnim.setValue(0);
      
      Animated.parallel([
        Animated.spring(celebScaleAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
        Animated.loop(
          Animated.timing(celebSpinAnim, { toValue: 1, duration: 2000, useNativeDriver: true })
        )
      ]).start();
    } else {
      celebScaleAnim.setValue(0);
      celebSpinAnim.setValue(0);
    }
  }, [celebration?.visible]);

  const spin = celebSpinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  useEffect(() => {
    if (currentMessage) {
      const textToShow = currentMessage && typeof currentMessage === 'object' ? currentMessage.text : currentMessage;
      const keepOpen = currentMessage && typeof currentMessage === 'object' ? currentMessage.keepOpen : false;
      
      setBubbleMessages([textToShow]);
      setMessageIndex(0);
      setCurrentDialogType('context');
      setShowBubble(true);
      
      if (!keepOpen) {
        const timer = setTimeout(() => setShowBubble(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentMessage]);

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(bounceAnim, { toValue: 1.2, useNativeDriver: true, friction: 3 }),
      Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true, friction: 3 }),
    ]).start();
    setShowModal(true);
  };

  const handleNextMessage = () => {
    if (messageIndex < bubbleMessages.length - 1) {
      setMessageIndex(messageIndex + 1);
    } else {
      setShowBubble(false);
      
      // Si está dormida, al hacer clic en Despertar, la despertamos
      if (mascotaStatus === 'sleeping') {
        sleepMascota();
      }
      
      // Si fue el mensaje de match de empleo, disparar evento para ir a verlo
      if (currentDialogType === 'jobs' && bestMatchJob) {
        import('react-native').then(rn => {
          rn.DeviceEventEmitter.emit('openBestMatchJob', bestMatchJob);
        });
      }
    }
  };

  const isLastMatchMessage = messageIndex === bubbleMessages.length - 1 && currentDialogType === 'jobs';

  if (!hasSelectedMascota || !selectedMascota) {
    return <MascotaSelector visible={true} onComplete={() => {}} />;
  }

  return (
    <>
      <Animated.View 
        style={[
          styles.container, 
          { transform: [{ translateX: pan.x }, { translateY: pan.y }] }
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={styles.touchableWrap}>
          {showBubble && bubbleMessages.length > 0 && (
            <Animated.View style={[styles.bubble, { transform: [{ scale: bounceAnim }] }]}>
              <Text style={styles.bubbleText}>{bubbleMessages[messageIndex]}</Text>
              
              {(bubbleMessages.length > 1 || (currentDialogType === 'context' && currentMessage && typeof currentMessage === 'object' && currentMessage.keepOpen) || mascotaStatus === 'sleeping') && (
                <TouchableOpacity onPress={handleNextMessage} style={styles.nextButton}>
                  <Text style={styles.nextButtonText}>
                    {messageIndex < bubbleMessages.length - 1 
                      ? "Siguiente ➔" 
                      : (isLastMatchMessage 
                          ? "Ir a ver ➔" 
                          : (mascotaStatus === 'sleeping' ? "Despertar ☀️" : "Cerrar ✖"))}
                  </Text>
                </TouchableOpacity>
              )}
              
              <View style={styles.bubbleArrow} />
            </Animated.View>
          )}

          <Animated.View style={{ transform: [{ translateY: floatAnim }, { scale: bounceAnim }, { scaleX: breatheAnim }, { scaleY: breatheAnim }] }}>
            {currentImage ? (
              <Image 
                source={currentImage} 
                style={styles.mascotImage} 
                resizeMode="contain"
              />
            ) : (
              <View style={[styles.circle, { backgroundColor: selectedMascota.color + '20' }]}>
                <Text style={styles.emoji}>{currentEmoji}</Text>
              </View>
            )}
          </Animated.View>

          <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{currentEtapa?.id || 1}</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressToNext}%`, backgroundColor: selectedMascota.color }]} />
        </View>

          {streak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakText}>{streak}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      <MascotaModal visible={showModal} onClose={() => setShowModal(false)} />
      
      {/* Modal de Celebración Global */}
      <Modal visible={!!celebration?.visible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
          <Animated.View style={{ transform: [{ scale: celebScaleAnim }, { rotate: spin }], alignItems: 'center' }}>
             <View style={{ width: 180, height: 180, borderRadius: 90, backgroundColor: selectedMascota.color + '40', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 4, borderColor: selectedMascota.color }}>
               {currentImage ? (
                 <Image source={currentImage} style={{ width: 140, height: 140 }} resizeMode="contain" />
               ) : (
                 <Text style={{ fontSize: 100 }}>{currentEmoji}</Text>
               )}
             </View>
          </Animated.View>
          <Animated.View style={{ transform: [{ scale: celebScaleAnim }], alignItems: 'center' }}>
             <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 2, height: 2}, textShadowRadius: 10, textAlign: 'center' }}>
               ¡FELICIDADES! 🎉
             </Text>
             <Text style={{ color: '#FCD34D', fontSize: 28, fontWeight: 'bold', marginTop: 15, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 5 }}>
               +20 🪙
             </Text>
             <Text style={{ color: 'white', fontSize: 18, marginTop: 10 }}>
               ¡Sigue aprendiendo y mejorando!
             </Text>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 110,
    right: 12,
    zIndex: 1000,
  },
  touchableWrap: {
    alignItems: 'center',
  },
  mascotImage: {
    width: 60,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  circle: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  emoji: {
    fontSize: 32,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  progressBar: {
    width: 50,
    height: 3,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  streakBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    gap: 2,
  },
  streakEmoji: {
    fontSize: 10,
  },
  streakText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bubble: {
    position: 'absolute',
    top: 5,
    right: 70, 
    backgroundColor: '#1F2937',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: 250, // Forzamos un ancho fijo más amplio
    justifyContent: 'center',
  },
  bubbleText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'left', // Alineación izquierda para mayor legibilidad
    lineHeight: 18,
  },
  bubbleArrow: {
    position: 'absolute',
    right: -8,
    top: '50%',
    marginTop: -8,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#1F2937',
  },
  nextButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});