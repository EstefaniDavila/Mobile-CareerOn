// screens/jobs/components/JobSwiper.js
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  PanResponder,
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
  const [appliedJobIds, setAppliedJobIds] = useState(new Set()); // Usar Set para IDs únicos
  const [discardedJobIds, setDiscardedJobIds] = useState(new Set());
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  
  const pan = useRef(new Animated.ValueXY()).current;
  const swipingRef = useRef(false);

  const currentJob = jobs[currentJobIndex];
  const nextJob = jobs[currentJobIndex + 1];

  // Cargar IDs aplicados desde el backend al montar el componente
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
    setCurrentJobIndex((prev) => prev + 1);
    pan.setValue({ x: 0, y: 0 });
    swipingRef.current = false;
    setIsSwiping(false);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !swipingRef.current && !isApplying,
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dx) > 10 && !swipingRef.current && !isApplying;
      },
      onPanResponderGrant: () => {
        swipingRef.current = true;
        setIsSwiping(true);
        pan.setOffset({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gesture) => {
        pan.setValue({ x: gesture.dx, y: 0 });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120 && !swipingRef.current === false) {
          handleApplyJob(currentJob);
          Animated.timing(pan, {
            toValue: { x: screenWidth, y: 0 },
            duration: 200,
            useNativeDriver: true,
          }).start(goToNextJob);
        } else if (gesture.dx < -120 && !swipingRef.current === false) {
          handleDiscardJob(currentJob);
          Animated.timing(pan, {
            toValue: { x: -screenWidth, y: 0 },
            duration: 200,
            useNativeDriver: true,
          }).start(goToNextJob);
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 9,
            tension: 40,
            useNativeDriver: true,
          }).start(() => {
            swipingRef.current = false;
            setIsSwiping(false);
          });
        }
      },
    }),
  ).current;

  // Verificar si ya aplicó a un trabajo
  const hasApplied = (jobId) => {
    return appliedJobIds.has(Number(jobId));
  };

  const handleApplyJob = async (job) => {
    const jobIdNum = Number(job.id);
    
    // Verificar si ya aplicó (local o desde backend)
    if (hasApplied(jobIdNum)) {
      Alert.alert("Aviso", "Ya has aplicado a esta oferta anteriormente.");
      // Aún así pasar al siguiente trabajo
      goToNextJob();
      return;
    }

    setIsApplying(true);
    
    try {
      const result = await studentService.applyToJob(jobIdNum);
      
      if (result.success) {
        // Agregar ID al Set
        setAppliedJobIds(prev => new Set(prev).add(jobIdNum));
        
        if (onJobAction) {
          onJobAction('save', job);
        }
        if (onJobApplied) {
          onJobApplied(job, true);
        }
        
        Alert.alert("✅ ¡Aplicación exitosa!", `Has aplicado a ${job.title} en ${job.company}`);
      } else {
        // Si el error es porque ya aplicó, agregarlo al Set localmente
        if (result.error?.includes("Ya has postulado")) {
          setAppliedJobIds(prev => new Set(prev).add(jobIdNum));
          Alert.alert("Aviso", "Ya habías aplicado a esta oferta anteriormente.");
        } else {
          Alert.alert("Error", result.error || "No se pudo aplicar al trabajo. Intenta de nuevo.");
        }
      }
    } catch (error) {
      console.error("Error aplicando a trabajo:", error);
      Alert.alert("Error", "Ocurrió un error al aplicar. Intenta de nuevo.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleDiscardJob = (job) => {
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
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const getCardStyle = () => {
    const rotate = pan.x.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: ["-8deg", "0deg", "8deg"],
      extrapolate: "clamp",
    });
    return {
      transform: [{ translateX: pan.x }, { rotate: rotate }],
    };
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

  // Verificar si el trabajo actual ya fue aplicado
  const alreadyApplied = hasApplied(currentJob?.id);

  return (
    <View style={styles.container}>
      <View style={styles.swipeHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Filtros</Text>
        </TouchableOpacity>
        <Text style={styles.counterText}>
          {currentJobIndex + 1} / {jobs.length}
        </Text>
      </View>

      <View style={styles.swipeContainer}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.jobCard, getCardStyle(), { zIndex: 2 }]}
        >
          {isApplying && (
            <View style={styles.applyingOverlay}>
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text style={styles.applyingText}>Aplicando...</Text>
            </View>
          )}
          
          {/* Badge de "Ya Aplicaste" */}
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

          <Text style={styles.description} numberOfLines={3}>
            {currentJob.description}
          </Text>

          <View style={styles.skillsContainer}>
            {currentJob.skills?.slice(0, 3).map((skill, idx) => (
              <View key={idx} style={styles.skillTag}>
                <Text style={styles.skillTagText}>{skill}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => handleViewDetails(currentJob)}
            disabled={isApplying}
          >
            <Text style={styles.expandButtonText}>Ver detalles</Text>
          </TouchableOpacity>
        </Animated.View>

        {nextJob && !isSwiping && (
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

        <View style={styles.swipeInstructions}>
          <View style={styles.instructionBadge}>
            <Text style={styles.instructionIcon}>←</Text>
            <Text style={styles.instructionText}>Descartar</Text>
          </View>
          <View style={styles.instructionBadge}>
            <Text style={styles.instructionIcon}>→</Text>
            <Text style={styles.instructionText}>Aplicar</Text>
          </View>
        </View>
      </View>

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

              <Text style={styles.modalSectionTitle}>Descripción</Text>
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
                  style={[styles.saveModalButton, alreadyApplied && styles.saveModalButtonDisabled]}
                  onPress={async () => {
                    if (alreadyApplied) {
                      Alert.alert("Aviso", "Ya has aplicado a esta oferta.");
                      return;
                    }
                    await handleApplyJob(selectedJob);
                    setShowJobDetails(false);
                  }}
                  disabled={isApplying || alreadyApplied}
                >
                  {isApplying ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveModalText}>
                      {alreadyApplied ? "Ya aplicaste" : "Aplicar ahora"}
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.discardModalButton}
                  onPress={() => {
                    handleDiscardJob(selectedJob);
                    setShowJobDetails(false);
                  }}
                >
                  <Text style={styles.discardModalText}>Descartar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  swipeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backButtonText: {
    color: "#4F46E5",
    fontWeight: "500",
    fontSize: 15,
  },
  counterText: {
    color: "#6B7280",
    fontSize: 14,
  },
  swipeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    position: "relative",
    paddingBottom: 100,
  },
  jobCard: {
    position: "absolute",
    width: screenWidth - 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    top: 20,
  },
  nextCard: {
    opacity: 0.5,
    transform: [{ scale: 0.95 }],
    zIndex: 1,
    top: 20,
  },
  applyingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  applyingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#4F46E5",
    fontWeight: "500",
  },
  alreadyAppliedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#10B981",
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    gap: 12,
    marginBottom: 20,
  },
  companyLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E5E7EB",
  },
  companyInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
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
    gap: 8,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  detailBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 30,
  },
  detailIcon: {
    fontSize: 12,
  },
  detailText: {
    fontSize: 12,
    color: "#4B5563",
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
    backgroundColor: "#4F46E5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skillTagText: {
    color: "#FFFFFF",
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
  swipeInstructions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
  },
  instructionBadge: {
    alignItems: "center",
    gap: 4,
  },
  instructionIcon: {
    fontSize: 20,
  },
  instructionText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: screenHeight * 0.85,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
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
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
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
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  bullet: {
    fontSize: 14,
    color: "#EF4444",
  },
  requirementText: {
    fontSize: 14,
    color: "#1F2937",
    flex: 1,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  benefitIcon: {
    fontSize: 14,
  },
  benefitText: {
    fontSize: 14,
    color: "#1F2937",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    marginBottom: 20,
  },
  saveModalButton: {
    flex: 1,
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveModalButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  saveModalText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  discardModalButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  discardModalText: {
    color: "#EF4444",
    fontWeight: "600",
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