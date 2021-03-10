import IMailProvider from '../models/IMailProvider';

interface Mail {
    to: string;
    body: string;
}

export default class FakeMailProvider implements IMailProvider {
    private mails: Mail[] = [];

    public async sendMail(to: string, body: string): Promise<void> {
        this.mails.push({ to, body });
    }
}
