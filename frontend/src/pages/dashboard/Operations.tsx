import React, { useState, useEffect } from "react";
import { operationsService } from "@services/operation.service";
import {
    Operation,
    OperationFormData,
    OperationsFilters,
} from "@/types/operation";
import { validateOperationForm } from "@utils/validators";
import { CURRENCIES, OPERATION_TYPES } from "@utils/constants";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import Loading from "@components/ui/Loading";
import Alert from "@components/ui/Alert";
import Layout from "@components/layout/Layout";

const Operations: React.FC = () => {
    const [operations, setOperations] = useState<Operation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [showForm, setShowForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });

    const [formData, setFormData] = useState<OperationFormData>({
        type: "buy",
        amount: "",
        currency: "USD",
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState<string>("");

    const [filters, setFilters] = useState<OperationsFilters>({
        page: 1,
        limit: 10,
    });

    useEffect(() => {
        loadOperations();
    }, [filters]);

    const loadOperations = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await operationsService.getOperations(filters);

            setOperations(response.data);
            setPagination({
                page: response.pagination.page,
                limit: response.pagination.limit,
                total: response.pagination.total,
                totalPages: response.pagination.totalPages,
            });
        } catch (err: any) {
            setError(err.message || "Error al cargar las operaciones");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError("");

        const validation = validateOperationForm(formData);
        if (!validation.isValid) {
            setFormErrors(validation.errors);
            return;
        }

        try {
            setFormLoading(true);

            await operationsService.createOperation({
                type: formData.type,
                amount: parseFloat(formData.amount),
                currency: formData.currency,
            });

            setFormData({
                type: "buy",
                amount: "",
                currency: "USD",
            });
            setShowForm(false);
            await loadOperations();
        } catch (err: any) {
            setSubmitError(err.message || "Error al crear la operación");
        } finally {
            setFormLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({
            ...prev,
            page: newPage,
        }));
    };

    const formatCurrency = (amount: number, currency: string) =>
        new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: currency,
        }).format(amount);

    const getOperationTypeText = (type: string) =>
        type === "buy" ? "Compra" : "Venta";

    const getOperationTypeColor = (type: string) =>
        type === "buy"
            ? "text-green-600 bg-green-100"
            : "text-red-600 bg-red-100";

    if (loading && operations.length === 0) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <Loading />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Operaciones</h1>
                        <p className="text-gray-600 mt-2">
                            Gestiona tus operaciones financieras
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
                            {showForm ? "Cancelar" : "Nueva Operación"}
                        </Button>
                    </div>
                </div>

                {error && (
                    <Alert variant="error" closable onClose={() => setSubmitError('')}>
                        {error}
                    </Alert>
                )}

                {showForm && (
                    <div className="bg-white rounded-lg shadow mb-8 p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {submitError && (
                                <Alert variant="error" closable onClose={() => setSubmitError('')}>
                                    {submitError}
                                </Alert>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label
                                        htmlFor="type"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Tipo de Operación *
                                    </label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        {OPERATION_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    {formErrors.type && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {formErrors.type}
                                        </p>
                                    )}
                                </div>

                                <Input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                />

                                <div>
                                    <label
                                        htmlFor="currency"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Moneda *
                                    </label>
                                    <select
                                        id="currency"
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        {CURRENCIES.map((currency) => (
                                            <option key={currency.value} value={currency.value}>
                                                {currency.label}
                                            </option>
                                        ))}
                                    </select>
                                    {formErrors.currency && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {formErrors.currency}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="primary">
                                    Guardar Operación
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Historial de Operaciones
                    </h2>
                    {operations.length === 0 ? (
                        <p className="text-gray-600">No hay operaciones registradas.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {operations.map((op) => (
                                <li key={op.id} className="py-4 flex justify-between">
                                    <div>
                                        <p className="font-medium">
                                            {getOperationTypeText(op.type)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(op.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getOperationTypeColor(
                                            op.type
                                        )}`}
                                    >
                                        {formatCurrency(op.amount, op.currency)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center mt-6 space-x-2">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                            (page) => (
                                <Button
                                    key={page}
                                    variant={pagination.page === page ? "primary" : "secondary"}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </Button>
                            )
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Operations;
