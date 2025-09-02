import { Router } from 'express';
import { body } from 'express-validator';
import { HealthController } from '../controllers/health.controller';

const router = Router();
const healthController = new HealthController();

router.get('/', healthController.health);
export { router as healthRoute };