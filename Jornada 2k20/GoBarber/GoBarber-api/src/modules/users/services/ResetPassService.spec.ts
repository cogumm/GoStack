import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import ResetPassService from "./ResetPassService";

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPass: ResetPassService;

describe("Reset pass service", () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPass = new ResetPassService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider
        );
    });

    it("should be able to reset the password", async () => {
        const user = await fakeUsersRepository.create({
            name: "Jhon Doe",
            email: "john@doe.com",
            password: "123456"
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHashe = jest.spyOn(fakeHashProvider, "generateHash");

        await resetPass.execute({
            password: "121212",
            token,
        });

        const updateUser = await fakeUsersRepository.findById(user.id);

        expect(generateHashe).toHaveBeenCalledWith("121212");
        expect(updateUser?.password).toBe("121212");
    });

    it("should be able to reset the password with non-existing token", async () => {
        await expect(
            resetPass.execute({
                token: "non-existing-token",
                password: "121212",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should be able to reset the password with non-existing user", async () => {
        const { token } = await fakeUserTokensRepository.generate("non-existing-user");

        await expect(
            resetPass.execute({
                token,
                password: "121212",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should be able to reset password if passed more than 2 hours", async () => {
        const user = await fakeUsersRepository.create({
            name: "Jhon Doe",
            email: "john@doe.com",
            password: "123456"
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPass.execute({
                password: "121212",
                token,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
