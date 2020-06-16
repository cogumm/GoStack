import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import authConfig from "../config/auth";
import AppError from "../errors/AppError";

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    // Validação do Token JWT.
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AppError("JWT token is missing", 401);
    }

    // Separando o token
    const [, token] = authHeader.split(" ");

    try {
        const decoded = verify(token, authConfig.jwt.secret);

        const { sub } = decoded as TokenPayload;

        req.user = {
            id: sub,
        };

        // console.log(decoded);
        return next();
    } catch {
        throw new AppError("Invalid JST token", 401);
    }
}
