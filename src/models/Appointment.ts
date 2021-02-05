import { v4 as uuid4 } from 'uuid';

class Appointment {
    id: string;

    provider: string;

    date: Date;

    constructor({ provider, date }: Omit<Appointment, 'id'>) {
        this.id = uuid4();
        this.provider = provider;
        this.date = date;
    }
}

export default Appointment;
