import FakeUserRepository from '@modules/user/repositories/fakes/FakeUserRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProviders/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
    it('should be able to add an avatar to user', async () => {
        const fakeUserRepository = new FakeUserRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUserRepository,
            fakeStorageProvider,
        );

        const user = await fakeUserRepository.create({
            name: 'Pedro',
            email: 'pedro@brandao.com',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFileName: 'avatar.jpg',
        });

        expect(user.avatar).toBe('avatar.jpg');
    });

    it('should delete old avatar when updating', async () => {
        const fakeUserRepository = new FakeUserRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUserRepository,
            fakeStorageProvider,
        );

        const user = await fakeUserRepository.create({
            name: 'Pedro',
            email: 'pedro@brandao.com',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFileName: 'avatar.jpg',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFileName: 'avatar2.jpg',
        });

        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
        expect(user.avatar).toBe('avatar2.jpg');
    });

    it('should not be able to add an avatar to non existing user', async () => {
        const fakeUserRepository = new FakeUserRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUserRepository,
            fakeStorageProvider,
        );

        expect(
            updateUserAvatar.execute({
                user_id: '404',
                avatarFileName: 'avatar.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
