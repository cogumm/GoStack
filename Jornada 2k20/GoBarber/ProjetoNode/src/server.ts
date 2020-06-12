import express from "express";
import routes from "./routes";

const server = express();

/**
 * Utilizando o express para converter o JSON em objeto do JS/TS.
 */
server.use(express.json());

/**
 * Rotas da aplicação.
 */
server.use(routes);

/**
 * Rodando o servidor back-end.
 */
server.listen(3001, () => {
    console.log("Servidor backend inicializado com sucesso na porta " + 3001);
});
