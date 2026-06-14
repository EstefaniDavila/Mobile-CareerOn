import api from './api';

const userChallengeService = {
  completeChallenge: async (challengeId) => {
    try {
      const response = await api.post(
        '/user-challenge/complete',
        {
          challenge_id: challengeId,
        }
      );

      return {
        success: true,
        data: response.data,
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

export default userChallengeService;