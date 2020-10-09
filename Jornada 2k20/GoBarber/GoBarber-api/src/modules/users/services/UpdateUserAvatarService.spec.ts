import AppError from "@shared/errors/AppError";

import FakeStorageProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import UpdateUserAvatarService from "./UpdateUserAvatarService";

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe("Update User Avatar", () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();

        updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );
    });

    it("should be able to create a new user", async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "john@doe.com",
            password: "123456",
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: "avatar.jpg",
        });

        expect(user.avatar).toBe("avatar.jpg");
    });

    it("should not be able to update avatar from non existing user", async () => {
        await expect(
            updateUserAvatar.execute({
                user_id: "non-existing-user",
                avatarFilename: "avatar.jpg",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should delete old avatar when updating new one", async () => {
        // Retornando a função de espionar do jest.
        const deleteFile = jest.spyOn(fakeStorageProvider, "deleteFile");

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "john@doe.com",
            password: "123456",
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: "avatar.jpg",
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: "avatar2.jpg",
        });

        await expect(deleteFile).toHaveBeenCalledWith("avatar.jpg");
        await expect(user.avatar).toBe("avatar2.jpg");
    });
});
