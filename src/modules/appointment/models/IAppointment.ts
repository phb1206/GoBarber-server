import User from '@modules/user/models/IUser';

export default interface IAppointment {
    id: string;
    provider_id: string;
    provider: User;
    date: Date;
    created_at: Date;
    updated_at: Date;
}
