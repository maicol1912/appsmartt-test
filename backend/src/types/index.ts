import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface CreateOperationRequest {
    type: OperationType;
    amount: number;
    currency: string;
}
export interface JwtPayload {
    id: string;
    email: string;
    iat?: number;
    exp?: number;
}

export enum OperationType {
    BUY = 'buy',
    SELL = 'sell'
}