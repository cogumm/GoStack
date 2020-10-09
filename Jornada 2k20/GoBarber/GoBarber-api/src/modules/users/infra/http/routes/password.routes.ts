import { Router } from "express";

import ForgotPassController from "../controllers/ForgotPassController";
import ResetPassController from "../controllers/ResetPassController";


const passRouter = Router();
const forgotPassController = new ForgotPassController();
const resetPassController = new ResetPassController();

passRouter.post("/forgot", forgotPassController.create);
passRouter.post("/reset", resetPassController.create);

export default passRouter;
