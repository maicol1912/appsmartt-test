import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/auth.service';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    login = async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Datos de entrada inválidos',
                    details: errors.array()
                });
            }

            const result = await this.authService.login(req.body);

            res.status(200).json({
                message: 'Login exitoso',
                ...result
            });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Credenciales inválidas') {
                    return res.status(401).json({ error: 'Credenciales inválidas' });
                }
            }

            console.error('Error en login:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    };

    register = async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Datos de entrada inválidos',
                    details: errors.array()
                });
            }

            const result = await this.authService.register(req.body);

            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                ...result
            });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'El usuario ya existe con este email') {
                    return res.status(409).json({ error: 'El usuario ya existe con este email' });
                }
            }

            console.error('Error en registro:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    };

    validateToken = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                return res.status(401).json({ error: 'Token no proporcionado' });
            }

            const user = await this.authService.validateToken(token);

            res.status(200).json({
                message: 'Token válido',
                user
            });
        } catch (error) {
            console.error('Error validando token:', error);
            res.status(401).json({ error: 'Token inválido' });
        }
    };
}