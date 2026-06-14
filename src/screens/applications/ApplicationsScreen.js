import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput, Image, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import studentService from '../../services/student';

export default function ApplicationsScreen() {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({
    Pendiente: false,
    En_revision: false,
    Entrevista: false,
    Rechazado: false,
    Ganador: false,
  });
  
  const [applications, setApplications] = useState({
    Pendiente: [],
    En_revision: [],
    Entrevista: [],
    Rechazado: [],
    Ganador: [],
  });

  // Mapeo de estados para mostrar en la UI
  const statusMapping = {
    'Pendiente': { title: '📌 Pendientes', icon: '⏳', columnId: 'Pendiente' },
    'En_revision': { title: '📤 En Revisión', icon: '👀', columnId: 'En_revision' },
    'Entrevista': { title: '🎙️ En Entrevista', icon: '🎯', columnId: 'Entrevista' },
    'Rechazado': { title: '❌ Rechazados', icon: '💔', columnId: 'Rechazado' },
    'Ganador': { title: '🏆 Ganadores', icon: '🎉', columnId: 'Ganador' },
  };

  // Cargar todas las aplicaciones por estado
  const loadApplicationsByStatus = async (status) => {
    console.log(`🔄 [${status}] Iniciando carga de aplicaciones...`);
    console.log(`🔍 [${status}] Status enviado a la API:`, status);
    
    setLoadingStates(prev => ({ ...prev, [status]: true }));
    try {
      const result = await studentService.getApplicationsByStatus(status);
      console.log(`📦 [${status}] Respuesta completa de la API:`, JSON.stringify(result, null, 2));
      
      if (result.success && result.data) {
        console.log(`✅ [${status}] Éxito. Cantidad de items recibidos:`, result.data.length);
        console.log(`📝 [${status}] Datos crudos de la API:`, JSON.stringify(result.data, null, 2));
        
        // Mapear los datos de la API al formato de la UI
        const formattedApps = result.data.map((app, index) => {
          console.log(`🔄 [${status}] Procesando item ${index + 1}:`);
          console.log(`📋 [${status}] Item completo:`, JSON.stringify(app, null, 2));
          
          // IMPORTANTE: Los datos del trabajo están anidados en JobPost
          const jobData = app.JobPost || {};
          console.log(`💼 [${status}] JobPost extraído:`, JSON.stringify(jobData, null, 2));
          
          const formatted = {
            id: app.id,
            // Datos del trabajo (vienen de JobPost)
            title: jobData.title || app.job_title || app.title || "Sin título",
            company: app.company_name || app.company || jobData.company || "Sin empresa",
            location: jobData.location || app.location || "No especificada",
            salary: jobData.salary_range || app.salary_range || app.salary || "No especificado",
            // Datos de la aplicación
            postedDate: app.created_at || app.posted_date,
            companyLogo: app.company_logo || `https://logo.clearbit.com/${(app.company_name || app.company || jobData.company || "")?.toLowerCase().replace(/\s/g, '')}.com`,
            matchPercent: app.match_percent || app.match_score || 75,
            requirements: jobData.requirements || app.requirements || [],
            appliedDate: app.applied_date || app.created_at,
            status: app.status,
            interviewDate: app.interview_date,
            interviewType: app.interview_type,
            feedbackTags: app.feedback_tags || [],
            closedDate: app.closed_date,
            // Guardar datos originales para depuración
            _raw: app
          };
          
          console.log(`✨ [${status}] Item formateado ${index + 1}:`, JSON.stringify(formatted, null, 2));
          return formatted;
        });
        
        console.log(`📊 [${status}] Total de aplicaciones formateadas:`, formattedApps.length);
        console.log(`📋 [${status}] Lista formateada completa:`, JSON.stringify(formattedApps, null, 2));
        
        setApplications(prev => ({
          ...prev,
          [status]: formattedApps
        }));
      } else {
        console.warn(`⚠️ [${status}] La API no retornó éxito o no tiene datos:`, result);
        console.log(`📭 [${status}] Estableciendo array vacío para ${status}`);
        setApplications(prev => ({
          ...prev,
          [status]: []
        }));
      }
    } catch (error) {
      console.error(`❌ [${status}] Error cargando aplicaciones:`, error);
      console.error(`❌ [${status}] Detalles del error:`, error.message, error.stack);
      setApplications(prev => ({
        ...prev,
        [status]: []
      }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [status]: false }));
      console.log(`🏁 [${status}] Finalizada carga. Estado de carga: false`);
    }
  };

  // Cargar todas las secciones al iniciar
  useEffect(() => {
    const loadAllApplications = async () => {
      console.log('🚀 Iniciando carga de todas las aplicaciones...');
      console.log('📋 Estados a cargar según BD: Pendiente, En_revision, Entrevista, Rechazado, Ganador');
      console.log('🔍 Verificando que los estados coincidan exactamente con la BD:');
      console.log('   - "Pendiente"');
      console.log('   - "En_revision"'); 
      console.log('   - "Entrevista"');
      console.log('   - "Rechazado"');
      console.log('   - "Ganador"');
      
      setLoading(true);
      
      await Promise.all([
        loadApplicationsByStatus('Pendiente'),
        loadApplicationsByStatus('En_revision'),
        loadApplicationsByStatus('Entrevista'),
        loadApplicationsByStatus('Rechazado'),
        loadApplicationsByStatus('Ganador'),
      ]);
      
      console.log('✅ Carga completa de todas las secciones');
      console.log('📊 Resumen final de aplicaciones cargadas:', {
        Pendiente: applications.Pendiente.length,
        En_revision: applications.En_revision.length,
        Entrevista: applications.Entrevista.length,
        Rechazado: applications.Rechazado.length,
        Ganador: applications.Ganador.length,
      });
      
      setLoading(false);
    };
    
    loadAllApplications();
  }, []);

  // Generar feedback con IA
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
    console.log('👁️ Ver feedback de aplicación:', application);
    setSelectedApplication(application);
    setShowFeedbackModal(true);
  };

  const handleViewDetails = (application, column) => {
    console.log(`👁️ Ver detalles de aplicación en columna ${column}:`, application);
    setSelectedApplication({ ...application, column });
    setShowDetailsModal(true);
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
      
      {(column === 'Rechazado' || column === 'Ganador') && application.feedbackTags && application.feedbackTags.length > 0 && (
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
    </TouchableOpacity>
  );

  const Column = ({ title, count, applications, columnId, icon, isLoading }) => {
    console.log(`🎨 Renderizando columna ${columnId} con ${count} aplicaciones`);
    return (
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
          {isLoading ? (
            <View style={styles.loadingColumn}>
              <ActivityIndicator size="small" color="#5B34F2" />
              <Text style={styles.loadingColumnText}>Cargando...</Text>
            </View>
          ) : (
            <>
              {applications.map(app => (
                <ColumnCard key={app.id} application={app} column={columnId} />
              ))}
              {applications.length === 0 && (
                <View style={styles.emptyColumn}>
                  <Text style={styles.emptyColumnText}>Sin aplicaciones</Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B34F2" />
        <Text style={styles.loadingText}>Cargando tus postulaciones...</Text>
      </View>
    );
  }

  console.log('📱 Renderizando pantalla principal con estados:', {
    Pendiente: applications.Pendiente.length,
    En_revision: applications.En_revision.length,
    Entrevista: applications.Entrevista.length,
    Rechazado: applications.Rechazado.length,
    Ganador: applications.Ganador.length,
  });

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
          title={statusMapping.Pendiente.title}
          count={applications.Pendiente.length}
          applications={applications.Pendiente}
          columnId={statusMapping.Pendiente.columnId}
          icon={statusMapping.Pendiente.icon}
          isLoading={loadingStates.Pendiente}
        />
        <Column 
          title={statusMapping.En_revision.title}
          count={applications.En_revision.length}
          applications={applications.En_revision}
          columnId={statusMapping.En_revision.columnId}
          icon={statusMapping.En_revision.icon}
          isLoading={loadingStates.En_revision}
        />
        <Column 
          title={statusMapping.Entrevista.title}
          count={applications.Entrevista.length}
          applications={applications.Entrevista}
          columnId={statusMapping.Entrevista.columnId}
          icon={statusMapping.Entrevista.icon}
          isLoading={loadingStates.Entrevista}
        />
        <Column 
          title={statusMapping.Rechazado.title}
          count={applications.Rechazado.length}
          applications={applications.Rechazado}
          columnId={statusMapping.Rechazado.columnId}
          icon={statusMapping.Rechazado.icon}
          isLoading={loadingStates.Rechazado}
        />
        <Column 
          title={statusMapping.Ganador.title}
          count={applications.Ganador.length}
          applications={applications.Ganador}
          columnId={statusMapping.Ganador.columnId}
          icon={statusMapping.Ganador.icon}
          isLoading={loadingStates.Ganador}
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
              
              {selectedApplication?.feedbackTags && selectedApplication.feedbackTags.length > 0 && (
                <View style={styles.tagsContainer}>
                  <Text style={styles.tagsTitle}>📌 Tags de mejora:</Text>
                  {selectedApplication.feedbackTags.map((tag, idx) => (
                    <View key={idx} style={styles.tagItem}>
                      <Text style={styles.tagBullet}>🔴</Text>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
              
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
              
              {selectedApplication?.requirements && selectedApplication.requirements.length > 0 && (
                <View style={styles.requirementsSection}>
                  <Text style={styles.sectionTitle}>✅ Requisitos clave</Text>
                  <View style={styles.requirementsList}>
                    {selectedApplication.requirements.map((req, idx) => (
                      <View key={idx} style={styles.requirementChip}>
                        <Text style={styles.requirementChipText}>{req}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              
              <View style={styles.matchSection}>
                <Text style={styles.sectionTitle}>🎯 Compatibilidad</Text>
                <View style={styles.matchBarLarge}>
                  <View style={[styles.matchFillLarge, { width: `${selectedApplication?.matchPercent}%` }]} />
                </View>
                <Text style={styles.matchPercentText}>{selectedApplication?.matchPercent}% de coincidencia</Text>
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
  loadingColumn: {
    padding: 32,
    alignItems: 'center',
  },
  loadingColumnText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCE5EC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#5F6368',
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
});