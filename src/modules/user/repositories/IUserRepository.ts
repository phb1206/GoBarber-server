import User from '@modules/user/models/IUser';
import CreateUserDTO from '@modules/user/dtos/CreateUserDTO';

export default interface IUserRepository {
    findById(id: string): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    create(data: CreateUserDTO): Promise<User>;
    save(user: User): Promise<User>;
}
