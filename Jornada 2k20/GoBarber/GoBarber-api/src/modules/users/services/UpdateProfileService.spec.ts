import AppError from "@shared/errors/AppError";
// import AppError from "@shared/errors/AppError";

import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import UpdateProfileService from "./UpdateProfileService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe("Update Profile", () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfile = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it("should be able to update the profile", async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "john@doe.com",
            password: "123456",
        });

        const updateUser = await updateProfile.execute({
            user_id: user.id,
            name: "John Snow",
            email: "john@snow.com"
        });

        await expect(updateUser.name).toBe("John Snow");
        await expect(updateUser.email).toBe("john@snow.com");
    });

    it("should not be able to change to another user email", async () => {
        await fakeUsersRepository.create({
            name: "John Doe",
            email: "john@doe.com",
            password: "123456",
        });

        const user = await fakeUsersRepository.create({
            name: "Teste",
            email: "test@doe.com",
            password: "123456",
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: "John Doe",
                email: "john@doe.com"
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should be able to update the password", async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "john@doe.com",
            password: "123456",
        });

        const updateUser = await updateProfile.execute({
            user_id: user.id,
            name: "John Snow",
            email: "john@snow.com",
            old_password: "123456",
            password: "123123"
        });

        expect(updateUser.password).toBe("123123");
    });

    it("should not be able to update the password without old password", async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "john@doe.com",
            password: "123456",
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: "John Snow",
                email: "john@snow.com",
                password: "123123"
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to update the password with wrong old password", async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "john@doe.com",
            password: "123456",
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: "John Snow",
                email: "john@snow.com",
                old_password: "wrong-old-pass",
                password: "123123"
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
