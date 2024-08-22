import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../token/jwt.strategy';
import { TokenModule } from '../token/token.module';
import { RedisModule } from '../redis/redis.module'; 
import { BlacklistService } from '../redis/blacklist.service';
import { MailModule } from '../mail/mail.module';
import { VerifyEmailController } from './verify-email.controller';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.jwtSecret, // Sử dụng secret cho access token từ ConfigService
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
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
