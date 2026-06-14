  import axios from 'axios';
  import AsyncStorage from '@react-native-async-storage/async-storage';

  // EXPO_PUBLIC_API_URL es cargado automáticamente por Expo
  // El valor para emulador Android es http://10.0.2.2:8000/api
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000/api';

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Bypass-Tunnel-Reminder': 'true',
    },
  });

  // Interceptor para agregar el token (en este caso el email simulando la auth) a cada petición
  api.interceptors.request.use(
    async (config) => {
      try {
        const userStr = await AsyncStorage.getItem('@user');
        if (userStr) {
          const user = JSON.parse(userStr);
          // Enviamos el email como "token" para que el backend reconozca al usuario en modo demo
          // (En un entorno real aquí iría el token JWT en el Authorization header)
          config.headers['Authorization'] = `Bearer ${user.email}`;
        }
      } catch (error) {
        console.error('Error al obtener token de AsyncStorage:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  export default api;
