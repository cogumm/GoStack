import { Request, Response } from "express";
import { container } from "tsyringe";

import ListProvidersService from "@modules/appointments/services/ListProvidersService";

export default class ProviersController {
    public async index(req: Request, res: Response): Promise<Response> {
        const { user_id } = req.body;

        const listProviders = container.resolve(ListProvidersService);

        const providers = await listProviders.execute({
            user_id,
        });

        return res.json(providers);
    }
}
