import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Image, TextInput } from 'react-native';
import { useState } from 'react';

export default function SkillsScreen() {
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showSkillAlert, setShowSkillAlert] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const [userSkills, setUserSkills] = useState({
    "Excel": { level: 80, completed: true, date: "2024-01-10" },
    "SQL": { level: 65, completed: true, date: "2024-01-15" },
    "Python": { level: 40, completed: false },
    "Power BI": { level: 20, completed: false },
    "Tableau": { level: 0, completed: false },
  });

  const roadmaps = {
    "Data Analyst": {
      title: "Data Analyst",
      icon: "📊",
      description: "Conviértete en Analista de Datos desde cero",
      totalJobs: 1243,
      avgSalary: "$2,200 - $3,500",
      color: "#0F6C7A",
      nodes: [
        { id: 1, name: "Excel", level: "Básico a Intermedio", demand: "+45%", demandPercent: 85, duration: "40 horas", courses: [
          { name: "Excel desde Cero", platform: "CarrerOn", price: "Gratis", rating: 4.8 },
          { name: "Excel Avanzado para Datos", platform: "Coursera", price: "$49", rating: 4.9 },
        ]},
        { id: 2, name: "SQL", level: "Intermedio", demand: "+65%", demandPercent: 92, duration: "50 horas", courses: [
          { name: "SQL para Análisis de Datos", platform: "CarrerOn", price: "Gratis", rating: 4.9 },
        ]},
        { id: 3, name: "Python", level: "Intermedio", demand: "+78%", demandPercent: 95, duration: "80 horas", courses: [] },
        { id: 4, name: "Power BI", level: "Intermedio", demand: "+52%", demandPercent: 88, duration: "30 horas", courses: [] },
        { id: 5, name: "Tableau", level: "Básico", demand: "+38%", demandPercent: 70, duration: "25 horas", courses: [] },
      ]
    },
    "Frontend Dev": {
      title: "Frontend Developer",
      icon: "💻",
      description: "Especialízate en desarrollo web frontend",
      totalJobs: 2341,
      avgSalary: "$2,500 - $4,200",
      color: "#5B34F2",
      nodes: [
        { id: 1, name: "HTML/CSS", level: "Básico", demand: "+55%", demandPercent: 90, duration: "30 horas", courses: [] },
        { id: 2, name: "JavaScript", level: "Intermedio", demand: "+72%", demandPercent: 96, duration: "60 horas", courses: [] },
        { id: 3, name: "React", level: "Avanzado", demand: "+85%", demandPercent: 98, duration: "80 horas", courses: [] },
        { id: 4, name: "TypeScript", level: "Intermedio", demand: "+68%", demandPercent: 85, duration: "40 horas", courses: [] },
        { id: 5, name: "Next.js", level: "Intermedio", demand: "+62%", demandPercent: 82, duration: "50 horas", courses: [] },
      ]
    },
    "DevOps": {
      title: "DevOps Engineer",
      icon: "⚙️",
      description: "Automatización y cloud computing",
      totalJobs: 876,
      avgSalary: "$3,500 - $5,500",
      color: "#F59E0B",
      nodes: [
        { id: 1, name: "Linux", level: "Intermedio", demand: "+58%", demandPercent: 85, duration: "40 horas", courses: [] },
        { id: 2, name: "Docker", level: "Intermedio", demand: "+75%", demandPercent: 94, duration: "35 horas", courses: [] },
        { id: 3, name: "Kubernetes", level: "Avanzado", demand: "+82%", demandPercent: 96, duration: "60 horas", courses: [] },
        { id: 4, name: "CI/CD", level: "Intermedio", demand: "+70%", demandPercent: 90, duration: "30 horas", courses: [] },
        { id: 5, name: "AWS", level: "Avanzado", demand: "+80%", demandPercent: 95, duration: "70 horas", courses: [] },
      ]
    }
  };

  const rejectedSkills = ["React", "TypeScript"];
  const [selectedRoadmapData, setSelectedRoadmapData] = useState(roadmaps["Data Analyst"]);
  const [activeRoadmap, setActiveRoadmap] = useState("Data Analyst");

  const handleNodePress = (node) => {
    setSelectedSkill(node);
    setShowCourseModal(true);
  };

  const handleCompleteCourse = (skillName, courseName) => {
    setUserSkills(prev => ({
      ...prev,
      [skillName]: { 
        ...prev[skillName], 
        level: Math.min(prev[skillName]?.level + 20 || 20, 100), 
        completed: prev[skillName]?.level + 20 >= 100 
      }
    }));
  };

  const getNodeStatus = (skillName) => {
    if (userSkills[skillName]) {
      if (userSkills[skillName].completed) return "completed";
      if (userSkills[skillName].level > 0) return "in-progress";
    }
    return "pending";
  };

  const completedCount = Object.values(userSkills).filter(s => s.completed).length;
  const inProgressCount = Object.values(userSkills).filter(s => s.level > 0 && !s.completed).length;
  const totalNodes = selectedRoadmapData.nodes.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Skills & Roadmap</Text>
        <Text style={styles.headerSubtitle}>Construye tu plan de carrera</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner de alerta */}
        {rejectedSkills.length > 0 && (
          <TouchableOpacity style={styles.alertBanner} onPress={() => setShowSkillAlert(true)}>
            <View style={styles.alertIconCircle}>
              <Text style={styles.alertIcon}>⚠️</Text>
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Habilidades que te faltan</Text>
              <Text style={styles.alertText}>
                Fuiste rechazado por {rejectedSkills.join(", ")}
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
          <View style={[styles.roadmapHeader, { backgroundColor: selectedRoadmapData.color + '10' }]}>
            <Text style={styles.roadmapIcon}>{selectedRoadmapData.icon}</Text>
            <View>
              <Text style={styles.roadmapTitle}>{selectedRoadmapData.title}</Text>
              <Text style={styles.roadmapDescription}>{selectedRoadmapData.description}</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{selectedRoadmapData.totalJobs}</Text>
              <Text style={styles.statLabel}>Vacantes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{selectedRoadmapData.avgSalary}</Text>
              <Text style={styles.statLabel}>Salario</Text>
            </View>
          </View>
        </View>

        {/* Roadmap visual */}
        <View style={styles.roadmapContainer}>
          <Text style={styles.sectionTitle}>Ruta de aprendizaje</Text>
          
          {selectedRoadmapData.nodes.map((node, index) => {
            const status = getNodeStatus(node.name);
            const isRejected = rejectedSkills.includes(node.name);
            
            return (
              <View key={node.id} style={styles.roadmapNode}>
                {/* Línea conectora */}
                {index > 0 && (
                  <View style={[
                    styles.connectorLine,
                    status === "completed" && styles.connectorLineCompleted
                  ]} />
                )}
                
                {/* Nodo */}
                <TouchableOpacity 
                  style={[
                    styles.nodeCard,
                    status === "completed" && styles.nodeCardCompleted,
                    status === "in-progress" && styles.nodeCardProgress,
                    isRejected && !userSkills[node.name]?.completed && styles.nodeCardRejected
                  ]}
                  onPress={() => handleNodePress(node)}
                  activeOpacity={0.7}
                >
                  <View style={styles.nodeLeft}>
                    <View style={[
                      styles.nodeStatusIcon,
                      status === "completed" && styles.nodeStatusCompleted,
                      status === "in-progress" && styles.nodeStatusProgress,
                      isRejected && !userSkills[node.name]?.completed && styles.nodeStatusRejected
                    ]}>
                      <Text style={styles.nodeStatusText}>
                        {status === "completed" ? "✓" : 
                         status === "in-progress" ? "●" : 
                         isRejected ? "!" : index + 1}
                      </Text>
                    </View>
                    
                    <View style={styles.nodeContent}>
                      <Text style={styles.nodeName}>{node.name}</Text>
                      <View style={styles.nodeTags}>
                        <View style={styles.tag}>
                          <Text style={styles.tagText}>{node.level}</Text>
                        </View>
                        <View style={styles.tag}>
                          <Text style={styles.tagText}>⏱️ {node.duration}</Text>
                        </View>
                      </View>
                      
                      {/* Barra de demanda */}
                      <View style={styles.demandWrapper}>
                        <View style={styles.demandBar}>
                          <View style={[styles.demandFill, { width: `${node.demandPercent}%`, backgroundColor: selectedRoadmapData.color }]} />
                        </View>
                        <Text style={styles.demandValue}>{node.demand}</Text>
                      </View>
                      
                      {/* Progreso del usuario */}
                      {userSkills[node.name] && userSkills[node.name].level > 0 && !userSkills[node.name].completed && (
                        <View style={styles.userProgress}>
                          <View style={styles.userProgressBar}>
                            <View style={[styles.userProgressFill, { width: `${userSkills[node.name].level}%` }]} />
                          </View>
                          <Text style={styles.userProgressText}>{userSkills[node.name].level}% completado</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  {status === "completed" && (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedBadgeText}>✔</Text>
                    </View>
                  )}
                  
                  {isRejected && !userSkills[node.name]?.completed && (
                    <View style={styles.rejectedBadge}>
                      <Text style={styles.rejectedBadgeText}>!</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Estadísticas generales */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Tu progreso</Text>
          
          <View style={styles.globalProgress}>
            <View style={styles.globalProgressHeader}>
              <Text style={styles.globalProgressLabel}>Completado</Text>
              <Text style={styles.globalProgressPercent}>{Math.round(completedCount / totalNodes * 100)}%</Text>
            </View>
            <View style={styles.globalProgressBar}>
              <View style={[styles.globalProgressFill, { width: `${completedCount / totalNodes * 100}%` }]} />
            </View>
          </View>
          
          <View style={styles.skillStats}>
            <View style={styles.skillStatCard}>
              <Text style={[styles.skillStatNumber, { color: selectedRoadmapData.color }]}>{completedCount}</Text>
              <Text style={styles.skillStatLabel}>Completadas</Text>
            </View>
            <View style={styles.skillStatCard}>
              <Text style={[styles.skillStatNumber, { color: "#F59E0B" }]}>{inProgressCount}</Text>
              <Text style={styles.skillStatLabel}>En curso</Text>
            </View>
            <View style={styles.skillStatCard}>
              <Text style={[styles.skillStatNumber, { color: "#9CA3AF" }]}>{totalNodes - completedCount - inProgressCount}</Text>
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
              <Text style={styles.modalTitle}>Aprender {selectedSkill?.name}</Text>
              <TouchableOpacity onPress={() => setShowCourseModal(false)}>
                <Text style={styles.closeModal}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.skillInfoModal}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Demanda</Text>
                  <View style={styles.infoDemandBar}>
                    <View style={[styles.infoDemandFill, { width: `${selectedSkill?.demandPercent}%` }]} />
                  </View>
                  <Text style={styles.infoDemandValue}>{selectedSkill?.demand}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Duración</Text>
                  <Text style={styles.infoValue}>⏱️ {selectedSkill?.duration}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nivel</Text>
                  <Text style={styles.infoValue}>📊 {selectedSkill?.level}</Text>
                </View>
              </View>
              
              <Text style={styles.coursesTitle}>Cursos recomendados</Text>
              {selectedSkill?.courses.map((course, idx) => (
                <View key={idx} style={styles.courseCard}>
                  <View>
                    <Text style={styles.courseName}>{course.name}</Text>
                    <Text style={styles.coursePlatform}>{course.platform}</Text>
                  </View>
                  <View style={styles.courseRight}>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingStar}>★</Text>
                      <Text style={styles.ratingText}>{course.rating}</Text>
                    </View>
                    <Text style={[styles.coursePrice, course.price === "Gratis" && styles.freePrice]}>
                      {course.price}
                    </Text>
                    <TouchableOpacity 
                      style={styles.startCourseButton}
                      onPress={() => handleCompleteCourse(selectedSkill.name, course.name)}
                    >
                      <Text style={styles.startCourseText}>Iniciar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              
              <TouchableOpacity style={styles.simulateButtonModal}>
                <Text style={styles.simulateButtonTextModal}>Simular entrevista técnica</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de alerta */}
      <Modal visible={showSkillAlert} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.alertModal}>
            <View style={styles.alertModalIconCircle}>
              <Text style={styles.alertModalIcon}>⚠️</Text>
            </View>
            <Text style={styles.alertModalTitle}>Habilidades necesarias</Text>
            <Text style={styles.alertModalText}>
              Basado en tus rechazos, necesitas desarrollar estas habilidades:
            </Text>
            
            <View style={styles.rejectedSkillsList}>
              {rejectedSkills.map(skill => (
                <View key={skill} style={styles.rejectedSkillItem}>
                  <Text style={styles.rejectedSkillIcon}>📘</Text>
                  <Text style={styles.rejectedSkillName}>{skill}</Text>
                  <TouchableOpacity style={styles.learnNowButton}>
                    <Text style={styles.learnNowText}>Aprender →</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            
            <TouchableOpacity style={styles.closeAlertButton} onPress={() => setShowSkillAlert(false)}>
              <Text style={styles.closeAlertText}>Entendido</Text>
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
    backgroundColor: '#F9FAFB',
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
  // Alert Banner
  alertBanner: {
    backgroundColor: '#FEF2F2',
    margin: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  alertIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertIcon: {
    fontSize: 18,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  alertText: {
    color: '#DC2626',
    fontSize: 12,
  },
  alertArrow: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Roadmap Selector
  roadmapSelector: {
    flexDirection: 'row',
    margin: 16,
    gap: 8,
  },
  selectorButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectorButtonActive: {
    backgroundColor: '#5B34F2',
    borderColor: '#5B34F2',
  },
  selectorIcon: {
    fontSize: 14,
  },
  selectorText: {
    color: '#6B7280',
    fontWeight: '500',
    fontSize: 12,
  },
  selectorTextActive: {
    color: '#FFFFFF',
  },
  // Roadmap Info
  roadmapInfo: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  roadmapHeader: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roadmapIcon: {
    fontSize: 40,
  },
  roadmapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  roadmapDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  // Roadmap Nodes
  roadmapContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    marginLeft: 4,
  },
  roadmapNode: {
    position: 'relative',
    marginBottom: 12,
  },
  connectorLine: {
    position: 'absolute',
    top: -12,
    left: 20,
    width: 2,
    height: 12,
    backgroundColor: '#E5E7EB',
  },
  connectorLineCompleted: {
    backgroundColor: '#10B981',
  },
  nodeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  nodeCardCompleted: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  nodeCardProgress: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  nodeCardRejected: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  nodeLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  nodeStatusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeStatusCompleted: {
    backgroundColor: '#10B981',
  },
  nodeStatusProgress: {
    backgroundColor: '#3B82F6',
  },
  nodeStatusRejected: {
    backgroundColor: '#EF4444',
  },
  nodeStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  nodeContent: {
    flex: 1,
  },
  nodeName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  nodeTags: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    color: '#6B7280',
  },
  demandWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  demandBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  demandFill: {
    height: '100%',
    borderRadius: 2,
  },
  demandValue: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1F2937',
  },
  userProgress: {
    marginTop: 8,
  },
  userProgressBar: {
    height: 3,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  userProgressFill: {
    height: '100%',
    backgroundColor: '#5B34F2',
    borderRadius: 2,
  },
  userProgressText: {
    fontSize: 10,
    color: '#5B34F2',
  },
  completedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rejectedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Stats Container
  statsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  globalProgress: {
    marginBottom: 20,
  },
  globalProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  globalProgressLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  globalProgressPercent: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B34F2',
  },
  globalProgressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  globalProgressFill: {
    height: '100%',
    backgroundColor: '#5B34F2',
    borderRadius: 4,
  },
  skillStats: {
    flexDirection: 'row',
    gap: 12,
  },
  skillStatCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  skillStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  skillStatLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  // Modals
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
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeModal: {
    fontSize: 24,
    color: '#6B7280',
    padding: 4,
  },
  skillInfoModal: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    width: 60,
  },
  infoDemandBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  infoDemandFill: {
    height: '100%',
    backgroundColor: '#0F6C7A',
    borderRadius: 3,
  },
  infoDemandValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2937',
  },
  infoValue: {
    fontSize: 13,
    color: '#1F2937',
    flex: 1,
  },
  coursesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  courseCard: {
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  coursePlatform: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  courseRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingStar: {
    fontSize: 11,
    color: '#F59E0B',
  },
  ratingText: {
    fontSize: 11,
    color: '#6B7280',
  },
  coursePrice: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
  },
  freePrice: {
    color: '#10B981',
  },
  startCourseButton: {
    backgroundColor: '#5B34F2',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
  },
  startCourseText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },
  simulateButtonModal: {
    backgroundColor: '#0F6C7A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  simulateButtonTextModal: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  alertModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    margin: 20,
    alignItems: 'center',
  },
  alertModalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  alertModalIcon: {
    fontSize: 28,
  },
  alertModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  alertModalText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  rejectedSkillsList: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  rejectedSkillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  rejectedSkillIcon: {
    fontSize: 20,
  },
  rejectedSkillName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  learnNowButton: {
    backgroundColor: '#5B34F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  learnNowText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },
  closeAlertButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    width: '100%',
  },
  closeAlertText: {
    color: '#6B7280',
    fontWeight: '500',
  },
});