import { Request, Response } from "express";
import { container } from "tsyringe";

// Importando o services.
import CreateAppointmentService from "@modules/appointments/services/CreateAppointmentService";

export default class AppointmentController {
    public async create(req: Request, res: Response): Promise<Response> {
        const user_id = req.user.id;
        const { provider_id, date } = req.body;

        // Formatando a data.
        // const parsedDate = parseISO(date);

        const createAppointment = container.resolve(CreateAppointmentService);

        const appointment = await createAppointment.execute({
            date,
            provider_id,
            user_id,
        });

        return res.json(appointment);
    }
}
