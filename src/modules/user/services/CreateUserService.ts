import { inject, injectable } from 'tsyringe';
import { hash } from 'bcryptjs';

import User from '@modules/user/infra/typeorm/entities/User';
import UserRepository from '@modules/user/repositories/IUserRepository';
import AppError from '@shared/errors/AppError';

interface RequestDTO {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {
    constructor(
        @inject('UserRepository')
        private userRepository: UserRepository,
    ) {}

    public async execute({ name, email, password }: RequestDTO): Promise<User> {
        if (await this.userRepository.findByEmail(email))
            throw new AppError('Email already registered');

        const hashedPassword = await hash(password, 8);

        const user = await this.userRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        return user;
    }
}

export default CreateUserService;
