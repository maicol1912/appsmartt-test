import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const rateLimitStore: RateLimitStore = {};

export const simpleRateLimit = (windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const clientId = req.ip || 'unknown';
        const now = Date.now();

        if (rateLimitStore[clientId] && now > rateLimitStore[clientId].resetTime) {
            delete rateLimitStore[clientId];
        }

        if (!rateLimitStore[clientId]) {
            rateLimitStore[clientId] = {
                count: 1,
                resetTime: now + windowMs
            };
        } else {
            rateLimitStore[clientId].count++;
        }

        const { count, resetTime } = rateLimitStore[clientId];

        res.set({
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': Math.max(0, maxRequests - count).toString(),
            'X-RateLimit-Reset': new Date(resetTime).toISOString()
        });

        if (count > maxRequests) {
            return res.status(429).json({
                error: 'Demasiadas peticiones',
                message: `Límite de ${maxRequests} peticiones por ${windowMs / 60000} minutos excedido`,
                retryAfter: Math.ceil((resetTime - now) / 1000)
            });
        }

        next();
    };
};

export const ensureRequestId = (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).requestId) {
        (req as any).requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }

    res.set('X-Request-ID', (req as any).requestId);

    next();
};