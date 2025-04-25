import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { URl, URlDocument } from './url.schema';
import * as randomstring from 'randomstring';
require('dotenv').config()
@Injectable()
export class URlService {
    constructor(
        @InjectModel(URl.name) private urlModel: Model<URlDocument>
    ) { }
    async createShortenUrl(url, userId) {
        const findUrl = await this.urlModel.findOne({ original: url, userId });
        if (findUrl)
            throw new ConflictException({ success: false, message: "Already created the shorten url for same" })

        const shortenUrl = randomstring.generate({ length: process.env.RANDOM_URL_LENGTH || 10, charset: 'alphanumeric' });
        return await this.urlModel.create({ userId: userId, shortenUrl, original: url })
    }
    async getShortenUrl(url, userId) {
        const findUrl = await this.urlModel.findOne({ shortenUrl: url, userId }).exec();
        if (!findUrl)
            throw new BadRequestException({ success: false, message: " No url found" })
        findUrl.noOfClicks = + findUrl.noOfClicks + 1
        await findUrl.save()
        return findUrl

    }
    async findAllUrls(userId) {
        return await this.urlModel.find({ userId })

    }
}



