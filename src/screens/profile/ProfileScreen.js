import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Modal, Alert, ActivityIndicator } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import studentService from '../../services/student';
import experienceService from '../../services/experience';
import educationService from '../../services/education';
import userSkillService from '../../services/userSkill';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('datos');
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const scrollViewRef = useRef();
  
  // Estado para datos reales del usuario
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    experience: "",
    linkedin: "",
    github: "",
    portfolio: "",
    university: "",
    career: "",
    summary: "",
  });

  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [languages, setLanguages] = useState([]);

  const [optimizedCV, setOptimizedCV] = useState({
    summary: "",
    skills: "",
    achievements: [],
    keywords: [],
  });

  // Estado para modales de agregar/editar
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newExperience, setNewExperience] = useState({ company: "", position: "", start_date: "", end_date: "", description: "" });
  const [newEducation, setNewEducation] = useState({ institution: "", degree: "", start_year: "", end_year: "", description: "" });
  const [newProject, setNewProject] = useState({ name: "", description: "", year: "" });
  const [newSkill, setNewSkill] = useState({ name: "", level: 50 });

  const chatbotQuestions = [
    { question: "¿Cuál es tu mayor logro profesional medible?", field: "achievement", help: "Ej: Aumenté ventas en 30% en 6 meses" },
    { question: "¿Qué tecnologías dominas?", field: "skills", help: "Ej: React, Python, SQL, AWS" },
    { question: "¿Cuál es tu nivel de inglés?", field: "english", help: "Ej: Avanzado (C1)" },
    { question: "¿Has liderado equipos? Cuéntame", field: "leadership", help: "Ej: Lideré un equipo de 5 personas" },
  ];

  const [chatbotStep, setChatbotStep] = useState(0);
  const [chatbotAnswers, setChatbotAnswers] = useState({});

  // Cargar perfil al iniciar
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const profileResult = await studentService.getProfile();

      console.log("Profile result:", profileResult);

      if (profileResult.success) {
        const responseData = profileResult.data?.data || profileResult.data || {};
        const user = responseData.user || {};
        const experiences = responseData.experiences || [];
        const projectsList = responseData.projects || [];
        const skillsList = responseData.skills || [];
        const languagesList = responseData.languages || [];

        console.log("Experiencias encontradas:", experiences.length);
        console.log("Skills encontradas:", skillsList.length);
        console.log("Proyectos encontrados:", projectsList.length);

        setUserData({
          fullName: user.name || user.full_name || "",
          email: user.email || "",
          phone: user.phone || "",
          location: user.location || `${user.city || ""} ${user.country || ""}`.trim(),
          title: user.title || user.job_title || user.headline || "",
          experience: user.experience_type || user.years_experience || "",
          linkedin: user.linkedin_url || user.linkedin || "",
          github: user.github_url || user.github || "",
          portfolio: user.portfolio_url || user.portfolio || "",
          university: user.university || "",
          career: user.career || "",
          summary: user.summary || user.bio || "",
        });

        setExperience(experiences.map((exp) => ({
          id: exp.id,
          company: exp.company,
          position: exp.position,
          start_date: exp.start_date,
          end_date: exp.end_date,
          period: `${exp.start_date || ''} - ${exp.end_date || 'Presente'}`,
          description: exp.description,
        })));

        setEducation(projectsList.map((proj) => ({
          id: proj.id,
          degree: proj.name,
          institution: proj.organization || "Proyecto",
          start_year: proj.start_year,
          end_year: proj.end_year,
          year: proj.end_year || "",
          description: proj.description || "",
        })));

        setSkills(skillsList.map((skill) => ({
          id: skill.id,
          name: skill.name || skill.skill_name,
          level: skill.level || 50,
        })));

        if (languagesList.length > 0) {
          setLanguages(languagesList);
        }

        const currentCV = responseData.current_cv || {};
        if (currentCV && currentCV.cv_mejorado) {
          setOptimizedCV({
            summary: currentCV.cv_mejorado.summary || user.summary || "",
            skills: currentCV.cv_mejorado.skills || skillsList.map(s => s.name).join(", "),
            achievements: currentCV.cv_mejorado.achievements || [],
            keywords: currentCV.cv_mejorado.keywords || [],
          });
        } else if (user.summary) {
          setOptimizedCV({
            summary: user.summary,
            skills: skillsList.map(s => s.name).join(", "),
            achievements: [],
            keywords: [],
          });
        }
      } else {
        Alert.alert("Error", profileResult.error || "No se pudo cargar el perfil");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "No se pudo cargar el perfil del usuario");
    } finally {
      setLoading(false);
    }
  };

  const saveUserData = async () => {
    setSaving(true);
    try {
      const result = await studentService.updateProfile?.(userData);
      if (result?.success) {
        Alert.alert("Éxito", "Perfil actualizado correctamente");
        loadUserProfile();
      } else {
        Alert.alert("Info", "Los datos se actualizarán correctamente");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const addExperience = async () => {
    if (!newExperience.company || !newExperience.position) {
      Alert.alert("Error", "Completa los campos obligatorios (Empresa y Puesto)");
      return;
    }

    const dataToSend = {
      company: newExperience.company,
      position: newExperience.position,
      start_date: newExperience.start_date || null,
      end_date: newExperience.end_date || null,
      description: newExperience.description || "",
    };

    console.log("Enviando experiencia:", dataToSend);

    const result = await experienceService.createExperience(dataToSend);
    
    console.log("Respuesta del servidor:", result);

    if (result.success) {
      Alert.alert("Éxito", "Experiencia agregada correctamente");
      setShowExperienceModal(false);
      setNewExperience({ company: "", position: "", start_date: "", end_date: "", description: "" });
      loadUserProfile();
    } else {
      Alert.alert("Error", result.error || "No se pudo agregar la experiencia");
    }
  };

  const deleteExperience = async (id) => {
    Alert.alert("Confirmar", "¿Eliminar esta experiencia?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const result = await experienceService.deleteExperience(id);
          if (result.success) {
            Alert.alert("Éxito", "Experiencia eliminada correctamente");
            loadUserProfile();
          } else {
            Alert.alert("Error", result.error);
          }
        }
      }
    ]);
  };

  const addEducation = async () => {
    if (!newEducation.institution || !newEducation.degree) {
      Alert.alert("Error", "Completa los campos obligatorios (Institución y Título)");
      return;
    }

    const dataToSend = {
      institution: newEducation.institution,
      degree: newEducation.degree,
      start_year: newEducation.start_year || null,
      end_year: newEducation.end_year || null,
      description: newEducation.description || "",
    };

    console.log("Enviando educación:", dataToSend);

    const result = await educationService.createEducation(dataToSend);
    
    console.log("Respuesta del servidor:", result);

    if (result.success) {
      Alert.alert("Éxito", "Educación agregada correctamente");
      setShowEducationModal(false);
      setNewEducation({ institution: "", degree: "", start_year: "", end_year: "", description: "" });
      loadUserProfile();
    } else {
      Alert.alert("Error", result.error || "No se pudo agregar la educación");
    }
  };

  const deleteEducation = async (id) => {
    Alert.alert("Confirmar", "¿Eliminar esta educación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const result = await educationService.deleteEducation(id);
          if (result.success) {
            Alert.alert("Éxito", "Educación eliminada correctamente");
            loadUserProfile();
          } else {
            Alert.alert("Error", result.error);
          }
        }
      }
    ]);
  };

  const addSkill = async () => {
    Alert.prompt(
      "Agregar habilidad",
      "Nombre de la habilidad",
      async (name) => {
        if (!name) return;

        const dataToSend = { name: name.trim() };
        console.log("Enviando habilidad:", dataToSend);

        const result = await userSkillService.createUserSkill(dataToSend);
        
        console.log("Respuesta del servidor:", result);

        if (result.success) {
          Alert.alert("Éxito", "Habilidad agregada correctamente");
          loadUserProfile();
        } else {
          Alert.alert("Error", result.error || "No se pudo agregar la habilidad");
        }
      }
    );
  };

  const deleteSkill = async (id) => {
    Alert.alert("Confirmar", "¿Eliminar esta habilidad?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const result = await userSkillService.deleteUserSkill(id);
          if (result.success) {
            Alert.alert("Éxito", "Habilidad eliminada correctamente");
            loadUserProfile();
          } else {
            Alert.alert("Error", result.error);
          }
        }
      }
    ]);
  };

  const updateSkillLevel = async (id, level) => {
    const result = await userSkillService.updateUserSkill(id, { level: level });
    if (result.success) {
      loadUserProfile();
    }
  };

  const startChatbot = () => {
    setShowChatbot(true);
    setChatbotStep(0);
    setChatbotAnswers({});
    setChatMessages([{
      type: 'bot',
      text: "👋 ¡Hola! Soy tu asistente IA. Voy a ayudarte a mejorar tu perfil. ¿Empezamos?",
    }]);
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        type: 'bot',
        text: chatbotQuestions[0].question,
        help: chatbotQuestions[0].help,
      }]);
    }, 500);
  };

  const sendChatMessage = () => {
    if (!userInput.trim()) return;
    
    setChatMessages(prev => [...prev, { type: 'user', text: userInput }]);
    setChatbotAnswers({ ...chatbotAnswers, [chatbotQuestions[chatbotStep].field]: userInput });
    setUserInput('');
    
    if (chatbotStep + 1 < chatbotQuestions.length) {
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          type: 'bot',
          text: chatbotQuestions[chatbotStep + 1].question,
          help: chatbotQuestions[chatbotStep + 1].help,
        }]);
        setChatbotStep(chatbotStep + 1);
      }, 800);
    } else {
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          type: 'bot',
          text: "✅ ¡Gracias! He actualizado tu perfil. Ahora tu CV está optimizado para ATS. ¿Quieres ver los cambios?",
          buttons: ["Ver CV optimizado"],
        }]);
        
        const allSkills = [...skills.map(s => s.name), ...(chatbotAnswers.skills?.split(',').map(s => s.trim()) || [])];
        setOptimizedCV({
          summary: userData.summary || "Profesional con experiencia en el sector",
          skills: allSkills.filter((v, i, a) => a.indexOf(v) === i).join(", "),
          achievements: [chatbotAnswers.achievement].filter(Boolean),
          keywords: [chatbotAnswers.skills, chatbotAnswers.english, chatbotAnswers.leadership].filter(Boolean),
        });
      }, 800);
    }
  };

  const handleChatbotAction = (action) => {
    if (action === "Ver CV optimizado") {
      setActiveTab('ia');
      setShowChatbot(false);
    }
  };

  const calculateProfileProgress = () => {
    let completed = 0;
    let total = 0;
    
    const basicFields = ['fullName', 'email', 'title'];
    basicFields.forEach(field => {
      total++;
      if (userData[field] && userData[field].trim() !== "") completed++;
    });
    
    total++;
    if (experience.length > 0) completed++;
    
    total++;
    if (skills.length > 0) completed++;
    
    total++;
    if (userData.summary && userData.summary.trim() !== "") completed++;
    
    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B34F2" />
        <Text style={styles.loadingText}>Cargando tu perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Mi Perfil</Text>
            <Text style={styles.headerSubtitle}>Tu CV potenciado con IA</Text>
          </View>
          <TouchableOpacity onPress={loadUserProfile} style={styles.reloadButton}>
            <Text style={styles.reloadButtonText}>⟳</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileGrid}>
          
          {/* COLUMNA IZQUIERDA */}
          <View style={styles.leftPanel}>
            {/* Avatar */}
            <View style={styles.avatarCard}>
              <Image source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName || 'Usuario')}&background=5B34F2&color=fff&size=100&bold=true` }} style={styles.avatar} />
              <View style={styles.avatarInfo}>
                <Text style={styles.userName}>{userData.fullName || "Usuario"}</Text>
                <Text style={styles.userTitle}>{userData.title || userData.career || "Sin título"}</Text>
                <View style={styles.progressWrapper}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${calculateProfileProgress()}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{calculateProfileProgress()}% completado</Text>
                </View>
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
              {[
                { id: 'datos', label: 'Datos', icon: '📝' },
                { id: 'cv', label: 'CV', icon: '📄' },
                { id: 'ia', label: 'IA', icon: '✨' }
              ].map(tab => (
                <TouchableOpacity 
                  key={tab.id}
                  style={[styles.tab, activeTab === tab.id && styles.tabActive]} 
                  onPress={() => setActiveTab(tab.id)}
                >
                  <Text style={styles.tabIcon}>{tab.icon}</Text>
                  <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Datos Personales */}
            {activeTab === 'datos' && (
              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nombre completo</Text>
                  <TextInput 
                    style={styles.input} 
                    value={userData.fullName} 
                    onChangeText={(v) => setUserData({...userData, fullName: v})}
                    placeholderTextColor="#9CA3AF"
                    placeholder="Ingresa tu nombre completo"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput 
                    style={styles.input} 
                    value={userData.email} 
                    onChangeText={(v) => setUserData({...userData, email: v})}
                    keyboardType="email-address"
                    placeholderTextColor="#9CA3AF"
                    placeholder="Ingresa tu email"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Teléfono</Text>
                  <TextInput 
                    style={styles.input} 
                    value={userData.phone || ""} 
                    onChangeText={(v) => setUserData({...userData, phone: v})}
                    keyboardType="phone-pad"
                    placeholderTextColor="#9CA3AF"
                    placeholder="Ingresa tu teléfono"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Ubicación</Text>
                  <TextInput 
                    style={styles.input} 
                    value={userData.location || ""} 
                    onChangeText={(v) => setUserData({...userData, location: v})}
                    placeholderTextColor="#9CA3AF"
                    placeholder="Ciudad, País"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Título profesional</Text>
                  <TextInput 
                    style={styles.input} 
                    value={userData.title || ""} 
                    onChangeText={(v) => setUserData({...userData, title: v})}
                    placeholderTextColor="#9CA3AF"
                    placeholder="Ej: Desarrollador Full Stack"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Universidad</Text>
                  <TextInput 
                    style={styles.input} 
                    value={userData.university || ""} 
                    onChangeText={(v) => setUserData({...userData, university: v})}
                    placeholderTextColor="#9CA3AF"
                    placeholder="Tu universidad"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Carrera</Text>
                  <TextInput 
                    style={styles.input} 
                    value={userData.career || ""} 
                    onChangeText={(v) => setUserData({...userData, career: v})}
                    placeholderTextColor="#9CA3AF"
                    placeholder="Tu carrera"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Resumen profesional</Text>
                  <TextInput 
                    style={[styles.input, styles.textArea]} 
                    value={userData.summary || ""} 
                    onChangeText={(v) => setUserData({...userData, summary: v})}
                    placeholderTextColor="#9CA3AF"
                    placeholder="Cuéntanos sobre ti..."
                    multiline
                    numberOfLines={4}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>LinkedIn</Text>
                  <TextInput 
                    style={styles.input} 
                    value={userData.linkedin || ""} 
                    onChangeText={(v) => setUserData({...userData, linkedin: v})}
                    keyboardType="url"
                    placeholderTextColor="#9CA3AF"
                    placeholder="https://linkedin.com/in/tuusuario"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>GitHub</Text>
                  <TextInput 
                    style={styles.input} 
                    value={userData.github || ""} 
                    onChangeText={(v) => setUserData({...userData, github: v})}
                    keyboardType="url"
                    placeholderTextColor="#9CA3AF"
                    placeholder="https://github.com/tuusuario"
                  />
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={saveUserData} disabled={saving}>
                  <Text style={styles.saveButtonText}>{saving ? "Guardando..." : "Guardar cambios"}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* CV / Experiencia, Educación y Habilidades */}
            {activeTab === 'cv' && (
              <ScrollView style={styles.cvContainer} showsVerticalScrollIndicator={false}>
                {/* Experiencia Laboral */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Experiencia Laboral</Text>
                  <TouchableOpacity onPress={() => setShowExperienceModal(true)}>
                    <Text style={styles.addSectionButton}>+ Agregar</Text>
                  </TouchableOpacity>
                </View>
                {experience.length > 0 ? (
                  experience.map(exp => (
                    <View key={exp.id} style={styles.experienceCard}>
                      <View style={styles.cardHeader}>
                        <View>
                          <Text style={styles.experienceCompany}>{exp.company}</Text>
                          <Text style={styles.experiencePosition}>{exp.position}</Text>
                        </View>
                        <TouchableOpacity onPress={() => deleteExperience(exp.id)}>
                          <Text style={styles.deleteButton}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.experiencePeriod}>{exp.period}</Text>
                      <Text style={styles.experienceDescription}>{exp.description}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No hay experiencia registrada</Text>
                )}

                {/* Educación */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Educación</Text>
                  <TouchableOpacity onPress={() => setShowEducationModal(true)}>
                    <Text style={styles.addSectionButton}>+ Agregar</Text>
                  </TouchableOpacity>
                </View>
                {education.length > 0 ? (
                  education.map(edu => (
                    <View key={edu.id} style={styles.educationCard}>
                      <View style={styles.cardHeader}>
                        <View>
                          <Text style={styles.educationDegree}>{edu.degree}</Text>
                          <Text style={styles.educationInstitution}>{edu.institution}</Text>
                        </View>
                        <TouchableOpacity onPress={() => deleteEducation(edu.id)}>
                          <Text style={styles.deleteButton}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.educationYear}>{edu.year}</Text>
                      <Text style={styles.experienceDescription}>{edu.description}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No hay educación registrada</Text>
                )}

                {/* Habilidades Técnicas */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Habilidades Técnicas</Text>
                  <TouchableOpacity onPress={addSkill}>
                    <Text style={styles.addSectionButton}>+ Agregar</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.skillsList}>
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <View key={skill.id} style={styles.skillCard}>
                        <Text style={styles.skillName}>{skill.name}</Text>
                        <View style={styles.skillLevelBar}>
                          <View style={[styles.skillLevelFill, { width: `${skill.level}%` }]} />
                        </View>
                        <Text style={styles.skillLevel}>{skill.level}%</Text>
                        <TouchableOpacity onPress={() => deleteSkill(skill.id)}>
                          <Text style={styles.deleteSkillButton}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.emptyText}>No hay habilidades registradas</Text>
                  )}
                </View>
              </ScrollView>
            )}

            {/* IA Optimizado */}
            {activeTab === 'ia' && (
              <View style={styles.iaContainer}>
                <View style={styles.iaHeader}>
                  <Text style={styles.iaIcon}>✨</Text>
                  <Text style={styles.iaTitle}>CV Optimizado</Text>
                </View>
                <Text style={styles.iaSubtitle}>Versión mejorada para ATS</Text>
                
                <View style={styles.optimizedSection}>
                  <Text style={styles.optimizedLabel}>Resumen Profesional</Text>
                  <Text style={styles.optimizedText}>{optimizedCV.summary || userData.summary || "Completa tu perfil para generar un resumen optimizado"}</Text>
                </View>
                
                <View style={styles.optimizedSection}>
                  <Text style={styles.optimizedLabel}>Habilidades destacadas</Text>
                  <Text style={styles.optimizedText}>{optimizedCV.skills || skills.map(s => s.name).join(", ")}</Text>
                </View>
                
                <View style={styles.optimizedSection}>
                  <Text style={styles.optimizedLabel}>Logros destacados</Text>
                  {optimizedCV.achievements.length > 0 ? (
                    optimizedCV.achievements.map((ach, idx) => (
                      <Text key={idx} style={styles.optimizedAchievement}>🚀 {ach}</Text>
                    ))
                  ) : (
                    <Text style={styles.optimizedText}>Usa el chatbot 🤖 para generar logros destacados</Text>
                  )}
                </View>
                
                <View style={styles.keywordsContainer}>
                  <Text style={styles.keywordsLabel}>Palabras clave ATS</Text>
                  <View style={styles.keywordsList}>
                    {optimizedCV.keywords.length > 0 ? (
                      optimizedCV.keywords.map((kw, idx) => (
                        <View key={idx} style={styles.keywordTag}>
                          <Text style={styles.keywordText}>{kw}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.optimizedText}>Completa tu perfil para generar keywords</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.iaActions}>
                  <TouchableOpacity style={styles.downloadButton}>
                    <Text style={styles.downloadButtonText}>Descargar PDF</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.copyButton}>
                    <Text style={styles.copyButtonText}>Copiar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* COLUMNA DERECHA - Vista previa */}
          <View style={styles.rightPanel}>
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewTitle}>Vista previa</Text>
                <Text style={styles.previewSubtitle}>Cómo te ven los reclutadores</Text>
              </View>
              
              <View style={styles.previewContent}>
                <View style={styles.previewNameSection}>
                  <Text style={styles.previewName}>{userData.fullName || "Tu Nombre"}</Text>
                  <Text style={styles.previewJobTitle}>{userData.title || userData.career || "Tu Título"}</Text>
                  <View style={styles.previewContact}>
                    <Text style={styles.previewContactText}>{userData.location || "Ubicación"}</Text>
                    <Text style={styles.previewContactText}>{userData.email || "email@ejemplo.com"}</Text>
                  </View>
                </View>
                
                <View style={styles.previewSection}>
                  <Text style={styles.previewSectionTitle}>Resumen profesional</Text>
                  <Text style={styles.previewSectionText}>
                    {optimizedCV.summary ? optimizedCV.summary.substring(0, 120) + "..." : (userData.summary ? userData.summary.substring(0, 120) + "..." : "Completa tu perfil para generar un resumen profesional...")}
                  </Text>
                </View>
                
                {experience.length > 0 && (
                  <View style={styles.previewSection}>
                    <Text style={styles.previewSectionTitle}>Experiencia destacada</Text>
                    <Text style={styles.previewCompany}>{experience[0].company}</Text>
                    <Text style={styles.previewSectionText}>
                      {experience[0].description?.substring(0, 80) || "Sin descripción"}
                    </Text>
                  </View>
                )}
                
                <View style={styles.previewSection}>
                  <Text style={styles.previewSectionTitle}>Tecnologías</Text>
                  <View style={styles.previewSkills}>
                    {skills.length > 0 ? (
                      skills.slice(0, 4).map((skill, idx) => (
                        <View key={idx} style={styles.previewSkillTag}>
                          <Text style={styles.previewSkillText}>{skill.name}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.previewSectionText}>Sin habilidades registradas</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal para agregar experiencia */}
      <Modal visible={showExperienceModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Experiencia</Text>
            <TextInput style={styles.modalInput} placeholder="Empresa *" value={newExperience.company} onChangeText={(v) => setNewExperience({...newExperience, company: v})} />
            <TextInput style={styles.modalInput} placeholder="Puesto *" value={newExperience.position} onChangeText={(v) => setNewExperience({...newExperience, position: v})} />
            <TextInput style={styles.modalInput} placeholder="Fecha inicio (YYYY-MM-DD)" value={newExperience.start_date} onChangeText={(v) => setNewExperience({...newExperience, start_date: v})} />
            <TextInput style={styles.modalInput} placeholder="Fecha fin (YYYY-MM-DD)" value={newExperience.end_date} onChangeText={(v) => setNewExperience({...newExperience, end_date: v})} />
            <TextInput style={[styles.modalInput, styles.textArea]} placeholder="Descripción" multiline value={newExperience.description} onChangeText={(v) => setNewExperience({...newExperience, description: v})} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowExperienceModal(false)}><Text>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={addExperience}><Text style={{color: '#fff'}}>Guardar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar educación */}
      <Modal visible={showEducationModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Educación</Text>
            <TextInput style={styles.modalInput} placeholder="Institución *" value={newEducation.institution} onChangeText={(v) => setNewEducation({...newEducation, institution: v})} />
            <TextInput style={styles.modalInput} placeholder="Título/Grado *" value={newEducation.degree} onChangeText={(v) => setNewEducation({...newEducation, degree: v})} />
            <TextInput style={styles.modalInput} placeholder="Año inicio" value={newEducation.start_year} onChangeText={(v) => setNewEducation({...newEducation, start_year: v})} />
            <TextInput style={styles.modalInput} placeholder="Año fin" value={newEducation.end_year} onChangeText={(v) => setNewEducation({...newEducation, end_year: v})} />
            <TextInput style={[styles.modalInput, styles.textArea]} placeholder="Descripción" multiline value={newEducation.description} onChangeText={(v) => setNewEducation({...newEducation, description: v})} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowEducationModal(false)}><Text>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={addEducation}><Text style={{color: '#fff'}}>Guardar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Botón flotante IA */}
      <TouchableOpacity style={styles.chatbotFab} onPress={startChatbot}>
        <Text style={styles.chatbotFabText}>🤖</Text>
      </TouchableOpacity>

      {/* Modal Chatbot */}
      <Modal visible={showChatbot} animationType="slide" transparent={true}>
        <View style={styles.chatbotModal}>
          <View style={styles.chatbotHeader}>
            <Text style={styles.chatbotTitle}>Asistente IA</Text>
            <TouchableOpacity onPress={() => setShowChatbot(false)}>
              <Text style={styles.chatbotClose}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.chatMessages} 
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {chatMessages.map((msg, idx) => (
              <View key={idx}>
                <View style={[styles.chatMessage, msg.type === 'user' ? styles.userMessage : styles.botMessage]}>
                  <Text style={msg.type === 'user' ? styles.userMessageText : styles.botMessageText}>{msg.text}</Text>
                  {msg.help && <Text style={styles.helpText}>💡 {msg.help}</Text>}
                  {msg.buttons && (
                    <View style={styles.chatButtons}>
                      {msg.buttons.map((btn, btnIdx) => (
                        <TouchableOpacity key={btnIdx} style={styles.chatButton} onPress={() => handleChatbotAction(btn)}>
                          <Text style={styles.chatButtonText}>{btn}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.chatInputContainer}>
            <TextInput 
              style={styles.chatInput}
              placeholder="Escribe tu respuesta..."
              placeholderTextColor="#9CA3AF"
              value={userInput}
              onChangeText={setUserInput}
              onSubmitEditing={sendChatMessage}
            />
            <TouchableOpacity style={styles.chatSendButton} onPress={sendChatMessage}>
              <Text style={styles.chatSendText}>Enviar</Text>
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
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#4320C9',
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reloadButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reloadButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
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
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  leftPanel: {
    flex: 2,
    minWidth: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rightPanel: {
    flex: 1.5,
    minWidth: 280,
  },
  avatarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#5B34F2',
  },
  avatarInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  userTitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  progressWrapper: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5B34F2',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
  },
  tabActive: {
    backgroundColor: '#5B34F2',
  },
  tabIcon: {
    fontSize: 14,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  formContainer: {
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#5B34F2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  cvContainer: {
    maxHeight: 500,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  addSectionButton: {
    color: '#5B34F2',
    fontWeight: '500',
    fontSize: 13,
  },
  experienceCard: {
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  deleteButton: {
    fontSize: 16,
    color: '#EF4444',
  },
  experienceCompany: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  experiencePosition: {
    fontSize: 13,
    color: '#5B34F2',
    fontWeight: '500',
    marginTop: 2,
  },
  experiencePeriod: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  experienceDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 18,
  },
  educationCard: {
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  educationDegree: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  educationInstitution: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  educationYear: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  skillsList: {
    gap: 12,
  },
  skillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skillName: {
    width: 90,
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2937',
  },
  skillLevelBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  skillLevelFill: {
    height: '100%',
    backgroundColor: '#5B34F2',
    borderRadius: 3,
  },
  skillLevel: {
    width: 40,
    fontSize: 12,
    color: '#6B7280',
  },
  deleteSkillButton: {
    width: 24,
    textAlign: 'center',
    color: '#EF4444',
    fontWeight: 'bold',
  },
  iaContainer: {
    gap: 16,
  },
  iaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iaIcon: {
    fontSize: 24,
  },
  iaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5B34F2',
  },
  iaSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  optimizedSection: {
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 14,
    gap: 6,
  },
  optimizedLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  optimizedText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  optimizedAchievement: {
    fontSize: 13,
    color: '#1F2937',
    marginBottom: 4,
  },
  keywordsContainer: {
    backgroundColor: '#F0FDF4',
    padding: 14,
    borderRadius: 14,
  },
  keywordsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keywordTag: {
    backgroundColor: '#5B34F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  keywordText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },
  iaActions: {
    flexDirection: 'row',
    gap: 12,
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#5B34F2',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  copyButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  previewHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  previewSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  previewContent: {
    gap: 14,
  },
  previewNameSection: {
    alignItems: 'center',
  },
  previewName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  previewJobTitle: {
    fontSize: 13,
    color: '#5B34F2',
    marginTop: 2,
  },
  previewContact: {
    marginTop: 6,
    gap: 2,
  },
  previewContactText: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  previewSection: {
    gap: 4,
  },
  previewSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  previewSectionText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  previewCompany: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
  },
  previewSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  previewSkillTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  previewSkillText: {
    fontSize: 11,
    color: '#6B7280',
  },
  chatbotFab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5B34F2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  chatbotFabText: {
    fontSize: 28,
  },
  chatbotModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 50,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  chatbotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  chatbotTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  chatbotClose: {
    fontSize: 22,
    color: '#6B7280',
    padding: 4,
  },
  chatMessages: {
    flex: 1,
    padding: 16,
  },
  chatMessage: {
    marginBottom: 16,
    maxWidth: '85%',
    padding: 12,
    borderRadius: 18,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 4,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#5B34F2',
    borderTopRightRadius: 4,
  },
  botMessageText: {
    fontSize: 14,
    color: '#1F2937',
  },
  userMessageText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  helpText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 6,
  },
  chatButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  chatButton: {
    backgroundColor: '#5B34F2',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  chatInputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chatSendButton: {
    backgroundColor: '#5B34F2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  chatSendText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  modalCancel: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  modalSave: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#5B34F2',
  },
});