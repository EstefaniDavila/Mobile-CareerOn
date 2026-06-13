import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Image, TextInput } from 'react-native';
import { useState } from 'react';

export default function SkillsScreen() {
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showSkillAlert, setShowSkillAlert] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Estado de habilidades del usuario
  const [userSkills, setUserSkills] = useState({
    "Excel": { level: 80, completed: true, date: "2024-01-10" },
    "SQL": { level: 65, completed: true, date: "2024-01-15" },
    "Python": { level: 40, completed: false },
    "Power BI": { level: 20, completed: false },
    "Tableau": { level: 0, completed: false },
  });

  // Roadmaps disponibles
  const roadmaps = {
    "Data Analyst": {
      title: "Data Analyst",
      icon: "📊",
      description: "Conviértete en Analista de Datos desde cero",
      totalJobs: 1243,
      avgSalary: "$2,200 - $3,500",
      nodes: [
        { 
          id: 1, 
          name: "Excel", 
          level: "Básico a Intermedio", 
          demand: "+45%", 
          demandPercent: 85,
          duration: "40 horas",
          courses: [
            { name: "Excel desde Cero", platform: "CarrerOn", price: "Gratis", url: "", rating: 4.8 },
            { name: "Excel Avanzado para Datos", platform: "Coursera", price: "$49", url: "", rating: 4.9 },
          ]
        },
        { 
          id: 2, 
          name: "SQL", 
          level: "Intermedio", 
          demand: "+65%", 
          demandPercent: 92,
          duration: "50 horas",
          courses: [
            { name: "SQL para Análisis de Datos", platform: "CarrerOn", price: "Gratis", url: "", rating: 4.9 },
            { name: "The Complete SQL Course", platform: "Udemy", price: "$59", url: "", rating: 4.7 },
          ]
        },
        { 
          id: 3, 
          name: "Python", 
          level: "Intermedio", 
          demand: "+78%", 
          demandPercent: 95,
          duration: "80 horas",
          courses: [
            { name: "Python para Data Science", platform: "CarrerOn", price: "Gratis", url: "", rating: 4.9 },
            { name: "Python Data Analysis", platform: "DataCamp", price: "$29/mes", url: "", rating: 4.8 },
          ]
        },
        { 
          id: 4, 
          name: "Power BI", 
          level: "Intermedio", 
          demand: "+52%", 
          demandPercent: 88,
          duration: "30 horas",
          courses: [
            { name: "Power BI Desktop", platform: "CarrerOn", price: "Gratis", url: "", rating: 4.7 },
            { name: "Power BI Data Visualization", platform: "Microsoft Learn", price: "Gratis", url: "", rating: 4.6 },
          ]
        },
        { 
          id: 5, 
          name: "Tableau", 
          level: "Básico", 
          demand: "+38%", 
          demandPercent: 70,
          duration: "25 horas",
          courses: [
            { name: "Tableau Fundamentals", platform: "CarrerOn", price: "Gratis", url: "", rating: 4.5 },
          ]
        },
      ]
    },
    "Frontend Developer": {
      title: "Frontend Developer",
      icon: "💻",
      description: "Especialízate en desarrollo web frontend",
      totalJobs: 2341,
      avgSalary: "$2,500 - $4,200",
      nodes: [
        { id: 1, name: "HTML/CSS", level: "Básico", demand: "+55%", demandPercent: 90, duration: "30 horas", courses: [] },
        { id: 2, name: "JavaScript", level: "Intermedio", demand: "+72%", demandPercent: 96, duration: "60 horas", courses: [] },
        { id: 3, name: "React", level: "Avanzado", demand: "+85%", demandPercent: 98, duration: "80 horas", courses: [] },
        { id: 4, name: "TypeScript", level: "Intermedio", demand: "+68%", demandPercent: 85, duration: "40 horas", courses: [] },
        { id: 5, name: "Next.js", level: "Intermedio", demand: "+62%", demandPercent: 82, duration: "50 horas", courses: [] },
      ]
    },
    "DevOps Engineer": {
      title: "DevOps Engineer",
      icon: "⚙️",
      description: "Automatización y cloud computing",
      totalJobs: 876,
      avgSalary: "$3,500 - $5,500",
      nodes: [
        { id: 1, name: "Linux", level: "Intermedio", demand: "+58%", demandPercent: 85, duration: "40 horas", courses: [] },
        { id: 2, name: "Docker", level: "Intermedio", demand: "+75%", demandPercent: 94, duration: "35 horas", courses: [] },
        { id: 3, name: "Kubernetes", level: "Avanzado", demand: "+82%", demandPercent: 96, duration: "60 horas", courses: [] },
        { id: 4, name: "CI/CD", level: "Intermedio", demand: "+70%", demandPercent: 90, duration: "30 horas", courses: [] },
        { id: 5, name: "AWS", level: "Avanzado", demand: "+80%", demandPercent: 95, duration: "70 horas", courses: [] },
      ]
    }
  };

  const [selectedRoadmapData, setSelectedRoadmapData] = useState(roadmaps["Data Analyst"]);
  const [activeRoadmap, setActiveRoadmap] = useState("Data Analyst");

  // Habilidades rechazadas del buscador (simulación)
  const rejectedSkills = ["React", "TypeScript"];

  const handleNodePress = (node) => {
    setSelectedSkill(node);
    setShowCourseModal(true);
  };

  const handleCompleteCourse = (skillName, courseName) => {
    setUserSkills(prev => ({
      ...prev,
      [skillName]: { ...prev[skillName], level: Math.min(prev[skillName]?.level + 20 || 20, 100), completed: prev[skillName]?.level + 20 >= 100 }
    }));
  };

  const getNodeStatus = (skillName) => {
    if (userSkills[skillName]) {
      if (userSkills[skillName].completed) return "completed";
      if (userSkills[skillName].level > 0) return "in-progress";
    }
    return "pending";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📈 Skills & Roadmap</Text>
        <Text style={styles.headerSubtitle}>Construye tu plan de carrera</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner de habilidades rechazadas del buscador */}
        {rejectedSkills.length > 0 && (
          <TouchableOpacity style={styles.alertBanner} onPress={() => setShowSkillAlert(true)}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Habilidades que te faltan</Text>
              <Text style={styles.alertText}>
                Fuiste rechazado en vacantes por: {rejectedSkills.join(", ")}. 
                Aprende estas habilidades para calificar.
              </Text>
            </View>
            <Text style={styles.alertArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* Selector de roadmap */}
        <View style={styles.roadmapSelector}>
          {Object.keys(roadmaps).map(roadmap => (
            <TouchableOpacity 
              key={roadmap}
              style={[styles.selectorButton, activeRoadmap === roadmap && styles.selectorButtonActive]}
              onPress={() => {
                setActiveRoadmap(roadmap);
                setSelectedRoadmapData(roadmaps[roadmap]);
              }}
            >
              <Text style={styles.selectorIcon}>{roadmaps[roadmap].icon}</Text>
              <Text style={[styles.selectorText, activeRoadmap === roadmap && styles.selectorTextActive]}>
                {roadmap}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info del roadmap */}
        <View style={styles.roadmapInfo}>
          <Text style={styles.roadmapTitle}>{selectedRoadmapData.icon} {selectedRoadmapData.title}</Text>
          <Text style={styles.roadmapDescription}>{selectedRoadmapData.description}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{selectedRoadmapData.totalJobs}</Text>
              <Text style={styles.statLabel}>Vacantes activas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{selectedRoadmapData.avgSalary}</Text>
              <Text style={styles.statLabel}>Salario promedio</Text>
            </View>
          </View>
        </View>

        {/* Roadmap visual */}
        <View style={styles.roadmapContainer}>
          {selectedRoadmapData.nodes.map((node, index) => {
            const status = getNodeStatus(node.name);
            return (
              <View key={node.id} style={styles.roadmapNode}>
                {/* Línea conectora */}
                {index > 0 && (
                  <View style={[
                    styles.connectorLine,
                    status === "completed" && styles.connectorLineCompleted,
                    status === "in-progress" && styles.connectorLineProgress
                  ]} />
                )}
                
                {/* Nodo */}
                <TouchableOpacity 
                  style={[
                    styles.nodeCard,
                    status === "completed" && styles.nodeCardCompleted,
                    status === "in-progress" && styles.nodeCardProgress,
                    rejectedSkills.includes(node.name) && styles.nodeCardRejected
                  ]}
                  onPress={() => handleNodePress(node)}
                >
                  <View style={styles.nodeHeader}>
                    <View style={styles.nodeIconContainer}>
                      <Text style={styles.nodeIcon}>
                        {status === "completed" ? "✅" : 
                         status === "in-progress" ? "🔄" : 
                         rejectedSkills.includes(node.name) ? "⚠️" : "📘"}
                      </Text>
                    </View>
                    <Text style={styles.nodeName}>{node.name}</Text>
                    {status === "completed" && <Text style={styles.completedBadge}>Completado</Text>}
                    {rejectedSkills.includes(node.name) && !userSkills[node.name]?.completed && (
                      <Text style={styles.rejectedBadge}>Te falta</Text>
                    )}
                  </View>
                  
                  <View style={styles.nodeDetails}>
                    <View style={styles.demandContainer}>
                      <Text style={styles.demandLabel}>Demanda en mercado</Text>
                      <View style={styles.demandBar}>
                        <View style={[styles.demandFill, { width: `${node.demandPercent}%` }]} />
                      </View>
                      <Text style={styles.demandValue}>{node.demand}</Text>
                    </View>
                    
                    <View style={styles.nodeMeta}>
                      <Text style={styles.metaText}>⏱️ {node.duration}</Text>
                      <Text style={styles.metaText}>📊 {node.level}</Text>
                    </View>
                  </View>
                  
                  {userSkills[node.name] && userSkills[node.name].level > 0 && !userSkills[node.name].completed && (
                    <View style={styles.progressContainer}>
                      <View style={styles.skillProgressBar}>
                        <View style={[styles.skillProgressFill, { width: `${userSkills[node.name].level}%` }]} />
                      </View>
                      <Text style={styles.progressText}>{userSkills[node.name].level}% completado</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Estadísticas generales */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>📊 Tu progreso general</Text>
          <View style={styles.globalProgress}>
            <View style={styles.globalProgressBar}>
              <View style={[styles.globalProgressFill, { width: `${Object.values(userSkills).filter(s => s.completed).length / selectedRoadmapData.nodes.length * 100}%` }]} />
            </View>
            <Text style={styles.globalProgressText}>
              {Object.values(userSkills).filter(s => s.completed).length} de {selectedRoadmapData.nodes.length} habilidades completadas
            </Text>
          </View>
          
          <View style={styles.skillStats}>
            <View style={styles.skillStatCard}>
              <Text style={styles.skillStatNumber}>{Object.values(userSkills).filter(s => s.completed).length}</Text>
              <Text style={styles.skillStatLabel}>Completadas</Text>
            </View>
            <View style={styles.skillStatCard}>
              <Text style={styles.skillStatNumber}>{Object.values(userSkills).filter(s => s.level > 0 && !s.completed).length}</Text>
              <Text style={styles.skillStatLabel}>En curso</Text>
            </View>
            <View style={styles.skillStatCard}>
              <Text style={styles.skillStatNumber}>{selectedRoadmapData.nodes.length - Object.values(userSkills).filter(s => s.completed).length}</Text>
              <Text style={styles.skillStatLabel}>Pendientes</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal de cursos */}
      <Modal visible={showCourseModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.courseModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📚 Aprende {selectedSkill?.name}</Text>
              <TouchableOpacity onPress={() => setShowCourseModal(false)}>
                <Text style={styles.closeModal}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.skillInfoModal}>
                <View style={styles.demandContainerModal}>
                  <Text style={styles.demandLabelModal}>Demanda en el mercado</Text>
                  <View style={styles.demandBarModal}>
                    <View style={[styles.demandFillModal, { width: `${selectedSkill?.demandPercent}%` }]} />
                  </View>
                  <Text style={styles.demandValueModal}>{selectedSkill?.demand}</Text>
                </View>
                <Text style={styles.durationText}>⏱️ Duración estimada: {selectedSkill?.duration}</Text>
                <Text style={styles.levelText}>📊 Nivel requerido: {selectedSkill?.level}</Text>
              </View>
              
              <Text style={styles.coursesTitle}>🎓 Cursos recomendados</Text>
              {selectedSkill?.courses.map((course, idx) => (
                <View key={idx} style={styles.courseCard}>
                  <View style={styles.courseHeader}>
                    <Text style={styles.courseName}>{course.name}</Text>
                    <Text style={styles.coursePlatform}>{course.platform}</Text>
                  </View>
                  <View style={styles.courseFooter}>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingStar}>⭐</Text>
                      <Text style={styles.ratingText}>{course.rating}</Text>
                    </View>
                    <Text style={[styles.coursePrice, course.price === "Gratis" && styles.freePrice]}>
                      {course.price}
                    </Text>
                    <TouchableOpacity 
                      style={styles.startCourseButton}
                      onPress={() => handleCompleteCourse(selectedSkill.name, course.name)}
                    >
                      <Text style={styles.startCourseText}>Comenzar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              
              <TouchableOpacity style={styles.simulateButtonModal}>
                <Text style={styles.simulateButtonTextModal}>🎤 Simular entrevista para {selectedSkill?.name}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de alerta de habilidades */}
      <Modal visible={showSkillAlert} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.alertModal}>
            <View style={styles.alertModalHeader}>
              <Text style={styles.alertModalIcon}>⚠️</Text>
              <Text style={styles.alertModalTitle}>Habilidades que necesitas</Text>
            </View>
            <Text style={styles.alertModalText}>
              Basado en las vacantes a las que aplicaste y fuiste rechazado, 
              estas son las habilidades que debes desarrollar para calificar:
            </Text>
            <View style={styles.rejectedSkillsList}>
              {rejectedSkills.map(skill => (
                <View key={skill} style={styles.rejectedSkillItem}>
                  <Text style={styles.rejectedSkillIcon}>📘</Text>
                  <Text style={styles.rejectedSkillName}>{skill}</Text>
                  <TouchableOpacity style={styles.learnNowButton}>
                    <Text style={styles.learnNowText}>Aprender ahora →</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.closeAlertButton} onPress={() => setShowSkillAlert(false)}>
              <Text style={styles.closeAlertText}>Cerrar</Text>
            </TouchableOpacity>
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
  alertBanner: {
    backgroundColor: '#F25F63',
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alertIcon: {
    fontSize: 24,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alertText: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.95,
  },
  alertArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  roadmapSelector: {
    flexDirection: 'row',
    margin: 16,
    gap: 8,
  },
  selectorButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  selectorButtonActive: {
    backgroundColor: '#5B34F2',
  },
  selectorIcon: {
    fontSize: 16,
  },
  selectorText: {
    color: '#5F6368',
    fontWeight: '500',
  },
  selectorTextActive: {
    color: '#FFFFFF',
  },
  roadmapInfo: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
  },
  roadmapTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginBottom: 8,
  },
  roadmapDescription: {
    fontSize: 14,
    color: '#5F6368',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#DCE5EC',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F6C7A',
  },
  statLabel: {
    fontSize: 12,
    color: '#5F6368',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#DCE5EC',
  },
  roadmapContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  roadmapNode: {
    position: 'relative',
    marginBottom: 16,
  },
  connectorLine: {
    position: 'absolute',
    top: -20,
    left: 30,
    width: 3,
    height: 20,
    backgroundColor: '#DCE5EC',
  },
  connectorLineCompleted: {
    backgroundColor: '#0F6C7A',
  },
  connectorLineProgress: {
    backgroundColor: '#5B34F2',
  },
  nodeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#DCE5EC',
  },
  nodeCardCompleted: {
    borderLeftColor: '#0F6C7A',
    backgroundColor: '#F0F7F5',
  },
  nodeCardProgress: {
    borderLeftColor: '#5B34F2',
  },
  nodeCardRejected: {
    borderLeftColor: '#F25F63',
    backgroundColor: '#FFF5F5',
  },
  nodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  nodeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeIcon: {
    fontSize: 18,
  },
  nodeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1C',
    flex: 1,
  },
  completedBadge: {
    backgroundColor: '#0F6C7A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  rejectedBadge: {
    backgroundColor: '#F25F63',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  nodeDetails: {
    gap: 12,
  },
  demandContainer: {
    gap: 6,
  },
  demandLabel: {
    fontSize: 11,
    color: '#5F6368',
  },
  demandBar: {
    height: 6,
    backgroundColor: '#DCE5EC',
    borderRadius: 3,
    overflow: 'hidden',
  },
  demandFill: {
    height: '100%',
    backgroundColor: '#0F6C7A',
    borderRadius: 3,
  },
  demandValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F6C7A',
  },
  nodeMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaText: {
    fontSize: 11,
    color: '#5F6368',
  },
  progressContainer: {
    marginTop: 12,
    gap: 4,
  },
  skillProgressBar: {
    height: 4,
    backgroundColor: '#DCE5EC',
    borderRadius: 2,
    overflow: 'hidden',
  },
  skillProgressFill: {
    height: '100%',
    backgroundColor: '#5B34F2',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: '#5B34F2',
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginBottom: 16,
  },
  globalProgress: {
    marginBottom: 20,
    gap: 8,
  },
  globalProgressBar: {
    height: 8,
    backgroundColor: '#DCE5EC',
    borderRadius: 4,
    overflow: 'hidden',
  },
  globalProgressFill: {
    height: '100%',
    backgroundColor: '#5B34F2',
    borderRadius: 4,
  },
  globalProgressText: {
    fontSize: 12,
    color: '#5F6368',
  },
  skillStats: {
    flexDirection: 'row',
    gap: 12,
  },
  skillStatCard: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  skillStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5B34F2',
  },
  skillStatLabel: {
    fontSize: 11,
    color: '#5F6368',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  courseModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  alertModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    margin: 20,
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
  skillInfoModal: {
    backgroundColor: '#F3F3F3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  demandContainerModal: {
    gap: 4,
  },
  demandLabelModal: {
    fontSize: 12,
    color: '#5F6368',
  },
  demandBarModal: {
    height: 6,
    backgroundColor: '#DCE5EC',
    borderRadius: 3,
    overflow: 'hidden',
  },
  demandFillModal: {
    height: '100%',
    backgroundColor: '#0F6C7A',
    borderRadius: 3,
  },
  demandValueModal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F6C7A',
  },
  durationText: {
    fontSize: 13,
    color: '#1C1C1C',
  },
  levelText: {
    fontSize: 13,
    color: '#1C1C1C',
  },
  coursesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginBottom: 12,
  },
  courseCard: {
    backgroundColor: '#F3F3F3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  courseHeader: {
    marginBottom: 12,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  coursePlatform: {
    fontSize: 12,
    color: '#5F6368',
    marginTop: 2,
  },
  courseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingStar: {
    fontSize: 12,
  },
  ratingText: {
    fontSize: 12,
    color: '#5F6368',
  },
  coursePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  freePrice: {
    color: '#0F6C7A',
  },
  startCourseButton: {
    backgroundColor: '#5B34F2',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  startCourseText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  simulateButtonModal: {
    backgroundColor: '#0F6C7A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  simulateButtonTextModal: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  alertModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  alertModalIcon: {
    fontSize: 32,
  },
  alertModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  alertModalText: {
    fontSize: 14,
    color: '#5F6368',
    marginBottom: 20,
    lineHeight: 20,
  },
  rejectedSkillsList: {
    gap: 12,
    marginBottom: 20,
  },
  rejectedSkillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  rejectedSkillIcon: {
    fontSize: 20,
  },
  rejectedSkillName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1C',
  },
  learnNowButton: {
    backgroundColor: '#5B34F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  learnNowText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  closeAlertButton: {
    backgroundColor: '#F3F3F3',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeAlertText: {
    color: '#5F6368',
    fontWeight: '500',
  },
});