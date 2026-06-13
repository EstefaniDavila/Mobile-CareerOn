import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, TextInput, Modal, Animated, PanResponder, Dimensions } from 'react-native';
import { useState, useRef, useEffect } from 'react';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function JobSearchScreen() {
  const [showFilters, setShowFilters] = useState(true);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [savedJobs, setSavedJobs] = useState([]);
  const [discardedJobs, setDiscardedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  
  const pan = useRef(new Animated.ValueXY()).current;
  const swipingRef = useRef(false);

  const [filters, setFilters] = useState({
    role: '',
    location: '',
    modality: '',
    salary: '',
  });

  const jobs = [
    {
      id: 1,
      title: "Desarrollador React Senior",
      company: "TechSolutions",
      location: "Remoto",
      modality: "Remoto",
      salary: "$3,500 - $4,800",
      description: "Buscamos un Desarrollador React Senior para unirse a nuestro equipo. Trabajarás en proyectos desafiantes con las últimas tecnologías.",
      requirements: ["5+ años en React", "TypeScript", "Next.js", "Inglés avanzado"],
      benefits: ["Trabajo 100% remoto", "Bonos trimestrales", "Días flexibles", "Capacitaciones pagadas"],
      companyLogo: "https://logo.clearbit.com/techsolutions.com",
      skills: ["React", "TypeScript", "Next.js", "Node.js"]
    },
    {
      id: 2,
      title: "Data Analyst Junior",
      company: "MercadoLibre",
      location: "Buenos Aires",
      modality: "Híbrido",
      salary: "$1,800 - $2,400",
      description: "Importante empresa busca Data Analyst para análisis de datos de usuarios y optimización de procesos.",
      requirements: ["SQL", "Python", "Power BI", "Excel avanzado"],
      benefits: ["Prepaga", "Descuentos en productos", "Gimnasio en oficina", "Días de estudio"],
      companyLogo: "https://logo.clearbit.com/mercadolibre.com",
      skills: ["SQL", "Python", "Power BI", "Tableau"]
    },
    {
      id: 3,
      title: "UX/UI Designer",
      company: "Globant",
      location: "Remoto",
      modality: "Remoto",
      salary: "$2,200 - $3,000",
      description: "Diseñador UX/UI con experiencia en productos digitales. Trabajarás con equipos internacionales.",
      requirements: ["Figma", "Adobe XD", "Investigación UX", "Prototipado"],
      benefits: ["Trabajo remoto", "Certificaciones", "Eventos internacionales", "Seguro médico"],
      companyLogo: "https://logo.clearbit.com/globant.com",
      skills: ["Figma", "UX Research", "Prototyping", "Design Systems"]
    },
    {
      id: 4,
      title: "Backend Developer Python",
      company: "Naranja X",
      location: "Córdoba",
      modality: "Híbrido",
      salary: "$2,500 - $3,500",
      description: "Desarrollador backend especializado en Python para servicios financieros.",
      requirements: ["Python", "Django/FastAPI", "PostgreSQL", "AWS"],
      benefits: ["Bono anual", "Osde 310", "Días extras", "Cursos pagos"],
      companyLogo: "https://logo.clearbit.com/naranjax.com",
      skills: ["Python", "Django", "AWS", "PostgreSQL"]
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "Despegar",
      location: "Remoto",
      modality: "Remoto",
      salary: "$3,000 - $4,200",
      description: "Ingeniero DevOps para automatización y mejora de infraestructura.",
      requirements: ["Docker", "Kubernetes", "CI/CD", "AWS/Azure"],
      benefits: ["Vacaciones extras", "Bono performance", "Certificaciones pagas", "Clases de inglés"],
      companyLogo: "https://logo.clearbit.com/despegar.com",
      skills: ["Docker", "K8s", "Jenkins", "Terraform"]
    },
  ];

  const currentJob = jobs[currentJobIndex];
  const nextJob = jobs[currentJobIndex + 1]; // Precargar la siguiente tarjeta

  const goToNextJob = () => {
    setCurrentJobIndex(prev => prev + 1);
    pan.setValue({ x: 0, y: 0 });
    swipingRef.current = false;
    setIsSwiping(false);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !swipingRef.current,
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dx) > 10 && !swipingRef.current;
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
          // Swipe derecha - Guardar
          handleSaveJob(currentJob);
          Animated.timing(pan, {
            toValue: { x: screenWidth, y: 0 },
            duration: 200,
            useNativeDriver: true,
          }).start(goToNextJob);
        } else if (gesture.dx < -120 && !swipingRef.current === false) {
          // Swipe izquierda - Descartar
          handleDiscardJob(currentJob);
          Animated.timing(pan, {
            toValue: { x: -screenWidth, y: 0 },
            duration: 200,
            useNativeDriver: true,
          }).start(goToNextJob);
        } else {
          // Volver
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
    })
  ).current;

  const handleSaveJob = (job) => {
    if (!savedJobs.find(j => j.id === job.id)) {
      setSavedJobs([...savedJobs, job]);
    }
  };

  const handleDiscardJob = (job) => {
    if (!discardedJobs.find(j => j.id === job.id)) {
      setDiscardedJobs([...discardedJobs, job]);
    }
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const getCardStyle = () => {
    const rotate = pan.x.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: ['-8deg', '0deg', '8deg'],
      extrapolate: 'clamp',
    });
    return {
      transform: [{ translateX: pan.x }, { rotate: rotate }],
    };
  };

  if (showFilters) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.filtersContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Buscar Empleos</Text>
            <Text style={styles.filtersSubtitle}>Encuentra tu próxima oportunidad</Text>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Rol</Text>
            <TextInput 
              style={styles.filterInput}
              placeholder="Ej: Desarrollador React"
              placeholderTextColor="#9CA3AF"
              value={filters.role}
              onChangeText={(text) => setFilters({...filters, role: text})}
            />
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Ubicación</Text>
            <TextInput 
              style={styles.filterInput}
              placeholder="Ciudad o Remoto"
              placeholderTextColor="#9CA3AF"
              value={filters.location}
              onChangeText={(text) => setFilters({...filters, location: text})}
            />
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Modalidad</Text>
            <View style={styles.modalityButtons}>
              {['Remoto', 'Híbrido', 'Presencial'].map(mod => (
                <TouchableOpacity 
                  key={mod}
                  style={[styles.modalityButton, filters.modality === mod && styles.modalityButtonActive]}
                  onPress={() => setFilters({...filters, modality: mod})}
                >
                  <Text style={[styles.modalityText, filters.modality === mod && styles.modalityTextActive]}>{mod}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Salario</Text>
            <View style={styles.salaryButtons}>
              {['< $1500', '$1500-$2500', '$2500-$4000', '> $4000'].map(sal => (
                <TouchableOpacity 
                  key={sal}
                  style={[styles.salaryButton, filters.salary === sal && styles.salaryButtonActive]}
                  onPress={() => setFilters({...filters, salary: sal})}
                >
                  <Text style={[styles.salaryText, filters.salary === sal && styles.salaryTextActive]}>{sal}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.resetButton} onPress={() => setFilters({ role: '', location: '', modality: '', salary: '' })}>
              <Text style={styles.resetText}>Resetear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchButton} onPress={() => setShowFilters(false)}>
              <Text style={styles.searchButtonText}>Ver ofertas →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (currentJobIndex < jobs.length) {
    return (
      <View style={styles.container}>
        <View style={styles.swipeHeader}>
          <TouchableOpacity onPress={() => setShowFilters(true)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Filtros</Text>
          </TouchableOpacity>
          <Text style={styles.counterText}>{currentJobIndex + 1} / {jobs.length}</Text>
        </View>

        <View style={styles.swipeContainer}>
          {/* Tarjeta actual */}
          <Animated.View 
            {...panResponder.panHandlers}
            style={[styles.jobCard, getCardStyle(), { zIndex: 2 }]}
          >
            <View style={styles.companyHeader}>
              <Image source={{ uri: currentJob.companyLogo }} style={styles.companyLogo} />
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

            <Text style={styles.description} numberOfLines={3}>{currentJob.description}</Text>

            <View style={styles.skillsContainer}>
              {currentJob.skills.slice(0, 3).map((skill, idx) => (
                <View key={idx} style={styles.skillTag}>
                  <Text style={styles.skillTagText}>{skill}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.expandButton} onPress={() => handleViewDetails(currentJob)}>
              <Text style={styles.expandButtonText}>Ver detalles</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Tarjeta siguiente (precargada) */}
          {nextJob && !isSwiping && (
            <View style={[styles.jobCard, styles.nextCard]}>
              <View style={styles.companyHeader}>
                <Image source={{ uri: nextJob.companyLogo }} style={styles.companyLogo} />
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
              <Text style={styles.instructionText}>Guardar</Text>
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
              <ScrollView>
                <Text style={styles.modalCompany}>{selectedJob?.company}</Text>
                
                <Text style={styles.modalSectionTitle}>Descripción</Text>
                <Text style={styles.modalDescription}>{selectedJob?.description}</Text>

                <Text style={styles.modalSectionTitle}>Requisitos</Text>
                {selectedJob?.requirements.map((req, idx) => (
                  <View key={idx} style={styles.requirementItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.requirementText}>{req}</Text>
                  </View>
                ))}

                <Text style={styles.modalSectionTitle}>Beneficios</Text>
                {selectedJob?.benefits.map((ben, idx) => (
                  <View key={idx} style={styles.benefitItem}>
                    <Text style={styles.benefitIcon}>✨</Text>
                    <Text style={styles.benefitText}>{ben}</Text>
                  </View>
                ))}

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.saveModalButton} onPress={() => {
                    handleSaveJob(selectedJob);
                    setShowJobDetails(false);
                  }}>
                    <Text style={styles.saveModalText}>Guardar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.discardModalButton} onPress={() => {
                    handleDiscardJob(selectedJob);
                    setShowJobDetails(false);
                  }}>
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

  return (
    <View style={styles.endContainer}>
      <Text style={styles.endEmoji}>🎉</Text>
      <Text style={styles.endTitle}>¡No hay más ofertas!</Text>
      <Text style={styles.endSubtitle}>Has visto todas las ofertas</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{savedJobs.length}</Text>
          <Text style={styles.statLabel}>Guardados</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{discardedJobs.length}</Text>
          <Text style={styles.statLabel}>Descartados</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.resetSearchButton} onPress={() => {
        setCurrentJobIndex(0);
        setSavedJobs([]);
        setDiscardedJobs([]);
        setShowFilters(true);
      }}>
        <Text style={styles.resetSearchText}>Nueva búsqueda</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  filtersContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  filtersHeader: {
    marginBottom: 32,
  },
  filtersTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  filtersSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  filterGroup: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  filterInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalityButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalityButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalityButtonActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  modalityText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  modalityTextActive: {
    color: '#FFFFFF',
  },
  salaryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  salaryButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  salaryButtonActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  salaryText: {
    color: '#6B7280',
    fontSize: 13,
  },
  salaryTextActive: {
    color: '#FFFFFF',
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resetText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  searchButton: {
    flex: 2,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  swipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backButtonText: {
    color: '#4F46E5',
    fontWeight: '500',
    fontSize: 15,
  },
  counterText: {
    color: '#6B7280',
    fontSize: 14,
  },
  swipeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    position: 'relative',
  },
  jobCard: {
    position: 'absolute',
    width: screenWidth - 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  nextCard: {
    opacity: 0.5,
    transform: [{ scale: 0.95 }],
    zIndex: 1,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  companyLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E5E7EB',
  },
  companyInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#6B7280',
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 30,
  },
  detailIcon: {
    fontSize: 12,
  },
  detailText: {
    fontSize: 12,
    color: '#4B5563',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  skillTag: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skillTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  expandButton: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
    alignItems: 'center',
  },
  expandButtonText: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 14,
  },
  swipeInstructions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginTop: 'auto',
    marginBottom: 20,
  },
  instructionBadge: {
    alignItems: 'center',
    gap: 4,
  },
  instructionIcon: {
    fontSize: 20,
  },
  instructionText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: screenHeight * 0.85,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  closeModal: {
    fontSize: 24,
    color: '#6B7280',
    padding: 8,
  },
  modalCompany: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  bullet: {
    fontSize: 14,
    color: '#EF4444',
  },
  requirementText: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  benefitIcon: {
    fontSize: 14,
  },
  benefitText: {
    fontSize: 14,
    color: '#1F2937',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 20,
  },
  saveModalButton: {
    flex: 1,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveModalText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  discardModalButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  discardModalText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  endContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  endEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  endTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  endSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  resetSearchButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
  },
  resetSearchText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});