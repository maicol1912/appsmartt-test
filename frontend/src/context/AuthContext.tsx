import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthContextType, User, LoginRequest, RegisterRequest } from '@/types/auth';
import { authService } from '@/services/auth.service';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

type AuthAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
    | { type: 'LOGIN_FAILURE' }
    | { type: 'LOGOUT' }
    | { type: 'SET_USER'; payload: User }
    | { type: 'VALIDATE_TOKEN_SUCCESS'; payload: User }
    | { type: 'VALIDATE_TOKEN_FAILURE' };

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };

        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
            };

        case 'LOGIN_FAILURE':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            };

        case 'LOGOUT':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            };

        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
            };

        case 'VALIDATE_TOKEN_SUCCESS':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
            };

        case 'VALIDATE_TOKEN_FAILURE':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            };

        default:
            return state;
    }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            const storedToken = authService.getToken();
            const storedUser = authService.getStoredUser();

            if (storedToken && storedUser) {
                const validation = await authService.validateToken();

                if (validation.valid) {
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: {
                            user: validation.user,
                            token: storedToken,
                        },
                    });
                } else {
                    console.log('ENTRE EN 1')
                    authService.clearAuthData();
                    dispatch({ type: 'VALIDATE_TOKEN_FAILURE' });
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        } catch (error) {
            console.error('Error al inicializar autenticación:', error);
            console.log('ENTRE EN 2')
            authService.clearAuthData();
            dispatch({ type: 'VALIDATE_TOKEN_FAILURE' });
        }
    };

    const login = async (credentials: LoginRequest): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            const response = await authService.login(credentials);
            authService.setToken(response.token);
            authService.setStoredUser(response.user);
            console.log('LOGIN_SUCCESS')
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    user: response.user,
                    token: response.token,
                },
            });
        } catch (error) {
            dispatch({ type: 'LOGIN_FAILURE' });
            throw error;
        }
    };

    const register = async (data: RegisterRequest): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            const response = await authService.register(data);
            authService.setToken(response.token);
            authService.setStoredUser(response.user);

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    user: response.user,
                    token: response.token,
                },
            });
        } catch (error) {
            dispatch({ type: 'LOGIN_FAILURE' });
            throw error;
        }
    };

    const logout = (): void => {
        authService.clearAuthData();
        dispatch({ type: 'LOGOUT' });
    };

    const validateToken = async (): Promise<boolean> => {
        try {
            const validation = await authService.validateToken();
            if (validation.user) {
                dispatch({ type: 'VALIDATE_TOKEN_SUCCESS', payload: validation.user });
                return true;
            } else {
                authService.clearAuthData();
                dispatch({ type: 'VALIDATE_TOKEN_FAILURE' });
                return false;
            }
        } catch (error) {
            authService.clearAuthData();
            dispatch({ type: 'VALIDATE_TOKEN_FAILURE' });
            return false;
        }
    };

    const contextValue: AuthContextType = {
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        login,
        register,
        logout,
        validateToken,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};