import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import api from "../../../services/api";

export default function OptimizarCV({ onBack }) {
  const [file, setFile] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [optimizedText, setOptimizedText] = useState("");
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [userData, setUserData] = useState(null);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets[0]) {
        setFile(result.assets[0]);
        setAnalysis(null);
        setShowTemplates(false);
        setError(null);
        setSelectedTemplate(null);
      }
    } catch (err) {
      console.error("Error al seleccionar archivo:", err);
      Alert.alert("Error", "No se pudo seleccionar el archivo");
    }
  };

  const handleOptimize = async () => {
    if (!file) {
      Alert.alert("Aviso", "Por favor, sube tu CV en formato PDF");
      return;
    }

    setIsPending(true);
    setError(null);
    setAnalysis(null);
    setShowTemplates(false);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: "application/pdf",
        name: file.name,
      });

      const response = await api.post("/ai/optimize-cv-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Respuesta de IA:", response.data);

      const analysisData = response.data.data || response.data;

      if (analysisData) {
        setAnalysis(analysisData);
        setOptimizedText(analysisData.cv_optimizado || "");
        // Extraer datos estructurados
        if (analysisData.datos_extraidos) {
          setUserData(analysisData.datos_extraidos);
        }
      } else {
        throw new Error("No se recibieron datos de análisis");
      }
    } catch (err) {
      console.error("Error al optimizar:", err);
      const errorMsg =
        err.response?.data?.detail || err.message || "Error al procesar el CV";
      setError(errorMsg);
      Alert.alert("Error", errorMsg);
    } finally {
      setIsPending(false);
    }
  };

  const handleGenerateFromProfile = async () => {
    setIsPending(true);
    setError(null);

    try {
      const response = await api.post("/ai/generate-cv-from-profile");

      console.log("Respuesta generación desde perfil:", response.data);

      const analysisData = response.data.data || response.data;

      if (analysisData) {
        setAnalysis(analysisData);
        setOptimizedText(analysisData.cv_optimizado || "");
        if (analysisData.datos_extraidos) {
          setUserData(analysisData.datos_extraidos);
        }
        setShowTemplates(true);
      } else {
        throw new Error("No se pudo generar el CV desde el perfil");
      }
    } catch (err) {
      console.error("Error al generar desde perfil:", err);
      const errorMsg =
        err.response?.data?.detail ||
        err.message ||
        "Error al generar CV desde el perfil";
      setError(errorMsg);
      Alert.alert("Error", errorMsg);
    } finally {
      setIsPending(false);
    }
  };

  const handleGenerateCV = () => {
    if (!analysis || !optimizedText) {
      Alert.alert("Error", "No hay un CV optimizado para generar");
      return;
    }
    setShowTemplates(true);
    setSelectedTemplate(null);
  };

  const generatePDFWithTemplate = async (templateType) => {
    setIsPending(true);
    setSelectedTemplate(templateType);

    try {
      // Parsear el texto optimizado para extraer secciones
      const parsedData = parseCVData(optimizedText, userData);
      
      let htmlContent = "";
      
      switch (templateType) {
        case "harvard":
          htmlContent = generateHarvardTemplate(parsedData);
          break;
        case "tech":
          htmlContent = generateTechTemplate(parsedData);
          break;
        case "executive":
          htmlContent = generateExecutiveTemplate(parsedData);
          break;
        default:
          htmlContent = generateHarvardTemplate(parsedData);
      }

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      const isSharingAvailable = await Sharing.isAvailableAsync();
      
      if (isSharingAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Guardar o compartir CV",
          UTI: "com.adobe.pdf",
        });
        
        Alert.alert(
          "✅ CV Generado",
          "Tu CV ha sido generado exitosamente con la plantilla seleccionada.",
          [{ text: "OK", style: "cancel" }]
        );
      }
      
    } catch (err) {
      console.error("Error al generar PDF:", err);
      Alert.alert("Error", "No se pudo generar el CV. Intenta de nuevo.");
    } finally {
      setIsPending(false);
    }
  };

  const parseCVData = (text, userData) => {
    // Extraer información del texto
    const lines = text.split('\n');
    let nombre = userData?.nombre || "Tu Nombre";
    let email = userData?.email || "";
    let telefono = userData?.telefono || "";
    
    // Intentar extraer nombre del texto
    const primeraLinea = lines[0].trim();
    if (primeraLinea && !primeraLinea.includes(':') && primeraLinea.length < 50) {
      nombre = primeraLinea;
    }
    
    // Extraer secciones
    const secciones = {
      perfil: "",
      experiencia: [],
      educacion: [],
      habilidades: [],
      proyectos: []
    };
    
    let seccionActual = "";
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      if (trimmedLine.includes("RESUMEN") || trimmedLine.includes("PERFIL") || trimmedLine.includes("PROFESIONAL")) {
        seccionActual = "perfil";
        continue;
      } else if (trimmedLine.includes("EXPERIENCIA")) {
        seccionActual = "experiencia";
        continue;
      } else if (trimmedLine.includes("EDUCACIÓN") || trimmedLine.includes("FORMACIÓN")) {
        seccionActual = "educacion";
        continue;
      } else if (trimmedLine.includes("HABILIDADES") || trimmedLine.includes("COMPETENCIAS")) {
        seccionActual = "habilidades";
        continue;
      } else if (trimmedLine.includes("PROYECTOS")) {
        seccionActual = "proyectos";
        continue;
      }
      
      if (seccionActual && trimmedLine) {
        if (seccionActual === "perfil") {
          secciones.perfil += trimmedLine + " ";
        } else {
          secciones[seccionActual].push(trimmedLine);
        }
      }
    }
    
    return {
      nombre,
      email,
      telefono,
      ...secciones,
      habilidades: secciones.habilidades.length > 0 ? secciones.habilidades : (userData?.habilidades || [])
    };
  };

  const generateHarvardTemplate = (data) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>CV - ${data.nombre}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.5;
            color: #1a1a1a;
            background: white;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 50px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #8b0000;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          h1 {
            font-size: 32px;
            color: #8b0000;
            letter-spacing: 2px;
            margin-bottom: 10px;
          }
          .contact {
            font-size: 12px;
            color: #555;
            margin-top: 10px;
          }
          h2 {
            font-size: 18px;
            color: #8b0000;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
            margin-top: 25px;
            margin-bottom: 15px;
            text-transform: uppercase;
          }
          .section {
            margin-bottom: 20px;
          }
          .job, .education-item {
            margin-bottom: 15px;
          }
          .job-title {
            font-weight: bold;
            font-size: 16px;
          }
          .company, .institution {
            font-style: italic;
            color: #555;
          }
          .date {
            float: right;
            color: #777;
            font-size: 12px;
          }
          .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
          .skill-tag {
            background: #f0f0f0;
            padding: 5px 12px;
            border-radius: 3px;
            font-size: 12px;
          }
          .profile-text {
            text-align: justify;
            font-size: 13px;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .container {
              padding: 40px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${data.nombre.toUpperCase()}</h1>
            <div class="contact">
              ${data.email ? data.email + " | " : ""}${data.telefono ? data.telefono : ""}
            </div>
          </div>
          
          ${data.perfil ? `
          <div class="section">
            <h2>Perfil Profesional</h2>
            <p class="profile-text">${data.perfil}</p>
          </div>
          ` : ''}
          
          ${data.experiencia.length > 0 ? `
          <div class="section">
            <h2>Experiencia Laboral</h2>
            ${data.experiencia.map(exp => `
              <div class="job">
                <div class="job-title">${exp}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          ${data.educacion.length > 0 ? `
          <div class="section">
            <h2>Educación</h2>
            ${data.educacion.map(edu => `
              <div class="education-item">
                <div>${edu}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          ${data.habilidades.length > 0 ? `
          <div class="section">
            <h2>Habilidades</h2>
            <div class="skills-list">
              ${data.habilidades.map(h => `<span class="skill-tag">${h}</span>`).join('')}
            </div>
          </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;
  };

  const generateTechTemplate = (data) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>CV - ${data.nombre}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            line-height: 1.6;
            background: #f5f5f5;
          }
          .container {
            display: flex;
            max-width: 1000px;
            margin: 30px auto;
            background: white;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          }
          .sidebar {
            width: 33%;
            background: #1a1a2e;
            color: white;
            padding: 30px;
          }
          .main {
            width: 67%;
            padding: 30px;
          }
          .name {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .title {
            font-size: 14px;
            color: #00d4ff;
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 2px solid #00d4ff;
            padding-bottom: 5px;
          }
          .contact-info {
            margin-top: 20px;
          }
          .contact-item {
            font-size: 12px;
            margin-bottom: 8px;
          }
          .skill-item {
            font-size: 12px;
            margin-bottom: 5px;
          }
          .main-section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1a1a2e;
            border-left: 4px solid #00d4ff;
            padding-left: 10px;
            margin-top: 25px;
            margin-bottom: 15px;
          }
          .job-title {
            font-weight: bold;
            font-size: 16px;
          }
          .profile-text {
            font-size: 13px;
            text-align: justify;
          }
          @media print {
            body {
              background: white;
            }
            .container {
              margin: 0;
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="sidebar">
            <div class="name">${data.nombre}</div>
            <div class="title">Profesional</div>
            
            <div class="contact-info">
              <div class="section-title">Contacto</div>
              ${data.email ? `<div class="contact-item">📧 ${data.email}</div>` : ''}
              ${data.telefono ? `<div class="contact-item">📱 ${data.telefono}</div>` : ''}
            </div>
            
            ${data.habilidades.length > 0 ? `
            <div class="contact-info">
              <div class="section-title">Habilidades</div>
              ${data.habilidades.map(h => `<div class="skill-item">• ${h}</div>`).join('')}
            </div>
            ` : ''}
          </div>
          
          <div class="main">
            ${data.perfil ? `
            <div>
              <div class="main-section-title">Perfil</div>
              <p class="profile-text">${data.perfil}</p>
            </div>
            ` : ''}
            
            ${data.experiencia.length > 0 ? `
            <div>
              <div class="main-section-title">Experiencia</div>
              ${data.experiencia.map(exp => `
                <div style="margin-bottom: 15px;">
                  <div class="job-title">${exp}</div>
                </div>
              `).join('')}
            </div>
            ` : ''}
            
            ${data.educacion.length > 0 ? `
            <div>
              <div class="main-section-title">Educación</div>
              ${data.educacion.map(edu => `
                <div style="margin-bottom: 10px;">${edu}</div>
              `).join('')}
            </div>
            ` : ''}
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const generateExecutiveTemplate = (data) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>CV - ${data.nombre}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Calibri', 'Arial', sans-serif;
            line-height: 1.5;
            color: #333;
            background: white;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 50px;
          }
          .header {
            background: #2c3e50;
            color: white;
            padding: 30px;
            margin-bottom: 30px;
            text-align: center;
          }
          h1 {
            font-size: 36px;
            letter-spacing: 3px;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 14px;
            opacity: 0.9;
          }
          .contact-bar {
            background: #ecf0f1;
            padding: 10px;
            text-align: center;
            margin-bottom: 30px;
          }
          .contact-item {
            display: inline;
            margin: 0 15px;
            font-size: 12px;
            color: #2c3e50;
          }
          h2 {
            font-size: 18px;
            color: #2c3e50;
            margin-top: 25px;
            margin-bottom: 15px;
            text-transform: uppercase;
            font-weight: 600;
          }
          .profile-text {
            text-align: justify;
            font-size: 13px;
          }
          .job, .edu-item {
            margin-bottom: 20px;
          }
          .job-header {
            font-weight: bold;
            font-size: 15px;
          }
          .skills-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
          }
          .skill {
            background: #ecf0f1;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${data.nombre.toUpperCase()}</h1>
          <div class="subtitle">Curriculum Vitae</div>
        </div>
        
        <div class="contact-bar">
          ${data.email ? `<span class="contact-item">✉️ ${data.email}</span>` : ''}
          ${data.telefono ? `<span class="contact-item">📞 ${data.telefono}</span>` : ''}
        </div>
        
        <div class="container">
          ${data.perfil ? `
          <div>
            <h2>Resumen Ejecutivo</h2>
            <p class="profile-text">${data.perfil}</p>
          </div>
          ` : ''}
          
          ${data.experiencia.length > 0 ? `
          <div>
            <h2>Trayectoria Profesional</h2>
            ${data.experiencia.map(exp => `
              <div class="job">
                <div class="job-header">${exp}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          ${data.educacion.length > 0 ? `
          <div>
            <h2>Formación Académica</h2>
            ${data.educacion.map(edu => `
              <div class="edu-item">${edu}</div>
            `).join('')}
          </div>
          ` : ''}
          
          ${data.habilidades.length > 0 ? `
          <div>
            <h2>Competencias</h2>
            <div class="skills-grid">
              ${data.habilidades.map(h => `<span class="skill">${h}</span>`).join('')}
            </div>
          </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;
  };

  const handleSaveToProfile = async () => {
    try {
      const response = await api.post("/cv/save-optimized", {
        optimized_cv: optimizedText,
        analysis: analysis,
      });

      if (response.data.success) {
        Alert.alert(
          "Éxito",
          "¡Tu CV Optimizado ha sido guardado en tu perfil!",
        );
      } else {
        Alert.alert("Error", "No se pudo guardar el CV");
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      Alert.alert("Error", "No se pudo guardar el CV en el perfil");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#10B981";
    if (score >= 50) return "#F59E0B";
    return "#EF4444";
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

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gradientHeader}>
          <Text style={styles.gradientIcon}>🤖</Text>
          <Text style={styles.gradientTitle}>Coach Evolutivo</Text>
          <Text style={styles.gradientSubtitle}>
            Sube tu CV en PDF y la IA lo optimizará para filtros ATS
          </Text>
        </View>

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
                    setShowTemplates(false);
                    setSelectedTemplate(null);
                  }}
                  style={styles.changeFileButton}
                >
                  <Text style={styles.changeFileText}>Cambiar archivo</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.uploadIcon}>📁</Text>
                <Text style={styles.uploadTitle}>
                  Toca para seleccionar tu CV
                </Text>
                <Text style={styles.uploadSubtitle}>PDF hasta 5MB</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              (!file || isPending) && styles.primaryButtonDisabled,
            ]}
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

        {(isPending || analysis) && (
          <View style={styles.resultsSection}>
            {isPending && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5B34F2" />
                <Text style={styles.loadingTitle}>
                  Procesando tu CV...
                </Text>
                <Text style={styles.loadingText}>
                  Generando optimizaciones...
                </Text>
              </View>
            )}

            {analysis && (
              <>
                <View style={styles.scoreCard}>
                  <View style={styles.scoreCircle}>
                    <Text
                      style={[
                        styles.scoreValue,
                        { color: getScoreColor(analysis.score) },
                      ]}
                    >
                      {analysis.score}
                    </Text>
                    <Text style={styles.scoreLabel}>Score ATS</Text>
                  </View>
                  <View style={styles.feedbackBox}>
                    <Text style={styles.feedbackTitle}>
                      💬 Feedback General
                    </Text>
                    <Text style={styles.feedbackText}>
                      {analysis.feedback_general}
                    </Text>
                  </View>
                </View>

                {analysis.mejoras && analysis.mejoras.length > 0 && (
                  <View style={styles.suggestionsCard}>
                    <Text style={styles.cardTitle}>
                      <Text style={styles.cardIcon}>📝</Text> Sugerencias de
                      Mejora
                    </Text>
                    {analysis.mejoras.map((mejora, index) => (
                      <View key={index} style={styles.suggestionItem}>
                        <View style={styles.suggestionHeader}>
                          <Text style={styles.suggestionTag}>
                            {mejora.seccion}
                          </Text>
                        </View>
                        <Text style={styles.suggestionText}>
                          {mejora.sugerencia}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

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

                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={handleGenerateCV}
                >
                  <Text style={styles.generateButtonIcon}>🎨</Text>
                  <Text style={styles.generateButtonText}>
                    Generar Mi Nuevo CV
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveToProfile}
                >
                  <Text style={styles.saveButtonText}>
                    Guardar en mi Perfil
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {showTemplates && analysis && (
          <View style={styles.templatesSection}>
            <Text style={styles.templatesTitle}>🎨 Elige tu Plantilla</Text>
            <Text style={styles.templatesSubtitle}>
              Selecciona el diseño que más te guste. Tu información ya está cargada.
            </Text>
            
            <View style={styles.templatePreview}>
              <TouchableOpacity 
                style={[styles.templateCard, selectedTemplate === 'harvard' && styles.templateCardSelected]}
                onPress={() => generatePDFWithTemplate('harvard')}
                disabled={isPending}
              >
                <Text style={styles.templateEmoji}>🎓</Text>
                <Text style={styles.templateName}>Harvard Classic</Text>
                <Text style={styles.templateDescription}>Una columna · Serif</Text>
                <Text style={styles.templateTag}>Tradicional</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.templateCard, selectedTemplate === 'tech' && styles.templateCardSelected]}
                onPress={() => generatePDFWithTemplate('tech')}
                disabled={isPending}
              >
                <Text style={styles.templateEmoji}>⚡</Text>
                <Text style={styles.templateName}>Tech Modern</Text>
                <Text style={styles.templateDescription}>Dos columnas · Sidebar</Text>
                <Text style={styles.templateTag}>Moderno</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.templateCard, selectedTemplate === 'executive' && styles.templateCardSelected]}
                onPress={() => generatePDFWithTemplate('executive')}
                disabled={isPending}
              >
                <Text style={styles.templateEmoji}>💼</Text>
                <Text style={styles.templateName}>Executive Clean</Text>
                <Text style={styles.templateDescription}>Una columna · Header</Text>
                <Text style={styles.templateTag}>Ejecutivo</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.comingSoonText}>
              Tus datos se extraen automáticamente del análisis
            </Text>
          </View>
        )}
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  gradientHeader: {
    backgroundColor: "#5B34F2",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    alignItems: "center",
  },
  gradientIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  gradientTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  gradientSubtitle: {
    fontSize: 13,
    color: "#E0E7FF",
    textAlign: "center",
    lineHeight: 18,
  },
  uploadSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#F9FAFB",
  },
  uploadAreaActive: {
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 12,
  },
  changeFileButton: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeFileText: {
    fontSize: 12,
    color: "#5B34F2",
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: "#5B34F2",
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  primaryButtonDisabled: {
    backgroundColor: "#C7D2FE",
  },
  buttonIcon: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#5B34F2",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#5B34F2",
  },
  helperText: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
  },
  resultsSection: {
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5B34F2",
    marginTop: 16,
  },
  loadingText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  scoreCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: "bold",
  },
  scoreLabel: {
    fontSize: 11,
    color: "#6B7280",
  },
  feedbackBox: {
    flex: 1,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 6,
  },
  feedbackText: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
  },
  suggestionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 18,
  },
  suggestionItem: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  suggestionHeader: {
    marginBottom: 6,
  },
  suggestionTag: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5B34F2",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  suggestionText: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
  },
  optimizedCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  optimizedTextArea: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 16,
    color: "#10B981",
    fontFamily: "monospace",
    fontSize: 12,
    minHeight: 200,
    marginBottom: 8,
  },
  editableHint: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "right",
  },
  generateButton: {
    backgroundColor: "#5B34F2",
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  generateButtonIcon: {
    fontSize: 20,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  saveButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
  },
  templatesSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  templatesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 4,
  },
  templatesSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },
  templatePreview: {
    flexDirection: "column",
    gap: 12,
    marginBottom: 16,
  },
  templateCard: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  templateCardSelected: {
    borderColor: "#5B34F2",
    backgroundColor: "#EEF2FF",
  },
  templateEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  templateName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 4,
  },
  templateTag: {
    fontSize: 10,
    color: "#5B34F2",
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  comingSoonText: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 12,
  },
});