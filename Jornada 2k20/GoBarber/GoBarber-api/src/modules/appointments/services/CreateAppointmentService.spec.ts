import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import CreateAppointmentService from "./CreateAppointmentService";
import AppError from "@shared/errors/AppError";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe("Create Appointment", () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );
    });

    it("should be able to create a new appointment", async () => {
        const appointment = await createAppointment.execute({
            date: new Date(),
            user_id: "user",
            provider_id: "123456",
        });

        await expect(appointment).toHaveProperty("id");
        await expect(appointment.provider_id).toBe("123456");
    });

    it("should not be able to create two appointments on the same time", async () => {
        const appointmentData = new Date(2020, 7, 31, 18);

        await createAppointment.execute({
            date: appointmentData,
            user_id: "user",
            provider_id: "123456",
        });

        // Verificando como retornar um "erro"
        await expect(
            createAppointment.execute({
                date: appointmentData,
                user_id: "user",
                provider_id: "123456",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
