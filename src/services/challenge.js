import api from './api';

const challengeService = {
  getChallengesBySkill: async (skillId) => {
    try {
      const response = await api.get(
        `/challenge/skill/${skillId}`
      );

      return {
        success: true,
        data: response.data.challenges,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          error.message,
      };
    }
  },
};

export default challengeService;