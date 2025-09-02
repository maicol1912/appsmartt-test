import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/ui/Loading';
import { ROUTES } from '@/utils/constants';

interface ProtectedRouteProps {
    children: ReactNode;
    redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    redirectTo = ROUTES.LOGIN
}) => {
    const { isAuthenticated, isLoading, user, validateToken } = useAuth();
    const location = useLocation();
    const [validationAttempted, setValidationAttempted] = useState(false);

    const validateAuthToken = useCallback(async () => {
        if (validationAttempted) return;

        try {
            console.log('Validando token de autenticación...');
            await validateToken();
        } catch (error) {
            console.error('Error validando token:', error);
        } finally {
            setValidationAttempted(true);
        }
    }, [validateToken, validationAttempted]);

    useEffect(() => {
        if (user && !isAuthenticated && !validationAttempted && !isLoading) {
            validateAuthToken();
        }
    }, [user, isAuthenticated, isLoading, validateAuthToken, validationAttempted]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading size="lg" text="Verificando sesión..." />
            </div>
        );
    }

    if (user && !isAuthenticated && validationAttempted) {
        console.log('Token inválido, redirigiendo a login');
        return (
            <Navigate
                to={redirectTo}
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    if (!user && !isLoading) {
        return (
            <Navigate
                to={redirectTo}
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loading size="lg" text="Comprobando autenticación..." />
        </div>
    );
};

interface PublicRouteProps {
    children: ReactNode;
    redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
    children,
    redirectTo = ROUTES.DASHBOARD
}) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading size="lg" text="Cargando..." />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};

interface RoleBasedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
    fallbackComponent?: ReactNode;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
    children,
    allowedRoles = [],
    fallbackComponent = (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Acceso Denegado
                </h2>
                <p className="text-gray-600">
                    No tienes permisos para acceder a esta sección.
                </p>
            </div>
        </div>
    ),
}) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading size="lg" text="Verificando permisos..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    if (allowedRoles.length === 0) {
        return <>{children}</>;
    }

    const userRoles = (user as any)?.roles || [];
    const hasPermission = allowedRoles.some(role => userRoles.includes(role));

    if (!hasPermission) {
        return <>{fallbackComponent}</>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;