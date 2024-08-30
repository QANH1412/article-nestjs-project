// auth.controller.ts 
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from '../token/dto/refresh-token.dto';
import { RefreshTokenService } from '../token/refresh-token.service';
import { Get, Body, Controller, Post, Req, Res, HttpException, HttpStatus, Headers, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ExtractJwt } from 'passport-jwt';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import * as csurf from 'csurf';

@ApiTags('Auth') // Thêm tag cho controller
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}


  
//////////////////////////////////// Register /////////////////////////////////////////
  @Post('/register')
  async register(@Body() RegisterDto: RegisterDto, @Res() res: Response) {
    try {
      await this.authService.register(RegisterDto);
      res.status(HttpStatus.CREATED).json({ message: 'User registered successfully. Please check your email to verify your account.' });
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////// Login //////////////////////////////////////
  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response, @Req() req: Request){
    
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


  /////////////////////////////////////////////// refresh ////////////////////////////////
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

  ////////////////////////////////////////////// logout ///////////////////////////
  @Post('/logout')
  async logout(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
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

  /////////////////////////////// request password reset by email ////////////////////////
  @Post('/request-reset')
  async requestPasswordReset(@Body() requestResetDto: RequestResetPasswordDto, @Res() res: Response): Promise<void> {
    try {
      await this.authService.requestPasswordReset(requestResetDto);
      res.status(HttpStatus.CREATED).json({ message: 'Please check your email to change your password.' });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Res() res: Response): Promise<void> {
    try {
      await this.authService.resetPassword(resetPasswordDto);
      res.status(HttpStatus.CREATED).json({ message: 'You have reset your password. Please log in again' });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  ///////////////////////////// login oAuth2 //////////////////////////////
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req: Request) {
    // Initiate Google OAuth login
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    // Khi Google gửi callback, tạo token cho người dùng
    const user = req.user as any; // Cast to appropriate type if needed

    const { accessToken, refreshToken } = user;
    // Redirect hoặc gửi tokens trong phản hồi
    res.json({ accessToken, refreshToken });  
  }
  
  @Get('/get')
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    // `req.csrfToken()` sẽ trả về giá trị CSRF token
    const csrfToken = req.csrfToken();
    // Đặt CSRF token vào cookie
    res.cookie('csrfToken', csrfToken, {
      httpOnly: false, // Đặt `httpOnly` là false để client-side có thể truy cập token này
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.json({ csrfToken });
  }
}
