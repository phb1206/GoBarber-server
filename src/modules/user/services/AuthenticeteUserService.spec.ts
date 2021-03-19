import FakeUserRepository from '@modules/user/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '@modules/user/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import AuthenticeteUserService from './AuthenticeteUserService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let authenticeteUser: AuthenticeteUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeHashProvider = new FakeHashProvider();

        authenticeteUser = new AuthenticeteUserService(
            fakeUserRepository,
            fakeHashProvider,
        );
    });

    it('should be able to authenticate user', async () => {
        const user = await fakeUserRepository.create({
            name: 'Pedro',
            email: 'pedro@brandao.com',
            password: '123456',
        });

        const response = await authenticeteUser.execute({
            email: 'pedro@brandao.com',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate with non existing user', async () => {
        expect(
            authenticeteUser.execute({
                email: 'pedro@brandao.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to authenticate with wrong password', async () => {
        await fakeUserRepository.create({
            name: 'Pedro',
            email: 'pedro@brandao.com',
            password: '123456',
        });

        expect(
            authenticeteUser.execute({
                email: 'pedro@brandao.com',
                password: '123455',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
