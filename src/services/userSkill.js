    import api from './api';

    const userSkillService = {
    getMySkills: async () => {
        try {
        const response = await api.get('/user-skill/');
        return { success: true, data: response.data };
        } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
        }
    },

    createUserSkill: async (skillData) => {
        try {
        const response = await api.post('/user-skill/', skillData);
        return { success: true, data: response.data };
        } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
        }
    },

    updateUserSkill: async (skillId, skillData) => {
        try {
        const response = await api.put(`/user-skill/${skillId}`, skillData);
        return { success: true, data: response.data };
        } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
        }
    },

    deleteUserSkill: async (skillId) => {
        try {
        const response = await api.delete(`/user-skill/${skillId}`);
        return { success: true, data: response.data };
        } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
        }
    },
    };

    export default userSkillService;