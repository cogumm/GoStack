import { Request, Response } from "express";
import { container } from "tsyringe";

import ResetPassService from "@modules/users/services/ResetPassService";

export default class ResetPassController {
    public async create(req: Request, res: Response): Promise<Response> {
        const { password, token } = req.body;

        const resetPass = container.resolve(ResetPassService);

        await resetPass.execute({
            password,
            token
        });

        return res.status(204).json();
    }
}
