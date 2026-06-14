import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useRef } from "react";
import * as Speech from "expo-speech";
import api from "../../../services/api";

export default function SimuladorEntrevistas({ onBack }) {
  const [step, setStep] = useState("select");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRoleName, setSelectedRoleName] = useState(null);

  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const isSendingRef = useRef(false);

  const categories = [
    { id: "tech", name: "Tecnología", icon: "💻", color: "#EEF2FF" },
    { id: "business", name: "Negocios", icon: "📊", color: "#FEF3C7" },
    { id: "health", name: "Salud", icon: "🏥", color: "#DCFCE7" },
    { id: "education", name: "Educación", icon: "📚", color: "#FFE4E6" },
    { id: "creative", name: "Creativo", icon: "🎨", color: "#FCE7F3" },
    { id: "legal", name: "Legal", icon: "⚖️", color: "#E0E7FF" },
    { id: "sales", name: "Ventas", icon: "📈", color: "#CCFBF1" },
    { id: "admin", name: "Administrativo", icon: "📋", color: "#E5E7EB" },
  ];

  const rolesByCategory = {
    tech: [
      { id: "frontend", name: "Frontend Developer", icon: "🎨" },
      { id: "backend", name: "Backend Developer", icon: "⚙️" },
      { id: "fullstack", name: "Full Stack", icon: "🚀" },
      { id: "datascience", name: "Data Scientist", icon: "📊" },
      { id: "devops", name: "DevOps", icon: "🔧" },
      { id: "mobile", name: "Mobile Developer", icon: "📱" },
    ],
    business: [
      { id: "marketing", name: "Marketing Digital", icon: "📢" },
      { id: "finance", name: "Finanzas", icon: "💰" },
      { id: "hr", name: "Recursos Humanos", icon: "👥" },
      { id: "project_manager", name: "Project Manager", icon: "📋" },
    ],
    health: [
      { id: "doctor", name: "Médico General", icon: "👨‍⚕️" },
      { id: "nurse", name: "Enfermería", icon: "💉" },
      { id: "psychologist", name: "Psicología", icon: "🧠" },
    ],
    education: [
      { id: "teacher", name: "Docente", icon: "👩‍🏫" },
      { id: "professor", name: "Profesor Universitario", icon: "🎓" },
    ],
    creative: [
      { id: "graphic_designer", name: "Diseñador Gráfico", icon: "🎨" },
      { id: "ui_ux", name: "UI/UX Designer", icon: "🎯" },
    ],
    legal: [{ id: "lawyer", name: "Abogado", icon: "⚖️" }],
    sales: [{ id: "sales_executive", name: "Ejecutivo de Ventas", icon: "📞" }],
    admin: [{ id: "assistant", name: "Asistente Administrativo", icon: "📎" }],
  };

  const speakText = async (text) => {
    try {
      await Speech.speak(text, {
        language: "es-ES",
        pitch: 1.0,
        rate: 0.9,
      });
    } catch (error) {
      console.error("Error al hablar:", error);
    }
  };

  const startInterview = async () => {
    if (!selectedRole || !selectedRoleName) {
      Alert.alert("Error", "Por favor selecciona un rol primero");
      return;
    }

    setIsProcessing(true);
    try {
      const requestData = {
        mode: "practice",
        job_id: null
      };
      
      console.log("📡 Enviando a /interview/start:", requestData);
      
      const response = await api.post('/interview/start', requestData);

      console.log("📥 Respuesta:", response.data);

      if (response.data.status === "success") {
        const firstQuestion = response.data.first_question || 
          `Hola, soy tu entrevistador. Esta es una entrevista de práctica para el puesto de ${selectedRoleName}. Cuéntame sobre ti y tu experiencia profesional.`;
        
        setMessages([{ role: "model", content: firstQuestion }]);
        await speakText(firstQuestion);
        setStep("interviewing"); // 👈 Cambiar a entrevista SOLO después de éxito
      } else {
        throw new Error(response.data.message || "No se pudo iniciar");
      }
    } catch (error) {
      console.error("Error iniciando entrevista:", error);
      Alert.alert("Error", "No se pudo iniciar la entrevista");
      setIsProcessing(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text || !text.trim() || isSendingRef.current) return;

    isSendingRef.current = true;

    const newHistory = [...messages, { role: "user", content: text }];
    setMessages(newHistory);
    setTextInput("");
    setIsProcessing(true);

    try {
      const jobContext = `Entrevista de práctica para el puesto de ${selectedRoleName} en el área de ${selectedCategory}.`;
      
      const response = await api.post('/interview/message', {
        history: newHistory,
        job_context: jobContext
      });

      if (response.data.status === "success") {
        const reply = response.data.reply || "Gracias por tu respuesta";
        const newMessages = [...newHistory, { role: "model", content: reply }];
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
      isSendingRef.current = false;
    }
  };

  const finishInterview = async () => {
    setIsProcessing(true);
    
    try {
      const jobContext = `Entrevista de práctica para el puesto de ${selectedRoleName} en el área de ${selectedCategory}`;
      
      const response = await api.post('/interview/finish', {
        history: messages,
        job_context: jobContext
      });

      if (response.data.status === "success") {
        setIsFinished(true);
        setEvaluation(response.data);
        setStep("results"); // 👈 Cambiar a resultados
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

  // ✅ SELECCIONAR ROL
  const handleSelectRole = (categoryId, roleId) => {
    const role = rolesByCategory[categoryId].find(r => r.id === roleId);
    setSelectedCategory(categoryId);
    setSelectedRole(roleId);
    setSelectedRoleName(role?.name || roleId);
    console.log("✅ Rol seleccionado:", { categoryId, roleId, roleName: role?.name });
  };

  // ✅ INICIAR ENTREVISTA - SOLO SE LLAMA DESPUÉS DE SELECCIONAR ROL
  const handleStartInterview = () => {
    if (!selectedRole || !selectedRoleName) {
      Alert.alert("Error", "Por favor selecciona un puesto específico");
      return;
    }
    console.log("🚀 Iniciando entrevista para:", selectedRoleName);
    startInterview(); // No cambiamos step aquí, lo hace startInterview después del éxito
  };

  const handleReset = () => {
    setStep("select");
    setSelectedCategory(null);
    setSelectedRole(null);
    setSelectedRoleName(null);
    setMessages([]);
    setEvaluation(null);
    setIsFinished(false);
    setTextInput("");
  };

  const scrollViewRef = useRef();

  // ==============================================================
  // PANTALLA 1: SELECCIÓN DE CATEGORÍA
  // ==============================================================
  if (step === "select" && !selectedCategory) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4320C9" />
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Simulador de Entrevistas</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>💼</Text>
            <Text style={styles.infoTitle}>Entrevista con IA</Text>
            <Text style={styles.infoText}>
              Selecciona tu área y luego el puesto específico.
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

  // ==============================================================
  // PANTALLA 2: SELECCIÓN DE ROL
  // EL BOTÓN "INICIAR ENTREVISTA" SOLO APARECE DESPUÉS DE SELECCIONAR UN ROL
  // ==============================================================
  if (step === "select" && selectedCategory) {
    const roles = rolesByCategory[selectedCategory] || [];
    const categoryInfo = categories.find((c) => c.id === selectedCategory);
    
    // Determinar si ya se seleccionó un rol
    const hasSelectedRole = selectedRole !== null;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4320C9" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {
            setSelectedCategory(null);
            setSelectedRole(null);
            setSelectedRoleName(null);
          }} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Selecciona tu rol</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryInfo?.color }]}>
            <Text style={styles.categoryBadgeIcon}>{categoryInfo?.icon}</Text>
            <Text style={styles.categoryBadgeText}>{categoryInfo?.name}</Text>
          </View>

          <Text style={styles.sectionTitle}>Especifica tu puesto</Text>

          <View style={styles.rolesGrid}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.roleCard,
                  selectedRole === role.id && styles.roleCardSelected
                ]}
                onPress={() => handleSelectRole(selectedCategory, role.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.roleIcon}>{role.icon}</Text>
                <Text style={styles.roleName}>{role.name}</Text>
                {selectedRole === role.id && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* 👇 EL BOTÓN "INICIAR ENTREVISTA" SOLO APARECE SI YA HAY UN ROL SELECCIONADO */}
          {hasSelectedRole && (
            <TouchableOpacity 
              style={styles.startButton} 
              onPress={handleStartInterview}
              disabled={isProcessing}
            >
              <Text style={styles.startButtonText}>
                {isProcessing ? "Iniciando..." : `Iniciar Entrevista como ${selectedRoleName}`}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.backToCategoriesButton} 
            onPress={() => {
              setSelectedCategory(null);
              setSelectedRole(null);
              setSelectedRoleName(null);
            }}
          >
            <Text style={styles.backToCategoriesText}>← Volver a categorías</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ==============================================================
  // PANTALLA 3: ENTREVISTA EN CURSO
  // ==============================================================
  if (step === "interviewing") {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4320C9" />

        <View style={styles.header}>
          <TouchableOpacity onPress={handleReset} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Entrevista • {selectedRoleName}
          </Text>
          <TouchableOpacity onPress={finishInterview} style={styles.finishButton}>
            <Text style={styles.finishButtonText}>Finalizar</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={styles.interviewContainer}>
            <View style={styles.instructionsCard}>
              <Text style={styles.instructionsIcon}>💡</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.instructionsTitle}>Entrevista para {selectedRoleName}</Text>
                <Text style={styles.instructionsText}>
                  Escribe tus respuestas y presiona "Enviar".
                </Text>
              </View>
            </View>

            <ScrollView
              ref={scrollViewRef}
              style={styles.chatContainer}
              contentContainerStyle={styles.chatContent}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
              showsVerticalScrollIndicator={true}
            >
              {messages.length === 0 ? (
                <View style={styles.emptyChat}>
                  <Text style={styles.emptyChatText}>✨ La IA comenzará la entrevista...</Text>
                </View>
              ) : (
                messages.map((msg, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.messageBubble,
                      msg.role === "user" ? styles.userMessage : styles.botMessage,
                    ]}
                  >
                    <Text style={msg.role === "user" ? styles.userMessageText : styles.botMessageText}>
                      {msg.content}
                    </Text>
                  </View>
                ))
              )}
              {isProcessing && (
                <View style={[styles.messageBubble, styles.botMessage]}>
                  <ActivityIndicator size="small" color="#5B34F2" />
                  <Text style={styles.botMessageText}>Procesando...</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.inputArea}>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Escribe tu respuesta aquí..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  value={textInput}
                  onChangeText={setTextInput}
                  editable={!isProcessing}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => sendMessage(textInput)}
                  disabled={isProcessing || !textInput.trim()}
                >
                  <Text style={styles.sendButtonText}>Enviar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // ==============================================================
  // PANTALLA 4: RESULTADOS FINALES
  // ==============================================================
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4320C9" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resultados</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsCard}>
          <Text style={styles.resultsIcon}>🎉</Text>
          <Text style={styles.resultsTitle}>Entrevista Finalizada</Text>

          <View style={styles.scoreSummary}>
            <Text style={styles.scoreLabel}>Puntuación General</Text>
            <Text style={styles.scoreValue}>
              {evaluation?.evaluation?.score || evaluation?.score || 0}/100
            </Text>
          </View>

          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackTitle}>💬 Feedback General</Text>
            <Text style={styles.feedbackText}>
              {evaluation?.evaluation?.feedback || evaluation?.feedback || "Gracias por participar."}
            </Text>
          </View>

          <View style={styles.rewardsCard}>
            <Text style={styles.rewardsTitle}>🎁 Recompensas obtenidas</Text>
            <View style={styles.rewardsRow}>
              <Text style={styles.rewardItem}>💰 +{evaluation?.rewards?.coins || 0} monedas</Text>
              <Text style={styles.rewardItem}>⭐ +{evaluation?.rewards?.xp || 0} XP</Text>
            </View>
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
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 16,
    backgroundColor: "#4320C9",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 24,
    color: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  finishButton: {
    backgroundColor: "#ED7B32",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  finishButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: "#EEF2FF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  infoIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    minWidth: "45%",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "600",
    color: "#1F2937",
  },
  rolesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  roleCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    position: "relative",
  },
  roleCardSelected: {
    borderColor: "#5B34F2",
    borderWidth: 2,
    backgroundColor: "#F3EEFF",
  },
  roleIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  roleName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1F2937",
    textAlign: "center",
  },
  checkMark: {
    position: "absolute",
    top: 8,
    right: 12,
    fontSize: 16,
    color: "#5B34F2",
    fontWeight: "bold",
  },
  backToCategoriesButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  backToCategoriesText: {
    fontSize: 14,
    color: "#5B34F2",
    fontWeight: "500",
  },
  startButton: {
    backgroundColor: "#5B34F2",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  interviewContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  instructionsCard: {
    flexDirection: "row",
    backgroundColor: "#E8E4FD",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  instructionsIcon: {
    fontSize: 24,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A2BC4",
    marginBottom: 2,
  },
  instructionsText: {
    fontSize: 12,
    color: "#4A2BC4",
  },
  chatContainer: {
    flex: 1,
    marginBottom: 12,
  },
  chatContent: {
    paddingVertical: 8,
    paddingBottom: 16,
    flexGrow: 1,
  },
  emptyChat: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyChatText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  messageBubble: {
    maxWidth: "85%",
    padding: 12,
    borderRadius: 18,
    marginBottom: 12,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#1C6B72",
    borderTopRightRadius: 4,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#F3F4F6",
    borderTopLeftRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userMessageText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  botMessageText: {
    fontSize: 14,
    color: "#1F2937",
  },
  inputArea: {
    paddingBottom: 8,
  },
  textInputContainer: {
    flexDirection: "row",
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: "#5B34F2",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  resultsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
  },
  resultsIcon: {
    fontSize: 48,
    textAlign: "center",
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 24,
  },
  scoreSummary: {
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  scoreLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 44,
    fontWeight: "bold",
    color: "#5B34F2",
  },
  feedbackSection: {
    marginBottom: 20,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  rewardsCard: {
    backgroundColor: "#F0FDF4",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  rewardsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#166534",
    marginBottom: 12,
  },
  rewardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rewardItem: {
    fontSize: 13,
    color: "#15803D",
    fontWeight: "500",
  },
  tipsCard: {
    backgroundColor: "#FEF3C7",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400E",
    marginBottom: 12,
  },
  tipItem: {
    fontSize: 13,
    color: "#78350F",
    marginBottom: 8,
    lineHeight: 18,
  },
  restartButton: {
    backgroundColor: "#5B34F2",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  restartButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  backToMenuButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  backToMenuText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
  },
});