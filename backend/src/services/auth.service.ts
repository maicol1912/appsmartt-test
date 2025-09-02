import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { jwtConfig } from '../config/jwt';
import { LoginRequest, RegisterRequest } from '../types';

export class AuthService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async login(loginData: LoginRequest) {
        const { email, password } = loginData;

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Credenciales inválidas');
        }

        const payload = {
            id: user.id,
            email: user.email
        };

        const options: SignOptions = {
            expiresIn: Number(jwtConfig.expiresIn)
        };

        const token = jwt.sign(payload, jwtConfig.secret, options);

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        };
    }

    async register(registerData: RegisterRequest) {
        const { email, password, firstName, lastName } = registerData;

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('El usuario ya existe con este email');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.userRepository.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        });

        const payload = {
            id: user.id,
            email: user.email
        };

        const options: SignOptions = {
            expiresIn: Number(jwtConfig.expiresIn)
        };

        const token = jwt.sign(payload, jwtConfig.secret, options);

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        };
    }

    async validateToken(token: string) {
        try {
            const payload = jwt.verify(token, jwtConfig.secret) as any;
            const user = await this.userRepository.findById(payload.id);

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            return {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            };
        } catch (error) {
            throw new Error('Token inválido');
        }
    }
}