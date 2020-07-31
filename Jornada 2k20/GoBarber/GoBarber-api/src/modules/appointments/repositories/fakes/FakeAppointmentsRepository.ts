import { uuid } from "uuidv4";
import { isEqual } from "date-fns";

import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentRepository";
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";

import Appointment from "../../infra/typeorm/entities/Appointment";

class AppointmentsRepository implements IAppointmentsRepository {
    // Variável em memória, assim não tem necessidade de criação de banco de dados.
    private appointments: Appointment[] = [];

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(appointment =>
            isEqual(appointment.date, date),
        );

        return findAppointment;
    }

    public async create({
        provider_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, { id: uuid(), date, provider_id });

        this.appointments.push(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;
