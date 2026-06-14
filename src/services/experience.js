import api from './api';

const experienceService = {
  getExperiences: async () => {
    try {
      const response = await api.get('/experience/');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  createExperience: async (experienceData) => {
    try {
      const response = await api.post('/experience/', experienceData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  updateExperience: async (experienceId, experienceData) => {
    try {
      const response = await api.put(
        `/experience/${experienceId}`,
        experienceData
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  deleteExperience: async (experienceId) => {
    try {
      const response = await api.delete(`/experience/${experienceId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};

export default experienceService;