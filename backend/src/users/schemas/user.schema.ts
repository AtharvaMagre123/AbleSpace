import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: false })
  password?: string;

  @Prop({ required: false, unique: true, sparse: true })
  googleId?: string;

  @Prop({ required: true, default: 'guest' })
  role: string;

  @Prop({ required: false })
  email?: string;

  @Prop({ required: false })
  avatar?: string;

  @Prop({ required: true, default: false })
  isGuest: boolean;

  @Prop({ required: false, default: 'light' })
  theme: string;

  @Prop({ required: false, default: 'blue' })
  colorMode: string;

  @Prop({ required: false })
  fullName?: string;

  @Prop({ required: false })
  title?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
