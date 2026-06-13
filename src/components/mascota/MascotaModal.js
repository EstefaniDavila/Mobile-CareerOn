import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useMascota } from './MascotaProvider';
import { ETAPAS } from './mascotaData';

export default function MascotaModal({ visible, onClose }) {
  const { 
    points, 
    streak, 
    currentEtapa, 
    nextEtapa, 
    pointsToNext, 
    progressToNext,
    dailyActions,
    selectedMascota,
    currentEmoji
  } = useMascota();

  const etapasList = Object.values(ETAPAS);
  const currentLevelId = currentEtapa?.id || 1;

  const getMessage = () => {
    const messages = {
      1: '¡Publica algo para que pueda nacer! 🥚',
      2: '¡Pío pío! Sigue así 🐣',
      3: '¡Ya sé volar! Completa tu roadmap 📈',
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
            <Text style={styles.modalTitle}>✨ {selectedMascota.nombre} ✨</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Mascota grande */}
            <View style={[styles.mascotaLarge, { backgroundColor: selectedMascota.color + '20' }]}>
              <Text style={styles.mascotaLargeEmoji}>{currentEmoji}</Text>
              <Text style={[styles.mascotaName, { color: selectedMascota.color }]}>
                {currentEtapa?.name} {selectedMascota.nombre}
              </Text>
              <Text style={styles.mascotaMessage}>“{getMessage()}”</Text>
            </View>

            {/* Estadísticas */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{points}</Text>
                <Text style={styles.statLabel}>Puntos</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>🔥 {streak}</Text>
                <Text style={styles.statLabel}>Racha</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>🏆 {currentLevelId}</Text>
                <Text style={styles.statLabel}>Nivel</Text>
              </View>
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