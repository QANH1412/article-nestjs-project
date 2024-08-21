import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../token/jwt.strategy';
import { jwtConstants } from '../token/constants';
import { TokenModule } from '../token/token.module';
import { RedisModule } from '../redis/redis.module'; 
import { BlacklistService } from '../redis/blacklist.service';
import { MailModule } from '../mail/mail.module';
import { VerifyEmailController } from './verify-email.controller';

@Module({
  imports: [
    JwtModule.register({
      global:true,
      secret: jwtConstants.secret,
    }),
    MailModule,
    UsersModule,
    TokenModule,
    RedisModule
  ],
  providers: [AuthService, JwtStrategy, BlacklistService],
  controllers: [AuthController, VerifyEmailController],
  exports: [AuthService],
})
export class AuthModule {}
