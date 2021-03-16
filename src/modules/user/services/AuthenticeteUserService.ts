import 'dotenv/config';
import { inject, injectable } from 'tsyringe';
import { sign } from 'jsonwebtoken';

import authConfig from '@config/auth';
import User from '@modules/user/infra/typeorm/entities/User';
import UserRepository from '@modules/user/repositories/IUserRepository';
import HashProvider from '@modules/user/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';

interface RequestDTO {
    email: string;
    password: string;
}
interface ResponseDTO {
    user: User;
    token: string;
}

@injectable()
class AuthenticeteUserService {
    constructor(
        @inject('UserRepository')
        private userRepository: UserRepository,

        @inject('HashProvider')
        private hashProvider: HashProvider,
    ) {}

    public async execute({
        email,
        password,
    }: RequestDTO): Promise<ResponseDTO> {
        const user = await this.userRepository.findByEmail(email);

        if (!user)
            throw new AppError('Invalid email/password combination', 401);
        if (!(await this.hashProvider.compareHash(password, user.password!)))
            throw new AppError('Invalid email/password combination', 401);

        const { secret, expiresIn } = authConfig.jwt;
        const token = sign({}, secret!, {
            subject: user.id,
            expiresIn,
        });

        return { user, token };
    }
}

export default AuthenticeteUserService;
