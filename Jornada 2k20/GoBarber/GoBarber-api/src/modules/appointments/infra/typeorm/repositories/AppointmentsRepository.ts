import { getRepository, Raw, Repository } from "typeorm";

import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentRepository";
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";
import IFindAllInMonthFromProviderDTO from "@modules/appointments/dtos/IFindAllInMonthFromProviderDTO";
import IFindAllInDayFromProviderDTO from "@modules/appointments/dtos/IFindAllInDayFromProviderDTO";

import Appointment from "../entities/Appointment";

class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        // Encontrando se tem algum agendamento na mesma data.
        const findAppointment = await this.ormRepository.findOne({
            where: { date },
        });

        return findAppointment;
    }

    public async findAllInMonthFromProvider({
        provider_id,
        month,
        year,
    }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        // Preenchendo com um 0 à esquerda
        const parsedMonth = String(month).padStart(2, "0");

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
                ),
            },
        });

        return appointments;
    }

    public async findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year,
    }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        const parsedDay = String(day).padStart(2, "0");
        const parsedMonth = String(month).padStart(2, "0");

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
                ),
            },
        });

        return appointments;
    }

    public async create({
        provider_id,
        user_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            user_id,
            provider_id,
            date,
        });

        await this.ormRepository.save(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;
