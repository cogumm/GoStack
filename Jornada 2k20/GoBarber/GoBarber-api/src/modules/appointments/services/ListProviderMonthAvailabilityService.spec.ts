import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import ListProviderMonthAvailabilityService from "./ListProviderMonthAvailabilityService";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe("List Provider month availability", () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(fakeAppointmentsRepository);
    });

    it("should be able to list the month availability from provider", async () => {
        await fakeAppointmentsRepository.create({
            provider_id: "user",
            date: new Date(2020, 9, 20, 8, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: "user",
            date: new Date(2020, 10, 21, 8, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: "user",
            date: new Date(2020, 10, 21, 10, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: "user",
            date: new Date(2020, 10, 20, 8, 0, 0),
        });

        const available = await listProviderMonthAvailabilityService.execute({
            provider_id: "user",
            year: 2020,
            month: 11,
        });

        expect(available).toEqual(
            expect.arrayContaining([
                { day: 19, availability: true },
                { day: 20, availability: false },
                { day: 21, availability: false },
                { day: 22, availability: true },
            ])
        );
    });
});
