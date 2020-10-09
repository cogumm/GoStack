import { Router } from "express";

import appointmentsRouter from "@modules/appointments/infra/http/routes/appointments.routes";
import usersRouter from "@modules/users/infra/http/routes/users.routes";
import sessionsRouter from "@modules/users/infra/http/routes/sessions.routes";
import passwordRouter from "@modules/users/infra/http/routes/password.routes";
import profileRouter from "@modules/users/infra/http/routes/profile.routes";

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

/**
 * Rota para resetar e esqueci senha
 */
routes.use("/password", passwordRouter);

/**
 * Rota do perfil.
 */
routes.use("/profile", profileRouter);

export default routes;
