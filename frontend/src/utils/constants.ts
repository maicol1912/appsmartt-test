export const API_BASE_URL = 'http://localhost/api';
export const APP_NAME = 'Appsmartt';

export const STORAGE_KEYS = {
    TOKEN: 'appsmartt_token',
    USER: 'appsmartt_user',
} as const;

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    OPERATIONS: '/operations',
    PROFILE: '/profile',
} as const;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        VALIDATE: '/auth/validate',
    },
    OPERATIONS: {
        CREATE: '/operations',
        GET_ALL: '/operations',
        GET_BY_ID: (id: number) => `/operations/${id}`,
    },
} as const;

export const CURRENCIES = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'COP', label: 'Colombian Peso (COP)' },
    { value: 'JPY', label: 'Japanese Yen (JPY)' },
] as const;

export const OPERATION_TYPES = [
    { value: 'buy' as const, label: 'Compra' },
    { value: 'sell' as const, label: 'Venta' },
] as const;

export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Error de conexión. Por favor, intenta de nuevo.',
    INVALID_CREDENTIALS: 'Credenciales inválidas.',
    UNAUTHORIZED: 'No tienes autorización para realizar esta acción.',
    SERVER_ERROR: 'Error interno del servidor. Por favor, intenta más tarde.',
    VALIDATION_ERROR: 'Por favor, verifica los datos ingresados.',
    TOKEN_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
} as const;

export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: '¡Bienvenido de vuelta!',
    REGISTER_SUCCESS: '¡Cuenta creada exitosamente!',
    OPERATION_CREATED: 'Operación registrada correctamente.',
    LOGOUT_SUCCESS: 'Sesión cerrada correctamente.',
} as const;