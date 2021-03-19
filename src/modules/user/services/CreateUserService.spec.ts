import FakeUserRepository from '@modules/user/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '@modules/user/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        createUser = new CreateUserService(
            fakeUserRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
    });

    it('should be able to create a new user', async () => {
        const user = await createUser.execute({
            name: 'Pedro',
            email: 'pedro@brandao.com',
            password: '123456',
        });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create a new user from already used email', async () => {
        await createUser.execute({
            name: 'Pedro',
            email: 'pedro@brandao.com',
            password: '123456',
        });

        expect(
            createUser.execute({
                name: 'Pedro',
                email: 'pedro@brandao.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
