import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { OperationsController } from '../controllers/operation.controller';
import { authenticateToken } from '../middlewares/auth';
import { OperationType } from '../types';

const router = Router();
const operationsController = new OperationsController();

const createOperationValidation = [
    body('type')
        .isIn([OperationType.BUY, OperationType.SELL])
        .withMessage('El tipo debe ser "buy" o "sell"'),
    body('amount')
        .isFloat({ gt: 0 })
        .withMessage('El monto debe ser un número mayor a 0'),
    body('currency')
        .trim()
        .isLength({ min: 2, max: 10 })
        .withMessage('La moneda debe tener entre 2 y 10 caracteres')
        .matches(/^[A-Z]{2,10}$/)
        .withMessage('La moneda debe estar en mayúsculas y solo contener letras')
];

const getPaginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La página debe ser un número entero mayor a 0'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('El límite debe ser un número entre 1 y 100')
];

const getByIdValidation = [
    param('id')
        .isUUID()
        .withMessage('ID debe ser un UUID válido')
];

router.use(authenticateToken);

// Rutas
router.post('/', createOperationValidation, operationsController.createOperation);
router.get('/', getPaginationValidation, operationsController.getUserOperations);
router.get('/:id', getByIdValidation, operationsController.getOperationById);

export { router as operationRoutes };