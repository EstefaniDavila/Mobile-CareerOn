import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Text, View, Animated, StyleSheet } from 'react-native';
import { useMascota } from './MascotaProvider';
import MascotaModal from './MascotaModal';

export default function MascotaIcon() {
  const { 
    hasSelectedMascota, 
    selectedMascota, 
    currentEmoji, 
    currentEtapa,
    streak, 
    progressToNext,
    generarFrase,
  } = useMascota();
  
  const [showModal, setShowModal] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState('');
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -5, duration: 1000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (!hasSelectedMascota) return;
    
    const interval = setInterval(() => {
      const frase = generarFrase();
      setBubbleMessage(frase);
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 4000);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [hasSelectedMascota]);

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(bounceAnim, { toValue: 1.2, useNativeDriver: true, friction: 3 }),
      Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true, friction: 3 }),
    ]).start();
    setShowModal(true);
  };

  if (!hasSelectedMascota || !selectedMascota) return null;

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.8}>
        {showBubble && (
          <Animated.View style={[styles.bubble, { transform: [{ scale: bounceAnim }] }]}>
            <Text style={styles.bubbleText}>{bubbleMessage}</Text>
            <View style={styles.bubbleArrow} />
          </Animated.View>
        )}

        <Animated.View style={{ transform: [{ translateY: floatAnim }, { scale: bounceAnim }] }}>
          <View style={[styles.circle, { backgroundColor: selectedMascota.color + '20' }]}>
            <Text style={styles.emoji}>{currentEmoji}</Text>
          </View>
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

      <MascotaModal visible={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 45,
    right: 12,
    zIndex: 1000,
    alignItems: 'center',
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
    bottom: 60,
    right: 0,
    backgroundColor: '#1F2937',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: 200,
  },
  bubbleText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  bubbleArrow: {
    position: 'absolute',
    bottom: -6,
    right: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1F2937',
  },
});