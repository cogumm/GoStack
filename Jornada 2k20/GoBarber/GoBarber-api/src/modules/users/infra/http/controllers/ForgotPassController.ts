import { Request, Response } from "express";
import { container } from "tsyringe";

import SendForgotPassEmailService from "@modules/users/services/SendForgotPassEmailService";

export default class ForgotPasswordController {
    public async create(req: Request, res: Response): Promise<Response> {
        const { email } = req.body;

        const sendForgotPassEmailService = container.resolve(
            SendForgotPassEmailService,
        );

        await sendForgotPassEmailService.execute({
            email,
        });

        return res.status(204).json();
    }
}
