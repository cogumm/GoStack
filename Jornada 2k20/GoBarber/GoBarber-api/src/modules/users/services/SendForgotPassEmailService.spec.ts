import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";
import SendForgotPassEmailService from "./SendForgotPassEmailService";

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPassEmail: SendForgotPassEmailService;

describe("Send forgot pass email", () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        sendForgotPassEmail = new SendForgotPassEmailService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeUserTokensRepository,
        );
    });


    it("should be able to recover the password using the email", async () => {
        const sendMail = jest.spyOn(fakeMailProvider, "sendMail");

        await fakeUsersRepository.create({
            name: "Jhon Doe",
            email: "john@doe.com",
            password: "123456"
        });

        await sendForgotPassEmail.execute({
            email: "john@doe.com",
        });

        await expect(sendMail).toHaveBeenCalled();
    });

    it("should be abele to recover a non-existing user password", async () => {
        await expect(
            sendForgotPassEmail.execute({
                email: "john@doe.com",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should generate a forget password token", async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, "generate");

        const user = await fakeUsersRepository.create({
            name: "Jhon Doe",
            email: "john@doe.com",
            password: "123456"
        });

        await sendForgotPassEmail.execute({
            email: "john@doe.com",
        });

        await expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});
