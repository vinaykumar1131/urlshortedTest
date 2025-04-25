import { Controller, Post, Body, Injectable, Res, ConflictException, UnauthorizedException } from '@nestjs/common';
import { Public } from 'src/lib/decorator';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Public()
    @Post('signup')
    async signup(@Body() body: { name: string; email: string; password: string }, @Res() res: any) {
        try {
            const result = this.userService.signup(body.name, body.email, body.password);
            return res.status(201).json({ success: true, data: result })

        } catch (error) {
            let statusCode = 500;
            if (error instanceof ConflictException)
                statusCode = 403
            return res.status(statusCode).json({ success: false, message: error.message ?? "something went wrong" })
        }

    }
    @Public()
    @Post('login')
    async login(@Body() body: { email: string; password: string }, @Res() res: any) {
        try {
            const result = await this.userService.signIn(body.email, body.password);

            return res.status(201).json({ success: true, data: result })

        } catch (error) {
            let statusCode = 500;
            if (error instanceof UnauthorizedException)
                statusCode = 400
            return res.status(statusCode).json({ success: false, message: error.message ?? "something went wrong" })
        }
    }
}
