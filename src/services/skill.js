import api from './api';

const skillService = {
  getSkills: async () => {
    try {
      const response = await api.get('/skill/');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  createSkill: async (skillData) => {
    try {
      const response = await api.post('/skill/', skillData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  updateSkill: async (skillId, skillData) => {
    try {
      const response = await api.put(`/skill/${skillId}`, skillData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  deleteSkill: async (skillId) => {
    try {
      const response = await api.delete(`/skill/${skillId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};

export default skillService;