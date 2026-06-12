import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

const CAREERS = [
  "Ingeniería de Sistemas e Informática", "Ingeniería de Software", "Ingeniería Industrial",
  "Ingeniería Civil", "Administración de Empresas", "Contabilidad y Finanzas",
  "Marketing", "Derecho", "Psicología", "Ciencias de la Comunicación", "Arquitectura",
];

const GOALS = [
  { id: "ppp", label: "📋 Práctica Pre-Profesional", desc: "Busco mis primeras prácticas" },
  { id: "pp", label: "🎯 Práctica Profesional", desc: "Ya tengo experiencia" },
  { id: "first_job", label: "💼 Primer empleo", desc: "Listo para tiempo completo" },
  { id: "target_company", label: "🏢 Empresa específica", desc: "Empresa soñada en mente" },
  { id: "switch_area", label: "🔄 Cambiar de área", desc: "Nuevos horizontes" },
  { id: "startup", label: "🚀 Emprender", desc: "Crear algo propio" },
];

const EXP_TYPES = [
  { id: "work", label: "💼 Laboral" },
  { id: "volunteering", label: "🤝 Voluntariado" },
  { id: "freelance", label: "💻 Freelance" },
];

export default function OnboardingScreen({ navigation, route }) {
  const [userEmail, setUserEmail] = useState(route.params?.email || ""); 

  useEffect(() => {
    const fetchUser = async () => {
      if (!userEmail) {
        const userStr = await AsyncStorage.getItem('@user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserEmail(user.email);
        }
      }
    };
    fetchUser();
  }, [userEmail]);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [career, setCareer] = useState("");
  const [semester, setSemester] = useState("");
  const [goal, setGoal] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [hasExperience, setHasExperience] = useState(null);
  const [experienceType, setExperienceType] = useState("");
  const [hasProjects, setHasProjects] = useState(null);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const submitStudent = async () => {
    setLoading(true);
    try {
      await api.post("/onboarding/student", {
        email: userEmail,
        career,
        semester: parseInt(semester) || 1,
        goal,
        has_experience: hasExperience || false,
        experience_type: hasExperience ? experienceType : null,
        has_projects: hasProjects || false,
        target_company: goal === "target_company" ? targetCompany : null,
      });
      navigation.replace("MainTabs");
    } catch (err) {
      console.error(err);
      navigation.replace("MainTabs");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {step > 1 ? (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1C6B72" />
          </TouchableOpacity>
        ) : <View style={{width: 24}}/>}
        
        {/* Progress Dots */}
        <View style={styles.progressContainer}>
          {[1, 2, 3].map(s => (
            <View key={s} style={[styles.dot, step >= s ? styles.dotActive : {}]} />
          ))}
        </View>
        <View style={{width: 24}}/>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {step === 1 && (
          <View>
            <Text style={styles.title}>Tu Perfil Académico</Text>
            <Text style={styles.subtitle}>Vamos a configurar la base para tu ruta.</Text>
            
            <Text style={styles.label}>Carrera</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={career} onValueChange={(v) => setCareer(v)}>
                <Picker.Item label="Selecciona tu carrera" value="" />
                {CAREERS.map(c => <Picker.Item key={c} label={c} value={c} />)}
              </Picker>
            </View>

            <Text style={styles.label}>Ciclo</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={semester} onValueChange={(v) => setSemester(v)}>
                <Picker.Item label="Selecciona tu ciclo" value="" />
                {[...Array(12)].map((_, i) => <Picker.Item key={i+1} label={`Ciclo ${i+1}`} value={(i+1).toString()} />)}
              </Picker>
            </View>

            <TouchableOpacity 
              style={[styles.btnPrimary, (!career || !semester) && styles.btnDisabled]}
              disabled={!career || !semester}
              onPress={handleNext}
            >
              <Text style={styles.btnText}>Siguiente Paso</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.title}>¿Cuál es tu meta principal?</Text>
            <Text style={styles.subtitle}>Adaptaremos tus misiones basadas en este objetivo.</Text>
            
            {GOALS.map(g => (
              <TouchableOpacity 
                key={g.id} 
                style={[styles.card, goal === g.id && styles.cardActive]}
                onPress={() => setGoal(g.id)}
              >
                <Text style={styles.cardTitle}>{g.label}</Text>
                <Text style={styles.cardDesc}>{g.desc}</Text>
              </TouchableOpacity>
            ))}

            {goal === "target_company" && (
              <View style={{marginTop: 10}}>
                <Text style={styles.label}>Empresa Objetivo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Google, BCP..."
                  value={targetCompany}
                  onChangeText={setTargetCompany}
                />
              </View>
            )}

            <TouchableOpacity 
              style={[styles.btnPrimary, (!goal || (goal === 'target_company' && !targetCompany)) && styles.btnDisabled]}
              disabled={!goal || (goal === 'target_company' && !targetCompany)}
              onPress={handleNext}
            >
              <Text style={styles.btnText}>Siguiente Paso</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={styles.title}>Tu Experiencia</Text>
            
            <Text style={styles.label}>¿Tienes experiencia previa?</Text>
            <View style={styles.row}>
              <TouchableOpacity style={[styles.choiceBtn, hasExperience === true && styles.choiceBtnActive]} onPress={() => setHasExperience(true)}>
                <Text style={[styles.choiceTxt, hasExperience === true && styles.choiceTxtActive]}>Sí, tengo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.choiceBtn, hasExperience === false && styles.choiceBtnActive]} onPress={() => {setHasExperience(false); setExperienceType("");}}>
                <Text style={[styles.choiceTxt, hasExperience === false && styles.choiceTxtActive]}>Aún no</Text>
              </TouchableOpacity>
            </View>

            {hasExperience === true && (
              <View style={[styles.row, {flexWrap: 'wrap', marginTop: 10}]}>
                {EXP_TYPES.map(exp => (
                  <TouchableOpacity key={exp.id} style={[styles.choiceBtn, experienceType === exp.id && styles.choiceBtnActive, {width: '48%', marginBottom: 10}]} onPress={() => setExperienceType(exp.id)}>
                    <Text style={[styles.choiceTxt, experienceType === exp.id && styles.choiceTxtActive, {fontSize: 12}]}>{exp.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={[styles.label, {marginTop: 20}]}>¿Tienes proyectos?</Text>
            <View style={styles.row}>
              <TouchableOpacity style={[styles.choiceBtn, hasProjects === true && styles.choiceBtnActive]} onPress={() => setHasProjects(true)}>
                <Text style={[styles.choiceTxt, hasProjects === true && styles.choiceTxtActive]}>Sí, tengo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.choiceBtn, hasProjects === false && styles.choiceBtnActive]} onPress={() => setHasProjects(false)}>
                <Text style={[styles.choiceTxt, hasProjects === false && styles.choiceTxtActive]}>Aún no</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.btnPrimary, (hasExperience === null || hasProjects === null || loading || (hasExperience && !experienceType)) && styles.btnDisabled]}
              disabled={hasExperience === null || hasProjects === null || loading || (hasExperience && !experienceType)}
              onPress={submitStudent}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Generar mi Ruta</Text>}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  backButton: { padding: 5 },
  progressContainer: { flexDirection: 'row', gap: 10 },
  dot: { width: 30, height: 6, borderRadius: 3, backgroundColor: '#e5e7eb' },
  dotActive: { backgroundColor: '#1C6B72' },
  content: { padding: 24 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1f2937', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#6b7280', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8, marginTop: 15 },
  pickerContainer: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 15 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, borderWidth: 2, borderColor: '#f3f4f6', marginBottom: 10 },
  cardActive: { borderColor: '#1C6B72', backgroundColor: '#f0fdfa' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  cardDesc: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 15, fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  choiceBtn: { flex: 1, padding: 15, borderRadius: 12, borderWidth: 2, borderColor: '#f3f4f6', alignItems: 'center' },
  choiceBtnActive: { borderColor: '#1C6B72', backgroundColor: '#f0fdfa' },
  choiceTxt: { fontWeight: 'bold', color: '#6b7280' },
  choiceTxtActive: { color: '#1C6B72' },
  btnPrimary: { backgroundColor: '#1C6B72', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 30 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
