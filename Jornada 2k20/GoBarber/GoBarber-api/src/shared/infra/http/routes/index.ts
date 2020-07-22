import { Router } from "express";

import appointmentsRouter from "@modules/appointments/infra/http/routes/appointments.routes";
import usersRouter from "@modules/users/infra/http/routes/users.routes";
import sessionsRouter from "@modules/users/infra/http/routes/sessions.routes";

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
