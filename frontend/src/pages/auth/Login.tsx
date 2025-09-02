import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { validateLoginForm } from '@/utils/validators';
import { ROUTES, APP_NAME } from '@/utils/constants';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { LoginFormData } from '@/types/auth';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading } = useAuth();

    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState<string>('');

    const from = (location.state as any)?.from || ROUTES.DASHBOARD;

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setErrors({});
        }
        if (submitError) {
            setSubmitError('');
        }
    }, [formData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');

        const validation = validateLoginForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        try {
            await login({
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });

            // Redirigir después del login exitoso
            navigate(from, { replace: true });
        } catch (error: any) {
            setSubmitError(error.message || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600">
                        <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Iniciar Sesión
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Accede a tu cuenta de {APP_NAME}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                    {submitError && (
                        <Alert variant="error" closable onClose={() => setSubmitError('')}>
                            {submitError}
                        </Alert>
                    )}

                    <div className="space-y-4">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            label="Correo Electrónico"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            error={errors.email}
                            fullWidth
                            leftIcon={
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            }
                        />

                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            label="Contraseña"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleInputChange}
                            error={errors.password}
                            fullWidth
                            showPasswordToggle
                            leftIcon={
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Recordarme
                            </label>
                        </div>

                        <div className="text-sm">
                            <a
                                href="#"
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                onClick={(e) => e.preventDefault()}
                            >
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        isLoading={isLoading}
                        loadingText="Iniciando sesión..."
                    >
                        Iniciar Sesión
                    </Button>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            ¿No tienes una cuenta?{' '}
                            <Link
                                to={ROUTES.REGISTER}
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </form>

                <div className="mt-8 text-center text-xs text-gray-500">
                    <p>
                        Al iniciar sesión, aceptas nuestros{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-500">
                            Términos de Servicio
                        </a>{' '}
                        y{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-500">
                            Política de Privacidad
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;