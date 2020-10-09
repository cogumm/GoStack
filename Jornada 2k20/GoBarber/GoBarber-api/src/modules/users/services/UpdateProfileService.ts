import { injectable, inject } from "tsyringe";

import AppError from "@shared/errors/AppError";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";
import IUserRepository from "../repositories/IUsersRepository";

import User from "../infra/typeorm/entities/User";

interface IRequest {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
class UpdateProfileService {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUserRepository,

        @inject("HashProvider")
        private hashProvider: IHashProvider,
    ) { }

    public async execute({ user_id, name, email, old_password, password }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);
        if (!user) {
            throw new AppError("User not found");
        }

        // Verificando se o e-mail informado não está sendo utilizado por outro usuário
        const userWithUpdateEmail = await this.usersRepository.findByEmail(email);
        if (userWithUpdateEmail && userWithUpdateEmail.id !== user_id) {
            throw new AppError("E-mail already in use.")
        }

        user.name = name;
        user.email = email;

        // Verificando se a senha "antiga" existe
        if (password && !old_password) {
            throw new AppError("You need to inform the old password to set a new password.");
        }

        // Atualizando a senha
        if (password && old_password) {
            // Comparando a senha antiga com a senha informada
            const checkOldPass = await this.hashProvider.compareHash(
                old_password,
                user.password,
            );
            if (!checkOldPass) {
                throw new AppError("Old password does not match.");
            }


            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.save(user);
    }
}

export default UpdateProfileService;
