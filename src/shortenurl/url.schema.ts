import { Type } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/user/user.schema';

export type URlDocument = URl & Document;

@Schema({ timestamps: true })
export class URl {
    @Prop({ required: true })
    original: string;

    @Prop({ required: true })
    shortenUrl: string;

    @Prop({ required: false, default: 0 })
    noOfClicks: number;

    @Prop({
        required: true,
        default: null,
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
    })
    @Type(() => User)
    userId: mongoose.Schema.Types.ObjectId;


}

export const URlSchema = SchemaFactory.createForClass(URl);
