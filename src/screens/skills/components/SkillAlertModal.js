import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import styles from './components'

export default function SkillAlertModal({
  visible,
  rejectedSkills,
  roadmaps,
  onClose,
  onSelectSkill,
}) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.alertModal}>
          <View style={styles.alertModalIconCircle}>
            <Text style={styles.alertModalIcon}>
              ⚠️
            </Text>
          </View>

          <Text style={styles.alertModalTitle}>
            Habilidades necesarias
          </Text>

          <Text style={styles.alertModalText}>
            Basado en tus rechazos, necesitas
            desarrollar estas habilidades:
          </Text>

          <View style={styles.rejectedSkillsList}>
            {rejectedSkills.map((skill) => (
              <View
                key={skill}
                style={styles.rejectedSkillItem}
              >
                <Text style={styles.rejectedSkillIcon}>
                  📘
                </Text>

                <Text style={styles.rejectedSkillName}>
                  {skill}
                </Text>

                <TouchableOpacity
                  style={styles.learnNowButton}
                  onPress={() => {
                    const roadmapWithSkill =
                      Object.entries(roadmaps).find(
                        ([_, value]) =>
                          value.skills.some(
                            (s) => s.name === skill
                          )
                      );

                    onSelectSkill(
                      roadmapWithSkill,
                      skill
                    );
                  }}
                >
                  <Text style={styles.learnNowText}>
                    Aprender →
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.closeAlertButton}
            onPress={onClose}
          >
            <Text style={styles.closeAlertText}>
              Entendido
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}