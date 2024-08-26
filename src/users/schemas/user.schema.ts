import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  password: string; 

  @Prop({ required: true, unique: true })
  email: string;
  
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  address: string;

  @Prop({ type: Date })
  dateOfBirth: Date;

  @Prop()
  phoneNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Role' })
  roleId: Types.ObjectId;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ type: Date, default: Date.now })
  lastActivity: Date; // Thêm trường theo dõi thời gian hoạt động

  @Prop({
    type: [
      {
        token: { type: String },
        expiredAt: { type: Date },
      },
    ],
  })
  resetPasswordToken: { token: string; expiredAt: Date }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
