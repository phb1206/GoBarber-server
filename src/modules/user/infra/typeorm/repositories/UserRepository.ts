import { getRepository, Repository } from 'typeorm';

import IUserRepository from '@modules/user/repositories/IUserRepository';
import CreateUserDTO from '@modules/user/dtos/CreateUserDTO';

import User from '@modules/user/infra/typeorm/entities/User';

class UserRepository implements IUserRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async findAll(exclude_ids?: string[]): Promise<User[]> {
        let users = await this.ormRepository.find();

        if (exclude_ids) {
            users = users.filter(user => !exclude_ids.includes(user.id));
        }

        return users;
    }

    public async findById(id: string): Promise<User | undefined> {
        const foundUser = await this.ormRepository.findOne(id);
        return foundUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const foundUser = await this.ormRepository.findOne({
            where: { email },
        });
        return foundUser;
    }

    public async create({
        name,
        email,
        password,
    }: CreateUserDTO): Promise<User> {
        const user = this.ormRepository.create({
            name,
            email,
            password,
        });
        await this.ormRepository.save(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }
}

export default UserRepository;
