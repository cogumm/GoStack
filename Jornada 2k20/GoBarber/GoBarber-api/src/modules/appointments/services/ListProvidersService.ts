import { injectable, inject } from "tsyringe";

import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";

import User from "@modules/users/infra/typeorm/entities/User";
import { classToClass } from "class-transformer";

interface IRequest {
    user_id: string;
}

@injectable()
export default class ListProvidersService {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({ user_id }: IRequest): Promise<User[]> {
        // Executando somente se não encontrar os usuários no cache.
        let users = await this.cacheProvider.recoverCache<User[]>(
            `providers-list:${user_id}`,
        );

        // Se não conseguir encontrar armazena os usuários novamente.
        if (!users) {
            users = await this.usersRepository.findAllProviders({
                except_user_id: user_id,
            });

            // console.log("Cheguei no console log da query no Redis.");

            // Salvando o cache para cada usuário da aplicação, sem o usuário logado.
            await this.cacheProvider.saveCache(
                `providers-list:${user_id}`,
                classToClass(users),
            );
        }

        return users;
    }
}
