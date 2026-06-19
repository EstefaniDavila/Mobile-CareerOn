import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 10.0.2.2 es la IP especial que usa el Emulador de Android para acceder al localhost de Windows
const API_URL = 'http://10.0.2.2:8000/api';

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