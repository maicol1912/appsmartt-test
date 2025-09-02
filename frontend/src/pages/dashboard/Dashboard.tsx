import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { operationsService } from '@/services/operation.service';
import { Operation } from '@/types/operation';
import { ROUTES } from '@/utils/constants';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import Alert from '@/components/ui/Alert';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [recentOperations, setRecentOperations] = useState<Operation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [stats, setStats] = useState({
        totalOperations: 0,
        totalBuys: 0,
        totalSells: 0,
        totalAmount: 0,
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await operationsService.getOperations({
                page: 1,
                limit: 5
            });
            console.log('getOperations', response)

            const buys = response?.data?.filter(op => op.type === 'buy');
            const sells = response?.data?.filter(op => op.type === 'sell');

            setStats({
                totalOperations: response.pagination.total,
                totalBuys: buys.length,
                totalSells: sells.length,
                totalAmount: response.data.reduce((sum, op) => sum + Number(op.amount), 0),
            });

        } catch (err: any) {
            setError(err.message || 'Error al cargar el dashboard');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const getOperationTypeText = (type: string) => {
        return type === 'buy' ? 'Compra' : 'Venta';
    };

    const getOperationTypeColor = (type: string) => {
        return type === 'buy'
            ? 'text-green-600 bg-green-100'
            : 'text-red-600 bg-red-100';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loading size="lg" text="Cargando dashboard..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        ¡Bienvenido de vuelta, {user?.firstName}!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Aquí tienes un resumen de tu actividad financiera
                    </p>
                </div>

                {error && (
                    <Alert variant="error" className="mb-6" closable onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Total Operaciones</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalOperations}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Compras</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalBuys}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Ventas</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalSells}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Volumen Total</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${stats.totalAmount}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Operaciones Recientes
                        </h2>
                        <Link to={ROUTES.OPERATIONS}>
                            <Button variant="outline" size="sm">
                                Ver todas
                            </Button>
                        </Link>
                    </div>

                    {!recentOperations || recentOperations?.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                No hay operaciones
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Comienza registrando tu primera operación financiera.
                            </p>
                            <div className="mt-6">
                                <Link to={ROUTES.OPERATIONS}>
                                    <Button variant="primary">
                                        Registrar Operación
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Monto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Moneda
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentOperations.map((operation) => (
                                        <tr key={operation.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOperationTypeColor(operation.type)}`}>
                                                    {getOperationTypeText(operation.type)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(operation.amount, operation.currency)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {operation.currency}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(operation.createdAt).toLocaleDateString('es-CO')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Acciones Rápidas
                        </h3>
                        <div className="space-y-3">
                            <Link to={ROUTES.OPERATIONS} className="block">
                                <Button variant="primary" fullWidth>
                                    Registrar Nueva Operación
                                </Button>
                            </Link>
                            <Link to={ROUTES.OPERATIONS} className="block">
                                <Button variant="outline" fullWidth>
                                    Ver Historial Completo
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Información de Cuenta
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><span className="font-medium">Email:</span> {user?.email}</p>
                            <p><span className="font-medium">Nombre:</span> {user?.firstName} {user?.lastName}</p>
                            <p><span className="font-medium">Miembro desde:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-CO') : 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;