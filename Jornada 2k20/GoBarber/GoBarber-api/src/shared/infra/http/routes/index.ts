import { Router } from "express";

import usersRouter from "@modules/users/infra/http/routes/users.routes";
import sessionsRouter from "@modules/users/infra/http/routes/sessions.routes";
import passwordRouter from "@modules/users/infra/http/routes/password.routes";
import profileRouter from "@modules/users/infra/http/routes/profile.routes";
import appointmentsRouter from "@modules/appointments/infra/http/routes/appointments.routes";
import providersRouter from "@modules/appointments/infra/http/routes/providers.routes";

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
 * Rota de sessões.
 */
routes.use("/sessions", sessionsRouter);

/**
 * Rota de usuários.
 */
routes.use("/users", usersRouter);

/**
 * Rota para resetar e esqueci senha
 */
routes.use("/password", passwordRouter);

/**
 * Rota do perfil.
 */
routes.use("/profile", profileRouter);

/**
 * Rota de agendamento.
 */
routes.use("/appointments", appointmentsRouter);

/**
 * Rota para listar os prestadores de serviço.
 */
routes.use("/providers", providersRouter);

export default routes;
