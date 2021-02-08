import { compare } from 'bcryptjs';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';

import authConfig from '../config/auth';
import User from '../models/User';
import AppError from '../errors/AppError';

interface RequestDTO {
    email: string;
    password: string;
}
interface ResponseDTO {
    user: User;
    token: string;
}

class AuthenticeteUserService {
    public async execute({
        email,
        password,
    }: RequestDTO): Promise<ResponseDTO> {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user)
            throw new AppError('Invalid email/password combination', 401);
        if (!(await compare(password, user.password!)))
            throw new AppError('Invalid email/password combination', 401);

        const { secret, expiresIn } = authConfig.jwt;
        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return { user, token };
    }
}

export default AuthenticeteUserService;
