import { Router } from "express";
import multer from "multer";
import uploadConfig from "@config/upload";
import { celebrate, Segments, Joi } from "celebrate";

import UsersController from "../controllers/UsersController";
import UserAvatarController from "../controllers/UserAvatarController";

// Certificando se o usuário está autenticado.
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const usersRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig.multer);

usersRouter.post(
    "/",
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        },
    }),
    usersController.create,
);

// Atualizar o avatar do usuário.
usersRouter.patch(
    "/avatar",
    ensureAuthenticated,
    upload.single("avatar"),
    userAvatarController.update,
);

export default usersRouter;
