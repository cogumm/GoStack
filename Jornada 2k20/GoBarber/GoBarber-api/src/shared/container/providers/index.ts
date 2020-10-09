import { container } from "tsyringe";

import IStorageProvider from "./StorageProvider/models/IStorageProvider";
import DiskStorageProvider from "./StorageProvider/implementations/DiskStorageProvider";

import IMailProvider from "./MailProvider/models/IMailProvider";
import EtherealMailProvider from "./MailProvider/implementations/EtherealMailProvider";

import IMailTemplateProvider from "./MailTemplateProvider/models/IMailTemplateProvider";
import HandlebarsMailTemplateProvider from "./MailTemplateProvider/implementations/HandlebarsMailTemplateProvider";

container.registerSingleton<IStorageProvider>(
    "StorageProvider",
    DiskStorageProvider,
);

container.registerSingleton<IMailTemplateProvider>(
    "MailTemplateProvider",
    HandlebarsMailTemplateProvider,
);

/**
 * Por alguma maneira quando usa o registerSingleton ele não está criando uma nova
 * instância do EtherealMailProvider.
 *
 * O registerInstance continua sendo um Singleton no node.
 */
container.registerInstance<IMailProvider>(
    "MailProvider",
    container.resolve(EtherealMailProvider),
);

