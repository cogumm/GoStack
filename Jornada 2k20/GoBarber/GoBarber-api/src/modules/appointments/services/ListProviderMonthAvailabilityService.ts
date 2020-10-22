import { injectable, inject } from "tsyringe";

import IAppointmentRepository from "../repositories/IAppointmentRepository";
// import User from "@modules/users/infra/typeorm/entities/User";

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
        @inject('AppointmentRepository')
        private appointmentsRepository: IAppointmentRepository,
    ) { }

    public async execute({ provider_id, month, year }: IRequest): Promise<IResponse> {
        const appointment = await this.appointmentsRepository.findAllInMonthFromProvider({
            provider_id,
            year,
            month,
        });

        console.log(appointment);

        return [{ day: 1, available: false }];
    }
}

export default ListProviderMonthAvailabilityService;
