import { inject, injectable } from 'tsyringe';
import { differenceInHours } from 'date-fns';

import UserRepository from '@modules/user/repositories/IUserRepository';
import UserTokenRepository from '@modules/user/repositories/IUserTokenRepository';
import HashProvider from '@modules/user/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
    token: string;
    password: string;
}

@injectable()
class ResetPasswordService {
    constructor(
        @inject('UserRepository')
        private userRepository: UserRepository,

        @inject('UserTokenRepository')
        private userTokenRepository: UserTokenRepository,

        @inject('HashProvider')
        private hashProvider: HashProvider,
    ) {}

    public async execute({ token, password }: IRequest): Promise<void> {
        const userToken = await this.userTokenRepository.findByToken(token);

        if (!userToken) {
            throw new AppError('Token is not valid');
        }

        if (differenceInHours(Date.now(), userToken.created_at) >= 2) {
            throw new AppError('Token expired');
        }

        const user = await this.userRepository.findById(userToken.user_id);

        user!.password = await this.hashProvider.generateHash(password);

        await this.userRepository.save(user!);
    }
}

export default ResetPasswordService;
