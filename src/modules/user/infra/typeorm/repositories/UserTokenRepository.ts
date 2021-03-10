import { getRepository, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import IUserTokenRepository from '@modules/user/repositories/IUserTokenRepository';

import UserToken from '@modules/user/infra/typeorm/entities/UserToken';
import IUserToken from '@modules/user/models/IUserToken';

class UserTokenRepository implements IUserTokenRepository {
    private ormRepository: Repository<UserToken>;

    constructor() {
        this.ormRepository = getRepository(UserToken);
    }

    public async generate(userId: string): Promise<IUserToken> {
        const userToken = this.ormRepository.create({
            id: uuid(),
            token: uuid(),
            userId,
        });

        await this.ormRepository.save(userToken);

        return userToken;
    }
}

export default UserTokenRepository;
