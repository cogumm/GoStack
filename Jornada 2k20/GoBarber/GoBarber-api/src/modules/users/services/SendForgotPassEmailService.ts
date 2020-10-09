import { injectable, inject } from "tsyringe";

import AppError from "@shared/errors/AppError";
import IUserRepository from "../repositories/IUsersRepository";
import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";
import IUserTokensRepository from "../repositories/IUserTokensRepository";

// import User from "../infra/typeorm/entities/User";

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
    ) { }

    public async execute({ email }: IRequest): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError("User does not exists.");
        }

        const { token } = await this.userTokensRepository.generate(user.id);

        await this.mailProvider.sendMail(
            email,
            `Pedido de recuperação de senha recebido, o seu Token é: ${token}`
        );
    }
}

export default SendForgotPassEmailService;
