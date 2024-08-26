import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '../config/config.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { CreateOauth2UserDto } from 'src/users/dto/create-Oauth2-user.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {

    super({
      clientID: configService.googleClientId,
      clientSecret: configService.googleClientSecret,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    
    const { name, emails, photos } = profile;

    const userDto: CreateOauth2UserDto = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      username: emails[0].value.split('@')[0], // Tạo username từ email hoặc một giá trị khác
      password: '', // Để trống password vì OAuth2 không sử dụng password
    };

    // Check if user already exists, create new user if not
    let existingUser = await this.usersService.findByEmail(userDto.email);
    if (!existingUser) {
      existingUser = await this.usersService.createOauth2(userDto);
    }

    const tokens = await this.authService.oAuth2CreateTokens(userDto.username);
    done(null, { ...existingUser, ...tokens }); // Trả về người dùng đã tồn tại hoặc mới tạo
  }
}
