import { Request, Response } from "express";
import { container } from "tsyringe";

import ListProviderDayAvailabilityService from "@modules/appointments/services/ListProviderDayAvailabilityService";

export default class ProviderMonthAvailabilityController {
    public async index(req: Request, res: Response): Promise<Response> {
        const { provider_id } = req.params;
        const { day, month, year } = req.query;

        const listProviderDayAvailabilityService = container.resolve(
            ListProviderDayAvailabilityService,
        );

        const availability = await listProviderDayAvailabilityService.execute({
            provider_id,
            day: Number(day),
            month: Number(month),
            year: Number(year),
        });

        return res.json(availability);
    }
}
