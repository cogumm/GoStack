import { Router } from "express";

import multer from "multer";

import uploadConfig from "../config/upload";

import CreateUserService from "../services/CreateUserService";
import UpdateUserAvatarService from "../services/UpdateUserAvatarService";

// Certificando se o usuário está autenticado.
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post("/", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const createUser = new CreateUserService();

        const user = await createUser.execute({
            name,
            email,
            password,
        });

        // Não mostrando o campo senha.
        delete user.password;

        return res.json(user);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

// Atualizar o avatar do usuário.
usersRouter.patch(
    "/avatar",
    ensureAuthenticated,
    upload.single("avatar"),
    async (req, res) => {
        // console.log(req.file);
        const updateUserAvatar = new UpdateUserAvatarService();
        try {
            const user = await updateUserAvatar.execute({
                user_id: req.user.id,
                avatarFilename: req.file.fieldname,
            });

            // delete user.password;

            return res.json(user);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },
);

export default usersRouter;
