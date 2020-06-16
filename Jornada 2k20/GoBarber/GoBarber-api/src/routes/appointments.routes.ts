import { Router } from "express";
import { getCustomRepository } from "typeorm";
import { parseISO } from "date-fns";

// Importando o repositório.
import AppointmentsRepository from "../repositories/AppointmentsRepository";
// Importando o services.
import CreateAppointmentService from "../services/CreateAppointmentService";
// Certificando se o usuário está autenticado.
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get("/", async (req, res) => {
    // console.log(req.user);
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointments = await appointmentsRepository.find();

    return res.json(appointments);
});

appointmentsRouter.post("/", async (req, res) => {
    try {
        const { provider_id, date } = req.body;

        // Formatando a data.
        const parsedDate = parseISO(date);

        const createAppointment = new CreateAppointmentService();

        const appointment = await createAppointment.execute({
            provider_id,
            date: parsedDate,
        });

        return res.json(appointment);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

export default appointmentsRouter;
