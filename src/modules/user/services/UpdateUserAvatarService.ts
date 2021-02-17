import path from 'path';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';

import uploadConfig from '@config/upload';
import User from '@modules/user/infra/typeorm/entities/User';
import UserRepository from '@modules/user/repositories/IUserRepository';
import AppError from '@shared/errors/AppError';

interface RequestDTO {
    user_id: string;
    avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
    constructor(
        @inject('UserRepository')
        private userRepository: UserRepository,
    ) {}

    public async execute({
        user_id,
        avatarFileName,
    }: RequestDTO): Promise<User> {
        const user = await this.userRepository.findById(user_id);

        if (!user)
            throw new AppError(
                'Only authenticated users can change avatar',
                401,
            );

        if (user.avatar) {
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );
            if (await fs.promises.stat(userAvatarFilePath))
                await fs.promises.unlink(userAvatarFilePath);
        }

        user.avatar = avatarFileName;
        await this.userRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
