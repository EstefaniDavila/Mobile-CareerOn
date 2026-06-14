import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import styles from './components';

export default function CourseModal({
  visible,
  selectedSkill,
  isLoading,
  onClose,
  onCompleteCourse,
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.courseModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Aprender {selectedSkill?.name}
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeModal}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.skillInfoModal}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Demanda</Text>

                <View style={styles.infoDemandBar}>
                  <View
                    style={[
                      styles.infoDemandFill,
                      {
                        width: `${selectedSkill?.demandPercent || 0}%`,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.infoDemandValue}>
                  {selectedSkill?.demand}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Duración</Text>
                <Text style={styles.infoValue}>
                  ⏱️ {selectedSkill?.duration}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nivel</Text>
                <Text style={styles.infoValue}>
                  📊 {selectedSkill?.level}
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
                  onPress={() =>
                    onCompleteCourse(
                      selectedSkill?.name,
                      'Curso básico'
                    )
                  }
                >
                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                    />
                  ) : (
                    <Text style={styles.startCourseText}>
                      Iniciar
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.simulateButtonModal}
            >
              <Text style={styles.simulateButtonTextModal}>
                Simular entrevista técnica
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}