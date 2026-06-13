import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, TextInput, Modal, Animated, PanResponder, Dimensions } from 'react-native';
import { useState, useRef } from 'react';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function JobSearchScreen() {
  const [showFilters, setShowFilters] = useState(true);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [savedJobs, setSavedJobs] = useState([]);
  const [discardedJobs, setDiscardedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  
  // Animación para swipe
  const pan = useRef(new Animated.ValueXY()).current;
  const [isSwiping, setIsSwiping] = useState(false);

  // Filtros
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
      type: "Tiempo completo",
      description: "Buscamos un Desarrollador React Senior para unirse a nuestro equipo. Trabajarás en proyectos desafiantes con las últimas tecnologías.",
      requirements: ["5+ años en React", "TypeScript", "Next.js", "Inglés avanzado"],
      benefits: ["Trabajo 100% remoto", "Bonos trimestrales", "Días flexibles", "Capacitaciones pagadas"],
      companyLogo: "https://logo.clearbit.com/techsolutions.com",
      postedDate: "Hace 2 días",
      applicants: 45,
      skills: ["React", "TypeScript", "Next.js", "Node.js"]
    },
    {
      id: 2,
      title: "Data Analyst Junior",
      company: "MercadoLibre",
      location: "Buenos Aires",
      modality: "Híbrido",
      salary: "$1,800 - $2,400",
      type: "Tiempo completo",
      description: "Importante empresa busca Data Analyst para análisis de datos de usuarios y optimización de procesos.",
      requirements: ["SQL", "Python", "Power BI", "Excel avanzado"],
      benefits: ["Prepaga", "Descuentos en productos", "Gimnasio en oficina", "Días de estudio"],
      companyLogo: "https://logo.clearbit.com/mercadolibre.com",
      postedDate: "Hace 5 días",
      applicants: 128,
      skills: ["SQL", "Python", "Power BI", "Tableau"]
    },
    {
      id: 3,
      title: "UX/UI Designer",
      company: "Globant",
      location: "Remoto",
      modality: "Remoto",
      salary: "$2,200 - $3,000",
      type: "Tiempo completo",
      description: "Diseñador UX/UI con experiencia en productos digitales. Trabajarás con equipos internacionales.",
      requirements: ["Figma", "Adobe XD", "Investigación UX", "Prototipado"],
      benefits: ["Trabajo remoto", "Certificaciones", "Eventos internacionales", "Seguro médico"],
      companyLogo: "https://logo.clearbit.com/globant.com",
      postedDate: "Hace 1 día",
      applicants: 67,
      skills: ["Figma", "UX Research", "Prototyping", "Design Systems"]
    },
    {
      id: 4,
      title: "Backend Developer Python",
      company: "Naranja X",
      location: "Córdoba",
      modality: "Híbrido",
      salary: "$2,500 - $3,500",
      type: "Tiempo completo",
      description: "Desarrollador backend especializado en Python para servicios financieros.",
      requirements: ["Python", "Django/FastAPI", "PostgreSQL", "AWS"],
      benefits: ["Bono anual", "Osde 310", " días extras", "Cursos pagos"],
      companyLogo: "https://logo.clearbit.com/naranjax.com",
      postedDate: "Hace 3 días",
      applicants: 89,
      skills: ["Python", "Django", "AWS", "PostgreSQL"]
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "Despegar",
      location: "Remoto",
      modality: "Remoto",
      salary: "$3,000 - $4,200",
      type: "Tiempo completo",
      description: "Ingeniero DevOps para automatización y mejora de infraestructura.",
      requirements: ["Docker", "Kubernetes", "CI/CD", "AWS/Azure"],
      benefits: ["Vacaciones extras", "Bono performance", "Certificaciones pagas", "Clases de inglés"],
      companyLogo: "https://logo.clearbit.com/despegar.com",
      postedDate: "Hace 4 días",
      applicants: 34,
      skills: ["Docker", "K8s", "Jenkins", "Terraform"]
    },
  ];

  const currentJob = jobs[currentJobIndex];

  // Configurar PanResponder para swipe
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsSwiping(true);
        pan.setOffset({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gesture) => {
        pan.setValue({ x: gesture.dx, y: 0 });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          // Swipe derecha - Guardar empleo
          handleSaveJob(currentJob);
          Animated.spring(pan, {
            toValue: { x: screenWidth, y: 0 },
            useNativeDriver: true,
          }).start(() => {
            setCurrentJobIndex(prev => prev + 1);
            pan.setValue({ x: 0, y: 0 });
            setIsSwiping(false);
          });
        } else if (gesture.dx < -120) {
          // Swipe izquierda - Descartar empleo
          handleDiscardJob(currentJob);
          Animated.spring(pan, {
            toValue: { x: -screenWidth, y: 0 },
            useNativeDriver: true,
          }).start(() => {
            setCurrentJobIndex(prev => prev + 1);
            pan.setValue({ x: 0, y: 0 });
            setIsSwiping(false);
          });
        } else {
          // Volver a posición original
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start(() => {
            setIsSwiping(false);
          });
        }
      },
    })
  ).current;

  const handleSaveJob = (job) => {
    setSavedJobs([...savedJobs, job]);
  };

  const handleDiscardJob = (job) => {
    setDiscardedJobs([...discardedJobs, job]);
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const getCardStyle = () => {
    const rotate = pan.x.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp',
    });
    return {
      transform: [{ translateX: pan.x }, { rotate: rotate }],
    };
  };

  if (showFilters) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🔍 Buscar Empleos</Text>
          <Text style={styles.headerSubtitle}>Encuentra tu próxima oportunidad</Text>
        </View>

        <ScrollView style={styles.filtersContainer}>
          <Text style={styles.sectionTitle}>Filtros de búsqueda</Text>
          
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Rol / Puesto</Text>
            <TextInput 
              style={styles.filterInput}
              placeholder="Ej: Desarrollador React, Data Analyst..."
              placeholderTextColor="#5F6368"
              value={filters.role}
              onChangeText={(text) => setFilters({...filters, role: text})}
            />
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Ubicación</Text>
            <TextInput 
              style={styles.filterInput}
              placeholder="Ciudad, provincia o 'Remoto'"
              placeholderTextColor="#5F6368"
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
            <Text style={styles.filterLabel}>Rango salarial</Text>
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
              <Text style={styles.resetText}>Resetear filtros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchButton} onPress={() => setShowFilters(false)}>
              <Text style={styles.searchButtonText}>Ver ofertas →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Vista de tarjetas (Swipe)
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
          <Animated.View 
            {...panResponder.panHandlers}
            style={[styles.jobCard, getCardStyle()]}
          >
            <View style={styles.companyHeader}>
              <Image source={{ uri: currentJob.companyLogo }} style={styles.companyLogo} defaultSource={{ uri: 'https://via.placeholder.com/60' }} />
              <View>
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
              <View style={styles.detailBadge}>
                <Text style={styles.detailIcon}>⏰</Text>
                <Text style={styles.detailText}>{currentJob.type}</Text>
              </View>
            </View>

            <Text style={styles.descriptionTitle}>Descripción</Text>
            <Text style={styles.description} numberOfLines={3}>{currentJob.description}</Text>

            <View style={styles.skillsContainer}>
              {currentJob.skills.slice(0, 3).map((skill, idx) => (
                <View key={idx} style={styles.skillTag}>
                  <Text style={styles.skillTagText}>{skill}</Text>
                </View>
              ))}
              {currentJob.skills.length > 3 && (
                <View style={styles.skillTag}>
                  <Text style={styles.skillTagText}>+{currentJob.skills.length - 3}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.expandButton} onPress={() => handleViewDetails(currentJob)}>
              <Text style={styles.expandButtonText}>Ver detalles completos ↓</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.swipeInstructions}>
            <View style={styles.instructionBadge}>
              <Text style={styles.instructionIcon}>👈</Text>
              <Text style={styles.instructionText}>Descartar</Text>
            </View>
            <View style={styles.instructionBadge}>
              <Text style={styles.instructionIcon}>👉</Text>
              <Text style={styles.instructionText}>Guardar</Text>
            </View>
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
                
                <View style={styles.modalDetailsGrid}>
                  <View style={styles.modalDetailItem}>
                    <Text style={styles.modalDetailIcon}>📍</Text>
                    <Text style={styles.modalDetailText}>{selectedJob?.location}</Text>
                  </View>
                  <View style={styles.modalDetailItem}>
                    <Text style={styles.modalDetailIcon}>💰</Text>
                    <Text style={styles.modalDetailText}>{selectedJob?.salary}</Text>
                  </View>
                  <View style={styles.modalDetailItem}>
                    <Text style={styles.modalDetailIcon}>💼</Text>
                    <Text style={styles.modalDetailText}>{selectedJob?.modality}</Text>
                  </View>
                  <View style={styles.modalDetailItem}>
                    <Text style={styles.modalDetailIcon}>👥</Text>
                    <Text style={styles.modalDetailText}>{selectedJob?.applicants} postulantes</Text>
                  </View>
                </View>

                <Text style={styles.modalSectionTitle}>📋 Descripción completa</Text>
                <Text style={styles.modalDescription}>{selectedJob?.description}</Text>

                <Text style={styles.modalSectionTitle}>✅ Requisitos</Text>
                {selectedJob?.requirements.map((req, idx) => (
                  <View key={idx} style={styles.requirementItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.requirementText}>{req}</Text>
                  </View>
                ))}

                <Text style={styles.modalSectionTitle}>🎁 Beneficios</Text>
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
                    <Text style={styles.saveModalText}>💾 Guardar empleo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.discardModalButton} onPress={() => {
                    handleDiscardJob(selectedJob);
                    setShowJobDetails(false);
                  }}>
                    <Text style={styles.discardModalText}>✖ Descartar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Pantalla de fin de búsqueda
  return (
    <View style={styles.endContainer}>
      <Text style={styles.endEmoji}>🎉</Text>
      <Text style={styles.endTitle}>¡No hay más ofertas!</Text>
      <Text style={styles.endSubtitle}>Has visto todas las ofertas disponibles</Text>
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
        <Text style={styles.resetSearchText}>🔍 Nueva búsqueda</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.viewSavedButton} onPress={() => {}}>
        <Text style={styles.viewSavedText}>Ver empleos guardados →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCE5EC',
  },
  header: {
    backgroundColor: '#4320C9',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#DCE5EC',
    marginTop: 4,
  },
  filtersContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginBottom: 20,
  },
  filterGroup: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1C',
    marginBottom: 8,
  },
  filterInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#DCE5EC',
  },
  modalityButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalityButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCE5EC',
  },
  modalityButtonActive: {
    backgroundColor: '#5B34F2',
    borderColor: '#5B34F2',
  },
  modalityText: {
    color: '#5F6368',
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
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DCE5EC',
  },
  salaryButtonActive: {
    backgroundColor: '#5B34F2',
    borderColor: '#5B34F2',
  },
  salaryText: {
    color: '#5F6368',
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
    backgroundColor: '#F3F3F3',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetText: {
    color: '#5F6368',
    fontWeight: '500',
  },
  searchButton: {
    flex: 2,
    backgroundColor: '#5B34F2',
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
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#4320C9',
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  swipeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  jobCard: {
    width: screenWidth - 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F3F3',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  companyName: {
    fontSize: 14,
    color: '#5F6368',
    marginTop: 2,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    gap: 4,
  },
  detailIcon: {
    fontSize: 12,
  },
  detailText: {
    fontSize: 12,
    color: '#1C1C1C',
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1C',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#5F6368',
    lineHeight: 18,
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  skillTag: {
    backgroundColor: '#0F6C7A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  skillTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  expandButton: {
    backgroundColor: '#F3F3F3',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  expandButtonText: {
    color: '#5B34F2',
    fontWeight: '600',
    fontSize: 14,
  },
  swipeInstructions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 30,
  },
  instructionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionIcon: {
    fontSize: 16,
  },
  instructionText: {
    fontSize: 12,
    color: '#5F6368',
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
    maxHeight: screenHeight * 0.9,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1C1C',
    flex: 1,
  },
  closeModal: {
    fontSize: 24,
    color: '#5F6368',
    padding: 8,
  },
  modalCompany: {
    fontSize: 16,
    color: '#5F6368',
    marginBottom: 16,
  },
  modalDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  modalDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  modalDetailIcon: {
    fontSize: 14,
  },
  modalDetailText: {
    fontSize: 13,
    color: '#1C1C1C',
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginTop: 16,
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: '#5F6368',
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
    color: '#F25F63',
  },
  requirementText: {
    fontSize: 14,
    color: '#1C1C1C',
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
    color: '#1C1C1C',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 20,
  },
  saveModalButton: {
    flex: 1,
    backgroundColor: '#5B34F2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveModalText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  discardModalButton: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  discardModalText: {
    color: '#F25F63',
    fontWeight: 'bold',
  },
  endContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCE5EC',
    padding: 20,
  },
  endEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  endTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginBottom: 8,
  },
  endSubtitle: {
    fontSize: 14,
    color: '#5F6368',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 120,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5B34F2',
  },
  statLabel: {
    fontSize: 14,
    color: '#5F6368',
    marginTop: 4,
  },
  resetSearchButton: {
    backgroundColor: '#5B34F2',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 12,
  },
  resetSearchText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  viewSavedButton: {
    paddingVertical: 14,
  },
  viewSavedText: {
    color: '#5B34F2',
    fontWeight: '500',
  },
});