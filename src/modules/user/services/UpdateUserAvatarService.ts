// import path from 'path';
// import fs from 'fs';
import { inject, injectable } from 'tsyringe';

// import uploadConfig from '@config/upload';
import User from '@modules/user/infra/typeorm/entities/User';
import UserRepository from '@modules/user/repositories/IUserRepository';
import StorageProvider from '@shared/container/providers/StorageProviders/models/IStorageProvider';
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

        @inject('StorageProvider')
        private storageProvider: StorageProvider,
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
            await this.storageProvider.deleteFile(user.avatar);
        }

        const filename = await this.storageProvider.saveFile(avatarFileName);

        user.avatar = filename;
        await this.userRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
