import { Router } from "express";

// Certificando se o usuário está autenticado.
import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";

import AppointmentsController from "../controllers/AppointmentsController";
import ProviderAppointmentsController from "../controllers/ProviderAppointmentsController";

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

/* appointmentsRouter.get("/", async (req, res) => {
    // console.log(req.user);
    const appointments = await appointmentsRepository.find();

    return res.json(appointments);
}); */

appointmentsRouter.post("/", appointmentsController.create);

appointmentsRouter.post("/me", providerAppointmentsController.index);

export default appointmentsRouter;
