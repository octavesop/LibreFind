import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

export type BadgeDocument = Badge & Document;

@Schema({ timestamps: true })
export class Badge {
  @Prop({ type: SchemaTypes.ObjectId })
  id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  age: number;
}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
