import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { URLController } from './url.controller';
import { URlSchema, URl } from './url.schema';
import { URlService } from './url.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: URl.name, schema: URlSchema }]),
    ],
    providers: [URlService],
    controllers: [URLController],
    exports: [URlService]
})
export class URLModule { }
