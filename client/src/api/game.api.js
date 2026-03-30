import api from './axios';

export const getGameState = async () => {
    const response = await api.get('/game/state');
    return response.data;
};

export const newGame = async () => {
    const response = await api.post('/game/new');
    return response.data;
};

export const getScene = async () => {
    const response = await api.get('/game/scene');
    return response.data;
};

export const makeChoice = async (choiceId) => {
    const response = await api.post('/game/choice', { choiceId });
    return response.data;
};

export const getInventory = async () => {
    const response = await api.get('/game/inventory');
    return response.data;
};

export const useItem = async (itemId) => {
    const response = await api.post('/game/use-item', { itemId });
    return response.data;
};

export const respondToEvent = async (responseData) => {
    const response = await api.post('/game/random-event', responseData);
    return response.data;
};
