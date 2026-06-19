// services/student.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const studentService = {
  // Obtener perfil del estudiante
  getProfile: async () => {
    try {
      const response = await api.get('/student/profile');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error en getProfile:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Subir currículum
  uploadResume: async (formData) => {
    try {
      const response = await api.post('/student/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error en uploadResume:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Agregar experiencia
  addExperience: async (experienceData) => {
    try {
      const response = await api.post('/student/experience', experienceData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error en addExperience:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Agregar proyecto
  addProject: async (projectData) => {
    try {
      const response = await api.post('/student/project', projectData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error en addProject:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Eliminar proyecto
  deleteProject: async (projectId) => {
    try {
      const response = await api.delete(`/student/project/${projectId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error en deleteProject:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Agregar habilidad
  addSkill: async (skillData) => {
    try {
      const response = await api.post('/student/skill', skillData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error en addSkill:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Obtener todos los trabajos
  getJobs: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.location) params.append('location', filters.location);
      if (filters.modality) params.append('modality', filters.modality);
      if (filters.salary_min) params.append('salary_min', filters.salary_min);
      if (filters.salary_max) params.append('salary_max', filters.salary_max);

      const url = params.toString()
        ? `/student/jobs?${params.toString()}`
        : '/student/jobs';

      const response = await api.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error en getJobs:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: []
      };
    }
  },

  // Aplicar a un trabajo - CORREGIDO (sin body, solo job_id en URL)
  applyToJob: async (jobId) => {
    try {
      const isOffline = await AsyncStorage.getItem('@is_demo_offline') === 'true';
      if (isOffline) {
        console.log("🎒 Modo offline activo. Guardando en la mochila...");
        const queueStr = await AsyncStorage.getItem('@offline_queue_applications');
        const queue = queueStr ? JSON.parse(queueStr) : [];
        if (!queue.includes(jobId)) {
          queue.push(jobId);
          await AsyncStorage.setItem('@offline_queue_applications', JSON.stringify(queue));
        }
        return { success: true, data: { message: "Guardado en la mochila (Offline)" }, offlineQueued: true };
      }

      const response = await api.post(`/student/jobs/${jobId}/apply`);
      return { success: true, data: response.data };
    } catch (error) {
      // Si el error es de red, también guardarlo en la cola
      if (error.message === 'Network Error' || !error.response) {
        console.log("🎒 Error de red. Guardando en la mochila...");
        try {
          const queueStr = await AsyncStorage.getItem('@offline_queue_applications');
          const queue = queueStr ? JSON.parse(queueStr) : [];
          if (!queue.includes(jobId)) {
            queue.push(jobId);
            await AsyncStorage.setItem('@offline_queue_applications', JSON.stringify(queue));
          }
          return { success: true, data: { message: "Guardado en la mochila (Offline fallback)" }, offlineQueued: true };
        } catch (e) {
          console.error("Error guardando en caché:", e);
        }
      }

      let errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message;

      if (errorMessage.includes("Ya has postulado")) {
        errorMessage = "Ya has aplicado a esta oferta anteriormente.";
      } else if (errorMessage.includes("Usuario no encontrado")) {
        errorMessage = "Usuario no encontrado. Inicia sesión nuevamente.";
      }

      return {
        success: false,
        error: errorMessage,
        details: error.response?.data
      };
    }
  },

  // Obtener aplicaciones por estado
  getApplicationsByStatus: async (status) => {
    try {
      const response = await api.get(`/student/applications/${status}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error en getApplicationsByStatus:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: []
      };
    }
  },
};

export default studentService;