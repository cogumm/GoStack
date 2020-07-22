import { getRepository } from "typeorm";

import { hash } from "bcryptjs";

import AppError from "@shared/errors/AppError";
import User from "../infra/typeorm/entities/User";

interface Request {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    public async execute({ name, email, password }: Request): Promise<User> {
        const usersRepository = getRepository(User);

        // Validando se existe um e-mail já criado.
        const checkUserExists = await usersRepository.findOne({
            where: { email },
        });

        if (checkUserExists) {
            throw new AppError("Email address already used.");
        }

        // Criptografando a senha.
        const hashedPassword = await hash(password, 8);

        // Criar o usuário
        const user = usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        await usersRepository.save(user);

        return user;
    }
}

export default CreateUserService;
