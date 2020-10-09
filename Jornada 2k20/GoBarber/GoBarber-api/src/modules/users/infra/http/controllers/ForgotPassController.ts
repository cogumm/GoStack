import { Request, Response } from "express";
import { container } from "tsyringe";

import SendForgotPassEmailService from "@modules/users/services/SendForgotPassEmailService";

export default class SendForgotPassController {
    public async create(req: Request, res: Response): Promise<Response> {
        const { email } = req.body;

        const sendForgotPassEmail = container.resolve(
            SendForgotPassEmailService,
        );

        await sendForgotPassEmail.execute({
            email,
        });

        return res.status(204).json();
    }
}
