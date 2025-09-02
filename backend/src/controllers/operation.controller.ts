import { Response } from 'express';
import { validationResult } from 'express-validator';
import { OperationService } from '../services/operation.service';
import { AuthenticatedRequest } from '../types';

export class OperationsController {
    private operationService: OperationService;

    constructor() {
        this.operationService = new OperationService();
    }

    createOperation = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Datos de entrada inválidos',
                    details: errors.array()
                });
            }

            if (!req.user) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }

            const operation = await this.operationService.createOperation(
                req.body,
                req.user.id
            );

            res.status(201).json(operation);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('Usuario no encontrado')) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                }
                if (error.message.includes('monto debe ser mayor') ||
                    error.message.includes('tipo de operación') ||
                    error.message.includes('moneda es requerida')) {
                    return res.status(400).json({ error: error.message });
                }
            }

            console.error('Error creando operación:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    };

    getUserOperations = async (req: AuthenticatedRequest, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            if (page < 1 || limit < 1 || limit > 100) {
                return res.status(400).json({
                    error: 'Parámetros de paginación inválidos. Page >= 1, Limit entre 1 y 100'
                });
            }

            const result = await this.operationService.getUserOperations(
                req.user.id,
                page,
                limit
            );

            res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error && error.message.includes('Usuario no encontrado')) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            console.error('Error obteniendo operaciones:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    };

    getOperationById = async (req: AuthenticatedRequest, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }

            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: 'ID de operación requerido' });
            }

            const operation = await this.operationService.getOperationById(
                id,
                req.user.id
            );

            res.status(200).json(operation);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Operación no encontrada') {
                    return res.status(404).json({ error: 'Operación no encontrada' });
                }
                if (error.message === 'No tienes permisos para ver esta operación') {
                    return res.status(403).json({ error: 'No tienes permisos para ver esta operación' });
                }
            }

            console.error('Error obteniendo operación:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    };
}