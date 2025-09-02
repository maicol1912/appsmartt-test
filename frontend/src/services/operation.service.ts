import apiClient from './api';
import {
    Operation,
    CreateOperationRequest,
    CreateOperationResponse,
    GetOperationsResponse,
    OperationsFilters
} from '@/types/operation';
import { API_ENDPOINTS } from '@/utils/constants';

export const operationsService = {
    async createOperation(operationData: CreateOperationRequest): Promise<CreateOperationResponse> {
        const { data } = await apiClient.post<{ data: CreateOperationResponse }>(
            API_ENDPOINTS.OPERATIONS.CREATE,
            operationData
        );
        return data;
    },

    async getOperations(filters: OperationsFilters = {}): Promise<GetOperationsResponse> {
        const queryParams = new URLSearchParams();

        if (filters.page) queryParams.append('page', filters.page.toString());
        if (filters.limit) queryParams.append('limit', filters.limit.toString());
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.currency) queryParams.append('currency', filters.currency);
        if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);

        const url = `${API_ENDPOINTS.OPERATIONS.GET_ALL}?${queryParams.toString()}`;

        const response = await apiClient.get<GetOperationsResponse>(url);
        return response;
    },
    async getOperationById(id: number): Promise<Operation> {
        const { data } = await apiClient.get<{ data: Operation }>(
            `${API_ENDPOINTS.OPERATIONS.GET_BY_ID}/${id}`
        );
        return data;
    }
};
