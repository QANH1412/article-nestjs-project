import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { RefreshTokenService } from './refresh-token.service';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from './constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret, // Secret cho access token
    }),
    JwtModule.register({
      global:true,
      secret: jwtConstants.refreshSecret, // Secret cho refresh token
    }),
    UsersModule,
  ],
  providers: [TokenService, RefreshTokenService],
  exports: [TokenService, RefreshTokenService], // Export để sử dụng ở các module khác
})
export class TokenModule {}
