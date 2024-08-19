// src/users/interfaces/user.interface.ts
import { Types } from 'mongoose';

export interface IUser {
  username: string;
  password: string;
  email: string;
  firstName?: string; 
  lastName?: string;  
  address?: string;   
  dateOfBirth?: Date; 
  phoneNumber?: string; 
  roleId?: Types.ObjectId;
  isEmailVerified?: boolean; 
  resetPasswordToken?: Array<{ token: string; expiredAt: Date }>;
}
