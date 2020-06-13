import { Router } from "express";
import { startOfHour, parseISO } from "date-fns";

// Importando o repositório.
import AppointmentsRepository from "../repositories/AppointmentsRepository";

// Rota
const appointmentsRouter = Router();

const appointmentsrepository = new AppointmentsRepository();

appointmentsRouter.post("/", (req, res) => {
    const { provider, date } = req.body;

    // Formatando a data.
    const parsedDate = startOfHour(parseISO(date));

    const findAppointmentsInSameDate = appointmentsrepository.findByDate(
        parsedDate,
    );

    if (findAppointmentsInSameDate) {
        return res
            .status(400)
            .json({ message: "This appointments is already booked." });
    }

    const appointment = appointmentsrepository.create(provider, parsedDate);

    return res.json(appointment);
});

export default appointmentsRouter;
