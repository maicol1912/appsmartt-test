export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message: string;
    error?: string;
}

export interface ApiError {
    message: string;
    status: number;
    errors?: ValidationError[];
}

export interface ValidationError {
    field: string;
    message: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiRequestConfig {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    data?: any;
    params?: Record<string, any>;
}

export interface ApiClient {
    get<T>(url: string, config?: ApiRequestConfig): Promise<T>;
    post<T>(url: string, data?: any, config?: ApiRequestConfig): Promise<T>;
    put<T>(url: string, data?: any, config?: ApiRequestConfig): Promise<T>;
    delete<T>(url: string, config?: ApiRequestConfig): Promise<T>;
}