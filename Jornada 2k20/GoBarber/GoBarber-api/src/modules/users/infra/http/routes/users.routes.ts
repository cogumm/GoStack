import { Router } from "express";
import { container } from "tsyringe";

import multer from "multer";

import uploadConfig from "@config/upload";

import CreateUserService from "@modules/users/services/CreateUserService";
import UpdateUserAvatarService from "@modules/users/services/UpdateUserAvatarService";

// Certificando se o usuário está autenticado.
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post("/", async (req, res) => {
    const { name, email, password } = req.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
        name,
        email,
        password,
    });

    // Não mostrando o campo senha.
    delete user.password;

    return res.json(user);
});

// Atualizar o avatar do usuário.
usersRouter.patch(
    "/avatar",
    ensureAuthenticated,
    upload.single("avatar"),
    async (req, res) => {
        // console.log(req.file);

        const updateUserAvatar = container.resolve(UpdateUserAvatarService);
        const user = await updateUserAvatar.execute({
            user_id: req.user.id,
            avatarFilename: req.file.fieldname,
        });

        // delete user.password;

        return res.json(user);
    },
);

export default usersRouter;
