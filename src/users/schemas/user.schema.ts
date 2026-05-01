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
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true }); // unique index for email
