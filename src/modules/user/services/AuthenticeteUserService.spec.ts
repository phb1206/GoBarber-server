import FakeUserRepository from '@modules/user/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '@modules/user/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import AuthenticeteUserService from './AuthenticeteUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
    it('should be able to authenticate user', async () => {
        const fakeUserRepository = new FakeUserRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );
        const authenticeteUser = new AuthenticeteUserService(
            fakeUserRepository,
            fakeHashProvider,
        );

        const user = await createUser.execute({
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
        const fakeUserRepository = new FakeUserRepository();
        const fakeHashProvider = new FakeHashProvider();
        const authenticeteUser = new AuthenticeteUserService(
            fakeUserRepository,
            fakeHashProvider,
        );

        expect(
            authenticeteUser.execute({
                email: 'pedro@brandao.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to authenticate with wrong password', async () => {
        const fakeUserRepository = new FakeUserRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );
        const authenticeteUser = new AuthenticeteUserService(
            fakeUserRepository,
            fakeHashProvider,
        );

        await createUser.execute({
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
