import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ApiError } from '@/types/api';
import { API_BASE_URL, STORAGE_KEYS, ERROR_MESSAGES } from '@/utils/constants';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                const apiError = this.handleError(error);

                if (apiError.status === 401) {
                    localStorage.removeItem(STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER);
                    window.location.href = '/login';
                }

                return Promise.reject(apiError);
            }
        );
    }

    private handleError(error: AxiosError): ApiError {
        if (!error.response) {
            return {
                message: ERROR_MESSAGES.NETWORK_ERROR,
                status: 0,
            };
        }

        const { status, data } = error.response;
        const errorData = data as any;

        switch (status) {
            case 400:
                return {
                    message: errorData.message || ERROR_MESSAGES.VALIDATION_ERROR,
                    status,
                    errors: errorData.errors,
                };
            case 401:
                return {
                    message: ERROR_MESSAGES.UNAUTHORIZED,
                    status,
                };
            case 403:
                return {
                    message: ERROR_MESSAGES.UNAUTHORIZED,
                    status,
                };
            case 404:
                return {
                    message: errorData.message || 'Recurso no encontrado',
                    status,
                };
            case 500:
                return {
                    message: ERROR_MESSAGES.SERVER_ERROR,
                    status,
                };
            default:
                return {
                    message: errorData.message || 'Error desconocido',
                    status,
                };
        }
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.put<T>(url, data, config);
        return response.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<T>(url, config);
        return response.data;
    }

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.patch<T>(url, data, config);
        return response.data;
    }

    setAuthToken(token: string | null): void {
        if (token) {
            this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete this.client.defaults.headers.common['Authorization'];
        }
    }

    getClient(): AxiosInstance {
        return this.client;
    }
}

const apiClient = new ApiClient();

export default apiClient;