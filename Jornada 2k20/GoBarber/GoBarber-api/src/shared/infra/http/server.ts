import "dotenv/config";
import "reflect-metadata";
import "express-async-errors";

import cors from "cors";
import { errors } from "celebrate";
import express, { Request, Response, NextFunction } from "express";

import routes from "./routes";

import rateLimiter from "./middlewares/rateLimiter";

import uploadConfig from "@config/upload";
import AppError from "@shared/errors/AppError";

// Importando o database
import "@shared/infra/typeorm";
// Importando o container
import "@shared/container";

const server = express();

/**
 * Express rate limit.
 */
server.use(rateLimiter);

/**
 * Ativando o CORS da aplicação.
 */
server.use(cors());

/**
 * Utilizando o express para converter o JSON em objeto do JS/TS.
 */
server.use(express.json());

/**
 * Rota estática.
 */
server.use("/files", express.static(uploadConfig.uploadsFolder));

/**
 * Rotas da aplicação.
 */
server.use(routes);

/**
 * Mensagens de erros do Celebrate.
 */
server.use(errors());

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
server.listen(process.env.APP_PORT || 3000, () => {
    console.log(
        "Servidor backend inicializado com sucesso na porta " +
            process.env.APP_PORT || 3000,
    );
});
