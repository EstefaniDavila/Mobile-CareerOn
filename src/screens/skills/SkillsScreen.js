import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';

export default function SkillsScreen() {
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showSkillAlert, setShowSkillAlert] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userSkills, setUserSkills] = useState({});
  const [userRejectedSkills, setUserRejectedSkills] = useState([]);

  // CATEGORÍAS DE CARRERA (TODAS LAS CARRERAS)
  const careerCategories = {
    technology: { name: "Tecnología", icon: "💻", color: "#5B34F2" },
    business: { name: "Negocios", icon: "📊", color: "#0F6C7A" },
    health: { name: "Salud", icon: "🏥", color: "#10B981" },
    education: { name: "Educación", icon: "📚", color: "#F59E0B" },
    creative: { name: "Creativo", icon: "🎨", color: "#EC4899" },
    legal: { name: "Legal", icon: "⚖️", color: "#6366F1" },
    sales: { name: "Ventas", icon: "📈", color: "#F97316" },
    admin: { name: "Administrativo", icon: "📋", color: "#6B7280" },
  };

  // ROADMAPS POR CATEGORÍA Y ROL
  const roadmaps = {
    // Tecnología
    "Frontend Developer": {
      title: "Frontend Developer",
      icon: "💻",
      category: "technology",
      description: "Especialízate en desarrollo web frontend",
      totalJobs: 2341,
      avgSalary: "$2,500 - $4,200",
      color: "#5B34F2",
      skills: [
        { id: 1, name: "HTML/CSS", level: "Básico a Intermedio", demand: "+55%", demandPercent: 90, duration: "30 horas", category: "technology" },
        { id: 2, name: "JavaScript", level: "Intermedio", demand: "+72%", demandPercent: 96, duration: "60 horas", category: "technology" },
        { id: 3, name: "React", level: "Avanzado", demand: "+85%", demandPercent: 98, duration: "80 horas", category: "technology" },
        { id: 4, name: "TypeScript", level: "Intermedio", demand: "+68%", demandPercent: 85, duration: "40 horas", category: "technology" },
        { id: 5, name: "Next.js", level: "Intermedio", demand: "+62%", demandPercent: 82, duration: "50 horas", category: "technology" },
      ]
    },
    "Data Analyst": {
      title: "Data Analyst",
      icon: "📊",
      category: "technology",
      description: "Conviértete en Analista de Datos",
      totalJobs: 1243,
      avgSalary: "$2,200 - $3,500",
      color: "#0F6C7A",
      skills: [
        { id: 1, name: "Excel", level: "Básico a Intermedio", demand: "+45%", demandPercent: 85, duration: "40 horas", category: "technology" },
        { id: 2, name: "SQL", level: "Intermedio", demand: "+65%", demandPercent: 92, duration: "50 horas", category: "technology" },
        { id: 3, name: "Python", level: "Intermedio", demand: "+78%", demandPercent: 95, duration: "80 horas", category: "technology" },
        { id: 4, name: "Power BI", level: "Intermedio", demand: "+52%", demandPercent: 88, duration: "30 horas", category: "technology" },
        { id: 5, name: "Tableau", level: "Básico", demand: "+38%", demandPercent: 70, duration: "25 horas", category: "technology" },
      ]
    },
    // Negocios
    "Marketing Digital": {
      title: "Marketing Digital",
      icon: "📢",
      category: "business",
      description: "Especialízate en marketing online",
      totalJobs: 1876,
      avgSalary: "$1,800 - $3,200",
      color: "#0F6C7A",
      skills: [
        { id: 1, name: "SEO/SEM", level: "Intermedio", demand: "+68%", demandPercent: 88, duration: "40 horas", category: "business" },
        { id: 2, name: "Google Analytics", level: "Intermedio", demand: "+72%", demandPercent: 90, duration: "35 horas", category: "business" },
        { id: 3, name: "Social Media Ads", level: "Intermedio", demand: "+75%", demandPercent: 92, duration: "30 horas", category: "business" },
        { id: 4, name: "Email Marketing", level: "Básico", demand: "+45%", demandPercent: 75, duration: "20 horas", category: "business" },
        { id: 5, name: "Content Strategy", level: "Intermedio", demand: "+58%", demandPercent: 82, duration: "35 horas", category: "business" },
      ]
    },
    "Finanzas": {
      title: "Finanzas",
      icon: "💰",
      category: "business",
      description: "Gestión financiera y análisis",
      totalJobs: 945,
      avgSalary: "$2,500 - $4,500",
      color: "#10B981",
      skills: [
        { id: 1, name: "Contabilidad", level: "Intermedio", demand: "+55%", demandPercent: 85, duration: "50 horas", category: "business" },
        { id: 2, name: "Análisis Financiero", level: "Intermedio", demand: "+68%", demandPercent: 88, duration: "45 horas", category: "business" },
        { id: 3, name: "Excel Avanzado", level: "Avanzado", demand: "+72%", demandPercent: 92, duration: "40 horas", category: "business" },
        { id: 4, name: "Power BI", level: "Intermedio", demand: "+58%", demandPercent: 80, duration: "30 horas", category: "business" },
        { id: 5, name: "Gestión de Riesgos", level: "Básico", demand: "+45%", demandPercent: 70, duration: "35 horas", category: "business" },
      ]
    },
    // Salud
    "Enfermería": {
      title: "Enfermería",
      icon: "💉",
      category: "health",
      description: "Especialización en cuidados de enfermería",
      totalJobs: 3245,
      avgSalary: "$1,500 - $2,800",
      color: "#10B981",
      skills: [
        { id: 1, name: "Cuidados Básicos", level: "Intermedio", demand: "+85%", demandPercent: 95, duration: "60 horas", category: "health" },
        { id: 2, name: "Farmacología", level: "Intermedio", demand: "+72%", demandPercent: 88, duration: "50 horas", category: "health" },
        { id: 3, name: "Primeros Auxilios", level: "Básico", demand: "+90%", demandPercent: 96, duration: "30 horas", category: "health" },
        { id: 4, name: "Gestión de Pacientes", level: "Intermedio", demand: "+65%", demandPercent: 82, duration: "40 horas", category: "health" },
      ]
    },
    // Educación
    "Docencia": {
      title: "Docencia",
      icon: "👩‍🏫",
      category: "education",
      description: "Preparación para la enseñanza",
      totalJobs: 2156,
      avgSalary: "$1,200 - $2,500",
      color: "#F59E0B",
      skills: [
        { id: 1, name: "Planificación Educativa", level: "Intermedio", demand: "+68%", demandPercent: 85, duration: "40 horas", category: "education" },
        { id: 2, name: "Psicología Educativa", level: "Básico", demand: "+55%", demandPercent: 78, duration: "35 horas", category: "education" },
        { id: 3, name: "Tecnología Educativa", level: "Intermedio", demand: "+72%", demandPercent: 88, duration: "30 horas", category: "education" },
        { id: 4, name: "Evaluación del Aprendizaje", level: "Intermedio", demand: "+60%", demandPercent: 80, duration: "25 horas", category: "education" },
      ]
    },
    // Creativo
    "Diseño Gráfico": {
      title: "Diseño Gráfico",
      icon: "🎨",
      category: "creative",
      description: "Diseño visual y creativo",
      totalJobs: 1432,
      avgSalary: "$1,600 - $3,000",
      color: "#EC4899",
      skills: [
        { id: 1, name: "Photoshop", level: "Intermedio", demand: "+78%", demandPercent: 92, duration: "50 horas", category: "creative" },
        { id: 2, name: "Illustrator", level: "Intermedio", demand: "+72%", demandPercent: 88, duration: "45 horas", category: "creative" },
        { id: 3, name: "Diseño UI/UX", level: "Básico", demand: "+82%", demandPercent: 90, duration: "40 horas", category: "creative" },
        { id: 4, name: "Figma", level: "Intermedio", demand: "+75%", demandPercent: 86, duration: "30 horas", category: "creative" },
      ]
    },
    // Legal
    "Derecho Corporativo": {
      title: "Derecho Corporativo",
      icon: "⚖️",
      category: "legal",
      description: "Asesoría legal empresarial",
      totalJobs: 876,
      avgSalary: "$3,000 - $6,000",
      color: "#6366F1",
      skills: [
        { id: 1, name: "Derecho Contractual", level: "Avanzado", demand: "+68%", demandPercent: 88, duration: "60 horas", category: "legal" },
        { id: 2, name: "Propiedad Intelectual", level: "Intermedio", demand: "+55%", demandPercent: 78, duration: "40 horas", category: "legal" },
        { id: 3, name: "Cumplimiento Normativo", level: "Intermedio", demand: "+62%", demandPercent: 82, duration: "45 horas", category: "legal" },
      ]
    },
    // Ventas
    "Ventas B2B": {
      title: "Ventas B2B",
      icon: "📈",
      category: "sales",
      description: "Ventas empresariales",
      totalJobs: 1987,
      avgSalary: "$2,000 - $5,000",
      color: "#F97316",
      skills: [
        { id: 1, name: "Negociación", level: "Avanzado", demand: "+85%", demandPercent: 95, duration: "40 horas", category: "sales" },
        { id: 2, name: "CRM", level: "Intermedio", demand: "+72%", demandPercent: 88, duration: "30 horas", category: "sales" },
        { id: 3, name: "Prospección de Clientes", level: "Intermedio", demand: "+78%", demandPercent: 90, duration: "35 horas", category: "sales" },
        { id: 4, name: "Cierre de Ventas", level: "Avanzado", demand: "+82%", demandPercent: 92, duration: "25 horas", category: "sales" },
      ]
    },
    // Administrativo
    "Asistente Ejecutivo": {
      title: "Asistente Ejecutivo",
      icon: "📋",
      category: "admin",
      description: "Gestión administrativa",
      totalJobs: 2154,
      avgSalary: "$1,200 - $2,200",
      color: "#6B7280",
      skills: [
        { id: 1, name: "Office 365", level: "Intermedio", demand: "+85%", demandPercent: 94, duration: "30 horas", category: "admin" },
        { id: 2, name: "Gestión de Agenda", level: "Intermedio", demand: "+72%", demandPercent: 88, duration: "20 horas", category: "admin" },
        { id: 3, name: "Atención al Cliente", level: "Intermedio", demand: "+78%", demandPercent: 90, duration: "25 horas", category: "admin" },
        { id: 4, name: "Organización de Eventos", level: "Básico", demand: "+55%", demandPercent: 75, duration: "35 horas", category: "admin" },
      ]
    },
  };

  const [activeRoadmap, setActiveRoadmap] = useState("Frontend Developer");
  const [selectedCategory, setSelectedCategory] = useState("technology");
  const [showCategorySelector, setShowCategorySelector] = useState(true);
  const [selectedRoadmapData, setSelectedRoadmapData] = useState(roadmaps["Frontend Developer"]);

  // Filtrar roadmaps por categoría
  const getRoadmapsByCategory = (categoryId) => {
    return Object.entries(roadmaps)
      .filter(([key, value]) => value.category === categoryId)
      .map(([key, value]) => ({ key, ...value }));
  };

  // Cargar skills del usuario desde API
  useEffect(() => {
    fetchUserSkills();
    fetchUserRejectedSkills();
  }, []);

  const fetchUserSkills = async () => {
    try {
      const token = localStorage.getItem("mock_token") || "dummy_token";
      const response = await fetch("http://localhost:8000/api/user/skills", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Transformar datos de API a formato local
        const skillsMap = {};
        data.skills?.forEach(skill => {
          skillsMap[skill.name] = {
            level: skill.progress || skill.level || 0,
            completed: skill.completed || skill.progress >= 100,
            completedAt: skill.completedAt,
            id: skill.id
          };
        });
        setUserSkills(skillsMap);
      }
    } catch (error) {
      console.error("Error al cargar skills:", error);
      // Datos de ejemplo
      setUserSkills({
        "HTML/CSS": { level: 100, completed: true, completedAt: "2024-01-10" },
        "JavaScript": { level: 65, completed: false },
        "React": { level: 30, completed: false },
      });
    }
  };

  const fetchUserRejectedSkills = async () => {
    try {
      const token = localStorage.getItem("mock_token") || "dummy_token";
      const response = await fetch("http://localhost:8000/api/user/rejected-skills", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserRejectedSkills(data.rejectedSkills || []);
      }
    } catch (error) {
      console.error("Error al cargar rechazos:", error);
      setUserRejectedSkills(["React", "TypeScript"]);
    }
  };

  // Agregar skill al usuario
  const addUserSkill = async (skillName, progress = 0) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("mock_token") || "dummy_token";
      const response = await fetch("http://localhost:8000/api/user/skills", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: skillName,
          progress: progress,
          category: selectedRoadmapData?.category || "technology"
        })
      });

      if (response.ok) {
        const newSkill = await response.json();
        setUserSkills(prev => ({
          ...prev,
          [skillName]: {
            level: progress,
            completed: progress >= 100,
            id: newSkill.id
          }
        }));
        Alert.alert("Éxito", `¡${skillName} agregado a tu perfil!`);
        return true;
      } else {
        const error = await response.json();
        Alert.alert("Error", error.message || "No se pudo agregar la skill");
        return false;
      }
    } catch (error) {
      console.error("Error al agregar skill:", error);
      Alert.alert("Error", "Error de conexión");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar progreso de skill
  const updateSkillProgress = async (skillName, newProgress) => {
    const skillId = userSkills[skillName]?.id;
    if (!skillId) return false;

    try {
      const token = localStorage.getItem("mock_token") || "dummy_token";
      const response = await fetch(`http://localhost:8000/api/user/skills/${skillId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ progress: newProgress })
      });

      if (response.ok) {
        setUserSkills(prev => ({
          ...prev,
          [skillName]: {
            ...prev[skillName],
            level: newProgress,
            completed: newProgress >= 100
          }
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al actualizar skill:", error);
      return false;
    }
  };

  const handleNodePress = (skill) => {
    setSelectedSkill(skill);
    setShowCourseModal(true);
  };

  const handleCompleteCourse = async (skillName, courseName) => {
    const currentSkill = userSkills[skillName];
    const newProgress = Math.min((currentSkill?.level || 0) + 20, 100);
    const isCompleted = newProgress >= 100;

    if (currentSkill?.id) {
      await updateSkillProgress(skillName, newProgress);
    } else {
      await addUserSkill(skillName, newProgress);
    }

    if (isCompleted) {
      Alert.alert("🎉 Felicitaciones", `¡Has completado ${skillName}!`);
    } else {
      Alert.alert("Progreso actualizado", `${skillName}: ${newProgress}% completado`);
    }
  };

  const getNodeStatus = (skillName) => {
    if (userSkills[skillName]) {
      if (userSkills[skillName].completed) return "completed";
      if (userSkills[skillName].level > 0) return "in-progress";
    }
    if (userRejectedSkills.includes(skillName)) return "rejected";
    return "pending";
  };

  const completedCount = Object.values(userSkills).filter(s => s.completed).length;
  const inProgressCount = Object.values(userSkills).filter(s => s.level > 0 && !s.completed).length;
  const totalSkills = selectedRoadmapData?.skills?.length || 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Skills & Roadmap</Text>
        <Text style={styles.headerSubtitle}>Construye tu plan de carrera</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner de alerta - habilidades rechazadas */}
        {userRejectedSkills.length > 0 && (
          <TouchableOpacity style={styles.alertBanner} onPress={() => setShowSkillAlert(true)}>
            <View style={styles.alertIconCircle}>
              <Text style={styles.alertIcon}>⚠️</Text>
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Habilidades que te faltan</Text>
              <Text style={styles.alertText}>
                Fuiste rechazado por {userRejectedSkills.slice(0, 2).join(", ")}
                {userRejectedSkills.length > 2 && ` y ${userRejectedSkills.length - 2} más`}
              </Text>
            </View>
            <Text style={styles.alertArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* Selector de categoría */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorySelector}>
          {Object.entries(careerCategories).map(([key, cat]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.categoryButton,
                selectedCategory === key && { backgroundColor: cat.color, borderColor: cat.color }
              ]}
              onPress={() => {
                setSelectedCategory(key);
                setShowCategorySelector(true);
                // Seleccionar primer roadmap de la categoría
                const categoryRoadmaps = getRoadmapsByCategory(key);
                if (categoryRoadmaps.length > 0) {
                  setActiveRoadmap(categoryRoadmaps[0].key);
                  setSelectedRoadmapData(roadmaps[categoryRoadmaps[0].key]);
                }
              }}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={[styles.categoryText, selectedCategory === key && styles.categoryTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Selector de roadmap específico dentro de la categoría */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roadmapSelector}>
          {getRoadmapsByCategory(selectedCategory).map(roadmap => (
            <TouchableOpacity
              key={roadmap.key}
              style={[
                styles.selectorButton,
                activeRoadmap === roadmap.key && { backgroundColor: roadmap.color, borderColor: roadmap.color }
              ]}
              onPress={() => {
                setActiveRoadmap(roadmap.key);
                setSelectedRoadmapData(roadmaps[roadmap.key]);
                setShowCategorySelector(false);
              }}
            >
              <Text style={styles.selectorIcon}>{roadmap.icon}</Text>
              <Text style={[styles.selectorText, activeRoadmap === roadmap.key && styles.selectorTextActive]}>
                {roadmap.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Info del roadmap */}
        {selectedRoadmapData && (
          <>
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
                  <Text style={styles.statValue}>{selectedRoadmapData.totalJobs.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>Vacantes</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{selectedRoadmapData.avgSalary}</Text>
                  <Text style={styles.statLabel}>Salario</Text>
                </View>
              </View>
            </View>

            {/* Roadmap visual - skills */}
            <View style={styles.roadmapContainer}>
              <Text style={styles.sectionTitle}>Ruta de aprendizaje</Text>
              
              {selectedRoadmapData.skills.map((skill, index) => {
                const status = getNodeStatus(skill.name);
                
                return (
                  <View key={skill.id} style={styles.roadmapNode}>
                    {index > 0 && (
                      <View style={[
                        styles.connectorLine,
                        status === "completed" && styles.connectorLineCompleted
                      ]} />
                    )}
                    
                    <TouchableOpacity 
                      style={[
                        styles.nodeCard,
                        status === "completed" && styles.nodeCardCompleted,
                        status === "in-progress" && styles.nodeCardProgress,
                        status === "rejected" && styles.nodeCardRejected
                      ]}
                      onPress={() => handleNodePress(skill)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.nodeLeft}>
                        <View style={[
                          styles.nodeStatusIcon,
                          status === "completed" && styles.nodeStatusCompleted,
                          status === "in-progress" && styles.nodeStatusProgress,
                          status === "rejected" && styles.nodeStatusRejected
                        ]}>
                          <Text style={styles.nodeStatusText}>
                            {status === "completed" ? "✓" : 
                             status === "in-progress" ? "●" : 
                             status === "rejected" ? "!" : index + 1}
                          </Text>
                        </View>
                        
                        <View style={styles.nodeContent}>
                          <Text style={styles.nodeName}>{skill.name}</Text>
                          <View style={styles.nodeTags}>
                            <View style={styles.tag}>
                              <Text style={styles.tagText}>{skill.level}</Text>
                            </View>
                            <View style={styles.tag}>
                              <Text style={styles.tagText}>⏱️ {skill.duration}</Text>
                            </View>
                          </View>
                          
                          <View style={styles.demandWrapper}>
                            <View style={styles.demandBar}>
                              <View style={[styles.demandFill, { width: `${skill.demandPercent}%`, backgroundColor: selectedRoadmapData.color }]} />
                            </View>
                            <Text style={styles.demandValue}>{skill.demand}</Text>
                          </View>
                          
                          {userSkills[skill.name] && userSkills[skill.name].level > 0 && !userSkills[skill.name].completed && (
                            <View style={styles.userProgress}>
                              <View style={styles.userProgressBar}>
                                <View style={[styles.userProgressFill, { width: `${userSkills[skill.name].level}%` }]} />
                              </View>
                              <Text style={styles.userProgressText}>{userSkills[skill.name].level}% completado</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      
                      {status === "completed" && (
                        <View style={styles.completedBadge}>
                          <Text style={styles.completedBadgeText}>✔</Text>
                        </View>
                      )}
                      
                      {status === "rejected" && (
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
                  <Text style={styles.globalProgressPercent}>
                    {totalSkills > 0 ? Math.round(completedCount / totalSkills * 100) : 0}%
                  </Text>
                </View>
                <View style={styles.globalProgressBar}>
                  <View style={[styles.globalProgressFill, { width: `${totalSkills > 0 ? completedCount / totalSkills * 100 : 0}%` }]} />
                </View>
              </View>
              
              <View style={styles.skillStats}>
                <View style={styles.skillStatCard}>
                  <Text style={[styles.skillStatNumber, { color: selectedRoadmapData?.color || "#5B34F2" }]}>{completedCount}</Text>
                  <Text style={styles.skillStatLabel}>Completadas</Text>
                </View>
                <View style={styles.skillStatCard}>
                  <Text style={[styles.skillStatNumber, { color: "#F59E0B" }]}>{inProgressCount}</Text>
                  <Text style={styles.skillStatLabel}>En curso</Text>
                </View>
                <View style={styles.skillStatCard}>
                  <Text style={[styles.skillStatNumber, { color: "#9CA3AF" }]}>{Math.max(0, totalSkills - completedCount - inProgressCount)}</Text>
                  <Text style={styles.skillStatLabel}>Pendientes</Text>
                </View>
              </View>
            </View>
          </>
        )}
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
              
              {/* Cursos simulados */}
              <View style={styles.courseCard}>
                <View>
                  <Text style={styles.courseName}>{selectedSkill?.name} desde Cero</Text>
                  <Text style={styles.coursePlatform}>CarrerOn</Text>
                </View>
                <View style={styles.courseRight}>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingStar}>★</Text>
                    <Text style={styles.ratingText}>4.8</Text>
                  </View>
                  <Text style={styles.freePrice}>Gratis</Text>
                  <TouchableOpacity 
                    style={styles.startCourseButton}
                    onPress={() => {
                      handleCompleteCourse(selectedSkill?.name, "Curso básico");
                      setShowCourseModal(false);
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.startCourseText}>Iniciar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity style={styles.simulateButtonModal}>
                <Text style={styles.simulateButtonTextModal}>Simular entrevista técnica</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de alerta - habilidades rechazadas */}
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
              {userRejectedSkills.map(skill => (
                <View key={skill} style={styles.rejectedSkillItem}>
                  <Text style={styles.rejectedSkillIcon}>📘</Text>
                  <Text style={styles.rejectedSkillName}>{skill}</Text>
                  <TouchableOpacity 
                    style={styles.learnNowButton}
                    onPress={() => {
                      setShowSkillAlert(false);
                      // Buscar y seleccionar roadmap que contenga esta skill
                      const roadmapWithSkill = Object.entries(roadmaps).find(([key, value]) =>
                        value.skills.some(s => s.name === skill)
                      );
                      if (roadmapWithSkill) {
                        setActiveRoadmap(roadmapWithSkill[0]);
                        setSelectedRoadmapData(roadmapWithSkill[1]);
                        setSelectedCategory(roadmapWithSkill[1].category);
                      }
                    }}
                  >
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

// Los estilos se mantienen igual que en tu código original
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
  categorySelector: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 0,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  roadmapSelector: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexGrow: 0,
  },
  selectorButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectorIcon: {
    fontSize: 14,
  },
  selectorText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectorTextActive: {
    color: '#FFFFFF',
  },
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
  freePrice: {
    fontSize: 12,
    fontWeight: '500',
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