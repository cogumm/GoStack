import { container } from "tsyringe";

import IStorageProvider from "./StorageProvider/models/IStorageProvider";
import DiskStorageProvider from "./StorageProvider/implementations/DiskStorageProvider";

import IMailProvider from "./MailProvider/models/IMailProvider";
import EtherealMailProvider from "./MailProvider/implementations/EtherealMailProvider";

container.registerSingleton<IStorageProvider>(
    "StorageProvider",
    DiskStorageProvider,
);

/**
 * Por alguma maneira quando usa o registerSingleton ele não está criando uma nova
 * instância do EtherealMailProvider.
 *
 * O registerInstance continua sendo um Singleton no node.
 */
container.registerInstance<IMailProvider>(
    "MailProvider",
    new EtherealMailProvider(),
);
