import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/user/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '@modules/user/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfileService = new UpdateProfileService(
            fakeUserRepository,
            fakeHashProvider,
        );
    });

    it('should be able to update user profile (name and email)', async () => {
        const user = await fakeUserRepository.create({
            name: 'Pedro',
            email: 'pedro@brandao.com',
            password: '123456',
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'New name',
            email: 'new@email.com',
        });

        expect(updatedUser.name).toBe('New name');
        expect(updatedUser.email).toBe('new@email.com');
    });

    it('should not be able to update non-existing user profile', async () => {
        await expect(
            updateProfileService.execute({
                user_id: 'user.id',
                name: 'New name',
                email: 'new@email.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update for an already existing email', async () => {
        const user = await fakeUserRepository.create({
            name: 'Pedro',
            email: 'pedro@brandao.com',
            password: '123456',
        });

        const user2 = await fakeUserRepository.create({
            name: 'Pedro2',
            email: 'pedro2@brandao.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: user.name,
                email: user2.email,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update only name', async () => {
        const user = await fakeUserRepository.create({
            name: 'Pedro',
            email: 'pedro@brandao.com',
            password: '123456',
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'New name',
            email: user.email,
        });

        expect(updatedUser.name).toBe('New name');
    });

    it('should be able to update password', async () => {
        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        const user = await fakeUserRepository.create({
            name: 'Pedro',
            email: 'pedro@brandao.com',
            password: '123456',
        });

        await updateProfileService.execute({
            user_id: user.id,
            name: user.name,
            email: user.email,
            old_password: '123456',
            password: '123123',
        });

        expect(generateHash).toBeCalledWith('123123');
    });

    it('should not be able to update password without old password', async () => {
        const user = await fakeUserRepository.create({
            name: 'Pedro',
            email: 'pedro@brandao.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: user.name,
                email: user.email,
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update password with incorrect old password', async () => {
        const user = await fakeUserRepository.create({
            name: 'Pedro',
            email: 'pedro@brandao.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: user.name,
                email: user.email,
                old_password: '12356',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
