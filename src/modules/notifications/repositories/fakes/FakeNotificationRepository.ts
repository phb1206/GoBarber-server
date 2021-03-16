import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import CreateNotificationDTO from '@modules/notifications/dtos/CreateNotificationDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import { ObjectID } from 'mongodb';

class NotificationRepository implements INotificationRepository {
    private notifications: Notification[] = [];

    public async create({
        content,
        user_id,
    }: CreateNotificationDTO): Promise<Notification> {
        const notification = new Notification();
        Object.assign(notification, { id: new ObjectID(), content, user_id });

        this.notifications.push(notification);

        return notification;
    }
}

export default NotificationRepository;
