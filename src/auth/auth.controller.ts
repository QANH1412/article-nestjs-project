// auth.controller.ts 
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from '../token/dto/refresh-token.dto';
import { RefreshTokenService } from '../token/refresh-token.service';
import { Get, Body, Controller, Post, Req, Res, HttpException, HttpStatus, Headers } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}


  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      await this.authService.register(createUserDto);
      res.status(HttpStatus.CREATED).json({ message: 'User registered successfully. Please check your email to verify your account.' });
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response){
    const loginDto: LoginDto = req.body;
    
    if (!loginDto.username || !loginDto.password) {
      throw new HttpException('Username and password are required', HttpStatus.BAD_REQUEST);
    }

    try {
      const { accessToken, refreshToken } = await this.authService.login(loginDto);

      // Đặt refreshToken vào cookie với các thuộc tính bảo mật
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      });

      // Gửi accessToken trong body response
      res.json({ accessToken, refreshToken }); // Đảm bảo trả về cả hai token

    } catch (error) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('/refresh')
async refreshTokens(@Req() req: Request, @Res() res: Response) {
  const refreshToken = req.cookies['refreshToken'];

  if (!refreshToken) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Refresh token is required' });
  }

  try {
    const { accessToken, refreshToken: newRefreshToken } = await this.refreshTokenService.refreshTokens({ refreshToken });

    // Đặt refreshToken mới vào cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    // Gửi phản hồi JSON sau khi thiết lập cookie
    return res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error('Error during refreshTokens:', error);
    
    // Đảm bảo rằng chỉ gọi một lần
    if (!res.headersSent) {
      // Gửi phản hồi lỗi dựa trên lỗi từ service
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message || 'Invalid or expired refresh token' });
    }
  }
}



  @Post('/logout')
  async logout(
    @Headers('authorization') authorizationHeader: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new HttpException('Authorization header missing or invalid', HttpStatus.BAD_REQUEST);
    }

    const accessToken = authorizationHeader.split(' ')[1];
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new HttpException('No refresh token found', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.authService.logout(accessToken, refreshToken);
      
      // Xóa cookie refreshToken
      res.clearCookie('refreshToken');

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      throw new HttpException('Logout failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
  }
}
