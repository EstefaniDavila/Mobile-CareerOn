import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import OptimizarCV from './components/OptimizarCV';
import SimuladorEntrevistas from './components/SimuladorEntrevistas';
import { useMascota } from '../../components/mascota/MascotaProvider';

export default function IAScreen() {
  const [activeComponent, setActiveComponent] = useState(null); // null, 'cv', 'entrevista'
  const { notifyIA } = useMascota();

  useEffect(() => {
    // Notificar a la mascota que entramos a la sección de IA
    notifyIA();
  }, [notifyIA]);

  const handleBack = () => {
    setActiveComponent(null);
  };

  // Renderizar componente seleccionado
  if (activeComponent === 'cv') {
    return <OptimizarCV onBack={handleBack} />;
  }

  if (activeComponent === 'entrevista') {
    return <SimuladorEntrevistas onBack={handleBack} />;
  }

  // Pantalla principal con los dos botones
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoInitial}>C</Text>
          </View>
          <View>
            <Text style={styles.logoText}>CarrerOn</Text>
            <Text style={styles.logoSubtext}>Tu Copiloto de Empleabilidad</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Título principal minimalista */}
        <View style={styles.heroSection}>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>✨ IA Coach</Text>
          </View>
          <Text style={styles.title}>Tu Coach{'\n'}de Empleabilidad</Text>
          <Text style={styles.subtitle}>
            Potencia tu perfil profesional con inteligencia artificial
          </Text>
        </View>

        {/* Dos botones principales */}
        <View style={styles.buttonsContainer}>
          {/* Optimizar CV - AHORA CON TouchableOpacity y onPress */}
          <TouchableOpacity 
            style={styles.buttonCard}
            onPress={() => setActiveComponent('cv')}
            activeOpacity={0.7}
          >
            <View style={styles.buttonIconWrapper}>
              <View style={[styles.iconCircle, styles.iconCv]}>
                <Text style={styles.iconEmoji}>📄</Text>
              </View>
            </View>
            <Text style={styles.buttonTitle}>Optimizar CV</Text>
            <Text style={styles.buttonDescription}>
              Análisis inteligente de tu currículum con recomendaciones personalizadas
            </Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureDot}>•</Text>
                <Text style={styles.featureText}>Análisis de keywords</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureDot}>•</Text>
                <Text style={styles.featureText}>Formato ATS friendly</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureDot}>•</Text>
                <Text style={styles.featureText}>Sugerencias de mejora</Text>
              </View>
            </View>
            <View style={styles.buttonFooter}>
              <Text style={styles.buttonFooterText}>Mejorar mi CV</Text>
              <Text style={styles.buttonFooterArrow}>→</Text>
            </View>
          </TouchableOpacity>

          {/* Simulador de Entrevistas - AHORA CON TouchableOpacity y onPress */}
          <TouchableOpacity 
            style={styles.buttonCard}
            onPress={() => setActiveComponent('entrevista')}
            activeOpacity={0.7}
          >
            <View style={styles.buttonIconWrapper}>
              <View style={[styles.iconCircle, styles.iconInterview]}>
                <Text style={styles.iconEmoji}>🎤</Text>
              </View>
            </View>
            <Text style={styles.buttonTitle}>Simulador de Entrevistas</Text>
            <Text style={styles.buttonDescription}>
              Practica entrevistas reales con feedback inmediato de IA
            </Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureDot}>•</Text>
                <Text style={styles.featureText}>Preguntas personalizadas</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureDot}>•</Text>
                <Text style={styles.featureText}>Feedback en tiempo real</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureDot}>•</Text>
                <Text style={styles.featureText}>Consejos de mejora</Text>
              </View>
            </View>
            <View style={styles.buttonFooter}>
              <Text style={styles.buttonFooterText}>Practicar ahora</Text>
              <Text style={styles.buttonFooterArrow}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Mensaje motivacional */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationIcon}>💡</Text>
          <Text style={styles.motivationText}>
            "El 85% de los CV optimizados con IA reciben más entrevistas"
          </Text>
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 16,
    backgroundColor: '#4320C9',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoInitial: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoSubtext: {
    fontSize: 11,
    color: '#DCE5EC',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  aiBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  aiBadgeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5B34F2',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonsContainer: {
    paddingHorizontal: 16,
    gap: 20,
  },
  buttonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonIconWrapper: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCv: {
    backgroundColor: '#EEF2FF',
  },
  iconInterview: {
    backgroundColor: '#E6F7F5',
  },
  iconEmoji: {
    fontSize: 28,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  buttonDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  featureList: {
    gap: 8,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureDot: {
    fontSize: 14,
    color: '#5B34F2',
  },
  featureText: {
    fontSize: 13,
    color: '#4B5563',
  },
  buttonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  buttonFooterText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#5B34F2',
  },
  buttonFooterArrow: {
    fontSize: 18,
    color: '#5B34F2',
  },
  motivationCard: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  motivationIcon: {
    fontSize: 24,
  },
  motivationText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    fontStyle: 'italic',
  },

  // Estilos del Modal Intermedio
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E6F7F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalEmoji: {
    fontSize: 32,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalGreenCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 12,
  },
  greenCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 8,
  },
  modalBlueCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  blueCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3730A3',
    marginBottom: 8,
  },
  modalFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalCheck: {
    color: '#16A34A',
    marginRight: 8,
    fontWeight: 'bold',
  },
  modalStar: {
    color: '#4F46E5',
    marginRight: 8,
  },
  modalFeatureText: {
    fontSize: 13,
    color: '#166534',
  },
  modalBlueFeatureText: {
    fontSize: 13,
    color: '#3730A3',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  modalBtnApp: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  modalBtnAppText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 15,
  },
  modalBtnWeb: {
    flex: 1,
    backgroundColor: '#5B34F2',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  modalBtnWebText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  modalFooterText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});