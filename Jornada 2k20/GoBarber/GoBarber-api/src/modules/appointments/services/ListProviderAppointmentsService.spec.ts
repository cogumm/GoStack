import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

import ListProviderAppointmentsService from "./ListProviderAppointmentsService";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointments: ListProviderAppointmentsService;

describe("List provider appointments service", () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();

        listProviderAppointments = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
            fakeCacheProvider,
        );
    });

    it("should be able to list the appointments on a specific day", async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: "provider",
            user_id: "user",
            date: new Date(2020, 9, 20, 14, 0, 0),
        });

        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: "provider",
            user_id: "user",
            date: new Date(2020, 9, 20, 15, 0, 0),
        });

        const appointments = await listProviderAppointments.execute({
            provider_id: "provider",
            year: 2020,
            month: 10,
            day: 20,
        });

        expect(appointments).toEqual([appointment1, appointment2]);
    });
});
