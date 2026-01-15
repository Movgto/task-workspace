import type { UserDto } from "./dto/create-user.dto.js";
import type { IAuthService } from "./auth-service.interface.js";
import type { IPasswordEncoder } from "./password-encoder.interface.js";
import type { PrismaClient } from "@prisma/client/extension";
import type { LoginUserDto } from "./dto/login-user.dto.js";
import type { prisma } from "../db/prisma.js";
import { InvalidCredentialsError, UserNotFountError } from "./exceptions/index.js";

import jwt from 'jsonwebtoken'
import { env } from "prisma/config";

class AuthService implements IAuthService {
    constructor(private passwordEncoder: IPasswordEncoder, private prismaClient: typeof prisma) {
        console.log("AuthService created");

        this.registerUser = this.registerUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }

    async registerUser(userDto: UserDto) {
        const user = await this.prismaClient.user.create({
            data: {
                ...userDto,
                password: await this.passwordEncoder.encode(userDto.password)
            }
        })

        return user;
    }

    async loginUser(loginDto: LoginUserDto) {
        const user = await this.prismaClient.user.findUnique({ where: { email: loginDto.email } });

        if (!user) throw new UserNotFountError;

        const valid = await this.passwordEncoder.check(loginDto.password, user.password);

        if (!valid) throw InvalidCredentialsError;

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            env('JWT_SECRET'),
            { expiresIn: '5h' }
        )

        const { password, createdAt, updatedAt, ...rest } = user;

        return {
            token,
            user: rest
        }
    }
}

export default AuthService;