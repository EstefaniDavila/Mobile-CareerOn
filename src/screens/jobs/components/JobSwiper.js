// screens/jobs/components/JobSwiper.js
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import studentService from "../../../services/student";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function JobSwiper({ jobs, onBack, onJobAction, onJobApplied }) {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [discardedJobIds, setDiscardedJobIds] = useState(new Set());
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false); // ✅ Control para evitar doble llamada
  
  // Animaciones
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const currentJob = jobs[currentJobIndex];
  const nextJob = jobs[currentJobIndex + 1];

  // Cargar IDs aplicados desde el backend
  useEffect(() => {
    const loadAppliedJobs = async () => {
      try {
        const result = await studentService.getApplicationsByStatus("Pendiente");
        if (result.success && result.data) {
          const appliedIds = new Set(result.data.map(app => app.job_id));
          setAppliedJobIds(appliedIds);
        }
      } catch (error) {
        console.error("Error cargando aplicaciones previas:", error);
      }
    };
    loadAppliedJobs();
  }, []);

  const goToNextJob = () => {
    // Resetear animaciones
    swipeAnim.setValue(0);
    opacityAnim.setValue(1);
    setCurrentJobIndex((prev) => prev + 1);
    setIsProcessingAction(false); // ✅ Resetear estado
  };

  // ✅ Función unificada para aplicar (sin animación, solo la acción)
  const executeApply = async (job) => {
    console.log("🚀 EXECUTE APPLY", job.id);
    if (!job || isProcessingAction) return;
    
    const jobIdNum = Number(job.id);
    
    if (hasApplied(jobIdNum)) {
      Alert.alert("Aviso", "Ya has aplicado a esta oferta anteriormente.");
      goToNextJob();
      return;
    }

    setIsProcessingAction(true);
    setIsApplying(true);
    
    try {
      const result = await studentService.applyToJob(jobIdNum);
      
      if (result.success) {
        setAppliedJobIds(prev => new Set(prev).add(jobIdNum));
        
        if (onJobAction) {
          onJobAction('save', job);
        }
        if (onJobApplied) {
          onJobApplied(job, true);
        }
        
        Alert.alert("✅ ¡Aplicación exitosa!", `Has aplicado a ${job.title} en ${job.company}`);
        goToNextJob();
      } else {
        setIsProcessingAction(false);
        if (result.error?.includes("Ya has postulado") || result.error?.includes("Ya has aplicado")) {
          setAppliedJobIds(prev => new Set(prev).add(jobIdNum));
          Alert.alert("Aviso", "Ya habías aplicado a esta oferta anteriormente.");
          goToNextJob();
        } else {
          Alert.alert("Error", result.error || "No se pudo aplicar al trabajo.");
        }
      }
    } catch (error) {
      console.error("Error aplicando a trabajo:", error);
      Alert.alert("Error", "Ocurrió un error al aplicar. Intenta de nuevo.");
      setIsProcessingAction(false);
    } finally {
      setIsApplying(false);
    }
  };

  // ✅ Función unificada para descartar
  const executeDiscard = (job) => {
    if (!job || isProcessingAction) return;
    
    setIsProcessingAction(true);
    
    const jobIdNum = Number(job.id);
    
    if (!discardedJobIds.has(jobIdNum)) {
      setDiscardedJobIds(prev => new Set(prev).add(jobIdNum));
      
      if (onJobAction) {
        onJobAction('discard', job);
      }
      if (onJobApplied) {
        onJobApplied(job, false);
      }
    }
    
    goToNextJob();
  };

  // ✅ Animación y acción para aplicar (solo animación, la acción ya está separada)
  const animateApply = () => {
  console.log("🔥 BOTON APLICAR PRESIONADO");

  if (!currentJob || isProcessingAction) return;

  Animated.parallel([
    Animated.timing(swipeAnim, {
      toValue: screenWidth,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }),
  ]).start(() => {
    console.log("🔥 EJECUTANDO APPLY");
    executeApply(currentJob);
  });
};

  // ✅ Animación y acción para descartar
  const animateDiscard = () => {
    if (!currentJob || isProcessingAction) return;
    
    // Animar hacia la izquierda
    Animated.parallel([
      Animated.timing(swipeAnim, {
        toValue: -screenWidth,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      executeDiscard(currentJob);
    });
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const hasApplied = (jobId) => {
    return appliedJobIds.has(Number(jobId));
  };

  // Estilos animados
  const animatedCardStyle = {
    transform: [{ translateX: swipeAnim }],
    opacity: opacityAnim,
  };

  if (currentJobIndex >= jobs.length) {
    return (
      <View style={styles.endContainer}>
        <Text style={styles.endEmoji}>🎉</Text>
        <Text style={styles.endTitle}>¡No hay más ofertas!</Text>
        <Text style={styles.endSubtitle}>Has visto todas las ofertas disponibles</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{appliedJobIds.size}</Text>
            <Text style={styles.statLabel}>Aplicados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{discardedJobIds.size}</Text>
            <Text style={styles.statLabel}>Descartados</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.resetSearchButton} onPress={onBack}>
          <Text style={styles.resetSearchText}>Nueva búsqueda</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const alreadyApplied = hasApplied(currentJob?.id);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Filtros</Text>
        </TouchableOpacity>
        <Text style={styles.counterText}>
          {currentJobIndex + 1} / {jobs.length}
        </Text>
      </View>

      <View style={styles.swipeContainer}>
        {/* Siguiente carta (vista previa) */}
        {nextJob && (
          <View style={[styles.jobCard, styles.nextCard]}>
            <View style={styles.companyHeader}>
              <Image
                source={{ uri: nextJob.companyLogo || 'https://via.placeholder.com/56x56?text=Logo' }}
                style={styles.companyLogo}
              />
              <View style={styles.companyInfo}>
                <Text style={styles.jobTitle}>{nextJob.title}</Text>
                <Text style={styles.companyName}>{nextJob.company}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Carta actual animada */}
        <Animated.View style={[styles.jobCard, styles.currentCard, animatedCardStyle]}>
          {isApplying && (
            <View style={styles.applyingOverlay}>
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text style={styles.applyingText}>Aplicando...</Text>
            </View>
          )}
          
          {alreadyApplied && (
            <View style={styles.alreadyAppliedBadge}>
              <Text style={styles.alreadyAppliedText}>✓ Ya aplicaste</Text>
            </View>
          )}
          
          <View style={styles.companyHeader}>
            <Image
              source={{ uri: currentJob.companyLogo || 'https://via.placeholder.com/56x56?text=Logo' }}
              style={styles.companyLogo}
            />
            <View style={styles.companyInfo}>
              <Text style={styles.jobTitle}>{currentJob.title}</Text>
              <Text style={styles.companyName}>{currentJob.company}</Text>
            </View>
          </View>

          <View style={styles.jobDetails}>
            <View style={styles.detailBadge}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text style={styles.detailText}>{currentJob.location}</Text>
            </View>
            <View style={styles.detailBadge}>
              <Text style={styles.detailIcon}>💼</Text>
              <Text style={styles.detailText}>{currentJob.modality}</Text>
            </View>
            <View style={styles.detailBadge}>
              <Text style={styles.detailIcon}>💰</Text>
              <Text style={styles.detailText}>{currentJob.salary}</Text>
            </View>
          </View>

          <Text style={styles.description} numberOfLines={4}>
            {currentJob.description}
          </Text>

          <View style={styles.skillsContainer}>
            {currentJob.skills?.slice(0, 4).map((skill, idx) => (
              <View key={idx} style={styles.skillTag}>
                <Text style={styles.skillTagText}>{skill}</Text>
              </View>
            ))}
            {currentJob.skills?.length > 4 && (
              <View style={styles.skillTag}>
                <Text style={styles.skillTagText}>+{currentJob.skills.length - 4}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => handleViewDetails(currentJob)}
            disabled={isApplying || isProcessingAction}
          >
            <Text style={styles.expandButtonText}>Ver detalles completos →</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Botones de acción */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.discardButton]}
            onPress={animateDiscard}
            disabled={isApplying || isProcessingAction}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>✕</Text>
            <Text style={styles.actionButtonText}>Descartar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.applyButton, alreadyApplied && styles.applyButtonDisabled]}
            onPress={animateApply}
            disabled={isApplying || isProcessingAction || alreadyApplied}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>✓</Text>
            <Text style={styles.actionButtonText}>
              {alreadyApplied ? "Ya aplicaste" : "Aplicar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de detalles */}
      <Modal visible={showJobDetails} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedJob?.title}</Text>
              <TouchableOpacity onPress={() => setShowJobDetails(false)}>
                <Text style={styles.closeModal}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalCompany}>{selectedJob?.company}</Text>

              <View style={styles.modalDetailsRow}>
                <View style={styles.modalDetail}>
                  <Text style={styles.modalDetailIcon}>📍</Text>
                  <Text style={styles.modalDetailText}>{selectedJob?.location}</Text>
                </View>
                <View style={styles.modalDetail}>
                  <Text style={styles.modalDetailIcon}>💼</Text>
                  <Text style={styles.modalDetailText}>{selectedJob?.modality}</Text>
                </View>
                <View style={styles.modalDetail}>
                  <Text style={styles.modalDetailIcon}>💰</Text>
                  <Text style={styles.modalDetailText}>{selectedJob?.salary}</Text>
                </View>
              </View>

              <Text style={styles.modalSectionTitle}>Descripción del puesto</Text>
              <Text style={styles.modalDescription}>
                {selectedJob?.description}
              </Text>

              <Text style={styles.modalSectionTitle}>Requisitos</Text>
              {selectedJob?.requirements?.map((req, idx) => (
                <View key={idx} style={styles.requirementItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.requirementText}>{req}</Text>
                </View>
              ))}

              <Text style={styles.modalSectionTitle}>Beneficios</Text>
              {selectedJob?.benefits?.map((ben, idx) => (
                <View key={idx} style={styles.benefitItem}>
                  <Text style={styles.benefitIcon}>✨</Text>
                  <Text style={styles.benefitText}>{ben}</Text>
                </View>
              ))}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalApplyButton, alreadyApplied && styles.modalApplyButtonDisabled]}
                  onPress={() => {
                    if (alreadyApplied) {
                      Alert.alert("Aviso", "Ya has aplicado a esta oferta.");
                      return;
                    }
                    setShowJobDetails(false);
                    // ✅ Solo animar, no ejecutar la acción directamente
                    animateApply();
                  }}
                  disabled={isApplying || isProcessingAction || alreadyApplied}
                >
                  {isApplying ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.modalApplyText}>
                      {alreadyApplied ? "Ya aplicaste" : "Aplicar ahora"}
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDiscardButton}
                  onPress={() => {
                    setShowJobDetails(false);
                    // ✅ Solo animar, no ejecutar la acción directamente
                    animateDiscard();
                  }}
                >
                  <Text style={styles.modalDiscardText}>Descartar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Los estilos se mantienen igual (no los cambio para no alargar la respuesta)
