import { getRepository } from "typeorm";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import authConfig from "../config/auth";

import User from "../models/User";

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

class AuthenticateUserService {
    public async execute({ email, password }: Request): Promise<Response> {
        // Validar o e-mail se é um e-mail válido.
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new Error("Incorrect email/password combination.");
        }

        // Validando a senha com o usuário.
        const passwordMatched = await compare(password, user.password);
        if (!passwordMatched) {
            throw new Error("Incorrect email/password combination.");
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

export default AuthenticateUserService;
