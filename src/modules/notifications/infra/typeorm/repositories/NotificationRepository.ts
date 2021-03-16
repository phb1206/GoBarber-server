import { getMongoRepository, MongoRepository } from 'typeorm';

import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import CreateNotificationDTO from '@modules/notifications/dtos/CreateNotificationDTO';
import Notification from '../schemas/Notification';

class NotificationRepository implements INotificationRepository {
    private ormRepository: MongoRepository<Notification>;

    constructor() {
        this.ormRepository = getMongoRepository(Notification, 'mongo');
    }

    public async create({
        content,
        user_id,
    }: CreateNotificationDTO): Promise<Notification> {
        const notification = this.ormRepository.create({
            content,
            user_id,
        });

        await this.ormRepository.save(notification);

        return notification;
    }
}

export default NotificationRepository;
