import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { UsersRepository } from './users.repository';
import { RolesModule } from 'src/roles/roles.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RolesModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
