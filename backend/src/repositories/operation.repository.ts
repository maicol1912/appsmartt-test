import { QueryRunner } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Operation } from '../entities/operation';
import { CreateOperationRequest, OperationType } from '../types';

export class OperationRepository {
    private repository = AppDataSource.getRepository(Operation);

    async create(operationData: CreateOperationRequest & { userId: string }, queryRunner?: QueryRunner): Promise<Operation> {
        const repo = queryRunner ? queryRunner.manager.getRepository(Operation) : this.repository;

        const operationEntity = {
            type: operationData.type as OperationType,
            amount: operationData.amount,
            currency: operationData.currency.toUpperCase(),
            userId: operationData.userId
        };

        const operation = repo.create(operationEntity);
        return repo.save(operation);
    }

    async findById(id: string): Promise<Operation | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['user']
        });
    }

    async findByUserId(userId: string, limit?: number, offset?: number): Promise<Operation[]> {
        const queryBuilder = this.repository.createQueryBuilder('operation')
            .where('operation.userId = :userId', { userId })
            .orderBy('operation.createdAt', 'DESC');

        if (limit) {
            queryBuilder.limit(limit);
        }

        if (offset) {
            queryBuilder.offset(offset);
        }

        return queryBuilder.getMany();
    }

    async countByUserId(userId: string): Promise<number> {
        return this.repository.count({
            where: { userId }
        });
    }

    async findAll(limit?: number, offset?: number): Promise<Operation[]> {
        const queryBuilder = this.repository.createQueryBuilder('operation')
            .leftJoinAndSelect('operation.user', 'user')
            .orderBy('operation.createdAt', 'DESC');

        if (limit) {
            queryBuilder.limit(limit);
        }

        if (offset) {
            queryBuilder.offset(offset);
        }

        return queryBuilder.getMany();
    }
}