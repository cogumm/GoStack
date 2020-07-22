import { Router } from "express";

// Certificando se o usuário está autenticado.
import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";

import AppointmentsController from "../controllers/AppointmentsController";

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

/* appointmentsRouter.get("/", async (req, res) => {
    // console.log(req.user);
    const appointments = await appointmentsRepository.find();

    return res.json(appointments);
}); */

appointmentsRouter.post("/", appointmentsController.create);

export default appointmentsRouter;
