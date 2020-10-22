import { injectable, inject } from "tsyringe";
import { getDaysInMonth, getDate } from "date-fns";

import IAppointmentRepository from "../repositories/IAppointmentRepository";

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
}

type IResponse = Array<{
    day: number;
    available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentRepository,
    ) { }

    public async execute({ provider_id, month, year }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
            provider_id,
            year,
            month,
        });
        // console.log(appointments);

        // Número de dias nesse mês / ano
        const numberOfDaysInMonth = getDaysInMonth(
            new Date(year, month - 1)
        );

        // Para cada mês o seus dias
        const eachDayArray = Array.from(
            { length: numberOfDaysInMonth },
            ( _, index ) => index + 1,
        );
        // console.log(eachDayArray);

        const availability = eachDayArray.map( day => {
            // Verifica se existe algum agendamento nesse dia em expecífico
            const appointmentsInDay = appointments.filter( appointment => {
                return getDate(appointment.date) === day;
            });

            return {
                day,
                available: appointmentsInDay.length < 10,
            };
        });

        return availability;
    }
}

export default ListProviderMonthAvailabilityService;
