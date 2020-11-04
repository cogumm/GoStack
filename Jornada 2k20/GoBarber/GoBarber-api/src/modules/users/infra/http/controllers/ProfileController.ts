import { Request, Response } from "express";
import { container } from "tsyringe";

import UpdateProfileService from "@modules/users/services/UpdateProfileService";
import ShowProfileService from "@modules/users/services/ShowProfileService";

export default class ProfileController {
    // Mostrando o perfil do usuário
    public async show(req: Request, res: Response): Promise<Response> {
        const user_id = req.user.id;

        const showProfile = container.resolve(ShowProfileService);

        const user = await showProfile.execute({ user_id });

        delete user.password;

        return res.json(user);
    }

    // Atualizando o perfil do usuário
    public async update(req: Request, res: Response): Promise<Response> {
        const user_id = req.user.id;
        const { name, email, old_password, password } = req.body;

        const updateProfile = container.resolve(UpdateProfileService);

        const user = await updateProfile.execute({
            user_id,
            name,
            email,
            old_password,
            password,
        });

        delete user.password;

        return res.json(user);
    }
}