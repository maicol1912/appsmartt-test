import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    statusCode?: number;
    code?: string;
}

export const errorHandler = (
    error: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const requestId = (req as any).requestId || 'unknown';
    const timestamp = new Date().toISOString();

    console.error(`[${timestamp}] ${requestId} ERROR:`, error.stack);

    const baseResponse = {
        timestamp,
        path: req.originalUrl,
        method: req.method,
        requestId,
        processingTime: Date.now() - ((req as any).startTime || Date.now()),
        version: process.env.API_VERSION || '1.0.0'
    };

    if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({
            error: 'Servicio temporalmente no disponible',
            message: 'Error de conexión a la base de datos',
            meta: { ...baseResponse, statusCode: 503 }
        });
    }

    if (error.code === '23505') {
        return res.status(409).json({
            error: 'Conflicto de datos',
            message: 'El recurso ya existe',
            meta: { ...baseResponse, statusCode: 409 }
        });
    }

    if (error.code === '23503') {
        return res.status(400).json({
            error: 'Datos inválidos',
            message: 'Referencia a recurso inexistente',
            meta: { ...baseResponse, statusCode: 400 }
        });
    }

    if (error.code === '23514') {
        return res.status(400).json({
            error: 'Datos inválidos',
            message: 'Los datos no cumplen con las restricciones requeridas',
            meta: { ...baseResponse, statusCode: 400 }
        });
    }

    if (error.name === 'QueryFailedError') {
        return res.status(400).json({
            error: 'Error en la consulta',
            message: 'Datos inválidos o formato incorrecto',
            meta: { ...baseResponse, statusCode: 400 }
        });
    }

    if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
        return res.status(400).json({
            error: 'JSON malformado',
            message: 'El formato de los datos enviados es inválido',
            meta: { ...baseResponse, statusCode: 400 }
        });
    }

    if (error.message && error.message.includes('request entity too large')) {
        return res.status(413).json({
            error: 'Payload demasiado grande',
            message: 'El tamaño de los datos enviados excede el límite permitido',
            meta: { ...baseResponse, statusCode: 413 }
        });
    }

    if (error.statusCode) {
        return res.status(error.statusCode).json({
            error: error.message || 'Error personalizado',
            meta: { ...baseResponse, statusCode: error.statusCode }
        });
    }

    const statusCode = 500;
    const isDevelopment = process.env.NODE_ENV === 'development';

    const errorResponse: any = {
        error: 'Error interno del servidor',
        message: isDevelopment ? error.message : 'Algo salió mal. Intenta de nuevo más tarde.',
        meta: { ...baseResponse, statusCode }
    };

    if (isDevelopment && error.stack) {
        errorResponse.stack = error.stack.split('\n').slice(0, 10);
    }

    res.status(statusCode).json(errorResponse);
};