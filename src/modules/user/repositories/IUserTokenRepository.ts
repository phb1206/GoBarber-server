import UserToken from '@modules/user/models/IUserToken';

export default interface IUserTokenRepository {
    generate(userId: string): Promise<UserToken>;
    findByToken(token: string): Promise<UserToken | undefined>;
}
