import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import api from '../../../services/api';

export default function SimuladorEntrevistas({ onBack }) {
  const [step, setStep] = useState('select');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  
  // Estados para audio
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const categories = [
    { id: 'tech', name: 'Tecnología', icon: '💻', color: '#EEF2FF' },
    { id: 'business', name: 'Negocios', icon: '📊', color: '#FEF3C7' },
    { id: 'health', name: 'Salud', icon: '🏥', color: '#DCFCE7' },
    { id: 'education', name: 'Educación', icon: '📚', color: '#FFE4E6' },
    { id: 'creative', name: 'Creativo', icon: '🎨', color: '#FCE7F3' },
    { id: 'legal', name: 'Legal', icon: '⚖️', color: '#E0E7FF' },
    { id: 'sales', name: 'Ventas', icon: '📈', color: '#CCFBF1' },
    { id: 'admin', name: 'Administrativo', icon: '📋', color: '#E5E7EB' },
  ];

  const rolesByCategory = {
    tech: [
      { id: 'frontend', name: 'Frontend Developer', icon: '🎨' },
      { id: 'backend', name: 'Backend Developer', icon: '⚙️' },
      { id: 'fullstack', name: 'Full Stack', icon: '🚀' },
      { id: 'datascience', name: 'Data Scientist', icon: '📊' },
      { id: 'devops', name: 'DevOps', icon: '🔧' },
      { id: 'mobile', name: 'Mobile Developer', icon: '📱' },
    ],
    business: [
      { id: 'marketing', name: 'Marketing Digital', icon: '📢' },
      { id: 'finance', name: 'Finanzas', icon: '💰' },
      { id: 'hr', name: 'Recursos Humanos', icon: '👥' },
      { id: 'project_manager', name: 'Project Manager', icon: '📋' },
    ],
    health: [
      { id: 'doctor', name: 'Médico General', icon: '👨‍⚕️' },
      { id: 'nurse', name: 'Enfermería', icon: '💉' },
      { id: 'psychologist', name: 'Psicología', icon: '🧠' },
    ],
    education: [
      { id: 'teacher', name: 'Docente', icon: '👩‍🏫' },
      { id: 'professor', name: 'Profesor Universitario', icon: '🎓' },
    ],
    creative: [
      { id: 'graphic_designer', name: 'Diseñador Gráfico', icon: '🎨' },
      { id: 'ui_ux', name: 'UI/UX Designer', icon: '🎯' },
    ],
    legal: [
      { id: 'lawyer', name: 'Abogado', icon: '⚖️' },
    ],
    sales: [
      { id: 'sales_executive', name: 'Ejecutivo de Ventas', icon: '📞' },
    ],
    admin: [
      { id: 'assistant', name: 'Asistente Administrativo', icon: '📎' },
    ],
  };

  // Solicitar permisos al iniciar
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setHasAudioPermission(status === 'granted');
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    })();
  }, []);

  const speakText = async (text) => {
    try {
      await Speech.speak(text, {
        language: 'es-ES',
        pitch: 1.0,
        rate: 0.9,
      });
    } catch (error) {
      console.error("Error al hablar:", error);
    }
  };

  // Iniciar entrevista - /api/interview/start
  const startInterview = async () => {
    setIsProcessing(true);
    try {
      const response = await api.post('/interview/start', {
        mode: selectedRole ? "job_specific" : "practice",
        job_id: selectedJobId
      });

      console.log("Start response:", response.data);

      if (response.data.status === "success") {
        const firstQuestion = response.data.first_question || "Cuéntame sobre ti";
        setMessages([
          { role: "model", content: firstQuestion }
        ]);
        await speakText(firstQuestion);
      } else {
        throw new Error(response.data.message || "No se pudo iniciar");
      }
    } catch (error) {
      console.error("Error iniciando entrevista:", error);
      Alert.alert("Error", "No se pudo iniciar la entrevista");
    } finally {
      setIsProcessing(false);
    }
  };

  // Iniciar grabación de audio
  const startRecording = async () => {
    if (!hasAudioPermission) {
      Alert.alert("Error", "No tienes permisos de micrófono");
      return;
    }
    
    try {
      setIsRecording(true);
      setTranscript("🎙️ Grabando...");
      
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      
    } catch (error) {
      console.error("Error al grabar:", error);
      Alert.alert("Error", "No se pudo iniciar la grabación");
      setIsRecording(false);
    }
  };

  // Detener grabación y transcribir (simulado)
  const stopRecording = async () => {
    if (!recording) return;
    
    setIsRecording(false);
    setIsTranscribing(true);
    setTranscript("🔄 Procesando audio...");

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      // Por ahora, simulamos la transcripción
      // En producción, aquí enviarías el audio a un servicio de reconocimiento de voz
      setTimeout(() => {
        // Simular texto transcrito
        const simulatedText = "Esta es una respuesta de prueba desde el audio grabado. En una versión real, aquí aparecería tu transcripción.";
        
        setTranscript(`📝 "${simulatedText.substring(0, 50)}..."`);
        setIsTranscribing(false);
        
        // Preguntar si quiere enviar esta respuesta
        Alert.alert(
          "Audio grabado",
          "¿Quieres enviar esta respuesta?",
          [
            {
              text: "Editar",
              onPress: () => {
                setTextInput(simulatedText);
                setTranscript("");
              }
            },
            {
              text: "Enviar",
              onPress: () => {
                sendMessage(simulatedText);
                setTranscript("");
              }
            },
            {
              text: "Cancelar",
              style: "cancel",
              onPress: () => setTranscript("")
            }
          ]
        );
      }, 1500);
      
    } catch (error) {
      console.error("Error procesando audio:", error);
      setTranscript("❌ Error al procesar el audio");
      Alert.alert("Error", "No se pudo procesar el audio");
    } finally {
      setRecording(null);
      setTimeout(() => {
        if (transcript !== "❌ Error al procesar el audio") {
          // No limpiar si hay error
        }
      }, 3000);
    }
  };

  // Enviar mensaje - /api/interview/message
  const sendMessage = async (text) => {
    if (!text || !text.trim()) {
      Alert.alert("Aviso", "Escribe o graba tu respuesta");
      return;
    }

    const newHistory = [
      ...messages,
      { role: "user", content: text }
    ];
    setMessages(newHistory);
    setTextInput("");
    setTranscript("");
    setIsProcessing(true);

    try {
      const response = await api.post('/interview/message', {
        history: newHistory,
        job_context: selectedRole ? `Job ID: ${selectedRole}` : null
      });

      console.log("Message response:", response.data);

      if (response.data.status === "success") {
        const reply = response.data.reply || response.data.message || "Gracias por tu respuesta";
        const newMessages = [
          ...newHistory,
          { role: "model", content: reply }
        ];
        setMessages(newMessages);
        await speakText(reply);
      } else {
        throw new Error(response.data.message || "Error en la respuesta");
      }
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      Alert.alert("Error", "No se pudo enviar tu respuesta");
    } finally {
      setIsProcessing(false);
    }
  };

  // Finalizar entrevista - /api/interview/finish
  const finishInterview = async () => {
    setIsProcessing(true);
    
    try {
      const response = await api.post('/interview/finish', {
        history: messages,
        job_context: selectedRole ? `Job ID: ${selectedRole}` : null
      });

      console.log("Finish response:", response.data);

      if (response.data.status === "success") {
        setIsFinished(true);
        setEvaluation(response.data);
      } else {
        throw new Error(response.data.message || "Error al finalizar");
      }
    } catch (error) {
      console.error("Error al finalizar:", error);
      Alert.alert("Error", "No se pudo finalizar la entrevista");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectRole = (categoryId, roleId) => {
    setSelectedCategory(categoryId);
    setSelectedRole(roleId);
  };

  const handleStartInterview = () => {
    setStep('interviewing');
    startInterview();
  };

  const handleReset = () => {
    setStep('select');
    setSelectedCategory(null);
    setSelectedRole(null);
    setSelectedJobId(null);
    setMessages([]);
    setEvaluation(null);
    setIsFinished(false);
    setTextInput("");
    setTranscript("");
  };

  const scrollViewRef = useRef();

  // Pantalla de selección de categoría
  if (step === 'select' && !selectedCategory) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Simulador de Entrevistas</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🎤</Text>
            <Text style={styles.infoTitle}>Entrevista con IA</Text>
            <Text style={styles.infoText}>
              Usa el micrófono para hablar o escribe tus respuestas. La IA evaluará tus respuestas.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>¿Cuál es tu área?</Text>
          
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: category.color }]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Pantalla de selección de rol
  if (step === 'select' && selectedCategory && !selectedRole) {
    const roles = rolesByCategory[selectedCategory] || [];
    const categoryInfo = categories.find(c => c.id === selectedCategory);

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedCategory(null)} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Selecciona tu rol</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryInfo?.color }]}>
            <Text style={styles.categoryBadgeIcon}>{categoryInfo?.icon}</Text>
            <Text style={styles.categoryBadgeText}>{categoryInfo?.name}</Text>
          </View>

          <Text style={styles.sectionTitle}>Especifica tu puesto</Text>
          
          <View style={styles.rolesGrid}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.id}
                style={styles.roleCard}
                onPress={() => handleSelectRole(selectedCategory, role.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.roleIcon}>{role.icon}</Text>
                <Text style={styles.roleName}>{role.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.startButton} onPress={handleStartInterview}>
            <Text style={styles.startButtonText}>Iniciar Entrevista</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backToCategoriesButton}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={styles.backToCategoriesText}>← Volver a categorías</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Pantalla de entrevista en curso
  if (step === 'interviewing' && !isFinished) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleReset} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Entrevista con IA</Text>
          <TouchableOpacity onPress={finishInterview} style={styles.finishButton}>
            <Text style={styles.finishButtonText}>Finalizar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.interviewContainer}>
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsIcon}>💡</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.instructionsTitle}>¿Cómo funciona?</Text>
              <Text style={styles.instructionsText}>
                Mantén presionado 🎤 para grabar audio. Suelta para procesar tu respuesta.
              </Text>
            </View>
          </View>

          <ScrollView 
            ref={scrollViewRef}
            style={styles.chatContainer} 
            contentContainerStyle={styles.chatContent}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
          >
            {messages.map((msg, idx) => (
              <View key={idx} style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userMessage : styles.botMessage
              ]}>
                <Text style={msg.role === 'user' ? styles.userMessageText : styles.botMessageText}>
                  {msg.content}
                </Text>
              </View>
            ))}
            {isProcessing && (
              <View style={[styles.messageBubble, styles.botMessage]}>
                <ActivityIndicator size="small" color="#5B34F2" />
                <Text style={styles.botMessageText}>Procesando...</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.recordingArea}>
            {(transcript !== "" || isTranscribing) && (
              <View style={styles.transcriptContainer}>
                {isTranscribing ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <ActivityIndicator size="small" color="#10B981" />
                    <Text style={styles.transcriptText}>Procesando audio...</Text>
                  </View>
                ) : (
                  <Text style={styles.transcriptText}>{transcript}</Text>
                )}
              </View>
            )}
            
            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.recordingActive]}
              onPressIn={startRecording}
              onPressOut={stopRecording}
              disabled={isProcessing || isTranscribing}
            >
              <Text style={styles.recordButtonText}>
                {isRecording ? "🔴 Grabando... (Suelta para enviar)" : "🎤 Mantén presionado para grabar"}
              </Text>
            </TouchableOpacity>

            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="O escribe tu respuesta aquí..."
                placeholderTextColor="#9CA3AF"
                multiline
                value={textInput}
                onChangeText={setTextInput}
                editable={!isProcessing && !isRecording && !isTranscribing}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => sendMessage(textInput)}
                disabled={isProcessing || isRecording || isTranscribing || !textInput.trim()}
              >
                <Text style={styles.sendButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Pantalla de resultados
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resultados</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.resultsCard}>
          <Text style={styles.resultsIcon}>🎉</Text>
          <Text style={styles.resultsTitle}>Entrevista Finalizada</Text>
          
          <View style={styles.scoreSummary}>
            <Text style={styles.scoreLabel}>Puntuación General</Text>
            <Text style={styles.scoreValue}>{evaluation?.score || evaluation?.evaluation?.score || 85}/100</Text>
          </View>

          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackTitle}>💬 Feedback General</Text>
            <Text style={styles.feedbackText}>
              {evaluation?.feedback || evaluation?.evaluation?.feedback || "¡Excelente trabajo! Has demostrado buenas habilidades de comunicación."}
            </Text>
          </View>

          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>🎯 Consejos para mejorar</Text>
            <Text style={styles.tipItem}>• Practica tus respuestas con anticipación</Text>
            <Text style={styles.tipItem}>• Investiga sobre la empresa y el puesto</Text>
            <Text style={styles.tipItem}>• Prepara ejemplos concretos de logros</Text>
            <Text style={styles.tipItem}>• Habla con claridad y confianza</Text>
            <Text style={styles.tipItem}>• Haz preguntas inteligentes al final</Text>
          </View>

          <TouchableOpacity style={styles.restartButton} onPress={handleReset}>
            <Text style={styles.restartButtonText}>Practicar de nuevo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backToMenuButton} onPress={onBack}>
            <Text style={styles.backToMenuText}>Volver al menú</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 16,
    backgroundColor: '#4320C9',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  finishButton: {
    backgroundColor: '#ED7B32',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  finishButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  infoIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    minWidth: '45%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 40,
    marginBottom: 24,
    gap: 8,
  },
  categoryBadgeIcon: {
    fontSize: 20,
  },
  categoryBadgeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  rolesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  roleCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  roleIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  roleName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
  },
  backToCategoriesButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backToCategoriesText: {
    fontSize: 14,
    color: '#5B34F2',
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#5B34F2',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  interviewContainer: {
    flex: 1,
    padding: 16,
  },
  instructionsCard: {
    flexDirection: 'row',
    backgroundColor: '#E8E4FD',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  instructionsIcon: {
    fontSize: 24,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A2BC4',
    marginBottom: 2,
  },
  instructionsText: {
    fontSize: 12,
    color: '#4A2BC4',
  },
  chatContainer: {
    flex: 1,
    maxHeight: 400,
    marginBottom: 16,
  },
  chatContent: {
    paddingVertical: 8,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1C6B72',
    borderTopRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userMessageText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  botMessageText: {
    fontSize: 14,
    color: '#1F2937',
  },
  recordingArea: {
    marginTop: 'auto',
  },
  transcriptContainer: {
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  transcriptText: {
    fontSize: 14,
    color: '#10B981',
    textAlign: 'center',
  },
  recordButton: {
    backgroundColor: '#5B34F2',
    paddingVertical: 16,
    borderRadius: 40,
    alignItems: 'center',
    marginBottom: 12,
  },
  recordingActive: {
    backgroundColor: '#EF4444',
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  textInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: '#5B34F2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resultsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  resultsIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  scoreSummary: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  scoreLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#5B34F2',
  },
  feedbackSection: {
    marginBottom: 20,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 12,
  },
  tipItem: {
    fontSize: 13,
    color: '#78350F',
    marginBottom: 8,
    lineHeight: 18,
  },
  restartButton: {
    backgroundColor: '#5B34F2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  restartButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backToMenuButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  backToMenuText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
});