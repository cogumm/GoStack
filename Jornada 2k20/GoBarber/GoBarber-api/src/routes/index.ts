import { Router } from "express";

import appointmentsRouter from "./appointments.routes";
import usersRouter from "./users.routes";
import sessionsRouter from "./sessions.routes";

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

/**
 * Rota de usuários.
 */
routes.use("/users", usersRouter);

/**
 * Rota de sessões.
 */
routes.use("/sessions", sessionsRouter);

export default routes;
