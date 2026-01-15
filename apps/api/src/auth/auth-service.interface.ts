import type { User } from "../generated/prisma/client.js";
import type { UserDto } from "./dto/create-user.dto.js";
import type { LoginUserDto } from "./dto/login-user.dto.js";

export interface IAuthService {
    registerUser: (userDto: UserDto) => Promise<User>
    loginUser: (loginDto: LoginUserDto) => Promise<any>
}