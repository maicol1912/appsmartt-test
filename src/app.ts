import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authRoutes } from './routes/auth.routes';
import { operationRoutes } from './routes/operation.routes';
import { errorHandler } from './utils/error.handler';
import { ENV } from './config/env';
import { healthRoute } from './routes/health.route';
import { requestLogger, responseInterceptor } from './middlewares/response.interceptor';
import { ensureRequestId, simpleRateLimit } from './middlewares/validator.middleware';

const app = express();

app.use(helmet());
app.use(cors({
    origin: ENV.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(responseInterceptor);
app.use(ensureRequestId);
app.use(requestLogger);
app.use(simpleRateLimit(60 * 1000, 30));

app.use('/api/auth', authRoutes);
app.use('/api/operations', operationRoutes);
app.use('/api/healthcheck', healthRoute);

app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});

app.use(errorHandler);

export { app };