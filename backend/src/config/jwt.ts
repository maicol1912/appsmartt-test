import dotenv from 'dotenv';
import { ENV } from './env';

dotenv.config();

export const jwtConfig = {
    secret: ENV.JWT_SECRET || 'fallback-secret-key',
    expiresIn: ENV.JWT_EXPIRES_IN || 24000000,
};

if (!ENV.JWT_SECRET) {
    console.warn('⚠️  JWT_SECRET no está definido en las variables de entorno');
}