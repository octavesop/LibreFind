import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

export type BadgeDocument = Badge & Document;

@Schema({ timestamps: true })
export class Badge {
  @Prop({ type: SchemaTypes.ObjectId })
  id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
