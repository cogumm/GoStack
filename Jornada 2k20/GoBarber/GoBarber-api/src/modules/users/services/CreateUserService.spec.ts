import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

import CreateUserService from "./CreateUserService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

describe("Create User", () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();

        createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
    });

    it("should be able to create a new user", async () => {
        const user = await createUser.execute({
            name: "John Doe",
            email: "john@doe.com",
            password: "123456",
        });

        expect(user).toHaveProperty("id");
    });

    it("should not be able to create a new user with same email from another", async () => {
        await createUser.execute({
            name: "John Doe",
            email: "john@doe.com",
            password: "123456",
        });

        await expect(
            createUser.execute({
                name: "John Doe",
                email: "john@doe.com",
                password: "123456",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
