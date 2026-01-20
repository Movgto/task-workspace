import type { Request, Response } from "express";
import type { IAuthService } from "./auth-service.interface.js";
import { InvalidCredentialsError, UserNotFountError } from "./exceptions/index.js";

class AuthController {
    constructor(private authService: IAuthService) {
        console.log("Auth Controller created");
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }

    async register(req: Request, res: Response) {
        try {
            const user = await this.authService.registerUser(req.body); // This should be validated with a middleware.        

            return res.status(201).json({
                message: "A new user has been registered!",
                userId: user.id
            })
        } catch (error) {
            console.error(error);
            return res.status(500).send("Error");
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { refreshToken, ...rest } = await this.authService.loginUser(req.body);

            res.cookie('refreshToken', refreshToken,
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                }
            );

            return res.status(200).json(rest);
        } catch (error) {
            if (error instanceof UserNotFountError) {
                return res.status(404).json({
                    error: "User not found"
                })
            }

            if (error instanceof InvalidCredentialsError) {
                return res.status(401).json({
                    error: "Credentials are not valid"
                })
            }

            console.log(error);

            return res.status(500).json({
                error: 'Internal Server Error'
            })
        }
    }

    // This method should be intercepter by a middleware for the user object to be present in the request.
    async getCurrentUser(req: Request, res: Response) {
        const user = req.user!;

        const { password, ...rest } = user;

        return res.status(200).json({
            user: rest
        })
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) return res.status(401).json({
                error: 'No refresh token'
            })

            const result = this.authService.refreshToken(refreshToken);

            return res.status(200).json(result)

        } catch (error) {
            // Handle JWT errors generically
            if (error instanceof Error && error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    error: 'Invalid token'
                })
            }

            if (error instanceof Error && error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    error: 'Token expired'
                })
            }

            return res.status(401).json({
                error: 'Unauthorized'
            })
        }
    }
}

export default AuthController;