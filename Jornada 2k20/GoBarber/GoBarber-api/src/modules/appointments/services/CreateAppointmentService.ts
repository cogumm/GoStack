import { startOfHour, isBefore, getHours, format } from "date-fns";
import { injectable, inject } from "tsyringe";

import AppError from "@shared/errors/AppError";

import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import Appointment from "../infra/typeorm/entities/Appointment";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

interface IRequest {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
export default class CreateAppointmentService {
    constructor(
        @inject("AppointmentsRepository")
        private appointmentsRepository: IAppointmentsRepository,

        @inject("NotificationsRepository")
        private notificationsRepository: INotificationsRepository,

        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({
        date,
        provider_id,
        user_id,
    }: IRequest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        // Verificando para não poder agendar em um horário que já passou
        if (isBefore(appointmentDate, Date.now())) {
            throw new AppError(
                "You can't create an appointemnt on a past date.",
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
                "You can only create appointments between 8am and 5pm.",
            );
        }

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
            provider_id,
        );

        if (findAppointmentInSameDate) {
            throw new AppError("This appointment is already booked");
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            user_id,
            date: appointmentDate,
        });

        // Formatando a data.
        const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'at' HH:mm");

        // Enviando a notificação para o servidor.
        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `New schedule for the day ${dateFormatted}h`,
        });

        // Invalidando o cache quando for criando um novo agendamento.
        await this.cacheProvider.invalidateCache(
            `provider-appointments:${provider_id}:${format(
                appointmentDate,
                "yyyy-M-d",
            )}`,
        );

        return appointment;
    }
}
