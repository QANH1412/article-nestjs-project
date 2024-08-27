import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Role extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], required: true })
  permissions: string[];

  @Prop({ required: false })
  icon?: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
