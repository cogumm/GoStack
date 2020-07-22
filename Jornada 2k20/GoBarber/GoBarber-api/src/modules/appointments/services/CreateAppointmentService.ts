import { startOfHour } from "date-fns";
import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import Appointment from "../infra/typeorm/entities/Appointment";
import IAppointmentRepository from "../repositories/IAppointmentRepository";

interface IRequest {
    provider_id: string;
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
        date,
    }: IRequest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        const findAppointmentsInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentsInSameDate) {
            throw new AppError("This appointments is already booked.");
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
