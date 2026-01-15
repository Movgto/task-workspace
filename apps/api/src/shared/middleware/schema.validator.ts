import type { NextFunction, Request, Response } from "express";
import type { ZodObject } from "zod";

const validateSchema = (schema: ZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {        

        const result = schema.safeParse(req.body);

        if (!result.success) return res.status(400).json({
            errors: result.error.issues
        });

        next();
    }
}

export default validateSchema;