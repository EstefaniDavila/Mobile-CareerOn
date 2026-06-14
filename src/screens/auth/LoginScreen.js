import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    
    try {
      const mockUser = {
        email: "estudiante0@utp.edu.pe",
        name: "Estudiante Demo",
        microsoft_id: "mock_student_123"
      };

      console.log("Enviando al backend:", mockUser);
      const response = await api.post("/auth/login", mockUser);
      console.log("Respuesta del Backend:", response.data);

      if (response.data.status === "success" || response.data.status === "warning") {
        // ===== CAMBIO IMPORTANTE AQUÍ =====
        // Guardar el token JWT real si existe
        if (response.data.token) {
          await AsyncStorage.setItem("@auth_token", response.data.token);
          console.log("✅ Token JWT guardado:", response.data.token);
        } else {
          // Si no hay token, al menos guardar algo (fallback)
          console.warn("⚠️ No se recibió token del backend, usando email como fallback");
          await AsyncStorage.setItem("@auth_token", response.data.user.email);
        }
        
        // Guardar datos del usuario
        await AsyncStorage.setItem("@user", JSON.stringify(response.data.user));

        // Solo manejamos estudiantes
        if (response.data.user.type === "Pending") {
          navigation.replace("Onboarding");
        } else {
          navigation.replace("MainTabs");
        }
      } else {
        Alert.alert("Error", response.data.message || "Ocurrió un error");
      }
    } catch (error) {
      console.error("Error conectando al backend:", error);
      Alert.alert(
        "Error de Conexión",
        "Error conectando al backend. ¿Está encendido el servidor?"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Resto del JSX igual...
    <SafeAreaView style={styles.container}>
      <View style={styles.brandContainer}>
        <View style={styles.logoWrapper}>
          <View style={styles.logoContainer}>
            <Image
              source={{
                uri: "https://res.cloudinary.com/dpuu7ddmk/image/upload/f_auto,q_auto/v1/WhatsApp_Image_2026-05-15_at_07.33.47_f5iq9x",
              }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
        
        <Text style={styles.title}>CarrerOn</Text>
        <Text style={styles.subtitle}>
          Tu copiloto de empleabilidad. Descubre tus brechas, optimiza tu CV y conecta con el mercado real.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.headerText}>
          <Text style={styles.loginTitle}>Iniciar Sesión</Text>
          <Text style={styles.loginSubtitle}>
            Ingresa con tu cuenta institucional de la universidad para continuar.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.loginButtonText}>Iniciando sesión...</Text>
              </View>
            ) : (
              <>
                <View style={styles.microsoftIcon}>
                  <View style={styles.iconRed} />
                  <View style={styles.iconGreen} />
                  <View style={styles.iconBlue} />
                  <View style={styles.iconYellow} />
                </View>
                <Text style={styles.loginButtonText}>
                  Demo: Ingresar como Estudiante
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Los estilos se mantienen igual
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCE5EC",
  },
  brandContainer: {
    flex: 1,
    backgroundColor: "#5B34F2",
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  logoWrapper: {
    marginBottom: 24,
  },
  logoContainer: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 20,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  logo: {
    width: 110,
    height: 110,
  },
  title: {
    fontSize: 44,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#E0D4FF",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 300,
  },
  formContainer: {
    flex: 1.2,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    marginTop: -25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  headerText: {
    marginBottom: 40,
    marginTop: 8,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C1C1C",
    textAlign: "center",
    marginBottom: 10,
  },
  loginSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    gap: 16,
  },
  loginButton: {
    backgroundColor: "#5B34F2",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
    elevation: 2,
    shadowColor: "#5B34F2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  loginButtonDisabled: {
    opacity: 0.7,
    elevation: 0,
    shadowOpacity: 0,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  microsoftIcon: {
    width: 24,
    height: 24,
    flexDirection: "row",
    flexWrap: "wrap",
    marginRight: 8,
  },
  iconRed: {
    width: 12,
    height: 12,
    backgroundColor: "#F25022",
  },
  iconGreen: {
    width: 12,
    height: 12,
    backgroundColor: "#7FBA00",
  },
  iconBlue: {
    width: 12,
    height: 12,
    backgroundColor: "#00A4EF",
  },
  iconYellow: {
    width: 12,
    height: 12,
    backgroundColor: "#FFB900",
  },
});