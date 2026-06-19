import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import studentService from '../../services/student';
import { useMascota } from '../../components/mascota/MascotaProvider';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { isOffline, toggleDemoOfflineMode } = useMascota();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estado para datos del usuario
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    linkedin: "",
    github: "",
    university: "",
    career: "",
    summary: "",
  });

  // Cargar perfil al iniciar
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const profileResult = await studentService.getProfile();

      if (profileResult.success) {
        const responseData = profileResult.data?.data || profileResult.data || {};
        const user = responseData.user || {};

        // Mapear datos del usuario
        setUserData({
          fullName: user.name || user.full_name || user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          location: user.location || `${user.city || ""} ${user.country || ""}`.trim(),
          title: user.title || user.job_title || user.headline || "",
          linkedin: user.linkedin_url || user.linkedin || "",
          github: user.github_url || user.github || "",
          university: user.university || "",
          career: user.career || "",
          summary: user.summary || user.bio || "",
        });
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
        Alert.alert("Info", "Datos actualizados correctamente");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "No se pudo guardar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sí, Salir", style: "destructive", onPress: async () => {
          try {
            await AsyncStorage.multiRemove([
              '@user', 
              '@auth_token', 
              '@is_demo_offline',
              '@mascota_selected',
              '@mascota_hasSelected',
              '@mascota_daily',
              '@cached_jobs',
              '@cached_applications',
              '@offline_queue_applications'
            ]);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch (e) {
            console.error("Error al cerrar sesión", e);
          }
      }}
    ]);
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
            <Text style={styles.headerSubtitle}>Información personal</Text>
          </View>
          <TouchableOpacity onPress={loadUserProfile} style={styles.reloadButton}>
            <Text style={styles.reloadButtonText}>⟳</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.profileContainer}>
          {/* Avatar */}
          <View style={styles.avatarCard}>
            <Image 
              source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName || 'Usuario')}&background=5B34F2&color=fff&size=100&bold=true` }} 
              style={styles.avatar} 
            />
            <View style={styles.avatarInfo}>
              <Text style={styles.userName}>{userData.fullName || "Usuario"}</Text>
              <Text style={styles.userTitle}>{userData.title || userData.career || "Sin título"}</Text>
            </View>
          </View>

          {/* Formulario de datos personales */}
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

            <View style={[styles.inputGroup, styles.switchContainer]}>
              <View>
                <Text style={styles.label}>Simular Modo Offline</Text>
                <Text style={styles.helperText}>Activa esto para probar la app sin conexión a internet.</Text>
              </View>
              <Switch 
                value={isOffline} 
                onValueChange={toggleDemoOfflineMode} 
                trackColor={{ false: "#D1D5DB", true: "#818CF8" }}
                thumbColor={isOffline ? "#5B34F2" : "#f4f3f4"}
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveUserData} disabled={saving}>
              <Text style={styles.saveButtonText}>{saving ? "Guardando..." : "Guardar cambios"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  profileContainer: {
    padding: 16,
  },
  avatarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  logoutButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  helperText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    maxWidth: 220,
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
});