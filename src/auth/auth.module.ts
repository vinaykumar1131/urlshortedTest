import { Module, forwardRef } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PassportModule } from '@nestjs/passport'
import { UserModule } from 'src/user/user.module';
import passport from 'passport';
import { JwtAuthGuard } from './jwt.gaurd';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
require('dotenv').config()
@Module({
    imports: [
        PassportModule, forwardRef(() => UserModule),
        JwtModule.register({
            global: true,
            secret: process.env.SECRET_KEY
        }),
    ],
    providers: [
        JwtAuthGuard,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard
        }
    ],
    controllers: [],
})

export class AuthModule { }