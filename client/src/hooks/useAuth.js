import { useState } from 'react';
import useAuthStore from '../store/authStore';
import * as authApi from '../api/auth.api';

// Helper to decode JWT payload safely
const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return {};
    }
};

const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const setAuth = useAuthStore((state) => state.setAuth);
    const logoutStore = useAuthStore((state) => state.logout);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            // authApi.login returns the response body: { status: "success", data: { accessToken, user } }
            const response = await authApi.login(email, password);
            // So responseBody.data is { accessToken, user }
            const { accessToken, user: rawUser } = response.data;

            let user = rawUser || {};
            // Ensure we have a valid user object with username
            if (!user.username) {
                const payload = decodeToken(accessToken);
                user = {
                    ...user,
                    id: user.id || payload.userId || payload.sub,
                    username: user.username || payload.username,
                    email: user.email || email
                };
            }

            setAuth(user, accessToken);
            return response;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (username, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.register(username, email, password);
            // Same structure: { status: "success", data: { accessToken, user } }

            const { accessToken, user: rawUser } = response.data;

            let user = rawUser || {};
            if (!user.username) {
                const payload = decodeToken(accessToken);
                user = {
                    ...user,
                    id: user.id || payload.userId || payload.sub,
                    username: user.username || payload.username || username,
                    email: user.email || email
                };
            }

            setAuth(user, accessToken);
            return response;
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (err) {
            console.error('Logout error', err);
        } finally {
            logoutStore();
        }
    };

    return {
        login,
        register,
        logout,
        loading,
        error
    };
};

export default useAuth;
