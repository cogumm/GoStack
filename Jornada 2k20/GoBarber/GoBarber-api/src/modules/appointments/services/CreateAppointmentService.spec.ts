import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import CreateAppointmentService from "./CreateAppointmentService";
import AppError from "@shared/errors/AppError";

describe("Create Appointment", () => {
    it("should be able to create a new appointment", async () => {
        // expect(1 + 2).toBe(3);
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: "123456",
        });

        expect(appointment).toHaveProperty("id");
        expect(appointment.provider_id).toBe("123456");
    });

    it("should not be able to create two appointments on the same time", async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointmentData = new Date(2020, 7, 31, 18);

        await createAppointment.execute({
            date: appointmentData,
            provider_id: "123456",
        });

        // Verificando como retornar um "erro"
        await expect(
            createAppointment.execute({
                date: appointmentData,
                provider_id: "123456",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
