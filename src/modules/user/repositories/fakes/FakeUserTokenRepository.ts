import { v4 as uuid } from 'uuid';

import IUserTokenRepository from '@modules/user/repositories/IUserTokenRepository';

import UserToken from '@modules/user/infra/typeorm/entities/UserToken';
import IUserToken from '@modules/user/models/IUserToken';

class FakeUserTokenRepository implements IUserTokenRepository {
    private userTokens: UserToken[] = [];

    public async generate(userId: string): Promise<UserToken> {
        const userToken = new UserToken();

        Object.assign(userToken, {
            id: uuid(),
            token: uuid(),
            userId,
            created_at: new Date(),
            updated_at: new Date(),
        });

        this.userTokens.push(userToken);
        return userToken;
    }

    public async findByToken(token: string): Promise<IUserToken | undefined> {
        return this.userTokens.find(userToken => userToken.token === token);
    }
}

export default FakeUserTokenRepository;
