import { Router } from 'express';
import AuthService from './auth.service.js';
import AuthController from './auth.controller.js';
import BcryptEncoder from './bcrypt-encoder.js';
import { prisma } from '../db/prisma.js';
import validateSchema from '../shared/middleware/schema.validator.js';
import { userDtoSchema } from './dto/create-user.dto.js';
import { loginUserSchema } from './dto/login-user.dto.js';

const router = Router();

const authService = new AuthService(new BcryptEncoder(), prisma);

const authController = new AuthController(authService);

router.post('/register',
    validateSchema(userDtoSchema),
    authController.register
);

router.post('/login',
    validateSchema(loginUserSchema),
    authController.login
)

export default router;