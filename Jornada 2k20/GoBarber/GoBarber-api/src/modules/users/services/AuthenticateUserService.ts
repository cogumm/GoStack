import { sign } from "jsonwebtoken";
import authConfig from "@config/auth";
import { injectable, inject } from "tsyringe";

import AppError from "@shared/errors/AppError";
import IUsersRepository from "../repositories/IUsersRepository";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";

import User from "../infra/typeorm/entities/User";

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

@injectable()
export default class AuthenticateUserService {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

        @inject("HashProvider")
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        // Validar o e-mail se é um e-mail válido.
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError("Incorrect email/password combination.", 401);
        }

        // Validando a senha com o usuário.
        const passwordMatched = await this.hashProvider.compareHash(
            password,
            user.password,
        );

        if (!passwordMatched) {
            throw new AppError("Incorrect email/password combination.", 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        // Se passou o usuário foi autenticado.
        return {
            user,
            token,
        };
    }
}
