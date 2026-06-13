import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Modal, Alert } from 'react-native';
import { useState } from 'react';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('datos'); // datos, cv, ia
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userInput, setUserInput] = useState('');
  
  // Datos del usuario
  const [userData, setUserData] = useState({
    fullName: "Ana Martínez",
    email: "ana.martinez@email.com",
    phone: "+54 11 2345-6789",
    location: "Buenos Aires, Argentina",
    title: "Desarrolladora Full Stack",
    experience: "5 años",
    linkedin: "linkedin.com/in/anamartinez",
    github: "github.com/anamartinez",
    portfolio: "anamartinez.dev",
  });

  // Experiencia laboral
  const [experience, setExperience] = useState([
    {
      id: 1,
      company: "TechSolutions Argentina",
      position: "Desarrolladora Full Stack",
      period: "2022 - Presente",
      description: "Desarrollo de aplicaciones web con React y Node.js. Implementación de APIs RESTful. Optimización de rendimiento en frontend.",
      achievements: ["Aumenté la velocidad de carga en un 40%", "Lideré un equipo de 3 desarrolladores", "Implementé CI/CD reduciendo tiempos de deploy"],
    },
    {
      id: 2,
      company: "Digital Agency",
      position: "Frontend Developer",
      period: "2020 - 2022",
      description: "Maquetación de sitios web responsive. Integración con APIs externas. Mantenimiento de aplicaciones existentes.",
      achievements: ["Desarrollé 15+ sitios web", "Reduje bugs en un 30%", "Implementé accesibilidad web"],
    },
  ]);

  // Educación
  const [education, setEducation] = useState([
    {
      id: 1,
      degree: "Ingeniería en Sistemas",
      institution: "Universidad de Buenos Aires",
      year: "2018 - 2023",
      status: "Completado",
    },
    {
      id: 2,
      degree: "Certificación React Avanzado",
      institution: "CarrerOn",
      year: "2024",
      status: "En curso",
    },
  ]);

  // Habilidades
  const [skills, setSkills] = useState([
    { name: "React", level: 85 },
    { name: "TypeScript", level: 75 },
    { name: "Node.js", level: 70 },
    { name: "Python", level: 60 },
    { name: "SQL", level: 65 },
    { name: "Git", level: 80 },
  ]);

  // CV Optimizado por IA
  const [optimizedCV, setOptimizedCV] = useState({
    summary: "Desarrolladora Full Stack con 5 años de experiencia en creación de aplicaciones web escalables. Especializada en React, TypeScript y Node.js. Apasionada por las buenas prácticas de código y la optimización de rendimiento. He liderado equipos pequeños y mejorado métricas clave como velocidad de carga en un 40%. Busco oportunidades donde pueda aplicar mis habilidades en entornos dinámicos y seguir aprendiendo.",
    skills: "React (85%), TypeScript (75%), Node.js (70%), Python (60%), SQL (65%), Git (80%). Experiencia en metodologías ágiles y CI/CD.",
    achievements: [
      "Optimización de rendimiento: Reducción del 40% en tiempo de carga de aplicación principal",
      "Liderazgo técnico: Coordinación de equipo de 3 desarrolladores en proyecto crítico",
      "Implementación de CI/CD: Reducción del 50% en tiempo de deployment",
      "Mejora de calidad: Reducción del 30% en bugs reportados post-lanzamiento",
    ],
    keywords: ["React", "TypeScript", "Node.js", "Full Stack", "CI/CD", "APIs REST", "Metodologías Ágiles"],
  });

  // Chatbot IA para móvil
  const chatbotQuestions = [
    {
      question: "¿Cuál es tu mayor logro profesional medible?",
      field: "achievement",
      help: "Ejemplo: Aumenté ventas en 30% en 6 meses / Reduje tiempos de respuesta en 50%",
    },
    {
      question: "¿Qué herramientas o tecnologías dominas?",
      field: "skills",
      help: "Ejemplo: React, Python, SQL, AWS, etc.",
    },
    {
      question: "¿Cuál es tu nivel de inglés?",
      field: "english",
      help: "Ejemplo: Avanzado (C1) - puedo mantener conversaciones técnicas",
    },
    {
      question: "¿Has liderado equipos o proyectos? Cuéntame tu experiencia",
      field: "leadership",
      help: "Ejemplo: Lideré un equipo de 5 personas en el desarrollo de...",
    },
  ];

  const [chatbotStep, setChatbotStep] = useState(0);
  const [chatbotAnswers, setChatbotAnswers] = useState({});

  const startChatbot = () => {
    setShowChatbot(true);
    setChatbotStep(0);
    setChatbotAnswers({});
    setChatMessages([{
      type: 'bot',
      text: "¡Hola! Soy tu asistente IA. Voy a ayudarte a mejorar tu perfil con preguntas estratégicas. Responde con detalle para que pueda optimizar tu CV. ¿Empezamos?",
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
          text: "¡Gracias por tu respuesta! He analizado tu información y actualizado tu perfil. Ahora tu CV está optimizado para ATS y destacará tus logros cuantificables. ¿Quieres ver los cambios?",
        }]);
        setTimeout(() => {
          setChatMessages(prev => [...prev, {
            type: 'bot',
            text: "💡 También he detectado que podrías mejorar en: React avanzado y metodologías ágiles. ¿Te gustaría que te recomiende cursos?",
            buttons: ["Ver CV optimizado", "Ver cursos recomendados"],
          }]);
        }, 1000);
      }, 800);
    }
  };

  const handleChatbotAction = (action) => {
    if (action === "Ver CV optimizado") {
      setActiveTab('ia');
      setShowChatbot(false);
    }
  };

  const updateUserData = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const addSkill = () => {
    Alert.prompt("Agregar habilidad", "Nombre de la habilidad", (name) => {
      if (name) {
        setSkills([...skills, { name, level: 50 }]);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👤 Mi Perfil</Text>
        <Text style={styles.headerSubtitle}>Tu CV potenciado con IA</Text>
      </View>

      {/* Layout de dos columnas para web/tablet */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileGrid}>
          
          {/* COLUMNA IZQUIERDA - Datos personales y formulario */}
          <View style={styles.leftPanel}>
            {/* Avatar y datos básicos */}
            <View style={styles.avatarCard}>
              <Image source={{ uri: "https://randomuser.me/api/portraits/women/68.jpg" }} style={styles.avatar} />
              <View style={styles.avatarInfo}>
                <Text style={styles.userName}>{userData.fullName}</Text>
                <Text style={styles.userTitle}>{userData.title}</Text>
                <View style={styles.completionBadge}>
                  <Text style={styles.completionText}>🎯 75% de perfil completado</Text>
                </View>
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
              <TouchableOpacity style={[styles.tab, activeTab === 'datos' && styles.tabActive]} onPress={() => setActiveTab('datos')}>
                <Text style={[styles.tabText, activeTab === 'datos' && styles.tabTextActive]}>Datos personales</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, activeTab === 'cv' && styles.tabActive]} onPress={() => setActiveTab('cv')}>
                <Text style={[styles.tabText, activeTab === 'cv' && styles.tabTextActive]}>CV / Experiencia</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, activeTab === 'ia' && styles.tabActive]} onPress={() => setActiveTab('ia')}>
                <Text style={[styles.tabText, activeTab === 'ia' && styles.tabTextActive]}>Maquillado IA</Text>
              </TouchableOpacity>
            </View>

            {/* Contenido de Datos Personales */}
            {activeTab === 'datos' && (
              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nombre completo</Text>
                  <TextInput style={styles.input} value={userData.fullName} onChangeText={(v) => updateUserData('fullName', v)} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput style={styles.input} value={userData.email} onChangeText={(v) => updateUserData('email', v)} keyboardType="email-address" />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Teléfono</Text>
                  <TextInput style={styles.input} value={userData.phone} onChangeText={(v) => updateUserData('phone', v)} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Ubicación</Text>
                  <TextInput style={styles.input} value={userData.location} onChangeText={(v) => updateUserData('location', v)} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Título profesional</Text>
                  <TextInput style={styles.input} value={userData.title} onChangeText={(v) => updateUserData('title', v)} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Años de experiencia</Text>
                  <TextInput style={styles.input} value={userData.experience} onChangeText={(v) => updateUserData('experience', v)} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>LinkedIn</Text>
                  <TextInput style={styles.input} value={userData.linkedin} onChangeText={(v) => updateUserData('linkedin', v)} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>GitHub</Text>
                  <TextInput style={styles.input} value={userData.github} onChangeText={(v) => updateUserData('github', v)} />
                </View>
                <TouchableOpacity style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Guardar cambios</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Contenido de CV / Experiencia */}
            {activeTab === 'cv' && (
              <ScrollView style={styles.cvContainer}>
                <Text style={styles.sectionTitle}>💼 Experiencia laboral</Text>
                {experience.map(exp => (
                  <View key={exp.id} style={styles.experienceCard}>
                    <Text style={styles.experienceCompany}>{exp.company}</Text>
                    <Text style={styles.experiencePosition}>{exp.position}</Text>
                    <Text style={styles.experiencePeriod}>{exp.period}</Text>
                    <Text style={styles.experienceDescription}>{exp.description}</Text>
                    <View style={styles.achievementsList}>
                      {exp.achievements.map((ach, idx) => (
                        <View key={idx} style={styles.achievementItem}>
                          <Text style={styles.achievementBullet}>🏆</Text>
                          <Text style={styles.achievementText}>{ach}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
                
                <TouchableOpacity style={styles.addButton}>
                  <Text style={styles.addButtonText}>+ Agregar experiencia</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>🎓 Educación</Text>
                {education.map(edu => (
                  <View key={edu.id} style={styles.educationCard}>
                    <Text style={styles.educationDegree}>{edu.degree}</Text>
                    <Text style={styles.educationInstitution}>{edu.institution}</Text>
                    <Text style={styles.educationYear}>{edu.year}</Text>
                    <View style={[styles.statusBadge, edu.status === 'Completado' ? styles.statusCompleted : styles.statusProgress]}>
                      <Text style={styles.statusText}>{edu.status}</Text>
                    </View>
                  </View>
                ))}
                <TouchableOpacity style={styles.addButton}>
                  <Text style={styles.addButtonText}>+ Agregar educación</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>🛠️ Habilidades técnicas</Text>
                <View style={styles.skillsList}>
                  {skills.map((skill, idx) => (
                    <View key={idx} style={styles.skillCard}>
                      <Text style={styles.skillName}>{skill.name}</Text>
                      <View style={styles.skillLevelBar}>
                        <View style={[styles.skillLevelFill, { width: `${skill.level}%` }]} />
                      </View>
                      <Text style={styles.skillLevel}>{skill.level}%</Text>
                    </View>
                  ))}
                  <TouchableOpacity style={styles.addSkillButton} onPress={addSkill}>
                    <Text style={styles.addSkillText}>+ Agregar habilidad</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}

            {/* Contenido de Maquillado IA */}
            {activeTab === 'ia' && (
              <View style={styles.iaContainer}>
                <View style={styles.iaHeader}>
                  <Text style={styles.iaIcon}>✨</Text>
                  <Text style={styles.iaTitle}>CV Optimizado por IA</Text>
                </View>
                <Text style={styles.iaSubtitle}>Versión mejorada para ATS (Applicant Tracking Systems)</Text>
                
                <View style={styles.optimizedSection}>
                  <Text style={styles.optimizedLabel}>Resumen profesional</Text>
                  <Text style={styles.optimizedText}>{optimizedCV.summary}</Text>
                </View>
                
                <View style={styles.optimizedSection}>
                  <Text style={styles.optimizedLabel}>Habilidades destacadas</Text>
                  <Text style={styles.optimizedText}>{optimizedCV.skills}</Text>
                </View>
                
                <View style={styles.optimizedSection}>
                  <Text style={styles.optimizedLabel}>Logros cuantificables</Text>
                  {optimizedCV.achievements.map((ach, idx) => (
                    <View key={idx} style={styles.optimizedAchievement}>
                      <Text style={styles.optimizedBullet}>✅</Text>
                      <Text style={styles.optimizedAchievementText}>{ach}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.keywordsContainer}>
                  <Text style={styles.keywordsLabel}>🔑 Palabras clave para ATS</Text>
                  <View style={styles.keywordsList}>
                    {optimizedCV.keywords.map((kw, idx) => (
                      <View key={idx} style={styles.keywordTag}>
                        <Text style={styles.keywordText}>{kw}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                
                <View style={styles.iaActions}>
                  <TouchableOpacity style={styles.downloadButton}>
                    <Text style={styles.downloadButtonText}>📄 Descargar PDF Optimizado</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.copyButton}>
                    <Text style={styles.copyButtonText}>📋 Copiar texto</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.iaTip}>
                  <Text style={styles.iaTipIcon}>💡</Text>
                  <Text style={styles.iaTipText}>
                    Este CV está optimizado para pasar filtros automáticos de ATS. Incluye keywords relevantes y logros medibles.
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* COLUMNA DERECHA - Vista previa del CV (web) */}
          <View style={styles.rightPanel}>
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewTitle}>📄 Vista previa de tu CV</Text>
                <Text style={styles.previewSubtitle}>Así te ven los reclutadores</Text>
              </View>
              
              <View style={styles.previewContent}>
                <View style={styles.previewNameSection}>
                  <Text style={styles.previewName}>{userData.fullName}</Text>
                  <Text style={styles.previewTitle}>{userData.title}</Text>
                  <View style={styles.previewContact}>
                    <Text style={styles.previewContactText}>{userData.location}</Text>
                    <Text style={styles.previewContactText}>{userData.phone}</Text>
                    <Text style={styles.previewContactText}>{userData.email}</Text>
                  </View>
                </View>
                
                <View style={styles.previewSection}>
                  <Text style={styles.previewSectionTitle}>Resumen</Text>
                  <Text style={styles.previewSectionText}>{optimizedCV.summary.substring(0, 150)}...</Text>
                </View>
                
                <View style={styles.previewSection}>
                  <Text style={styles.previewSectionTitle}>Experiencia destacada</Text>
                  <Text style={styles.previewCompany}>{experience[0].company}</Text>
                  <Text style={styles.previewPosition}>{experience[0].position} | {experience[0].period}</Text>
                  <Text style={styles.previewSectionText}>{experience[0].achievements[0]}</Text>
                </View>
                
                <View style={styles.previewSection}>
                  <Text style={styles.previewSectionTitle}>Habilidades clave</Text>
                  <View style={styles.previewSkills}>
                    {skills.slice(0, 5).map((skill, idx) => (
                      <View key={idx} style={styles.previewSkillTag}>
                        <Text style={styles.previewSkillText}>{skill.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              
              <TouchableOpacity style={styles.refreshPreview}>
                <Text style={styles.refreshPreviewText}>⟳ Actualizar vista previa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón flotante para asistente IA (móvil) */}
      <TouchableOpacity style={styles.chatbotFab} onPress={startChatbot}>
        <Text style={styles.chatbotFabText}>🤖</Text>
      </TouchableOpacity>

      {/* Modal del Chatbot IA */}
      <Modal visible={showChatbot} animationType="slide" transparent={true}>
        <View style={styles.chatbotModal}>
          <View style={styles.chatbotHeader}>
            <Text style={styles.chatbotTitle}>🤖 Asistente IA de CV</Text>
            <TouchableOpacity onPress={() => setShowChatbot(false)}>
              <Text style={styles.chatbotClose}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.chatMessages} ref={ref => scrollView = ref} onContentSizeChange={() => scrollView?.scrollToEnd({ animated: true })}>
            {chatMessages.map((msg, idx) => (
              <View key={idx} style={[styles.chatMessage, msg.type === 'user' ? styles.userMessage : styles.botMessage]}>
                <Text style={msg.type === 'user' ? styles.userMessageText : styles.botMessageText}>{msg.text}</Text>
                {msg.help && (
                  <Text style={styles.helpText}>💡 {msg.help}</Text>
                )}
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
            ))}
          </ScrollView>
          
          <View style={styles.chatInputContainer}>
            <TextInput 
              style={styles.chatInput}
              placeholder="Escribe tu respuesta..."
              placeholderTextColor="#5F6368"
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
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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
    borderBottomColor: '#DCE5EC',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  userTitle: {
    fontSize: 14,
    color: '#5F6368',
    marginTop: 4,
  },
  completionBadge: {
    marginTop: 8,
  },
  completionText: {
    fontSize: 12,
    color: '#0F6C7A',
    fontWeight: '500',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#F3F3F3',
  },
  tabActive: {
    backgroundColor: '#5B34F2',
  },
  tabText: {
    fontSize: 13,
    color: '#5F6368',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1C1C1C',
  },
  input: {
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#1C1C1C',
  },
  saveButton: {
    backgroundColor: '#5B34F2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cvContainer: {
    maxHeight: 500,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginTop: 16,
    marginBottom: 12,
  },
  experienceCard: {
    backgroundColor: '#F3F3F3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  experienceCompany: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  experiencePosition: {
    fontSize: 14,
    color: '#5B34F2',
    fontWeight: '500',
    marginTop: 4,
  },
  experiencePeriod: {
    fontSize: 12,
    color: '#5F6368',
    marginTop: 4,
  },
  experienceDescription: {
    fontSize: 13,
    color: '#5F6368',
    marginTop: 8,
    lineHeight: 18,
  },
  achievementsList: {
    marginTop: 10,
    gap: 6,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  achievementBullet: {
    fontSize: 12,
  },
  achievementText: {
    fontSize: 12,
    color: '#1C1C1C',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#F3F3F3',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#5B34F2',
    fontWeight: '500',
  },
  educationCard: {
    backgroundColor: '#F3F3F3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  educationDegree: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  educationInstitution: {
    fontSize: 13,
    color: '#5F6368',
    marginTop: 4,
  },
  educationYear: {
    fontSize: 12,
    color: '#5F6368',
    marginTop: 2,
  },
  statusBadge: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusCompleted: {
    backgroundColor: '#0F6C7A',
  },
  statusProgress: {
    backgroundColor: '#F25F63',
  },
  statusText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
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
    width: 80,
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1C',
  },
  skillLevelBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#DCE5EC',
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
    color: '#5F6368',
  },
  addSkillButton: {
    marginTop: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addSkillText: {
    color: '#5B34F2',
    fontWeight: '500',
  },
  iaContainer: {
    gap: 16,
  },
  iaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
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
    color: '#5F6368',
    marginBottom: 8,
  },
  optimizedSection: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  optimizedLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  optimizedText: {
    fontSize: 13,
    color: '#5F6368',
    lineHeight: 18,
  },
  optimizedAchievement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  optimizedBullet: {
    fontSize: 12,
  },
  optimizedAchievementText: {
    fontSize: 13,
    color: '#1C1C1C',
    flex: 1,
  },
  keywordsContainer: {
    backgroundColor: '#F0F7FF',
    padding: 16,
    borderRadius: 12,
  },
  keywordsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1C',
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
    fontSize: 12,
    fontWeight: '500',
  },
  iaActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#5B34F2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  copyButton: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#5F6368',
    fontWeight: '500',
  },
  iaTip: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E7',
    padding: 12,
    borderRadius: 10,
    gap: 10,
    marginTop: 8,
    marginBottom: 20,
  },
  iaTipIcon: {
    fontSize: 16,
  },
  iaTipText: {
    flex: 1,
    fontSize: 12,
    color: '#B86F00',
    lineHeight: 16,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  previewHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DCE5EC',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  previewSubtitle: {
    fontSize: 12,
    color: '#5F6368',
    marginTop: 4,
  },
  previewContent: {
    gap: 16,
  },
  previewNameSection: {
    alignItems: 'center',
  },
  previewName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  previewTitle: {
    fontSize: 14,
    color: '#5B34F2',
    marginTop: 4,
  },
  previewContact: {
    marginTop: 8,
    gap: 2,
  },
  previewContactText: {
    fontSize: 11,
    color: '#5F6368',
    textAlign: 'center',
  },
  previewSection: {
    gap: 6,
  },
  previewSectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  previewSectionText: {
    fontSize: 12,
    color: '#5F6368',
    lineHeight: 16,
  },
  previewCompany: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  previewPosition: {
    fontSize: 11,
    color: '#5F6368',
  },
  previewSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  previewSkillTag: {
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  previewSkillText: {
    fontSize: 11,
    color: '#5F6368',
  },
  refreshPreview: {
    marginTop: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  refreshPreviewText: {
    fontSize: 12,
    color: '#5B34F2',
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
    shadowOpacity: 0.3,
    shadowRadius: 6,
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
    borderBottomColor: '#DCE5EC',
  },
  chatbotTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  chatbotClose: {
    fontSize: 24,
    color: '#5F6368',
    padding: 4,
  },
  chatMessages: {
    flex: 1,
    padding: 16,
  },
  chatMessage: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F3F3',
    padding: 12,
    borderRadius: 18,
    borderTopLeftRadius: 4,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#5B34F2',
    padding: 12,
    borderRadius: 18,
    borderTopRightRadius: 4,
  },
  botMessageText: {
    fontSize: 14,
    color: '#1C1C1C',
  },
  userMessageText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  helpText: {
    fontSize: 11,
    color: '#5F6368',
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
    borderTopColor: '#DCE5EC',
    gap: 12,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1C1C1C',
  },
  chatSendButton: {
    backgroundColor: '#5B34F2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  chatSendText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});