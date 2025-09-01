import 'reflect-metadata';
import { app } from './app';
import { AppDataSource } from './config/database';
import dotenv from 'dotenv';
import { ENV } from './config/env';

dotenv.config();


const PORT = ENV.PORT || 3000;

async function startServer() {
    try {
        await AppDataSource.initialize();
        console.log('✅ Database connection established');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 Environment: ${ENV.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
}

startServer();