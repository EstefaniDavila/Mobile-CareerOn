import api from "./api";

const skillService = {
  getSkills: async () => {
    try {
      const response = await api.get(
        "/skill"
      );

      return {
        success: true,
        data:
          response.data.skills || [],
      };
    } catch (error) {
      console.log(
        "SKILL ERROR:",
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

export default skillService;