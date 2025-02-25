import AppError from "@shared/errors/AppError";

import FakeNotificationsRepository from "@modules/notifications/repositories/fakes/FakesNotificationsRepository";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

import CreateAppointmentService from "./CreateAppointmentService";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;
let fakeCacheProvider: FakeCacheProvider;

describe("Create Appointment", () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        fakeCacheProvider = new FakeCacheProvider();

        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotificationsRepository,
            fakeCacheProvider,
        );
    });

    it("should be able to create a new appointment", async () => {
        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            return new Date(2020, 9, 10, 10).getTime();
        });

        const appointment = await createAppointment.execute({
            date: new Date(2020, 9, 10, 13),
            user_id: "user-id",
            provider_id: "provider-id",
        });

        expect(appointment).toHaveProperty("id");
        expect(appointment.provider_id).toBe("provider-id");
    });

    it("should not be able to create two appointments on the same time", async () => {
        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            return new Date(2020, 9, 10, 10).getTime();
        });

        const appointmentData = new Date(2020, 9, 10, 13);

        await createAppointment.execute({
            date: appointmentData,
            user_id: "user-id",
            provider_id: "provider-id",
        });

        // Verificando como retornar um "erro"
        await expect(
            createAppointment.execute({
                date: appointmentData,
                user_id: "user-id",
                provider_id: "provider-id",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create an appointment on a past date", async () => {
        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            return new Date(2020, 9, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 9, 10, 11),
                user_id: "user-id",
                provider_id: "provider-id",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create an appointment with same user as provider", async () => {
        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            return new Date(2020, 9, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 9, 10, 13),
                user_id: "user-id",
                provider_id: "user-id",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create an appointment before 8am and after 5pm", async () => {
        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            return new Date(2020, 9, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 9, 11, 7),
                user_id: "user-id",
                provider_id: "provider-id",
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointment.execute({
                date: new Date(2020, 9, 11, 18),
                user_id: "user-id",
                provider_id: "provider-id",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
