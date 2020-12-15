import { injectable, inject } from "tsyringe";

import User from "@modules/users/infra/typeorm/entities/User";

import IUserRepository from "@modules/users/repositories/IUsersRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";

interface IRequest {
    user_id: string;
}

@injectable()
class ListProvidersService {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUserRepository,

        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({ user_id }: IRequest): Promise<User[]> {
        // Executando somente se não encontrar os usuários no cache.
        let users = await this.cacheProvider.recoverCache<User[]>(
            `providers-list:${user_id}`,
        );

        if (!users) {
            users = await this.usersRepository.findAllProviders({
                except_user_id: user_id,
            });

            console.log("Cheguei no console log da query no Redis.");

            // Salvando o cache para cada usuário da aplicação, sem o usuário logado.
            await this.cacheProvider.saveCache(
                `providers-list:${user_id}`,
                users,
            );
        }

        return users;
    }
}

export default ListProvidersService;
