import { inject, injectable } from 'tsyringe';

import User from '@modules/user/infra/typeorm/entities/User';
import UserRepository from '@modules/user/repositories/IUserRepository';
import HashProvider from '@modules/user/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';

interface RequestDTO {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
class UpdateProfileService {
    constructor(
        @inject('UserRepository')
        private userRepository: UserRepository,

        @inject('HashProvider')
        private hashProvider: HashProvider,
    ) {}

    public async execute({
        user_id,
        name,
        email,
        old_password,
        password,
    }: RequestDTO): Promise<User> {
        const user = await this.userRepository.findById(user_id);

        if (!user)
            throw new AppError(
                'Only authenticated users can change their profile',
                401,
            );

        const newEmailUser = await this.userRepository.findByEmail(email);
        if (newEmailUser && newEmailUser.id !== user_id)
            throw new AppError('This email is already registered', 401);

        user.name = name;
        user.email = email;

        if (password) {
            if (
                !old_password ||
                !(await this.hashProvider.compareHash(
                    old_password,
                    user.password!,
                ))
            )
                throw new AppError('Invlaid old password', 401);
            user.password = await this.hashProvider.generateHash(password);
        }

        const updatedUser = await this.userRepository.save(user);

        updatedUser.password = undefined;
        return updatedUser;
    }
}

export default UpdateProfileService;
