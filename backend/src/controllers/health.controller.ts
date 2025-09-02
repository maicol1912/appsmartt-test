import { Request, Response } from 'express';

export class HealthController {

    constructor() {
    }

    health = async (req: Request, res: Response) => {
        try {

            res.status(200).json({
                status: 'UP'
            });
        } catch (error) {
            res.status(500).json({ status: 'DOWN' });
        }
    };
}