import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { useMascota } from './MascotaProvider';

export default function MascotaModal({ visible, onClose }) {
  const { points, streak, currentLevel, nextLevel, pointsToNextLevel, progressToNext, dailyActions } = useMascota();

  // Frases según el nivel
  const getMessage = () => {
    const messages = {
      1: ['¡Toc toc! ¿Hay alguien ahí?', 'Publica algo para que pueda nacer 🥚', '¡Necesito calor! Participa cada día'],
      2: ['¡Pío pío! Sigue así', 'Completa cursos para crecer 🐣', '¡Me encanta verte aprender!'],
      3: ['¡Ya sé volar!', 'Completa tu roadmap 📈', 'Cada logro me hace más fuerte'],
      4: ['¡Soy un sabio! 🦉', 'Tu carrera está despegando', '¡Vamos por más!'],
      5: ['🔥 ¡RENAZCO DE MIS CENIZAS!', 'Eres una leyenda', '¡Nadie te detiene!'],
    };
    const levelMessages = messages[currentLevel.id] || messages[1];
    return levelMessages[Math.floor(Math.random() * levelMessages.length)];
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>✨ Tu Compañero de Carrera ✨</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Mascota grande */}
            <View style={[styles.mascotaLarge, { backgroundColor: currentLevel.color + '15' }]}>
              <Text style={styles.mascotaLargeEmoji}>{currentLevel.emoji}</Text>
              <Text style={[styles.mascotaName, { color: currentLevel.color }]}>{currentLevel.name}</Text>
              <Text style={styles.mascotaMessage}>“{getMessage()}”</Text>
            </View>

            {/* Estadísticas principales */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{points}</Text>
                <Text style={styles.statLabel}>Puntos totales</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>🔥 {streak}</Text>
                <Text style={styles.statLabel}>Racha de días</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>🏆 {currentLevel.id}</Text>
                <Text style={styles.statLabel}>Nivel alcanzado</Text>
              </View>
            </View>

            {/* Barra de progreso al siguiente nivel */}
            {nextLevel && (
              <View style={styles.progressSection}>
                <Text style={styles.progressTitle}>Para llegar a {nextLevel.name}</Text>
                <View style={styles.progressBarLarge}>
                  <View style={[styles.progressFillLarge, { width: `${progressToNext}%`, backgroundColor: currentLevel.color }]} />
                </View>
                <Text style={styles.progressText}>
                  {pointsToNextLevel} puntos para el siguiente nivel
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
                <Text style={styles.dailyText}>Postularse a empleos</Text>
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
                {[
                  { level: 1, name: 'HuevOn', emoji: '🥚', points: 0 },
                  { level: 2, name: 'Learning', emoji: '🐣', points: 100 },
                  { level: 3, name: 'SkillBird', emoji: '🐦', points: 300 },
                  { level: 4, name: 'CareerOn', emoji: '🦉', points: 600 },
                  { level: 5, name: 'MasterFénix', emoji: '🔥', points: 1000 },
                ].map(level => (
                  <View key={level.level} style={[
                    styles.evolutionCard,
                    currentLevel.id >= level.level && styles.evolutionCardUnlocked
                  ]}>
                    <Text style={styles.evolutionEmoji}>{level.emoji}</Text>
                    <Text style={styles.evolutionName}>{level.name}</Text>
                    <Text style={styles.evolutionPoints}>{level.points} pts</Text>
                    {currentLevel.id >= level.level && (
                      <View style={styles.unlockBadge}>
                        <Text style={styles.unlockText}>✓</Text>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Tips para ganar puntos */}
            <View style={styles.tipsSection}>
              <Text style={styles.sectionTitle}>💡 Tips para ganar puntos</Text>
              <Text style={styles.tipText}>• 📝 Publica 1 logro por día → +20 pts y mantiene tu racha</Text>
              <Text style={styles.tipText}>• 🎓 Completa cursos → +50 pts cada uno</Text>
              <Text style={styles.tipText}>• 🗺️ Termina nodos del roadmap → +30 pts</Text>
              <Text style={styles.tipText}>• 🔥 Mantén racha diaria → +10 pts extra por día</Text>
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
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DCE5EC',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    color: '#5F6368',
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  mascotaMessage: {
    fontSize: 14,
    color: '#5F6368',
    marginTop: 12,
    textAlign: 'center',
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
    backgroundColor: '#F3F3F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  statLabel: {
    fontSize: 11,
    color: '#5F6368',
    marginTop: 4,
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1C',
    marginBottom: 8,
  },
  progressBarLarge: {
    height: 10,
    backgroundColor: '#DCE5EC',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFillLarge: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#5F6368',
  },
  dailySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginBottom: 12,
  },
  dailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  dailyIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dailyText: {
    flex: 1,
    fontSize: 14,
    color: '#1C1C1C',
  },
  dailyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  pending: {
    backgroundColor: '#5B34F2',
  },
  completed: {
    backgroundColor: '#0F6C7A',
  },
  dailyBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },
  evolutionSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  evolutionCard: {
    backgroundColor: '#F3F3F3',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 12,
    minWidth: 80,
    opacity: 0.5,
  },
  evolutionCardUnlocked: {
    opacity: 1,
    backgroundColor: currentLevel?.color + '20',
  },
  evolutionEmoji: {
    fontSize: 32,
  },
  evolutionName: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
  },
  evolutionPoints: {
    fontSize: 10,
    color: '#5F6368',
  },
  unlockBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#0F6C7A',
    borderRadius: 12,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tipsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  tipText: {
    fontSize: 12,
    color: '#5F6368',
    marginBottom: 6,
    lineHeight: 18,
  },
});