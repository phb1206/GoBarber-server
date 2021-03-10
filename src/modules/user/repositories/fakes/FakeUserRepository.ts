import { v4 as uuidv4 } from 'uuid';

import IUserRepository from '@modules/user/repositories/IUserRepository';
import CreateUserDTO from '@modules/user/dtos/CreateUserDTO';

import User from '@modules/user/infra/typeorm/entities/User';

class FakeUserRepository implements IUserRepository {
    private users: User[] = [];

    public async findById(id: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.id === id);
        return findUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.email === email);
        return findUser;
    }

    public async create({
        name,
        email,
        password,
    }: CreateUserDTO): Promise<User> {
        const user = new User();
        Object.assign(user, { id: uuidv4(), name, email, password });
        this.users.push(user);
        return user;
    }

    public async save(user: User): Promise<User> {
        const findIndex = this.users.findIndex(u => u.id === user.id);
        this.users[findIndex] = user;
        return user;
    }
}

export default FakeUserRepository;
