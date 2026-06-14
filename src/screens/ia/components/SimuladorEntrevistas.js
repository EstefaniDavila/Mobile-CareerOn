import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';

export default function SimuladorEntrevistas({ onBack }) {
  const [step, setStep] = useState('select'); // select, interviewing, results
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);

  // CATEGORÍAS PRINCIPALES
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

  // ROLES POR CATEGORÍA
  const rolesByCategory = {
    tech: [
      { id: 'frontend', name: 'Frontend Developer', icon: '🎨' },
      { id: 'backend', name: 'Backend Developer', icon: '⚙️' },
      { id: 'fullstack', name: 'Full Stack', icon: '🚀' },
      { id: 'datascience', name: 'Data Scientist', icon: '📊' },
      { id: 'devops', name: 'DevOps', icon: '🔧' },
      { id: 'mobile', name: 'Mobile Developer', icon: '📱' },
      { id: 'qa', name: 'QA Tester', icon: '🧪' },
      { id: 'security', name: 'Seguridad Informática', icon: '🔒' },
    ],
    business: [
      { id: 'marketing', name: 'Marketing Digital', icon: '📢' },
      { id: 'finance', name: 'Finanzas', icon: '💰' },
      { id: 'hr', name: 'Recursos Humanos', icon: '👥' },
      { id: 'admin_business', name: 'Administración', icon: '📁' },
      { id: 'logistics', name: 'Logística', icon: '🚚' },
      { id: 'project_manager', name: 'Project Manager', icon: '📋' },
      { id: 'consultant', name: 'Consultor', icon: '💡' },
    ],
    health: [
      { id: 'doctor', name: 'Médico General', icon: '👨‍⚕️' },
      { id: 'nurse', name: 'Enfermería', icon: '💉' },
      { id: 'dentist', name: 'Odontología', icon: '🦷' },
      { id: 'psychologist', name: 'Psicología', icon: '🧠' },
      { id: 'physiotherapy', name: 'Fisioterapia', icon: '🏃' },
      { id: 'nutrition', name: 'Nutrición', icon: '🥗' },
      { id: 'veterinary', name: 'Veterinaria', icon: '🐾' },
    ],
    education: [
      { id: 'teacher', name: 'Docente', icon: '👩‍🏫' },
      { id: 'professor', name: 'Profesor Universitario', icon: '🎓' },
      { id: 'pedagogue', name: 'Pedagogo', icon: '📖' },
      { id: 'tutor', name: 'Tutor', icon: '✏️' },
      { id: 'educational_coordinator', name: 'Coordinador Educativo', icon: '📅' },
    ],
    creative: [
      { id: 'graphic_designer', name: 'Diseñador Gráfico', icon: '🎨' },
      { id: 'ui_ux', name: 'UI/UX Designer', icon: '🎯' },
      { id: 'illustrator', name: 'Ilustrador', icon: '🖌️' },
      { id: 'photographer', name: 'Fotógrafo', icon: '📷' },
      { id: 'video_editor', name: 'Editor de Video', icon: '🎬' },
      { id: 'animator', name: 'Animador', icon: '✨' },
      { id: 'copywriter', name: 'Redactor Creativo', icon: '✍️' },
    ],
    legal: [
      { id: 'lawyer', name: 'Abogado', icon: '⚖️' },
      { id: 'judge', name: 'Juez', icon: '👨‍⚖️' },
      { id: 'notary', name: 'Notario', icon: '📜' },
      { id: 'legal_advisor', name: 'Asesor Legal', icon: '📝' },
      { id: 'compliance', name: 'Compliance', icon: '✅' },
    ],
    sales: [
      { id: 'sales_executive', name: 'Ejecutivo de Ventas', icon: '📞' },
      { id: 'account_manager', name: 'Account Manager', icon: '🤝' },
      { id: 'business_dev', name: 'Desarrollo de Negocios', icon: '🚀' },
      { id: 'retail', name: 'Ventas Retail', icon: '🏬' },
      { id: 'real_estate', name: 'Bienes Raíces', icon: '🏠' },
    ],
    admin: [
      { id: 'assistant', name: 'Asistente Administrativo', icon: '📎' },
      { id: 'receptionist', name: 'Recepcionista', icon: '📞' },
      { id: 'secretary', name: 'Secretaria', icon: '📋' },
      { id: 'office_manager', name: 'Office Manager', icon: '🏢' },
      { id: 'data_entry', name: 'Data Entry', icon: '⌨️' },
    ],
  };

  // PREGUNTAS GENERALES Y ESPECÍFICAS POR ROL
  const getQuestionsForRole = (categoryId, roleId) => {
    const baseQuestions = {
      general: [
        'Háblame de ti y tu experiencia profesional',
        '¿Cuáles son tus principales fortalezas?',
        '¿Cuáles son tus áreas de oportunidad?',
        '¿Por qué quieres trabajar con nosotros?',
        '¿Dónde te ves en 5 años?',
        '¿Cuál ha sido tu mayor logro profesional?',
        '¿Cómo manejas situaciones de presión?',
        '¿Qué esperas lograr en los primeros 3 meses?',
      ],
      tech: [
        '¿Qué tecnologías dominas y cuál es tu favorita?',
        '¿Cómo te mantienes actualizado en tecnología?',
        '¿Has trabajado con metodologías ágiles?',
        '¿Cómo resuelves problemas técnicos complejos?',
      ],
      business: [
        '¿Cómo defines una estrategia de marketing exitosa?',
        '¿Qué métricas consideras clave en finanzas?',
        '¿Cómo gestionas equipos de trabajo?',
        '¿Qué herramientas de gestión utilizas?',
      ],
      health: [
        '¿Cómo manejas situaciones de emergencia?',
        '¿Qué importancia le das al trato con pacientes?',
        '¿Cómo te mantienes actualizado en medicina?',
        '¿Cómo trabajas bajo presión en cirugías/emergencias?',
      ],
      education: [
        '¿Cuál es tu metodología de enseñanza?',
        '¿Cómo manejas estudiantes con diferentes ritmos?',
        '¿Qué herramientas tecnológicas usas en clase?',
        '¿Cómo evalúas el aprendizaje?',
      ],
      creative: [
        '¿Cuál es tu proceso creativo?',
        '¿Cómo manejas las críticas a tu trabajo?',
        '¿Qué herramientas de diseño dominas?',
        '¿Cómo te inspiras para crear?',
      ],
      legal: [
        '¿Cómo te mantienes actualizado en leyes?',
        '¿Cuál es tu experiencia en litigios?',
        '¿Cómo manejas la confidencialidad?',
        '¿Qué áreas del derecho dominas?',
      ],
      sales: [
        '¿Cuál es tu técnica de cierre de ventas?',
        '¿Cómo manejas objeciones?',
        '¿Cuál es tu récord de ventas?',
        '¿Cómo construyes relaciones con clientes?',
      ],
      admin: [
        '¿Cómo organizas tu tiempo y prioridades?',
        '¿Qué herramientas de oficina dominas?',
        '¿Cómo manejas múltiples tareas?',
        '¿Qué experiencia tienes en atención al cliente?',
      ],
    };

    let specificQuestions = [];
    
    if (categoryId === 'tech') specificQuestions = baseQuestions.tech;
    else if (categoryId === 'business') specificQuestions = baseQuestions.business;
    else if (categoryId === 'health') specificQuestions = baseQuestions.health;
    else if (categoryId === 'education') specificQuestions = baseQuestions.education;
    else if (categoryId === 'creative') specificQuestions = baseQuestions.creative;
    else if (categoryId === 'legal') specificQuestions = baseQuestions.legal;
    else if (categoryId === 'sales') specificQuestions = baseQuestions.sales;
    else if (categoryId === 'admin') specificQuestions = baseQuestions.admin;
    else specificQuestions = [];

    // Mezclar preguntas generales + específicas
    const allQuestions = [...baseQuestions.general, ...specificQuestions];
    // Tomar 5 preguntas aleatorias
    return allQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
  };

  const [currentQuestions, setCurrentQuestions] = useState([]);

  const handleSelectRole = (categoryId, roleId) => {
    setSelectedCategory(categoryId);
    setSelectedRole(roleId);
  };

  const handleStartInterview = () => {
    const questions = getQuestionsForRole(selectedCategory, selectedRole);
    setCurrentQuestions(questions);
    setStep('interviewing');
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion + 1 < currentQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('results');
    }
  };

  const handleReset = () => {
    setStep('select');
    setSelectedCategory(null);
    setSelectedRole(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setCurrentQuestions([]);
  };

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
            <Text style={styles.infoTitle}>Practica con IA</Text>
            <Text style={styles.infoText}>
              Selecciona tu área profesional para comenzar la simulación
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

  // Pantalla de selección de rol específico
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
  if (step === 'interviewing') {
    const progress = ((currentQuestion + 1) / currentQuestions.length) * 100;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleReset} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Entrevista en curso</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.interviewContainer}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              Pregunta {currentQuestion + 1} de {currentQuestions.length}
            </Text>
          </View>

          <View style={styles.questionCard}>
            <Text style={styles.questionIcon}>🤖</Text>
            <Text style={styles.questionText}>{currentQuestions[currentQuestion]}</Text>
          </View>

          <View style={styles.answerButtons}>
            {['Excelente', 'Bien', 'Regular', 'Necesito mejorar'].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.answerOption}
                onPress={() => handleAnswer(option)}
                activeOpacity={0.7}
              >
                <Text style={styles.answerOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
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
          <Text style={styles.resultsIcon}>📊</Text>
          <Text style={styles.resultsTitle}>Feedback de tu entrevista</Text>
          
          <View style={styles.scoreSummary}>
            <Text style={styles.scoreLabel}>Puntuación general</Text>
            <Text style={styles.scoreValue}>
              {Math.round(answers.filter(a => a === 'Excelente' || a === 'Bien').length / answers.length * 100)}%
            </Text>
          </View>

          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackTitle}>💪 Fortalezas</Text>
            <Text style={styles.feedbackText}>
              {answers.filter(a => a === 'Excelente' || a === 'Bien').length > 2
                ? 'Demuestras buen conocimiento y confianza en tus respuestas. Tienes una comunicación clara y estructurada.'
                : 'Tienes disposición para aprender y mejorar. Muestras interés en el puesto.'}
            </Text>
          </View>

          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackTitle}>📈 Áreas de mejora</Text>
            <Text style={styles.feedbackText}>
              {answers.filter(a => a === 'Regular' || a === 'Necesito mejorar').length > 1
                ? 'Te sugerimos practicar más tus respuestas y profundizar en conceptos clave de tu área.'
                : 'Sigue practicando para ganar más fluidez y confianza en tus respuestas.'}
            </Text>
          </View>

          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>🎯 Consejos generales</Text>
            <Text style={styles.tipItem}>• Investiga sobre la empresa antes de la entrevista</Text>
            <Text style={styles.tipItem}>• Prepara ejemplos concretos de tu experiencia</Text>
            <Text style={styles.tipItem}>• Haz preguntas inteligentes al final</Text>
            <Text style={styles.tipItem}>• Cuida tu lenguaje corporal</Text>
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
  },
  startButtonDisabled: {
    backgroundColor: '#C7D2FE',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  interviewContainer: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5B34F2',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  questionIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 26,
  },
  answerButtons: {
    gap: 12,
  },
  answerOption: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  answerOptionText: {
    fontSize: 15,
    color: '#1F2937',
    textAlign: 'center',
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