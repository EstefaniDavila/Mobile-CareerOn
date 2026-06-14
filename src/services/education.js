import api from './api';

const educationService = {
  getEducations: async () => {
    try {
      const response = await api.get('/education/');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  createEducation: async (educationData) => {
    try {
      const response = await api.post('/education/', educationData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  updateEducation: async (educationId, educationData) => {
    try {
      const response = await api.put(
        `/education/${educationId}`,
        educationData
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  deleteEducation: async (educationId) => {
    try {
      const response = await api.delete(`/education/${educationId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};

export default educationService;