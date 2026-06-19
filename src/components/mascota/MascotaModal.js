import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import { useMascota } from './MascotaProvider';
import { ETAPAS } from './mascotaData';

export default function MascotaModal({ visible, onClose }) {
  const { 
    points, 
    streak,
    coins,
    careerScore,
    userName,
    bestMatchJob,
    currentEtapa, 
    nextEtapa, 
    pointsToNext, 
    progressToNext,
    dailyActions,
    selectedMascota,
    currentEmoji,
    currentImage,
    feedMascota,
    sleepMascota,
    mascotaStatus,
    updateMascotaName,
    isVideoDownloadEnabled,
    toggleVideoDownload
  } = useMascota();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");

  const etapasList = Object.values(ETAPAS);
  const currentLevelId = currentEtapa?.id || 1;

  const getMessage = () => {
    if (mascotaStatus === 'sleeping') {
      return `¡Hola ${userName || 'Abigail'}, bienvenido! No olvides despertarme para ayudarte.`;
    }
    if (bestMatchJob && bestMatchJob.match_score > 80) return `¡Hay un empleo de ${bestMatchJob.title} con ${bestMatchJob.match_score}% match para ti hoy! 🎯`;
    if (streak > 7) return `¡${streak} días de racha! ¡Eres imparable! 🔥`;
    if (coins > 100) return `💰 Tienes ${coins} monedas. ¡Sigue acumulando!`;
    const messages = {
      1: '¡Publica algo para que pueda nacer! 🥚',
      2: '¡Pío pío! Sigue postulándote 🐣',
      3: '¡Ya sé volar! Completa tu perfil 📈',
      4: '¡Soy un sabio! Tu carrera despega 🦉',
      5: '¡ERES UNA LEYENDA! 🔥',
    };
    return messages[currentLevelId] || messages[1];
  };

  if (!selectedMascota) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            {isEditingName ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 15 }}>
                <TextInput
                  style={{ flex: 1, fontSize: 20, fontWeight: 'bold', color: '#4F46E5', borderBottomWidth: 2, borderBottomColor: '#4F46E5', padding: 0 }}
                  value={editNameValue}
                  onChangeText={setEditNameValue}
                  autoFocus
                  maxLength={15}
                />
                <TouchableOpacity 
                  onPress={() => {
                    if (editNameValue.trim()) {
                      updateMascotaName(editNameValue.trim());
                    }
                    setIsEditingName(false);
                  }}
                  style={{ marginLeft: 10, backgroundColor: '#4F46E5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Guardar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.modalTitle}>✨ {selectedMascota.nombre} ✨</Text>
                <TouchableOpacity 
                  onPress={() => {
                    setEditNameValue(selectedMascota.nombre);
                    setIsEditingName(true);
                  }}
                  style={{ marginLeft: 10, padding: 5 }}
                >
                  <Text style={{ fontSize: 18 }}>✏️</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Mascota grande */}
            <View style={[styles.mascotaLarge, { backgroundColor: selectedMascota.color + '20' }]}>
              {currentImage ? (
                <Image 
                  source={currentImage} 
                  style={{ width: 120, height: 120, marginBottom: 10 }} 
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.mascotaLargeEmoji}>{currentEmoji}</Text>
              )}
              <Text style={[styles.mascotaName, { color: selectedMascota.color }]}>
                {currentEtapa?.name} {selectedMascota.nombre}
              </Text>
              {userName ? (
                <Text style={styles.helloText}>¡Hola, {userName}! 👋</Text>
              ) : null}
              <Text style={styles.mascotaMessage}>"{getMessage()}"</Text>
            </View>

            {/* Estadísticas REALES */}
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: '#FEF9C3' }]}>
                <Text style={styles.statValue}>🪙 {coins}</Text>
                <Text style={styles.statLabel}>Monedas</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#FEE2E2' }]}>
                <Text style={styles.statValue}>🔥 {streak}</Text>
                <Text style={styles.statLabel}>Racha días</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#EEF2FF' }]}>
                <Text style={styles.statValue}>⭐ {careerScore}</Text>
                <Text style={styles.statLabel}>Career Score</Text>
              </View>
            </View>

            {bestMatchJob && bestMatchJob.match_score > 0 && (
              <View style={styles.matchBanner}>
                <Text style={styles.matchBannerText}>
                  🎯 Mejor match de hoy: {bestMatchJob.title} ({bestMatchJob.match_score}%)
                </Text>
                <Text style={styles.matchBannerSub}>¡Hay empleos que encajan contigo!</Text>
              </View>
            )}

            {/* Acciones Interactivas */}
            <View style={styles.interactiveSection}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]} 
                onPress={feedMascota}
              >
                <Text style={styles.actionIcon}>🍎</Text>
                <View style={styles.actionTexts}>
                  <Text style={[styles.actionTitle, { color: '#B91C1C' }]}>Alimentar</Text>
                  <Text style={[styles.actionSub, { color: '#EF4444' }]}>-10 M | +10 XP</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: mascotaStatus === 'sleeping' ? '#FEF9C3' : '#E0E7FF', borderColor: mascotaStatus === 'sleeping' ? '#FDE047' : '#A5B4FC' }]} 
                onPress={sleepMascota}
              >
                <Text style={styles.actionIcon}>{mascotaStatus === 'sleeping' ? '☀️' : '💤'}</Text>
                <View style={styles.actionTexts}>
                  <Text style={[styles.actionTitle, { color: mascotaStatus === 'sleeping' ? '#A16207' : '#4338CA' }]}>{mascotaStatus === 'sleeping' ? 'Despertar' : 'Dormir'}</Text>
                  <Text style={[styles.actionSub, { color: mascotaStatus === 'sleeping' ? '#CA8A04' : '#6366F1' }]}>{mascotaStatus === 'sleeping' ? 'Activar Racha' : 'Buenas noches'}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Barra de progreso */}
            {nextEtapa && (
              <View style={styles.progressSection}>
                <Text style={styles.progressTitle}>Para llegar a {nextEtapa.name}</Text>
                <View style={styles.progressBarLarge}>
                  <View style={[styles.progressFillLarge, { width: `${progressToNext}%`, backgroundColor: selectedMascota.color }]} />
                </View>
                <Text style={styles.progressText}>
                  {pointsToNext} puntos para el siguiente nivel
                </Text>
              </View>
            )}

            {/* Acciones diarias */}
            <View style={styles.dailySection}>
              <Text style={styles.sectionTitle}>📅 Acciones de hoy</Text>
              
              <View style={styles.dailyItem}>
                <Text style={styles.dailyIcon}>📝</Text>
                <Text style={styles.dailyText}>Publicar un logro</Text>
                <View style={[styles.dailyBadge, dailyActions.post ? styles.completed : styles.pending]}>
                  <Text style={styles.dailyBadgeText}>{dailyActions.post ? '✓ Hecho' : '+20 pts'}</Text>
                </View>
              </View>

              <View style={styles.dailyItem}>
                <Text style={styles.dailyIcon}>💼</Text>
                <Text style={styles.dailyText}>Postularse</Text>
                <View style={[styles.dailyBadge, dailyActions.apply >= 3 ? styles.completed : styles.pending]}>
                  <Text style={styles.dailyBadgeText}>{dailyActions.apply}/3 • +5 c/u</Text>
                </View>
              </View>

              <View style={styles.dailyItem}>
                <Text style={styles.dailyIcon}>🎤</Text>
                <Text style={styles.dailyText}>Simular entrevista</Text>
                <View style={[styles.dailyBadge, dailyActions.interview >= 2 ? styles.completed : styles.pending]}>
                  <Text style={styles.dailyBadgeText}>{dailyActions.interview}/2 • +15 c/u</Text>
                </View>
              </View>
            </View>

            {/* Evoluciones */}
            <View style={styles.evolutionSection}>
              <Text style={styles.sectionTitle}>📈 Evoluciones</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {etapasList.map(etapa => (
                  <View key={etapa.id} style={[
                    styles.evolutionCard,
                    currentLevelId >= etapa.id && styles.evolutionCardUnlocked
                  ]}>
                    <Text style={styles.evolutionEmoji}>{etapa.emoji}</Text>
                    <Text style={styles.evolutionName}>{etapa.name}</Text>
                    <Text style={styles.evolutionPoints}>{etapa.minPoints} pts</Text>
                    {currentLevelId >= etapa.id && (
                      <View style={styles.unlockBadge}>
                        <Text style={styles.unlockText}>✓</Text>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Tips */}
            <View style={styles.tipsSection}>
              <Text style={styles.sectionTitle}>💡 Tips</Text>
              <Text style={styles.tipText}>• 📝 Publica 1 logro por día → +20 pts</Text>
              <Text style={styles.tipText}>• 🎓 Completa cursos → +50 pts</Text>
              <Text style={styles.tipText}>• 🗺️ Termina nodos del roadmap → +30 pts</Text>
              <Text style={styles.tipText}>• 🔥 Mantén racha diaria → +10 pts extra</Text>
            </View>

            {/* Configuraciones Offline */}
            <View style={[styles.tipsSection, { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD', marginTop: 15 }]}>
              <Text style={styles.sectionTitle}>⚙️ Configuración Offline</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                <View style={{ flex: 1, paddingRight: 15 }}>
                  <Text style={{ fontWeight: 'bold', color: '#0369A1' }}>Descargar videos</Text>
                  <Text style={{ color: '#0EA5E9', fontSize: 12, marginTop: 4 }}>Guarda los videos de las clases para cuando no tengas internet.</Text>
                </View>
                <TouchableOpacity 
                  onPress={toggleVideoDownload}
                  style={{
                    width: 50,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: isVideoDownloadEnabled ? '#0EA5E9' : '#CBD5E1',
                    justifyContent: 'center',
                    alignItems: isVideoDownloadEnabled ? 'flex-end' : 'flex-start',
                    padding: 3
                  }}
                >
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: 'white' }} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    color: '#6B7280',
  },
  mascotaLarge: {
    alignItems: 'center',
    padding: 24,
    margin: 20,
    borderRadius: 20,
  },
  mascotaLargeEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  mascotaName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mascotaMessage: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  helloText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4F46E5',
    marginTop: 6,
  },
  matchBanner: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#D1FAE5',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#10B981',
    alignItems: 'center',
  },
  matchBannerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#047857',
  },
  matchBannerSub: {
    fontSize: 12,
    color: '#065F46',
    marginTop: 4,
  },
  interactiveSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  actionTexts: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionSub: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  progressBarLarge: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFillLarge: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  dailySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  dailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  dailyIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  dailyText: {
    flex: 1,
    fontSize: 13,
    color: '#1F2937',
  },
  dailyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  pending: {
    backgroundColor: '#5B34F2',
  },
  completed: {
    backgroundColor: '#10B981',
  },
  dailyBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  evolutionSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  evolutionCard: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
    minWidth: 70,
    opacity: 0.5,
  },
  evolutionCardUnlocked: {
    opacity: 1,
    backgroundColor: '#F3F4F6',
  },
  evolutionEmoji: {
    fontSize: 28,
  },
  evolutionName: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 6,
  },
  evolutionPoints: {
    fontSize: 9,
    color: '#6B7280',
  },
  unlockBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#10B981',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tipsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  tipText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
    lineHeight: 18,
  },
});