import { isEqual } from "date-fns";
import Appointment from "../models/Appointments";

class AppointmentsRepository {
    private appointments: Appointment[];

    constructor() {
        this.appointments = [];
    }

    public findByDate(date: Date): Appointment | null {
        // Encontrando se tem algum agendamento na mesma data.
        const findAppointment = this.appointments.find(appointment =>
            isEqual(date, appointment.date),
        );

        return findAppointment || null;
    }

    public create(provider: string, date: Date): Appointment {
        const appointment = new Appointment(provider, date);

        this.appointments.push(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;
