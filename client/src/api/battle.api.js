import api from './axios';

export const getBattle = async (battleId) => {
    const response = await api.get(`/battle/${battleId}`);
    return response.data;
};

export const sendAction = async (battleId, action, detail) => {
    const response = await api.post(`/battle/${battleId}/action`, { type: action, detail });
    return response.data;
};

export const submitLeaderboard = async () => {
    const response = await api.post('/leaderboard/submit');
    return response.data;
};
