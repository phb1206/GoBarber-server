import { inject, injectable } from 'tsyringe';

import User from '@modules/user/infra/typeorm/entities/User';
import UserRepository from '@modules/user/repositories/IUserRepository';

@injectable()
class ListProviderService {
    constructor(
        @inject('UserRepository')
        private userRepository: UserRepository,
    ) {}

    public async execute(user_id: string): Promise<User[]> {
        const users = await this.userRepository.findAll([user_id]);

        users.forEach(user => delete user.password);

        return users;
    }
}

export default ListProviderService;
