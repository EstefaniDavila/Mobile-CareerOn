// MascotaSelector.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';
import { useMascota } from './MascotaProvider';
import { MASCOTAS } from './mascotaData';

export default function MascotaSelector({ visible, onComplete }) {
  const { seleccionarMascota } = useMascota();
  const [selected, setSelected] = useState(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleSelect = (mascota) => {
    setSelected(mascota);
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.1, useNativeDriver: true, friction: 3 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 3 }),
    ]).start();
  };

  const handleConfirm = () => {
    if (selected) {
      seleccionarMascota(selected);
      onComplete();
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>🥚 ¡Elige tu compañero!</Text>
          <Text style={styles.subtitle}>
            Este ser te acompañará en tu camino laboral. 
            ¡Crecerá contigo a medida que avances!
          </Text>

          <View style={styles.grid}>
            {Object.values(MASCOTAS).map((mascota) => (
              <TouchableOpacity
                key={mascota.id}
                style={[
                  styles.card,
                  selected?.id === mascota.id && styles.cardSelected,
                  { borderColor: mascota.color }
                ]}
                onPress={() => handleSelect(mascota)}
              >
                <Animated.View style={{ transform: [{ scale: selected?.id === mascota.id ? scaleAnim : 1 }] }}>
                  <Text style={styles.emoji}>{mascota.emoji}</Text>
                </Animated.View>
                <Text style={styles.mascotaName}>{mascota.name}</Text>
                <Text style={styles.description}>{mascota.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.confirmButton, !selected && styles.disabled]}
            onPress={handleConfirm}
            disabled={!selected}
          >
            <Text style={styles.confirmText}>
              {selected ? `¡Elegir a ${selected.name}!` : 'Selecciona una mascota'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1C1C1C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#5F6368',
    marginBottom: 24,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F3F3F3',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    backgroundColor: '#F0F7FF',
    borderWidth: 2,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  mascotaName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginBottom: 4,
  },
  description: {
    fontSize: 10,
    color: '#5F6368',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#5B34F2',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#DCE5EC',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});