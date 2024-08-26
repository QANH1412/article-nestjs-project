import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';
import { UsersModule } from '../users/users.module';
import { ConfigService } from '../config/config.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PassportModule, UsersModule, AuthModule],
  providers: [GoogleStrategy, ConfigService],
  exports: [GoogleStrategy],
})
export class GoogleModule {}
