import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Modal, Alert } from 'react-native';
import { useState, useRef } from 'react';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('datos');
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userInput, setUserInput] = useState('');
  const scrollViewRef = useRef();
  
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

  const [experience, setExperience] = useState([
    {
      id: 1,
      company: "TechSolutions Argentina",
      position: "Desarrolladora Full Stack",
      period: "2022 - Presente",
      description: "Desarrollo de aplicaciones web con React y Node.js. Implementación de APIs RESTful.",
      achievements: ["📈 Aumenté la velocidad de carga en un 40%", "👥 Lideré un equipo de 3 desarrolladores", "⚡ Implementé CI/CD reduciendo tiempos de deploy"],
    },
    {
      id: 2,
      company: "Digital Agency",
      position: "Frontend Developer",
      period: "2020 - 2022",
      description: "Maquetación de sitios web responsive. Integración con APIs externas.",
      achievements: ["🌐 Desarrollé 15+ sitios web", "🐛 Reduje bugs en un 30%", "♿ Implementé accesibilidad web"],
    },
  ]);

  const [education, setEducation] = useState([
    { id: 1, degree: "Ingeniería en Sistemas", institution: "Universidad de Buenos Aires", year: "2018 - 2023", status: "Completado" },
    { id: 2, degree: "Certificación React Avanzado", institution: "CarrerOn", year: "2024", status: "En curso" },
  ]);

  const [skills, setSkills] = useState([
    { name: "React", level: 85 },
    { name: "TypeScript", level: 75 },
    { name: "Node.js", level: 70 },
    { name: "Python", level: 60 },
    { name: "SQL", level: 65 },
    { name: "Git", level: 80 },
  ]);

  const [optimizedCV, setOptimizedCV] = useState({
    summary: "Desarrolladora Full Stack con 5 años de experiencia en aplicaciones web escalables. Especializada en React, TypeScript y Node.js. Apasionada por las buenas prácticas y la optimización de rendimiento.",
    skills: "React (85%), TypeScript (75%), Node.js (70%), Python (60%), SQL (65%), Git (80%)",
    achievements: [
      "🚀 Reducción del 40% en tiempo de carga",
      "👥 Coordinación de equipo de 3 desarrolladores",
      "⚡ Reducción del 50% en tiempo de deployment",
    ],
    keywords: ["React", "TypeScript", "Node.js", "Full Stack", "CI/CD", "APIs REST"],
  });

  const chatbotQuestions = [
    { question: "¿Cuál es tu mayor logro profesional medible?", field: "achievement", help: "Ej: Aumenté ventas en 30% en 6 meses" },
    { question: "¿Qué tecnologías dominas?", field: "skills", help: "Ej: React, Python, SQL, AWS" },
    { question: "¿Cuál es tu nivel de inglés?", field: "english", help: "Ej: Avanzado (C1)" },
    { question: "¿Has liderado equipos? Cuéntame", field: "leadership", help: "Ej: Lideré un equipo de 5 personas" },
  ];

  const [chatbotStep, setChatbotStep] = useState(0);
  const [chatbotAnswers, setChatbotAnswers] = useState({});

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
      }, 800);
    }
  };

  const handleChatbotAction = (action) => {
    if (action === "Ver CV optimizado") {
      setActiveTab('ia');
      setShowChatbot(false);
    }
  };

  const addSkill = () => {
    Alert.prompt("Agregar habilidad", "Nombre de la habilidad", (name) => {
      if (name) setSkills([...skills, { name, level: 50 }]);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <Text style={styles.headerSubtitle}>Tu CV potenciado con IA</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileGrid}>
          
          {/* COLUMNA IZQUIERDA */}
          <View style={styles.leftPanel}>
            {/* Avatar */}
            <View style={styles.avatarCard}>
              <Image source={{ uri: "https://randomuser.me/api/portraits/women/68.jpg" }} style={styles.avatar} />
              <View style={styles.avatarInfo}>
                <Text style={styles.userName}>{userData.fullName}</Text>
                <Text style={styles.userTitle}>{userData.title}</Text>
                <View style={styles.progressWrapper}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: "75%" }]} />
                  </View>
                  <Text style={styles.progressText}>75% completado</Text>
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
                {[
                  { label: 'Nombre completo', field: 'fullName', keyboard: 'default' },
                  { label: 'Email', field: 'email', keyboard: 'email-address' },
                  { label: 'Teléfono', field: 'phone', keyboard: 'phone-pad' },
                  { label: 'Ubicación', field: 'location', keyboard: 'default' },
                  { label: 'Título profesional', field: 'title', keyboard: 'default' },
                  { label: 'Años de experiencia', field: 'experience', keyboard: 'default' },
                  { label: 'LinkedIn', field: 'linkedin', keyboard: 'url' },
                  { label: 'GitHub', field: 'github', keyboard: 'url' },
                ].map((item, idx) => (
                  <View key={idx} style={styles.inputGroup}>
                    <Text style={styles.label}>{item.label}</Text>
                    <TextInput 
                      style={styles.input} 
                      value={userData[item.field]} 
                      onChangeText={(v) => setUserData({...userData, [item.field]: v})}
                      keyboardType={item.keyboard}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                ))}
                <TouchableOpacity style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Guardar cambios</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* CV / Experiencia */}
            {activeTab === 'cv' && (
              <ScrollView style={styles.cvContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Experiencia</Text>
                {experience.map(exp => (
                  <View key={exp.id} style={styles.experienceCard}>
                    <Text style={styles.experienceCompany}>{exp.company}</Text>
                    <Text style={styles.experiencePosition}>{exp.position}</Text>
                    <Text style={styles.experiencePeriod}>{exp.period}</Text>
                    <Text style={styles.experienceDescription}>{exp.description}</Text>
                    <View style={styles.achievementsList}>
                      {exp.achievements.map((ach, idx) => (
                        <View key={idx} style={styles.achievementItem}>
                          <Text style={styles.achievementText}>{ach}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
                <TouchableOpacity style={styles.addButton}>
                  <Text style={styles.addButtonText}>+ Agregar experiencia</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Educación</Text>
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

                <Text style={styles.sectionTitle}>Habilidades</Text>
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

            {/* IA Optimizado */}
            {activeTab === 'ia' && (
              <View style={styles.iaContainer}>
                <View style={styles.iaHeader}>
                  <Text style={styles.iaIcon}>✨</Text>
                  <Text style={styles.iaTitle}>CV Optimizado</Text>
                </View>
                <Text style={styles.iaSubtitle}>Versión mejorada para ATS</Text>
                
                <View style={styles.optimizedSection}>
                  <Text style={styles.optimizedLabel}>Resumen</Text>
                  <Text style={styles.optimizedText}>{optimizedCV.summary}</Text>
                </View>
                
                <View style={styles.optimizedSection}>
                  <Text style={styles.optimizedLabel}>Habilidades</Text>
                  <Text style={styles.optimizedText}>{optimizedCV.skills}</Text>
                </View>
                
                <View style={styles.optimizedSection}>
                  <Text style={styles.optimizedLabel}>Logros</Text>
                  {optimizedCV.achievements.map((ach, idx) => (
                    <Text key={idx} style={styles.optimizedAchievement}>{ach}</Text>
                  ))}
                </View>
                
                <View style={styles.keywordsContainer}>
                  <Text style={styles.keywordsLabel}>Palabras clave ATS</Text>
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
                  <Text style={styles.previewName}>{userData.fullName}</Text>
                  <Text style={styles.previewJobTitle}>{userData.title}</Text>
                  <View style={styles.previewContact}>
                    <Text style={styles.previewContactText}>{userData.location}</Text>
                    <Text style={styles.previewContactText}>{userData.email}</Text>
                  </View>
                </View>
                
                <View style={styles.previewSection}>
                  <Text style={styles.previewSectionTitle}>Resumen</Text>
                  <Text style={styles.previewSectionText}>{optimizedCV.summary.substring(0, 120)}...</Text>
                </View>
                
                <View style={styles.previewSection}>
                  <Text style={styles.previewSectionTitle}>Experiencia</Text>
                  <Text style={styles.previewCompany}>{experience[0].company}</Text>
                  <Text style={styles.previewSectionText}>{experience[0].achievements[0]}</Text>
                </View>
                
                <View style={styles.previewSection}>
                  <Text style={styles.previewSectionTitle}>Tecnologías</Text>
                  <View style={styles.previewSkills}>
                    {skills.slice(0, 4).map((skill, idx) => (
                      <View key={idx} style={styles.previewSkillTag}>
                        <Text style={styles.previewSkillText}>{skill.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 12,
  },
  experienceCard: {
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
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
  achievementsList: {
    marginTop: 10,
    gap: 4,
  },
  achievementItem: {
    paddingVertical: 2,
  },
  achievementText: {
    fontSize: 12,
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: '#5B34F2',
    fontWeight: '500',
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
  statusBadge: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusCompleted: {
    backgroundColor: '#10B981',
  },
  statusProgress: {
    backgroundColor: '#F59E0B',
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
});