import { injectable, inject } from "tsyringe";
import path from "path";

import AppError from "@shared/errors/AppError";
import IUserRepository from "../repositories/IUsersRepository";
import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";
import IUserTokensRepository from "../repositories/IUserTokensRepository";

interface IRequest {
    email: string;
}

@injectable()
class SendForgotPassEmailService {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUserRepository,

        @inject("MailProvider")
        private mailProvider: IMailProvider,

        @inject("UserTokensRepository")
        private userTokensRepository: IUserTokensRepository,
    ) {}

    public async execute({ email }: IRequest): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError("User does not exists.");
        }

        const { token } = await this.userTokensRepository.generate(user.id);

        // Importando o template da recureção de senha.
        const forgotPassTemplate = path.resolve(
            __dirname,
            "..",
            "templates",
            "forgot_password.hbs",
        );

        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: "[GoBarber] Recuperação de senha!",
            templateData: {
                file: forgotPassTemplate,
                variables: {
                    name: user.name,
                    link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
                },
            },
        });
    }
}

export default SendForgotPassEmailService;
