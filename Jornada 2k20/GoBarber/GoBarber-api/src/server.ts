import "reflect-metadata";

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import "express-async-errors";

import routes from "./routes";

import uploadConfig from "./config/upload";
import AppError from "./errors/AppError";

// Importando o database
import "./database";

const server = express();

server.use(cors());

/**
 * Utilizando o express para converter o JSON em objeto do JS/TS.
 */
server.use(express.json());

/**
 * Rota estática.
 */
server.use("/files", express.static(uploadConfig.directory));

/**
 * Rotas da aplicação.
 */
server.use(routes);

/**
 * Middleware para tratativa dos erros.
 */
server.use((err: Error, req: Request, res: Response, _: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            status: "error",
        });
    }

    console.error(err);

    return res.status(500).json({
        message: "Internal server error.",
        status: "error",
    });
});

/**
 * Rodando o servidor back-end.
 */
server.listen(3001, () => {
    console.log("Servidor backend inicializado com sucesso na porta " + 3001);
});
