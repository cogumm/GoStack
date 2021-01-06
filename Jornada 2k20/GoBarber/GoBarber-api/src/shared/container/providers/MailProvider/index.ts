import { container } from "tsyringe";
import mailConfig from "@config/mail";

import IMailProvider from "./models/IMailProvider";

import EtherealMailProvider from "./implementations/EtherealMailProvider";
import SESMailProvider from "./implementations/SESMailProvider";

const providers = {
    ethereal: container.resolve(EtherealMailProvider),
    ses: container.resolve(SESMailProvider),
};

/**
 * Por alguma maneira quando usa o registerSingleton ele não está criando uma nova
 * instância do EtherealMailProvider.
 *
 * O registerInstance continua sendo um Singleton no node.
 */
container.registerInstance<IMailProvider>(
    "MailProvider",
    // Verificando de qual driver está sendo utilizado para enviar o e-mail.
    providers[mailConfig.driver],
);
