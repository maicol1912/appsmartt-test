import { AppDataSource } from '../config/database';
import { OperationRepository } from '../repositories/operation.repository';
import { UserRepository } from '../repositories/user.repository';
import { CreateOperationRequest, OperationType } from '../types';

export class OperationService {
    private operationRepository: OperationRepository;
    private userRepository: UserRepository;

    constructor() {
        this.operationRepository = new OperationRepository();
        this.userRepository = new UserRepository();
    }

    async createOperation(operationData: CreateOperationRequest, userId: string) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            if (operationData.amount <= 0) {
                throw new Error('El monto debe ser mayor a 0');
            }

            if (!Object.values(OperationType).includes(operationData.type)) {
                throw new Error('El tipo de operación debe ser "buy" o "sell"');
            }

            if (!operationData.currency || operationData.currency.length === 0) {
                throw new Error('La moneda es requerida');
            }

            const operation = await this.operationRepository.create(
                {
                    ...operationData,
                    userId
                },
                queryRunner
            );

            await queryRunner.commitTransaction();

            return {
                id: operation.id,
                type: operation.type,
                amount: operation.amount,
                currency: operation.currency,
                createdAt: operation.createdAt
            };

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getUserOperations(userId: string, page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const [operations, total] = await Promise.all([
            this.operationRepository.findByUserId(userId, limit, offset),
            this.operationRepository.countByUserId(userId)
        ]);

        return {
            operations: operations.map(op => ({
                id: op.id,
                type: op.type,
                amount: op.amount,
                currency: op.currency,
                createdAt: op.createdAt
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getOperationById(operationId: string, userId: string) {
        const operation = await this.operationRepository.findById(operationId);

        if (!operation) {
            throw new Error('Operación no encontrada');
        }

        if (operation.userId !== userId) {
            throw new Error('No tienes permisos para ver esta operación');
        }

        return {
            id: operation.id,
            type: operation.type,
            amount: operation.amount,
            currency: operation.currency,
            createdAt: operation.createdAt
        };
    }
}