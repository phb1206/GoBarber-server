import { inject, injectable } from 'tsyringe';

import User from '@modules/user/infra/typeorm/entities/User';
import UserRepository from '@modules/user/repositories/IUserRepository';
import CacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

@injectable()
class ListProviderService {
    constructor(
        @inject('UserRepository')
        private userRepository: UserRepository,

        @inject('CacheProvider')
        private cacheProvider: CacheProvider,
    ) {}

    public async execute(user_id: string): Promise<User[]> {
        let users = await this.cacheProvider.get<User[]>(
            `providers_list:${user_id}`,
        );

        if (!users) {
            users = await this.userRepository.findAll([user_id]);

            await this.cacheProvider.save(`providers_list:${user_id}`, users);
        }

        return users;
    }
}

export default ListProviderService;
