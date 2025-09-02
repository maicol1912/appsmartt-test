import { AppDataSource } from '../config/database';
import { User } from '../entities/user';

export class UserRepository {
    private repository = AppDataSource.getRepository(User);

    async findByEmail(email: string): Promise<User | null> {
        return this.repository.findOne({
            where: { email, isActive: true }
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.repository.findOne({
            where: { id, isActive: true }
        });
    }

    async create(userData: Partial<User>): Promise<User> {
        const user = this.repository.create(userData);
        return this.repository.save(user);
    }

    async update(id: string, userData: Partial<User>): Promise<User | null> {
        await this.repository.update(id, userData);
        return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.update(id, { isActive: false });
        return result.affected !== null && result?.affected > 0;
    }
}