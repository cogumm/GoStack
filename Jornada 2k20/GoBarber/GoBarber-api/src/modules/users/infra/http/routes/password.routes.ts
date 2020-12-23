import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import ForgotPassController from "../controllers/ForgotPassController";
import ResetPassController from "../controllers/ResetPassController";

const passRouter = Router();
const forgotPassController = new ForgotPassController();
const resetPassController = new ResetPassController();

passRouter.post(
    "/forgot",
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
        },
    }),
    forgotPassController.create,
);

passRouter.post(
    "/reset",
    celebrate({
        [Segments.BODY]: {
            token: Joi.string().uuid().required(),
            password: Joi.string().required(),
            // Validando se o campo "password_confirmation" é igual ao "password".
            password_confirmation: Joi.string()
                .required()
                .valid(Joi.ref("password")),
        },
    }),
    resetPassController.create,
);

export default passRouter;
