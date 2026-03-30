import { create } from 'zustand';

const useAuthStore = create((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,

    setAuth: (user, accessToken) => set({
        user,
        accessToken,
        isAuthenticated: true
    }),

    setAccessToken: (accessToken) => set({
        accessToken,
        isAuthenticated: !!accessToken
    }),

    logout: () => set({
        user: null,
        accessToken: null,
        isAuthenticated: false
    }),
}));

export default useAuthStore;
