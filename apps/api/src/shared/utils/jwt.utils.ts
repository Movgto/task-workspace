import jwt from 'jsonwebtoken';
import { isValidJWT } from 'zod/v4/core';

export class JwtUtils {
    static verify(token: string) {
        return jwt.verify(token, process.env.JWT_SECRET!);        
    }
}