import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { RefreshTokenService } from './refresh-token.service';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    ConfigModule, // Đảm bảo ConfigModule được import
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.jwtSecret, // Sử dụng secret cho access token từ ConfigService
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.jwtRefreshSecret, // Sử dụng secret cho refresh token từ ConfigService
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [TokenService, RefreshTokenService],
  exports: [TokenService, RefreshTokenService], // Export để sử dụng ở các module khác
})
export class TokenModule {}
