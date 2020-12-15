import { injectable, inject } from "tsyringe";

import AppError from "@shared/errors/AppError";
import IUserRepository from "../repositories/IUsersRepository";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";

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

        @inject("HashProvider")
        private hashProvider: IHashProvider,

        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({ name, email, password }: IRequest): Promise<User> {
        // Validando se existe um e-mail já criado.
        const checkUserExists = await this.usersRepository.findByEmail(email);

        if (checkUserExists) {
            throw new AppError("Email address already used.");
        }

        // Criptografando a senha.
        const hashedPassword = await this.hashProvider.generateHash(password);

        // Criar o usuário
        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        // Invalidar quando um usuário é criado.
        await this.cacheProvider.invalidatePrefixCache("provider-list");

        return user;
    }
}

export default CreateUserService;
