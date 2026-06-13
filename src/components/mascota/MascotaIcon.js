import React, { useState } from 'react';
import { TouchableOpacity, Text, View, Modal, Animated, StyleSheet } from 'react-native';
import { useMascota } from './MascotaProvider';
import MascotaModal from './MascotaModal';

export default function MascotaIcon() {
  const { points, streak, currentLevel, progressToNext } = useMascota();
  const [showModal, setShowModal] = useState(false);
  const [bounceAnim] = useState(new Animated.Value(1));

  const handlePress = () => {
    // Animación de rebote al tocar
    Animated.sequence([
      Animated.spring(bounceAnim, { toValue: 1.2, useNativeDriver: true, friction: 3 }),
      Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true, friction: 3 }),
    ]).start();
    
    setShowModal(true);
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.container} 
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
          <View style={[styles.mascotaCircle, { backgroundColor: currentLevel.color + '20' }]}>
            <Text style={styles.mascotaEmoji}>{currentLevel.emoji}</Text>
          </View>
        </Animated.View>
        
        {/* Indicador de nivel */}
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{currentLevel.id}</Text>
        </View>
        
        {/* Barra de progreso pequeña */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progressToNext}%`, backgroundColor: currentLevel.color }]} />
        </View>
        
        {/* Racha */}
        {streak > 0 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakText}>{streak}</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <MascotaModal visible={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 1000,
    alignItems: 'center',
  },
  mascotaCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  mascotaEmoji: {
    fontSize: 28,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#1C1C1C',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    width: 40,
    height: 3,
    backgroundColor: '#DCE5EC',
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  streakBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    flexDirection: 'row',
    backgroundColor: '#F25F63',
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
});