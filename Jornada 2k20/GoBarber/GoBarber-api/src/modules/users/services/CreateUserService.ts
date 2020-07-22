import { hash } from "bcryptjs";
import { injectable, inject } from "tsyringe";

import AppError from "@shared/errors/AppError";
import IUserRepository from "../repositories/IUsersRepository";

import User from "../infra/typeorm/entities/User";

interface IRequest {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUserRepository,
    ) {}

    public async execute({ name, email, password }: IRequest): Promise<User> {
        // Validando se existe um e-mail já criado.
        const checkUserExists = await this.usersRepository.findByEmail(email);

        if (checkUserExists) {
            throw new AppError("Email address already used.");
        }

        // Criptografando a senha.
        const hashedPassword = await hash(password, 8);

        // Criar o usuário
        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        return user;
    }
}

export default CreateUserService;
