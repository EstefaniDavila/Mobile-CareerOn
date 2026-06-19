import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import * as Speech from "expo-speech";
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './components';
import challengeService from '../../../services/challenge';
import userChallengeService from '../../../services/userchallenge';
import { useMascota } from '../../../components/mascota/MascotaProvider';

export default function CourseModal({
  visible,
  selectedSkill,
  isLoading,
  onClose,
  onCompleteCourse,
}) {
  const { addRewards, setCurrentMessage, triggerCelebration, isOffline } = useMascota();
  const [challenges, setChallenges] = useState([]);
  const [loadingChallenges, setLoadingChallenges] = useState(false);
  const [completingChallengeId, setCompletingChallengeId] = useState(null);
  
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [courseView, setCourseView] = useState('overview'); // 'overview' | 'classes'
  
  const [completedClasses, setCompletedClasses] = useState([]);
  const [activeClass, setActiveClass] = useState(null);
  const [showClassModal, setShowClassModal] = useState(false);
  
  // Estados para simulación de video
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  // Estado para el mensaje local de la mascota dentro del modal
  const [localMascotMessage, setLocalMascotMessage] = useState(null);

  useEffect(() => {
    let interval;
    if (isVideoPlaying && videoProgress < 100) {
      interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setIsVideoPlaying(false);
            return 100;
          }
          return prev + 10; // Aumenta 10% cada 300ms (simula un video de 3 segundos)
        });
      }, 300);
    } else if (videoProgress >= 100) {
      setIsVideoPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying, videoProgress]);

  // Resetear video al abrir una clase
  useEffect(() => {
    if (showClassModal) {
      setVideoProgress(0);
      setIsVideoPlaying(false);
    }
  }, [showClassModal, activeClass]);

  useEffect(() => {
    if (visible && selectedSkill?.id) {
      loadChallenges(selectedSkill.id);
      loadCompletedClasses(selectedSkill.id);
    } else {
      setChallenges([]);
    }
  }, [visible, selectedSkill]);

  const loadCompletedClasses = async (skillId) => {
    try {
      const data = await AsyncStorage.getItem(`@completed_classes_${skillId}`);
      if (data) {
        setCompletedClasses(JSON.parse(data));
      } else {
        setCompletedClasses([]);
      }
    } catch (e) {
      console.log('Error loading completed classes:', e);
    }
  };

  const loadChallenges = async (skillId) => {
    setLoadingChallenges(true);
    try {
      const response = await challengeService.getChallengesBySkill(skillId);
      let loadedChallenges = response.data || [];
      if (loadedChallenges.length === 0) {
        // Retos dinámicos dependiendo de la tecnología
        const skillName = selectedSkill?.name || 'la tecnología';
        loadedChallenges = [
          {
            id: 'mock-1',
            title: `Fundamentos de ${skillName}`,
            description: `Mira un video corto y responde un cuestionario técnico.`,
            points: 50,
            completed: false,
            type: 'video_quiz',
            question: `¿Cuál de las siguientes es la principal ventaja de utilizar ${skillName}?`,
            correctAnswer: 0,
            options: [
              `Mejora la eficiencia y escalabilidad del proyecto`,
              `Solo sirve para cambiar el color de los botones`,
              `Hace que la computadora se caliente más rápido`
            ]
          },
          {
            id: 'mock-2',
            title: `Reto Práctico: Debugging`,
            description: `Encuentra el error en el bloque de código mostrado.`,
            points: 100,
            completed: false,
            type: 'code',
            question: `¿Qué línea causa un error fatal en este script de ${skillName}?`,
            correctAnswer: 1,
            options: [
              `Línea 1: Importaciones`,
              `Línea 14: Bucle infinito sin condición de salida`,
              `Línea 20: Fin del archivo`
            ]
          }
        ];
      }
      
      // Mapear completados locales
      try {
        const storedCompletedStr = await AsyncStorage.getItem(`@completed_challenges_${skillId}`);
        const storedCompletedIds = storedCompletedStr ? JSON.parse(storedCompletedStr) : [];
        
        loadedChallenges = loadedChallenges.map(c => {
          if (storedCompletedIds.includes(c.id)) {
            return { ...c, completed: true };
          }
          return c;
        });
      } catch (e) {
        console.log(e);
      }

      setChallenges(loadedChallenges);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingChallenges(false);
    }
  };

  const startChallenge = (challenge) => {
    setActiveChallenge(challenge);
    setShowChallengeModal(true);
  };

  const handleCompleteChallenge = async (challenge, selectedOptionIndex) => {
    if (selectedOptionIndex !== undefined && challenge.correctAnswer !== undefined) {
      if (selectedOptionIndex !== challenge.correctAnswer) {
        Alert.alert('❌ Incorrecto', 'Esa no es la respuesta correcta. Presta atención e intenta de nuevo.');
        return;
      }
    }

    setShowChallengeModal(false);
    setCompletingChallengeId(challenge.id);
    try {
      let success = true;
      let errorMsg = null;
      
      if (challenge.id.toString().startsWith('mock-')) {
        // Simular llamada para mocks
        await new Promise(r => setTimeout(r, 1000));
      } else {
        const response = await userChallengeService.completeChallenge(challenge.id);
        success = response.success;
        errorMsg = response.error;
      }
      
      if (success) {
        Alert.alert("🎉 Reto Superado", `¡Respuesta correcta! Has completado: ${challenge.title}.\n\nGanaste 20 🪙 monedas y ${challenge.points} XP de progreso.`);
        
        // Sumar monedas reales y aumentar progreso
        if (addRewards) {
          addRewards(challenge.points, 20); // Da 20 monedas como pidió el usuario
        }
        
        if (setCurrentMessage) {
          const offlineMsg = isOffline ? " No te preocupes, tus recompensas se actualizarán apenas te conectes." : "";
          setCurrentMessage(`¡Eres un genio! Resolviste el reto de ${selectedSkill?.name} y ganaste 20 monedas 🪙.${offlineMsg}`);
          Speech.speak(`¡Eres un genio! Resolviste el reto y ganaste 20 monedas.`, { language: 'es-ES', rate: 0.9 });
        }
        
        // Mostrar mensaje visual dentro del modal
        const offlineMsgLocal = isOffline ? "\nNo te preocupes, tus recompensas se actualizarán apenas te conectes." : "";
        setLocalMascotMessage(`¡Eres un genio! Resolviste el reto y ganaste 20 monedas 🪙${offlineMsgLocal}`);
        setTimeout(() => setLocalMascotMessage(null), 4000);
        
        // Disparar celebración global
        if (triggerCelebration) {
          triggerCelebration('challenge');
        }
        
        // Marcar mock como completado localmente si es mock
        if (challenge.id.toString().startsWith('mock-')) {
          setChallenges(prev => prev.map(c => c.id === challenge.id ? { ...c, completed: true } : c));
        } else {
          await loadChallenges(selectedSkill.id);
        }
        
        // Guardar persistencia local para todos los completados
        try {
          const stored = await AsyncStorage.getItem(`@completed_challenges_${selectedSkill.id}`);
          let ids = stored ? JSON.parse(stored) : [];
          if (!ids.includes(challenge.id)) {
            ids.push(challenge.id);
            await AsyncStorage.setItem(`@completed_challenges_${selectedSkill.id}`, JSON.stringify(ids));
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        Alert.alert("Error", errorMsg || "No se pudo completar el reto");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCompletingChallengeId(null);
    }
  };

  const handleCompleteClass = async () => {
    if (activeClass && !completedClasses.includes(activeClass.num)) {
      const newClasses = [...completedClasses, activeClass.num];
      setCompletedClasses(newClasses);
      
      try {
        await AsyncStorage.setItem(`@completed_classes_${selectedSkill.id}`, JSON.stringify(newClasses));
      } catch (e) {
        console.log(e);
      }

      if (newClasses.length >= 5 && onCompleteCourse) {
        onCompleteCourse(selectedSkill.id, selectedSkill.name);
      }

      if (addRewards) {
        addRewards(10, 20); // 10 puntos de exp, 20 monedas por clase
      }
      
      if (setCurrentMessage) {
        const offlineMsg = isOffline ? " No te preocupes, tus recompensas se actualizarán apenas te conectes." : "";
        setCurrentMessage(`¡Excelente! Has terminado la clase ${activeClass.num}. ¡Toma tus 20 monedas! 🪙${offlineMsg}`);
        Speech.speak(`¡Excelente! Has terminado la clase. Toma tus 20 monedas.`, { language: 'es-ES', rate: 0.9 });
      }
      
      // Mostrar mensaje visual dentro del modal
      const offlineMsgLocal = isOffline ? "\nNo te preocupes, tus recompensas se actualizarán apenas te conectes." : "";
      setLocalMascotMessage(`¡Excelente! Has terminado la clase ${activeClass.num}. ¡Toma tus 20 monedas! 🪙${offlineMsgLocal}`);
      setTimeout(() => setLocalMascotMessage(null), 4000);
      
      // Disparar celebración global
      if (triggerCelebration) {
        triggerCelebration('class');
      }
    }
    setShowClassModal(false);
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.courseModal}>
          <View style={styles.modalHeader}>
            {courseView === 'classes' ? (
              <TouchableOpacity onPress={() => setCourseView('overview')} style={{ marginRight: 10 }}>
                <Text style={{ fontSize: 24, color: 'white' }}>←</Text>
              </TouchableOpacity>
            ) : null}
            <Text style={styles.modalTitle}>
              {courseView === 'classes' ? 'Clases del Curso' : `Aprender ${selectedSkill?.name}`}
            </Text>

            <TouchableOpacity onPress={() => { setCourseView('overview'); onClose(); }}>
              <Text style={styles.closeModal}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {courseView === 'overview' ? (
              <>
                <View style={{ backgroundColor: '#FFFBEB', padding: 12, borderRadius: 12, marginBottom: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#FDE68A' }}>
                   <Text style={{ fontSize: 24, marginRight: 10 }}>🏆</Text>
                   <View style={{ flex: 1 }}>
                     <Text style={{ fontWeight: 'bold', color: '#B45309', fontSize: 15 }}>Recompensa del Curso</Text>
                     <Text style={{ color: '#D97706', fontSize: 13 }}>Completa todas las clases y retos para ganar hasta 200 monedas.</Text>
                   </View>
                </View>
                
                <View style={styles.skillInfoModal}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Demanda</Text>

                <View style={styles.infoDemandBar}>
                  <View
                    style={[
                      styles.infoDemandFill,
                      {
                        width: `${selectedSkill?.demandPercent || 85}%`,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.infoDemandValue}>
                  {selectedSkill?.demand || "Alta"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Duración</Text>
                <Text style={styles.infoValue}>
                  ⏱️ {selectedSkill?.duration || "4 semanas"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nivel</Text>
                <Text style={styles.infoValue}>
                  📊 {selectedSkill?.level || "Principiante"}
                </Text>
              </View>
            </View>

            <Text style={styles.coursesTitle}>
              Cursos recomendados
            </Text>

            <View style={styles.courseCard}>
              <View>
                <Text style={styles.courseName}>
                  {selectedSkill?.name} desde Cero
                </Text>

                <Text style={styles.coursePlatform}>
                  CareerOn
                </Text>
              </View>

              <View style={styles.courseRight}>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingStar}>★</Text>
                  <Text style={styles.ratingText}>4.8</Text>
                </View>

                <Text style={styles.freePrice}>Gratis</Text>

                <TouchableOpacity
                  style={styles.startCourseButton}
                  disabled={isLoading}
                  onPress={() => setCourseView('classes')}
                >
                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                    />
                  ) : (
                    <Text style={styles.startCourseText}>
                      {completedClasses.length >= 5 ? 'Volver a ver' : 'Ver temario'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.coursesTitle, { marginTop: 20 }]}>
              Retos prácticos
            </Text>

            {loadingChallenges ? (
              <ActivityIndicator size="small" color="#5B34F2" style={{ marginTop: 10 }} />
            ) : challenges.length > 0 ? (
              challenges.map(challenge => (
                <View key={challenge.id} style={styles.courseCard}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={styles.courseName}>{challenge.title}</Text>
                    <Text style={[styles.coursePlatform, { color: '#5F6368', fontSize: 12, marginTop: 4 }]} numberOfLines={2}>
                      {challenge.description}
                    </Text>
                  </View>
                  <View style={[styles.courseRight, { justifyContent: 'center' }]}>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingStar}>💎</Text>
                      <Text style={styles.ratingText}>{challenge.points} pts</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.startCourseButton, challenge.completed && { backgroundColor: '#10B981' }]}
                      disabled={completingChallengeId === challenge.id || challenge.completed}
                      onPress={() => startChallenge(challenge)}
                    >
                      {completingChallengeId === challenge.id ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.startCourseText}>
                          {challenge.completed ? 'Completado' : 'Hacer reto'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={{ padding: 16, alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, marginBottom: 16 }}>
                <Text style={{ color: '#6B7280', fontSize: 13 }}>No hay retos disponibles para esta habilidad.</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.simulateButtonModal}
            >
              <Text style={styles.simulateButtonTextModal}>
                Simular entrevista técnica
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          /* VISTA DE CLASES DEL CURSO */
          <View style={{ paddingVertical: 10 }}>
            <View style={{ backgroundColor: '#EEF2FF', padding: 15, borderRadius: 12, marginBottom: 20 }}>
               <Text style={{ fontWeight: 'bold', color: '#4338CA', fontSize: 16 }}>Curso: {selectedSkill?.name} para Principiantes</Text>
               <Text style={{ color: '#4F46E5', marginTop: 5 }}>Progreso: {completedClasses.length} / 5 clases completadas</Text>
               <View style={{ height: 6, backgroundColor: '#C7D2FE', borderRadius: 3, marginTop: 10 }}>
                 <View style={{ height: 6, backgroundColor: '#4F46E5', borderRadius: 3, width: `${(completedClasses.length / 5) * 100}%` }} />
               </View>
            </View>
            
            {[
              { num: 1, title: 'Introducción a los conceptos básicos', type: '🎥 Video' },
              { num: 2, title: 'Configuración del entorno', type: '📄 Lectura' },
              { num: 3, title: 'Sintaxis y Estructuras de control', type: '🎥 Video' },
              { num: 4, title: 'Tu primer proyecto real', type: '💻 Práctica' },
              { num: 5, title: 'Evaluación Técnica (Mini-proyecto)', type: '🏆 Proyecto' },
            ].map((clase, i) => {
              const isCompleted = completedClasses.includes(clase.num);
              const isLocked = clase.num > 1 && !completedClasses.includes(clase.num - 1);
              
              return (
                <TouchableOpacity 
                  key={i} 
                  style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isCompleted ? '#F0FDF4' : (isLocked ? '#F3F4F6' : '#F9FAFB'), padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: isCompleted ? '#BBF7D0' : '#E5E7EB', opacity: isLocked ? 0.6 : 1 }}
                  onPress={() => {
                    if (isLocked) {
                      Alert.alert('🔒 Clase Bloqueada', 'Debes completar la clase anterior para poder acceder a esta.');
                    } else {
                      setActiveClass(clase);
                      setShowClassModal(true);
                    }
                  }}
                >
                   <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isCompleted ? '#10B981' : (isLocked ? '#D1D5DB' : '#E0E7FF'), justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
                      <Text style={{ fontWeight: 'bold', color: isCompleted ? 'white' : (isLocked ? '#6B7280' : '#4338CA') }}>{isCompleted ? '✓' : clase.num}</Text>
                   </View>
                   <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '600', color: isCompleted ? '#065F46' : (isLocked ? '#6B7280' : '#1F2937'), fontSize: 15 }}>{clase.title}</Text>
                      <Text style={{ color: isCompleted ? '#059669' : '#6B7280', fontSize: 13, marginTop: 4 }}>{clase.type} • +20 🪙</Text>
                   </View>
                   <Text style={{ fontSize: 20, color: isCompleted ? '#10B981' : '#D1D5DB' }}>{isCompleted ? '⭐' : (isLocked ? '🔒' : '▶️')}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
          </ScrollView>
        </View>
        
        {/* Mensaje Visual de la Mascota superpuesto en el Modal Principal */}
        {localMascotMessage && (
          <View style={{ position: 'absolute', bottom: 40, left: 20, right: 20, backgroundColor: '#FFF', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 10, elevation: 15, zIndex: 999, borderWidth: 2, borderColor: '#4F46E5' }}>
            <View style={{ backgroundColor: '#EEF2FF', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
              <Text style={{ fontSize: 30 }}>🦁</Text>
            </View>
            <Text style={{ flex: 1, fontSize: 15, color: '#374151', fontWeight: 'bold' }}>{localMascotMessage}</Text>
          </View>
        )}
      </View>
    </Modal>
    
      {/* Modal de Clase de Video */}
      {showClassModal && activeClass && (
        <Modal visible={showClassModal} animationType="fade" transparent>
           <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 16 }}>
              <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 20, paddingBottom: 30 }}>
                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                   <Text style={{ fontSize: 14, color: '#6366F1', fontWeight: 'bold' }}>Clase {activeClass.num}</Text>
                   <TouchableOpacity onPress={() => setShowClassModal(false)}>
                     <Text style={{ fontSize: 20, color: '#9CA3AF' }}>✕</Text>
                   </TouchableOpacity>
                 </View>
                 
                 <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 20 }}>{activeClass.title}</Text>
                 
                 {/* Video Player Falso */}
                 <View style={{ height: 200, backgroundColor: '#000', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
                    <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(255,0,0,0.8)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
                      <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>EN VIVO</Text>
                    </View>
                    
                    {!isVideoPlaying && videoProgress < 100 && (
                      <TouchableOpacity 
                        style={{ width: 60, height: 60, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => setIsVideoPlaying(true)}
                      >
                        <Text style={{ fontSize: 30, color: 'white', marginLeft: 5 }}>▶</Text>
                      </TouchableOpacity>
                    )}
                    
                    {videoProgress >= 100 && (
                      <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Video Finalizado ✅</Text>
                      </View>
                    )}

                    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                      <View style={{ flex: 1, height: 4, backgroundColor: '#4B5563', borderRadius: 2, marginRight: 10 }}>
                        <View style={{ width: `${videoProgress}%`, height: '100%', backgroundColor: '#6366F1', borderRadius: 2 }} />
                      </View>
                      <Text style={{ color: 'white', fontSize: 12 }}>{Math.floor((videoProgress / 100) * 10)}:00 / 10:00</Text>
                    </View>
                 </View>
                 
                 <Text style={{ fontSize: 15, color: '#4B5563', marginBottom: 25, lineHeight: 22 }}>
                   En esta lección aprenderás los fundamentos esenciales y cómo aplicarlos en escenarios reales de {selectedSkill?.name}. Presta atención a las mejores prácticas detalladas por el instructor.
                 </Text>
                 
                 {completedClasses.includes(activeClass.num) ? (
                   <View style={{ backgroundColor: '#D1FAE5', padding: 15, borderRadius: 12, alignItems: 'center' }}>
                     <Text style={{ color: '#065F46', fontWeight: 'bold', fontSize: 16 }}>✅ Clase Completada</Text>
                   </View>
                 ) : (
                   <TouchableOpacity 
                      style={{ 
                        backgroundColor: videoProgress >= 100 ? '#4F46E5' : '#D1D5DB', 
                        padding: 16, borderRadius: 12, alignItems: 'center', 
                        shadowColor: videoProgress >= 100 ? '#4F46E5' : 'transparent', 
                        shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8, elevation: videoProgress >= 100 ? 5 : 0 
                      }} 
                      disabled={videoProgress < 100}
                      onPress={handleCompleteClass}
                   >
                     <Text style={{ color: videoProgress >= 100 ? 'white' : '#6B7280', fontWeight: 'bold', fontSize: 16 }}>
                       {videoProgress < 100 ? 'Termina de ver el video 🎥' : 'Marcar como Completada (+20 🪙)'}
                     </Text>
                   </TouchableOpacity>
                 )}
              </View>
           </View>
        </Modal>
      )}

      {/* Modal Interactivo del Reto */}
      {showChallengeModal && activeChallenge && (
        <Modal visible={showChallengeModal} animationType="fade" transparent>
           <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 }}>
              <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 24 }}>
                 <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>{activeChallenge.title}</Text>
                 <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>{activeChallenge.description}</Text>
                 
                 {/* Video Placeholder */}
                 <View style={{ height: 160, backgroundColor: '#1F2937', borderRadius: 12, marginVertical: 15, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 40 }}>▶️</Text>
                    <Text style={{ color: 'white', marginTop: 12, fontWeight: '600' }}>Video de Introducción</Text>
                 </View>
                 
                 <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 15, marginTop: 10 }}>Pregunta: {activeChallenge.question}</Text>
                 
                 {activeChallenge.options?.map((opt, idx) => (
                   <TouchableOpacity 
                      key={idx}
                      style={{ padding: 14, backgroundColor: '#F3F4F6', borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB' }} 
                      onPress={() => handleCompleteChallenge(activeChallenge, idx)}
                   >
                     <Text style={{ color: '#374151', fontWeight: '500' }}>{opt}</Text>
                   </TouchableOpacity>
                 ))}
                 
                 <TouchableOpacity style={{ marginTop: 16, alignItems: 'center', paddingVertical: 10 }} onPress={() => setShowChallengeModal(false)}>
                   <Text style={{ color: '#EF4444', fontWeight: '600', fontSize: 15 }}>Cancelar reto</Text>
                 </TouchableOpacity>
              </View>
           </View>
        </Modal>
      )}
    </>
  );
}