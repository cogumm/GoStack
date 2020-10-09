import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import ShowProfileService from "./ShowProfileService";

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe("Show Profile", () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        showProfile = new ShowProfileService(fakeUsersRepository);
    });

    it("should be able to show the profile", async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "john@doe.com",
            password: "123456",
        });

        const profile = await showProfile.execute({
            user_id: user.id,
        });

        expect(profile.name).toBe("John Doe");
        expect(profile.email).toBe("john@doe.com");
    });

    it("should be not able to show the profile from non-existing user", async () => {
        expect(
            showProfile.execute({
                user_id: "non-existing-user-id",
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
