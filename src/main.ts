import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình cookie-parser
  app.use(cookieParser());

  // Sử dụng ValidationPipe để tự động xác thực dữ liệu đầu vào
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Thiết lập Helmet để thêm các header bảo mật
  app.use(helmet());

  // Thiết lập rate-limiting để giới hạn số lượng yêu cầu
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 phút
      max: 100, // Tối đa 100 yêu cầu mỗi IP trong khoảng thời gian này
      message: 'Too many requests from this IP, please try again later.',
    }),
  );

  // // Cấu hình CSRF middleware
  // app.use(
  //   csurf({
  //     cookie: {
  //       httpOnly: true, // Đảm bảo cookie chỉ có thể truy cập qua HTTP
  //       secure: false, // Chỉ sử dụng cookie bảo mật trên production
  //     },
  //   }),
  // );

  
  
  // Cấu hình CORS để bảo vệ ứng dụng khỏi các yêu cầu từ các origin không mong muốn
  app.enableCors({
    origin: ['http://localhost:3000'], // Chỉ định các origin được phép
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Cho phép gửi cookie cùng với yêu cầu
  });

  // Lắng nghe trên cổng 3000
  await app.listen(3000);
}

bootstrap();
