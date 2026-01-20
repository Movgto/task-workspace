import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { JwtUtils } from "../utils/jwt.utils.js";
import { prisma } from "../../db/prisma.js";
import type { User } from "../../generated/prisma/client.js";

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

const jwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Missing or invalid credentials'
        })
    }

    try {
        const token = authHeader.split(' ')[1];

        if (!token) return res.status(401).json({
            error: 'Missing or invalid credentials'
        })

        const decoded = JwtUtils.verify(token) as any;

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: decoded.id
            }
        })        

        req.user = user;

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                error: 'The token has expired'
            })
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                error: 'The token is not valid'
            })
        }

        return res.status(401).json({
            error: 'Unauthorized'
        })
    }
}

export default jwtAuthMiddleware;