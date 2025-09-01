import { DataSource } from 'typeorm';
import { User } from '../entities/user';
import { Operation } from '../entities/operation';
import { ENV } from './env';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: ENV.DB_HOST || 'localhost',
    port: ENV.DB_PORT,
    username: ENV.DB_USERNAME,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_DATABASE,
    synchronize: ENV.NODE_ENV === 'development',
    logging: ENV.NODE_ENV === 'development',
    entities: [User, Operation],
    migrations: ['src/migrations/*.ts'],
    subscribers: ['src/subscribers/*.ts'],
});