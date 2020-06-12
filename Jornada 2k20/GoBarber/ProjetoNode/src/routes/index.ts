import { Router } from "express";
import appointmentsRouter from "./appointments.routes";

const routes = Router();

/**
 * Rota /
 */
routes.get("/", (req, res) => {
    return res.json({
        app: "GoBarbet 2k20",
        author: 'Gabriel "CoGUMm" Vilar',
        mail: "gabriel@cogumm.net",
    });
});

/**
 * Rota de agendamento.
 */
routes.use("/appointments", appointmentsRouter);

export default routes;
