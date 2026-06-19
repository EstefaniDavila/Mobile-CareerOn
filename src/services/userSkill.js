import api from "./api";

const userSkillService = {
  getMySkills: async () => {
    try {
      const response = await api.get(
        "/user-skill"
      );

      return {
        success: true,
        data:
          response.data.user_skills ||
          [],
      };
    } catch (error) {
      console.log(
        "USER SKILL ERROR:",
        error.response?.data
      );

      return {
        success: false,
        error:
          error.response?.data
            ?.detail ||
          error.message,
      };
    }
  },

  createUserSkill: async (
    skillData
  ) => {
    try {
       const response = await api.post(
      '/user-skill',
      skillData
    );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.log(
        "CREATE SKILL ERROR:",
        error.response?.data
      );

      return {
        success: false,
        error:
          error.response?.data
            ?.detail ||
          error.message,
      };
    }
  },

  updateUserSkill: async (
    skillId,
    level
  ) => {
    try {
      const response =
        await api.put(
          `/user-skill/${skillId}`,
          {
            skill_id: skillId,
            level,
          }
        );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.log(
        "UPDATE SKILL ERROR:",
        error.response?.data
      );

      return {
        success: false,
        error:
          error.response?.data
            ?.detail ||
          error.message,
      };
    }
  },
};

export default userSkillService;