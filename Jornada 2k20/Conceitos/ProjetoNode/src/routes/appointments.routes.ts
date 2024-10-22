import { Router } from "express";
import { parseISO } from "date-fns";

// Importando o repositório.
import AppointmentsRepository from "../repositories/AppointmentsRepository";
// Importando o services.
import CreateAppointmentService from "../services/CreateAppointmentService";

const appointmentsRouter = Router();

const appointmentsRepository = new AppointmentsRepository();

appointmentsRouter.get("/", (req, res) => {
    const appointments = appointmentsRepository.all();

    return res.json(appointments);
});

appointmentsRouter.post("/", (req, res) => {
    try {
        const { provider, date } = req.body;

        // Formatando a data.
        const parsedDate = parseISO(date);

        const createAppointment = new CreateAppointmentService(
            appointmentsRepository,
        );

        const appointment = createAppointment.execute({
            provider,
            date: parsedDate,
        });

        return res.json(appointment);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

export default appointmentsRouter;
