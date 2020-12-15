import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import AuthenticateUserService from "./AuthenticateUserService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe("Authenticate User", () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it("should be able to authenticate", async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "john@doe.com",
            password: "123456",
        });

        const response = await authenticateUser.execute({
            email: "john@doe.com",
            password: "123456",
        });

        await expect(response).toHaveProperty("token");
        await expect(response.user).toEqual(user);
    });

    it("should not be able to authenticate with non existing user", async () => {
        await expect(
            authenticateUser.execute({
                email: "john@doe.com",
                password: "123456",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to authenticate with wrong password", async () => {
        await fakeUsersRepository.create({
            name: "John Doe",
            email: "john@doe.com",
            password: "123456",
        });

        await expect(
            authenticateUser.execute({
                email: "john@doe.com",
                password: "wrong-password",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
