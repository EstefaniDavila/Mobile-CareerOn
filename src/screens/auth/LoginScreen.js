import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { jwtDecode } from 'jwt-decode';
import api from '../../services/api';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
};

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: '27589cb4-be6b-4759-9106-e1d28c934a9e',
      scopes: ['openid', 'profile', 'email', 'User.Read'],
      responseType: 'id_token',
      usePKCE: false,
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'careeron'
      }),
      extraParams: {
        nonce: 'careeron_nonce_12345',
        prompt: 'select_account'
      }
    },
    discovery
  );

  useEffect(() => {
    console.log("AuthSession Response cambió:", response?.type);
    if (response?.type === 'success') {
      console.log("Microsoft devolvió éxito. Params:", response.params);
      const { access_token, id_token } = response.params;
      handleBackendLogin(id_token || access_token);
    } else if (response?.type === 'error') {
      console.log("Error de Microsoft:", response.error);
      Alert.alert('Error de Autenticación', response.error?.message || 'Error al iniciar sesión con Microsoft');
    }
  }, [response]);

  const handleBackendLogin = async (token) => {
    console.log("Iniciando handleBackendLogin con token de longitud:", token ? token.length : 'ninguno');
    setLoading(true);
    try {
      const decoded = jwtDecode(token);
      console.log("Token decodificado:", decoded);

      const email = decoded.email || decoded.preferred_username || decoded.upn;
      const name = decoded.name || email?.split('@')[0];

      if (!email) {
        console.log("No se encontró email en el token decodificado.");
        Alert.alert('Error', 'No se pudo obtener el correo de Microsoft.');
        setLoading(false);
        return;
      }

      console.log("Llamando al backend en /auth/login con email:", email);
      const apiResponse = await api.post('/auth/login', {
        email: email,
        name: name,
        microsoft_id: decoded.oid || decoded.sub || 'id_generico'
      });
      console.log("Respuesta del backend:", apiResponse.data);

      if (apiResponse.data.status === 'success' || apiResponse.data.status === 'warning') {
        const user = apiResponse.data.user;
        console.log("Guardando usuario en AsyncStorage y redirigiendo...");
        await AsyncStorage.setItem('@user', JSON.stringify(user));

        if (user.type === 'Pending') {
          navigation.replace('Onboarding');
        } else {
          navigation.replace('MainTabs');
        }
      } else {
        console.log("Backend devolvió error:", apiResponse.data.message);
        Alert.alert('Error', apiResponse.data.message || 'Ocurrió un error');
      }
    } catch (error) {
      console.error('Excepción atrapada en Login error:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://res.cloudinary.com/dpuu7ddmk/image/upload/f_auto,q_auto/v1/WhatsApp_Image_2026-05-15_at_07.33.47_f5iq9x" }}
        style={styles.logo}
      />
      <Text style={styles.title}>CarrerOn</Text>
      <Text style={styles.subtitle}>Tu Copiloto de Empleabilidad</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Inicia sesión con tu cuenta UTP o corporativa:</Text>

        <TouchableOpacity
          style={[styles.microsoftButton, !request ? styles.btnDisabled : {}]}
          onPress={() => promptAsync()}
          disabled={loading || !request}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <View style={styles.btnContent}>
              <Image
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png' }}
                style={styles.msLogo}
              />
              <Text style={styles.buttonText}>Continuar con Microsoft</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.mockNote}>* Inicio de sesión seguro vía OAuth 2.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1C6B72', alignItems: 'center', justifyContent: 'center', padding: 20 },
  logo: { width: 150, height: 150, resizeMode: 'contain', marginBottom: 20 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#ffffff', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#DCE5EC', marginBottom: 40 },
  formContainer: { width: '100%', backgroundColor: '#ffffff', padding: 24, borderRadius: 20, elevation: 5 },
  label: { fontSize: 14, color: '#374151', marginBottom: 20, textAlign: 'center' },
  microsoftButton: { backgroundColor: '#2F2F2F', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnDisabled: { opacity: 0.5 },
  btnContent: { flexDirection: 'row', alignItems: 'center' },
  msLogo: { width: 20, height: 20, marginRight: 10 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  mockNote: { textAlign: 'center', color: '#9ca3af', fontSize: 12, marginTop: 15 }
});
