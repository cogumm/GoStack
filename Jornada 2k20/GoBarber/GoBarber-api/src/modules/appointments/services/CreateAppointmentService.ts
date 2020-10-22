import { getHours, isBefore, startOfHour } from "date-fns";
import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import Appointment from "../infra/typeorm/entities/Appointment";
import IAppointmentRepository from "../repositories/IAppointmentRepository";

interface IRequest {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject("AppointmentsRepository")
        private appointmentsRepository: IAppointmentRepository,
    ) {}

    public async execute({
        provider_id,
        user_id,
        date,
    }: IRequest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        // Verificando para não poder agendar em um horário que já passou
        if (isBefore(appointmentDate, Date.now())) {
            throw new AppError(
                "You can't create an appointment on a past date.",
            );
        }

        // Servidor não pode agendar um horário apra ele mesmo
        if (user_id === provider_id) {
            throw new AppError(
                "You can't create an appointment with yourself.",
            );
        }

        // Verificando se está dentro do horário de funcionamento
        if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
            throw new AppError(
                "Yout can only create appointments between 8am and 5pm.",
            );
        }

        const findAppointmentsInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentsInSameDate) {
            throw new AppError("This appointments is already booked.");
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            user_id,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
