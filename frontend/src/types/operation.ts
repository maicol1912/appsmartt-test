export interface Operation {
    id: number;
    type: OperationType;
    amount: number;
    currency: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export type OperationType = 'buy' | 'sell';

export interface CreateOperationRequest {
    type: OperationType;
    amount: number;
    currency: string;
}

export interface CreateOperationResponse {
    id: number;
    type: OperationType;
    amount: number;
    currency: string;
    createdAt: string;
}

export interface GetOperationsResponse {
    data: Operation[];
    meta: {
        timestamp: string;
        path: string;
        method: string;
        statusCode: number;
        requestId: string;
        processingTime: number;
        version: string;
        count: number;
    };
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface OperationFormData {
    type: OperationType;
    amount: string;
    currency: string;
}

export interface OperationsFilters {
    page?: number;
    limit?: number;
    type?: OperationType;
    currency?: string;
    dateFrom?: string;
    dateTo?: string;
}