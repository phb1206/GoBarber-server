import { inject, injectable } from 'tsyringe';

import User from '@modules/user/infra/typeorm/entities/User';
import UserRepository from '@modules/user/repositories/IUserRepository';
import AppError from '@shared/errors/AppError';

@injectable()
class ShowProfileService {
    constructor(
        @inject('UserRepository')
        private userRepository: UserRepository,
    ) {}

    public async execute(user_id: string): Promise<User> {
        const user = await this.userRepository.findById(user_id);

        if (!user)
            throw new AppError(
                'Only authenticated users can change their profile',
                401,
            );

        user.password = undefined;

        return user;
    }
}

export default ShowProfileService;