const styles = StyleSheet.create({
  // ... (todos los estilos se mantienen igual que en tu código original)
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backButtonText: {
    color: "#4F46E5",
    fontWeight: "600",
    fontSize: 15,
  },
  counterText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  swipeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    position: "relative",
  },
  jobCard: {
    width: screenWidth - 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  currentCard: {
    position: "absolute",
    zIndex: 2,
  },
  nextCard: {
    opacity: 0.4,
    transform: [{ scale: 0.95 }],
    zIndex: 1,
  },
  applyingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  applyingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#4F46E5",
    fontWeight: "600",
  },
  alreadyAppliedBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 5,
  },
  alreadyAppliedText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  companyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F3F4F6",
  },
  companyInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: "#6B7280",
  },
  jobDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  detailBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 30,
  },
  detailIcon: {
    fontSize: 14,
  },
  detailText: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  skillTag: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skillTagText: {
    color: "#4F46E5",
    fontSize: 12,
    fontWeight: "500",
  },
  expandButton: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 16,
    alignItems: "center",
  },
  expandButtonText: {
    color: "#4F46E5",
    fontWeight: "600",
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginTop: screenHeight * 0.55,
    paddingBottom: 20,
  },
  actionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  discardButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#EF4444",
  },
  applyButton: {
    backgroundColor: "#4F46E5",
  },
  applyButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  actionButtonIcon: {
    fontSize: 32,
    fontWeight: "bold",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    color: "#1F2937",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: screenHeight * 0.85,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
  },
  closeModal: {
    fontSize: 24,
    color: "#6B7280",
    padding: 8,
  },
  modalCompany: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 20,
  },
  modalDetailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 30,
  },
  modalDetailIcon: {
    fontSize: 14,
  },
  modalDetailText: {
    fontSize: 13,
    color: "#4B5563",
  },
  modalSectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 20,
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  requirementItem: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  bullet: {
    fontSize: 14,
    color: "#EF4444",
  },
  requirementText: {
    fontSize: 14,
    color: "#1F2937",
    flex: 1,
    lineHeight: 20,
  },
  benefitItem: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  benefitIcon: {
    fontSize: 14,
  },
  benefitText: {
    fontSize: 14,
    color: "#1F2937",
    flex: 1,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
    marginBottom: 12,
  },
  modalApplyButton: {
    flex: 1,
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  modalApplyButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  modalApplyText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  modalDiscardButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  modalDiscardText: {
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 16,
  },
  endContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F5F7FA",
  },
  endEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  endTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  endSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 32,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4F46E5",
  },
  statLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  resetSearchButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
  },
  resetSearchText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});