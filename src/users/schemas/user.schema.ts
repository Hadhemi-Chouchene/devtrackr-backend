import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    enum: Role,
    default: Role.USER,
  })
  role!: Role;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email!: string;

  @Prop({ type: String, required: true })
  password!: string;

  @Prop({ type: String, default: null, trim: true })
  fullName?: string;

  @Prop({ type: String, default: null })
  avatarUrl?: string | null;

  @Prop({
    type: String,
    default: null,
  })
  refreshToken?: string | null;
}
export const UserSchema = SchemaFactory.createForClass(User);
