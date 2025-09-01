import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';

interface ResponseMeta {
    timestamp: string;
    path: string;
    method: string;
    statusCode: number;
    requestId?: string;
    processingTime?: number;
    count?: number;
    version?: string;
}

interface StandardResponse {
    data?: any;
    message?: string;
    meta: ResponseMeta;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    links?: {
        self: string;
        first?: string;
        last?: string;
        prev?: string;
        next?: string;
    };
}

interface ErrorResponse {
    error: string;
    message?: string;
    details?: any;
    meta: ResponseMeta;
    stack?: string;
}

interface PaginatedData {
    operations?: any[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    [key: string]: any;
}

export const responseInterceptor = (req: Request, res: Response, next: NextFunction) => {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const startTime = Date.now();

    (req as any).requestId = requestId;
    (req as any).startTime = startTime;

    const originalJson = res.json;
    const originalStatus = res.status;

    res.status = function (code: number) {
        (this as any).statusCode = code;
        return originalStatus.call(this, code);
    };

    res.json = function (body: any): Response {
        const processingTime = Date.now() - startTime;
        const currentStatusCode = res.statusCode || 200;

        const baseMeta: ResponseMeta = {
            timestamp: new Date().toISOString(),
            path: req.originalUrl || req.path,
            method: req.method,
            statusCode: currentStatusCode,
            requestId,
            processingTime,
            version: ENV.API_VERSION || '1.0.0'
        };

        if (currentStatusCode >= 400) {
            const errorResponse: ErrorResponse = {
                error: body?.error || body?.message || 'Error desconocido',
                meta: baseMeta
            };

            if (body?.message && body?.error && body.message !== body.error) {
                errorResponse.message = body.message;
            }

            return originalJson.call(this, errorResponse);
        }

        const excludedPaths = ['/health', '/api/health', '/status'];
        if (excludedPaths.includes(req.path)) {
            return originalJson.call(this, body);
        }

        let response: StandardResponse;

        if (body && typeof body === 'object' && body.pagination && (body.operations || body.items || body.data)) {
            const paginatedData = body as PaginatedData;
            const dataArray = paginatedData.operations || paginatedData.items || paginatedData.data || [];

            response = {
                data: dataArray,
                meta: {
                    ...baseMeta,
                    count: Array.isArray(dataArray) ? dataArray.length : 0
                },
                pagination: paginatedData.pagination
            };

        }
        else if (Array.isArray(body)) {
            response = {
                data: body,
                meta: {
                    ...baseMeta,
                    count: body.length
                }
            };
        }
        else if (body && typeof body === 'object' && body.message) {
            const { message, ...rest } = body;

            response = {
                data: Object.keys(rest).length > 0 ? rest : null,
                message,
                meta: baseMeta
            };
        }
        else if (body && typeof body === 'object') {
            response = {
                data: body,
                meta: baseMeta
            };
        }
        else {
            response = {
                data: body,
                meta: baseMeta
            };
        }

        return originalJson.call(this, response);
    };

    next();
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const requestId = (req as any).requestId;
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] ${requestId} ${req.method} ${req.originalUrl} - Started`);

    if (ENV.NODE_ENV === 'development' && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const safeBody = { ...req.body };
        if (safeBody.password) safeBody.password = '[HIDDEN]';
        if (safeBody.confirmPassword) safeBody.confirmPassword = '[HIDDEN]';

        console.log(`[${timestamp}] ${requestId} Body:`, JSON.stringify(safeBody, null, 2));
    }

    const originalEnd = res.end;
    res.end = function (...args: any[]) {
        const processingTime = Date.now() - (req as any).startTime;
        const endTimestamp = new Date().toISOString();

        console.log(`[${endTimestamp}] ${requestId} ${req.method} ${req.originalUrl} - ${res.statusCode} - ${processingTime}ms`);

        return originalEnd.apply(this, args);
    };

    next();
};