import SendMailDTO from '../dtos/SendMailDTO';
import IMailProvider from '../models/IMailProvider';

export default class FakeMailProvider implements IMailProvider {
    private mails: SendMailDTO[] = [];

    public async sendMail(data: SendMailDTO): Promise<void> {
        this.mails.push(data);
    }
}
