import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { validateRegisterForm } from '@/utils/validators';
import { ROUTES, APP_NAME } from '@/utils/constants';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { RegisterFormData } from '@/types/auth';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register, isLoading } = useAuth();

    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState<string>('');
    const [acceptTerms, setAcceptTerms] = useState(false);

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

        if (!acceptTerms) {
            setSubmitError('Debes aceptar los términos y condiciones');
            return;
        }

        const validation = validateRegisterForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        try {
            await register({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });

            navigate(ROUTES.DASHBOARD, { replace: true });
        } catch (error: any) {
            setSubmitError(error.message || 'Error al crear la cuenta');
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
                        Crear Cuenta
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Únete a {APP_NAME} y comienza a gestionar tus operaciones
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                    {submitError && (
                        <Alert variant="error" closable onClose={() => setSubmitError('')}>
                            {submitError}
                        </Alert>
                    )}

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                                required
                                label="Nombre"
                                placeholder="Tu nombre"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                error={errors.firstName}
                                fullWidth
                                leftIcon={
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                }
                            />

                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                autoComplete="family-name"
                                required
                                label="Apellido"
                                placeholder="Tu apellido"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                error={errors.lastName}
                                fullWidth
                                leftIcon={
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                }
                            />
                        </div>

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
                            autoComplete="new-password"
                            required
                            label="Contraseña"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleInputChange}
                            error={errors.password}
                            fullWidth
                            showPasswordToggle
                            helperText="Mínimo 6 caracteres"
                            leftIcon={
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            }
                        />

                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            label="Confirmar Contraseña"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            error={errors.confirmPassword}
                            fullWidth
                            showPasswordToggle
                            leftIcon={
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                    </div>

                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="accept-terms"
                                name="accept-terms"
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="accept-terms" className="text-gray-700">
                                Acepto los{' '}
                                <a
                                    href="#"
                                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    Términos de Servicio
                                </a>{' '}
                                y la{' '}
                                <a
                                    href="#"
                                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    Política de Privacidad
                                </a>
                            </label>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        isLoading={isLoading}
                        loadingText="Creando cuenta..."
                        disabled={!acceptTerms}
                    >
                        Crear Cuenta
                    </Button>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            ¿Ya tienes una cuenta?{' '}
                            <Link
                                to={ROUTES.LOGIN}
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </form>

                <div className="mt-8 text-center text-xs text-gray-500">
                    <p>
                        Al registrarte, aceptas recibir comunicaciones de {APP_NAME}.
                        Puedes darte de baja en cualquier momento.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;