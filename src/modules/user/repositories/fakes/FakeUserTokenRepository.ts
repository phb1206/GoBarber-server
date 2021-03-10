import { v4 as uuid } from 'uuid';

import IUserTokenRepository from '@modules/user/repositories/IUserTokenRepository';

import UserToken from '@modules/user/infra/typeorm/entities/UserToken';

class FakeUserTokenRepository implements IUserTokenRepository {
    private userTokens: UserToken[] = [];

    public async generate(userId: string): Promise<UserToken> {
        const userToken = new UserToken();

        Object.assign(userToken, {
            id: uuid(),
            token: uuid(),
            userId,
        });

        this.userTokens.push(userToken);
        return userToken;
    }
}

export default FakeUserTokenRepository;
