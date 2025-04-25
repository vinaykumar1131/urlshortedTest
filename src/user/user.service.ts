import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    async signup(name: string, email: string, password: string): Promise<User> {
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({ name, email, password: hashedPassword });
        return newUser.save();
    }

    async login(email: string, password: string): Promise<User> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }
    async signIn(email, password) {
        const user = await this.login(email, password);
        if (typeof user == 'string') {
            return user;
        }
        if (user) {
            const { _id }: any = user;
            const payload = {
                ...user,
                sub: _id || ''
            };
            return {
                user,
                token: await this.jwtService.signAsync(payload)
            };
        } else {
            throw new UnauthorizedException();
        }
    }
}
