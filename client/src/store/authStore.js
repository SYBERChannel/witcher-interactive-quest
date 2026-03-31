import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
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
        }),
        {
            name: 'witcher-auth-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

export default useAuthStore;
