import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function OptimizarCV({ onBack }) {
  const [file, setFile] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [optimizedText, setOptimizedText] = useState('');
  const [error, setError] = useState(null);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      
      if (result.canceled === false && result.assets && result.assets[0]) {
        setFile(result.assets[0]);
        setAnalysis(null);
        setShowTemplates(false);
        setError(null);
      }
    } catch (err) {
      console.error('Error al seleccionar archivo:', err);
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  const handleOptimize = async () => {
    if (!file) {
      Alert.alert('Aviso', 'Por favor, sube tu CV en formato PDF');
      return;
    }

    setIsPending(true);
    setError(null);
    setAnalysis(null);
    setShowTemplates(false);

    try {
      // Leer el archivo como base64
      const fileUri = file.uri;
      const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Aquí iría la llamada real a la API
      // Por ahora simulamos la respuesta
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular respuesta de IA
      const mockAnalysis = {
        score: 78,
        feedback_general: 'Tu CV tiene una buena base, pero puede mejorar en keywords específicas y formato ATS. Los reclutadores buscan perfiles más cuantificables.',
        mejoras: [
          { seccion: 'Experiencia Profesional', sugerencia: 'Añade logros cuantificables (ej: "Aumenté ventas en 30%")' },
          { seccion: 'Habilidades', sugerencia: 'Incluye keywords como React, Python, SQL según tu industria' },
          { seccion: 'Formato', sugerencia: 'Usa un formato más limpio y estructurado para ATS' },
          { seccion: 'Resumen', sugerencia: 'Personaliza el resumen para cada puesto al que apliques' },
        ],
        cv_optimizado: `[Tu Nombre]\n[Tu Título Profesional]\n\nRESUMEN PROFESIONAL\nProfesional con experiencia demostrada en el sector, especializado en [tu área]. Conocimientos sólidos en [tecnologías clave] y capacidad para trabajar en equipo.\n\nEXPERIENCIA LABORAL\n• Empresa X (2022-Actualidad): Logré [logro cuantificable]\n• Empresa Y (2020-2022): Implementé [mejora específica]\n\nEDUCACIÓN\n• [Tu título] - [Universidad]\n\nHABILIDADES TÉCNICAS\n• [Keyword 1] | [Keyword 2] | [Keyword 3]`,
      };

      setAnalysis(mockAnalysis);
      setOptimizedText(mockAnalysis.cv_optimizado);
      
    } catch (err) {
      console.error('Error al optimizar:', err);
      setError(err.message || 'Error al procesar el CV');
      Alert.alert('Error', 'No se pudo analizar el CV. Intenta de nuevo.');
    } finally {
      setIsPending(false);
    }
  };

  const handleGenerateFromProfile = async () => {
    setIsPending(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis = {
        score: 85,
        feedback_general: 'Basado en tu perfil, tienes un buen potencial. Tu CV generado está optimizado para los roles que buscas.',
        mejoras: [
          { seccion: 'Destaca logros', sugerencia: 'Añade más métricas cuantificables' },
          { seccion: 'Personalización', sugerencia: 'Adapta el CV para cada oferta específica' },
        ],
        cv_optimizado: `[CV Generado desde tu perfil]\n\n[Tu información se ha cargado automáticamente]\n\nEXPERIENCIA\n• [Tus experiencias del perfil]\n\nHABILIDADES\n• [Tus habilidades del perfil]`,
      };
      
      setAnalysis(mockAnalysis);
      setOptimizedText(mockAnalysis.cv_optimizado);
      
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', 'No se pudo generar el CV desde tu perfil');
    } finally {
      setIsPending(false);
    }
  };

  const handleGenerateCV = () => {
    setShowTemplates(true);
  };

  const handleSaveToProfile = () => {
    Alert.alert('Éxito', '¡Tu CV Optimizado ha sido guardado en tu perfil!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Optimizar CV</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cabecera con gradiente */}
        <View style={styles.gradientHeader}>
          <Text style={styles.gradientIcon}>🤖</Text>
          <Text style={styles.gradientTitle}>Coach Evolutivo</Text>
          <Text style={styles.gradientSubtitle}>
            Sube tu CV en PDF y la IA lo optimizará para filtros ATS
          </Text>
        </View>

        {/* Zona de subida de archivo */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionLabel}>📄 Sube tu Currículum (.pdf)</Text>
          
          <TouchableOpacity
            style={[styles.uploadArea, file && styles.uploadAreaActive]}
            onPress={handlePickDocument}
            activeOpacity={0.7}
          >
            {file ? (
              <>
                <Text style={styles.uploadIcon}>✅</Text>
                <Text style={styles.fileName} numberOfLines={2}>
                  {file.name}
                </Text>
                <Text style={styles.fileSize}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </Text>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setAnalysis(null);
                  }}
                  style={styles.changeFileButton}
                >
                  <Text style={styles.changeFileText}>Cambiar archivo</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.uploadIcon}>📁</Text>
                <Text style={styles.uploadTitle}>Toca para seleccionar tu CV</Text>
                <Text style={styles.uploadSubtitle}>PDF hasta 5MB</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, (!file || isPending) && styles.primaryButtonDisabled]}
            onPress={handleOptimize}
            disabled={!file || isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.buttonIcon}>⚡</Text>
                <Text style={styles.primaryButtonText}>Analizar con IA</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleGenerateFromProfile}
            disabled={isPending}
          >
            <Text style={styles.secondaryButtonText}>
              ✨ Generar desde mi Perfil
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.helperText}>
            ⚠️ Completa tu experiencia y habilidades en "Mi Perfil" primero
          </Text>
        </View>

        {/* Resultados del análisis */}
        {(isPending || analysis) && (
          <View style={styles.resultsSection}>
            {isPending && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5B34F2" />
                <Text style={styles.loadingTitle}>Claude está leyendo tu CV...</Text>
                <Text style={styles.loadingText}>Extrayendo experiencia y generando mejoras</Text>
              </View>
            )}

            {analysis && (
              <>
                {/* Score y Feedback */}
                <View style={styles.scoreCard}>
                  <View style={styles.scoreCircle}>
                    <Text style={styles.scoreValue}>{analysis.score}</Text>
                    <Text style={styles.scoreLabel}>Score ATS</Text>
                  </View>
                  <View style={styles.feedbackBox}>
                    <Text style={styles.feedbackTitle}>💬 Feedback General</Text>
                    <Text style={styles.feedbackText}>{analysis.feedback_general}</Text>
                  </View>
                </View>

                {/* Sugerencias */}
                <View style={styles.suggestionsCard}>
                  <Text style={styles.cardTitle}>
                    <Text style={styles.cardIcon}>📝</Text> Sugerencias de Mejora
                  </Text>
                  {analysis.mejoras.map((mejora, index) => (
                    <View key={index} style={styles.suggestionItem}>
                      <View style={styles.suggestionHeader}>
                        <Text style={styles.suggestionTag}>{mejora.seccion}</Text>
                      </View>
                      <Text style={styles.suggestionText}>{mejora.sugerencia}</Text>
                    </View>
                  ))}
                </View>

                {/* CV Optimizado editable */}
                <View style={styles.optimizedCard}>
                  <Text style={styles.cardTitle}>
                    <Text style={styles.cardIcon}>✨</Text> CV Optimizado
                  </Text>
                  <TextInput
                    style={styles.optimizedTextArea}
                    multiline
                    value={optimizedText}
                    onChangeText={setOptimizedText}
                    textAlignVertical="top"
                  />
                  <Text style={styles.editableHint}>✏️ Toca para editar</Text>
                </View>

                {/* Botón Generar CV */}
                <TouchableOpacity style={styles.generateButton} onPress={handleGenerateCV}>
                  <Text style={styles.generateButtonIcon}>🎨</Text>
                  <Text style={styles.generateButtonText}>Generar Mi Nuevo CV</Text>
                </TouchableOpacity>

                {/* Botón Guardar */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveToProfile}>
                  <Text style={styles.saveButtonText}>Guardar en mi Perfil</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Plantillas (simplificado) */}
        {showTemplates && (
          <View style={styles.templatesSection}>
            <Text style={styles.templatesTitle}>🎨 Elige tu Plantilla</Text>
            <Text style={styles.templatesSubtitle}>Próximamente más diseños</Text>
            <View style={styles.templatePreview}>
              <Text style={styles.templatePlaceholder}>📄 Plantilla Moderna</Text>
              <Text style={styles.templatePlaceholder}>📄 Plantilla Clásica</Text>
              <Text style={styles.templatePlaceholder}>📄 Plantilla Ejecutiva</Text>
            </View>
          </View>
        )}
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
    padding: 16,
    paddingBottom: 40,
  },
  gradientHeader: {
    backgroundColor: '#5B34F2',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  gradientIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  gradientTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  gradientSubtitle: {
    fontSize: 13,
    color: '#E0E7FF',
    textAlign: 'center',
    lineHeight: 18,
  },
  uploadSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  uploadAreaActive: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  changeFileButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeFileText: {
    fontSize: 12,
    color: '#5B34F2',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#5B34F2',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  primaryButtonDisabled: {
    backgroundColor: '#C7D2FE',
  },
  buttonIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#5B34F2',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#5B34F2',
  },
  helperText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  resultsSection: {
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B34F2',
    marginTop: 16,
  },
  loadingText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5B34F2',
  },
  scoreLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  feedbackBox: {
    flex: 1,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  feedbackText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  suggestionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 18,
  },
  suggestionItem: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionHeader: {
    marginBottom: 6,
  },
  suggestionTag: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B34F2',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  suggestionText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  optimizedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  optimizedTextArea: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    color: '#10B981',
    fontFamily: 'monospace',
    fontSize: 12,
    minHeight: 200,
    marginBottom: 8,
  },
  editableHint: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  generateButton: {
    backgroundColor: '#5B34F2',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  generateButtonIcon: {
    fontSize: 20,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
  templatesSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  templatesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  templatesSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  templatePreview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  templatePlaceholder: {
    flex: 1,
    textAlign: 'center',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    color: '#6B7280',
  },
});