import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANTE:
// Reemplaza 192.168.1.12 por la IP REAL de tu laptop
const API_URL = 'http://172.27.0.1:8000/api';

console.log('API_URL =', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const userStr = await AsyncStorage.getItem('@user');

      if (userStr) {
        const user = JSON.parse(userStr);

        config.headers['Authorization'] = `Bearer ${user.email}`;
      }
    } catch (error) {
      console.error(
        'Error al obtener token de AsyncStorage:',
        error
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;