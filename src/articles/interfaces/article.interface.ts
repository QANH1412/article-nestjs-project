import { Document } from 'mongoose';

export interface Article extends Document {
  readonly title: string;
  readonly content: string;
  readonly createdAt: Date;
}