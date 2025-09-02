import apiClient from './api';
import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    User
} from '@/types/auth';
import { API_ENDPOINTS } from '@/utils/constants';

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<{ data: AuthResponse }>(
                API_ENDPOINTS.AUTH.LOGIN,
                credentials
            );

            const authResponse = response.data;

            if (authResponse.token) {
                console.log('TOKEN', authResponse.token)
                this.setToken(authResponse.token);
                this.setStoredUser(authResponse.user);
            }

            return authResponse;
        } catch (error) {
            throw error;
        }
    },

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        try {
            const { data } = await apiClient.post<{ data: AuthResponse }>(
                API_ENDPOINTS.AUTH.REGISTER,
                userData
            );
            return data;
        } catch (error) {
            throw error;
        }
    },

    async validateToken(): Promise<{ user: User; valid: boolean }> {
        try {
            const response = await apiClient.get<any>(
                API_ENDPOINTS.AUTH.VALIDATE
            );

            if (response.data && response.data.user) {
                return {
                    user: response.data.user,
                    valid: true
                };
            } else {
                throw new Error('Estructura de respuesta inválida');
            }
        } catch (error) {
            console.error('Error validating token:', error);
            throw error;
        }
    },

    async getCurrentUser(): Promise<User> {
        try {
            const { data } = await apiClient.get<{ data: { user: User } }>(
                API_ENDPOINTS.AUTH.VALIDATE
            );
            return data.user;
        } catch (error) {
            throw error;
        }
    },

    logout(): void {
        apiClient.setAuthToken(null);
    },

    hasValidToken(): boolean {
        const token = localStorage.getItem('appsmartt_token');
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime;
        } catch {
            return false;
        }
    },

    getToken(): string | null {
        return localStorage.getItem('appsmartt_token');
    },

    setToken(token: string): void {
        console.log('appsmartt_token', token)
        localStorage.setItem('appsmartt_token', token);
        apiClient.setAuthToken(token);
    },

    getStoredUser(): User | null {
        const userStr = localStorage.getItem('appsmartt_user');
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    setStoredUser(user: User): void {
        localStorage.setItem('appsmartt_user', JSON.stringify(user));
    },

    clearAuthData(): void {
        console.log('ENTRE EN CLEAR DATA')
        localStorage.removeItem('appsmartt_token');
        localStorage.removeItem('appsmartt_user');
        apiClient.setAuthToken(null);
    }
};