import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import { useState } from 'react';

export default function ApplicationsScreen() {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const [applications, setApplications] = useState({
    saved: [
      {
        id: 1,
        title: "Frontend Developer",
        company: "TechSolutions",
        location: "Remoto",
        salary: "$3,500 - $4,800",
        postedDate: "Hace 2 días",
        companyLogo: "https://logo.clearbit.com/techsolutions.com",
        matchPercent: 85,
        requirements: ["React", "TypeScript", "Next.js"],
        savedDate: "2024-01-15",
      },
      {
        id: 2,
        title: "UX/UI Designer",
        company: "Globant",
        location: "Remoto",
        salary: "$2,200 - $3,000",
        postedDate: "Hace 1 día",
        companyLogo: "https://logo.clearbit.com/globant.com",
        matchPercent: 72,
        requirements: ["Figma", "UX Research", "Prototyping"],
        savedDate: "2024-01-14",
      },
    ],
    applied: [
      {
        id: 3,
        title: "Data Analyst Junior",
        company: "MercadoLibre",
        location: "Buenos Aires",
        salary: "$1,800 - $2,400",
        postedDate: "Hace 5 días",
        companyLogo: "https://logo.clearbit.com/mercadolibre.com",
        matchPercent: 90,
        requirements: ["SQL", "Python", "Power BI"],
        appliedDate: "2024-01-10",
        status: "En revisión",
      },
      {
        id: 4,
        title: "Backend Developer Python",
        company: "Naranja X",
        location: "Córdoba",
        salary: "$2,500 - $3,500",
        postedDate: "Hace 3 días",
        companyLogo: "https://logo.clearbit.com/naranjax.com",
        matchPercent: 78,
        requirements: ["Python", "Django", "PostgreSQL"],
        appliedDate: "2024-01-12",
        status: "En revisión",
      },
    ],
    interview: [
      {
        id: 5,
        title: "DevOps Engineer",
        company: "Despegar",
        location: "Remoto",
        salary: "$3,000 - $4,200",
        postedDate: "Hace 4 días",
        companyLogo: "https://logo.clearbit.com/despegar.com",
        matchPercent: 88,
        requirements: ["Docker", "Kubernetes", "CI/CD"],
        appliedDate: "2024-01-08",
        interviewDate: "2024-01-20",
        interviewType: "Técnica - Zoom",
        status: "Agendada",
      },
    ],
    feedback: [
      {
        id: 6,
        title: "React Native Developer",
        company: "PedidosYa",
        location: "Remoto",
        salary: "$2,800 - $3,800",
        postedDate: "Hace 1 semana",
        companyLogo: "https://logo.clearbit.com/pedidosya.com",
        matchPercent: 68,
        requirements: ["React Native", "Redux", "Firebase"],
        appliedDate: "2024-01-05",
        closedDate: "2024-01-12",
        feedbackTags: ["Falta profundizar en React Native", "Expectativa salarial alta", "Comunicación técnica"],
        status: "No seleccionado",
      },
      {
        id: 7,
        title: "Product Manager",
        company: "Meli",
        location: "Híbrido",
        salary: "$3,500 - $5,000",
        postedDate: "Hace 2 semanas",
        companyLogo: "https://logo.clearbit.com/mercadolibre.com",
        matchPercent: 65,
        requirements: ["Agile", "Data Driven", "Leadership"],
        appliedDate: "2024-01-02",
        closedDate: "2024-01-10",
        feedbackTags: ["Falta experiencia en liderazgo", "Métricas de producto limitadas"],
        status: "No seleccionado",
      },
    ],
  });

  const generateAIFeedback = (tags, jobTitle, companyName) => {
    const feedbackTemplates = {
      "Falta profundizar en React Native": "Te recomendamos fortalecer tus conocimientos en React Native. Hay un curso gratuito de 20 horas en nuestra plataforma.",
      "Expectativa salarial alta": `Para ${companyName}, el rango salarial estándar es de $2,200 - $3,000. Te sugerimos investigar más los rangos del mercado.`,
      "Comunicación técnica": "La comunicación técnica es clave. Nuestro simulador de entrevistas tiene ejercicios específicos para mejorar esta habilidad.",
      "Falta experiencia en liderazgo": "El liderazgo se construye con práctica. Te invitamos a participar en proyectos open source.",
      "Métricas de producto limitadas": "Las métricas son fundamentales. Revisa nuestro curso de 'Métricas para Product Managers'.",
    };

    let feedback = `📋 Feedback de ${companyName} para ${jobTitle}\n\n`;
    feedback += "Áreas de mejora detectadas:\n\n";
    
    tags.forEach(tag => {
      const template = feedbackTemplates[tag] || `💡 ${tag}`;
      feedback += `• ${tag}\n   ${template}\n\n`;
    });
    
    feedback += "No te desanimes, cada entrevista es una oportunidad de aprendizaje. ¡Seguimos trabajando para la próxima! 💪";
    
    return feedback;
  };

  const handleViewFeedback = (application) => {
    setSelectedApplication(application);
    setShowFeedbackModal(true);
  };

  const handleViewDetails = (application, column) => {
    setSelectedApplication({ ...application, column });
    setShowDetailsModal(true);
  };

  const moveToNextStage = (application, currentColumn) => {
    const stages = ['saved', 'applied', 'interview'];
    const currentIndex = stages.indexOf(currentColumn);
    const nextStage = stages[currentIndex + 1];
    
    if (nextStage) {
      setApplications(prev => ({
        ...prev,
        [currentColumn]: prev[currentColumn].filter(app => app.id !== application.id),
        [nextStage]: [...prev[nextStage], { ...application, movedDate: new Date().toISOString() }]
      }));
    }
  };

  const ColumnCard = ({ application, column }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => handleViewDetails(application, column)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Image source={{ uri: application.companyLogo }} style={styles.cardLogo} />
        <View style={styles.cardHeaderInfo}>
          <Text style={styles.cardTitle}>{application.title}</Text>
          <Text style={styles.cardCompany}>{application.company}</Text>
        </View>
      </View>
      
      <View style={styles.cardDetails}>
        <View style={styles.cardDetail}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detailText}>{application.location}</Text>
        </View>
        <View style={styles.cardDetail}>
          <Text style={styles.detailIcon}>💰</Text>
          <Text style={styles.detailText}>{application.salary}</Text>
        </View>
      </View>
      
      <View style={styles.matchContainer}>
        <View style={styles.matchBar}>
          <View style={[styles.matchFill, { width: `${application.matchPercent}%` }]} />
        </View>
        <Text style={styles.matchText}>{application.matchPercent}% match con tu perfil</Text>
      </View>
      
      {column === 'feedback' && application.feedbackTags && (
        <TouchableOpacity 
          style={styles.feedbackButton}
          onPress={(e) => {
            e.stopPropagation();
            handleViewFeedback(application);
          }}
        >
          <Text style={styles.feedbackButtonText}>📝 Ver feedback de IA</Text>
        </TouchableOpacity>
      )}
      
      {column !== 'feedback' && (
        <TouchableOpacity 
          style={styles.moveButton}
          onPress={(e) => {
            e.stopPropagation();
            moveToNextStage(application, column);
          }}
        >
          <Text style={styles.moveButtonText}>
            {column === 'saved' && '📝 Postularme →'}
            {column === 'applied' && '🎯 Pasar a entrevista →'}
            {column === 'interview' && '✅ Marcar como finalizado →'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const Column = ({ title, count, applications, columnId, icon }) => (
    <View style={styles.column}>
      <View style={styles.columnHeader}>
        <Text style={styles.columnIcon}>{icon}</Text>
        <Text style={styles.columnTitle}>{title}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      </View>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {applications.map(app => (
          <ColumnCard key={app.id} application={app} column={columnId} />
        ))}
        {applications.length === 0 && (
          <View style={styles.emptyColumn}>
            <Text style={styles.emptyColumnText}>Sin aplicaciones</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Mis Postulaciones</Text>
        <Text style={styles.headerSubtitle}>Sigue el progreso de tus aplicaciones</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.kanbanContainer}
      >
        <Column 
          title="Guardadas" 
          count={applications.saved.length}
          applications={applications.saved}
          columnId="saved"
          icon="📌"
        />
        <Column 
          title="Postulado" 
          count={applications.applied.length}
          applications={applications.applied}
          columnId="applied"
          icon="📤"
        />
        <Column 
          title="En Entrevista" 
          count={applications.interview.length}
          applications={applications.interview}
          columnId="interview"
          icon="🎙️"
        />
        <Column 
          title="Feedback" 
          count={applications.feedback.length}
          applications={applications.feedback}
          columnId="feedback"
          icon="💬"
        />
      </ScrollView>

      {/* Modal de Feedback */}
      <Modal visible={showFeedbackModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.feedbackModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🤖 Feedback Inteligente</Text>
              <TouchableOpacity onPress={() => setShowFeedbackModal(false)}>
                <Text style={styles.closeModal}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.companyInfo}>
                <Text style={styles.feedbackCompany}>{selectedApplication?.company}</Text>
                <Text style={styles.feedbackPosition}>{selectedApplication?.title}</Text>
              </View>
              
              <View style={styles.tagsContainer}>
                <Text style={styles.tagsTitle}>📌 Tags de mejora:</Text>
                {selectedApplication?.feedbackTags?.map((tag, idx) => (
                  <View key={idx} style={styles.tagItem}>
                    <Text style={styles.tagBullet}>🔴</Text>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.aiFeedbackContainer}>
                <View style={styles.aiHeader}>
                  <Text style={styles.aiIcon}>🧠</Text>
                  <Text style={styles.aiTitle}>Análisis de IA</Text>
                </View>
                <Text style={styles.aiFeedbackText}>
                  {generateAIFeedback(
                    selectedApplication?.feedbackTags || [], 
                    selectedApplication?.title || '', 
                    selectedApplication?.company || ''
                  )}
                </Text>
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.simulateButton}>
                  <Text style={styles.simulateButtonText}>🎤 Simular entrevista</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.courseButton}>
                  <Text style={styles.courseButtonText}>📚 Ver cursos</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Detalles */}
      <Modal visible={showDetailsModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.detailsModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalles de la postulación</Text>
              <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                <Text style={styles.closeModal}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.detailsCompanyHeader}>
                <Image source={{ uri: selectedApplication?.companyLogo }} style={styles.detailsLogo} />
                <View>
                  <Text style={styles.detailsTitle}>{selectedApplication?.title}</Text>
                  <Text style={styles.detailsCompany}>{selectedApplication?.company}</Text>
                </View>
              </View>
              
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>📍 Ubicación</Text>
                  <Text style={styles.detailValue}>{selectedApplication?.location}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>💰 Salario</Text>
                  <Text style={styles.detailValue}>{selectedApplication?.salary}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>📅 Fecha</Text>
                  <Text style={styles.detailValue}>{selectedApplication?.appliedDate || selectedApplication?.savedDate}</Text>
                </View>
                {selectedApplication?.interviewDate && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>🎙️ Entrevista</Text>
                    <Text style={styles.detailValue}>{selectedApplication?.interviewDate}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.requirementsSection}>
                <Text style={styles.sectionTitle}>✅ Requisitos clave</Text>
                <View style={styles.requirementsList}>
                  {selectedApplication?.requirements?.map((req, idx) => (
                    <View key={idx} style={styles.requirementChip}>
                      <Text style={styles.requirementChipText}>{req}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <View style={styles.matchSection}>
                <Text style={styles.sectionTitle}>🎯 Compatibilidad</Text>
                <View style={styles.matchBarLarge}>
                  <View style={[styles.matchFillLarge, { width: `${selectedApplication?.matchPercent}%` }]} />
                </View>
                <Text style={styles.matchPercentText}>{selectedApplication?.matchPercent}% de coincidencia</Text>
              </View>
              
              {selectedApplication?.column !== 'feedback' && (
                <TouchableOpacity 
                  style={styles.continueButton}
                  onPress={() => {
                    if (selectedApplication?.column !== 'feedback') {
                      moveToNextStage(selectedApplication, selectedApplication.column);
                    }
                    setShowDetailsModal(false);
                  }}
                >
                  <Text style={styles.continueButtonText}>
                    {selectedApplication?.column === 'saved' && '📝 Continuar postulación →'}
                    {selectedApplication?.column === 'applied' && '🎯 Preparar entrevista →'}
                    {selectedApplication?.column === 'interview' && '✅ Marcar completado →'}
                  </Text>
                </TouchableOpacity>
              )}
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
    backgroundColor: '#DCE5EC',
  },
  header: {
    backgroundColor: '#4320C9',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
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
  kanbanContainer: {
    padding: 16,
    gap: 16,
    alignItems: 'flex-start',
  },
  column: {
    width: 320,
    backgroundColor: '#F3F3F3',
    borderRadius: 16,
    marginRight: 16,
    maxHeight: '78%',
    overflow: 'hidden',
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#DCE5EC',
    gap: 8,
  },
  columnIcon: {
    fontSize: 20,
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1C',
    flex: 1,
  },
  countBadge: {
    backgroundColor: '#5B34F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyColumn: {
    padding: 32,
    alignItems: 'center',
  },
  emptyColumnText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    margin: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  cardLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F3F3',
  },
  cardHeaderInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  cardCompany: {
    fontSize: 13,
    color: '#5F6368',
    marginTop: 2,
  },
  cardDetails: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  cardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailIcon: {
    fontSize: 12,
  },
  detailText: {
    fontSize: 12,
    color: '#5F6368',
  },
  matchContainer: {
    marginBottom: 12,
  },
  matchBar: {
    height: 6,
    backgroundColor: '#DCE5EC',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  matchFill: {
    height: '100%',
    backgroundColor: '#0F6C7A',
    borderRadius: 3,
  },
  matchText: {
    fontSize: 11,
    color: '#5F6368',
  },
  feedbackButton: {
    backgroundColor: '#F25F63',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  feedbackButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  moveButton: {
    backgroundColor: '#5B34F2',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  moveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  feedbackModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  detailsModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  closeModal: {
    fontSize: 24,
    color: '#5F6368',
    padding: 4,
  },
  companyInfo: {
    marginBottom: 20,
  },
  feedbackCompany: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  feedbackPosition: {
    fontSize: 14,
    color: '#5F6368',
    marginTop: 4,
  },
  tagsContainer: {
    marginBottom: 20,
  },
  tagsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1C',
    marginBottom: 12,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    backgroundColor: '#FFF5F5',
    padding: 10,
    borderRadius: 8,
  },
  tagBullet: {
    fontSize: 12,
  },
  tagText: {
    fontSize: 13,
    color: '#1C1C1C',
    flex: 1,
  },
  aiFeedbackContainer: {
    backgroundColor: '#F0F7FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aiIcon: {
    fontSize: 20,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5B34F2',
  },
  aiFeedbackText: {
    fontSize: 14,
    color: '#1C1C1C',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  simulateButton: {
    flex: 1,
    backgroundColor: '#5B34F2',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  simulateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  courseButton: {
    flex: 1,
    backgroundColor: '#0F6C7A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  courseButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  detailsCompanyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  detailsLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F3F3',
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  detailsCompany: {
    fontSize: 14,
    color: '#5F6368',
    marginTop: 2,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F3F3F3',
    padding: 12,
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 11,
    color: '#5F6368',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1C',
  },
  requirementsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginBottom: 12,
  },
  requirementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  requirementChip: {
    backgroundColor: '#0F6C7A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  requirementChipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  matchSection: {
    marginBottom: 20,
  },
  matchBarLarge: {
    height: 8,
    backgroundColor: '#DCE5EC',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  matchFillLarge: {
    height: '100%',
    backgroundColor: '#0F6C7A',
    borderRadius: 4,
  },
  matchPercentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F6C7A',
  },
  continueButton: {
    backgroundColor: '#5B34F2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});