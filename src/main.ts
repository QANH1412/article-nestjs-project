import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

   
  // Cấu hình CORS để bảo vệ ứng dụng khỏi các yêu cầu từ các origin không mong muốn
  app.enableCors({
    origin: ['http://localhost:3000'], // Chỉ định các origin được phép
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Cho phép gửi cookie cùng với yêu cầu
  });

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('API documentation for your project')
    .setVersion('1.0')
    .addBearerAuth() // Thêm Bearer Token auth nếu cần
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // Cấu hình middleware csurf
  app.use(csurf({
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Chỉ bật khi chạy trong môi trường sản xuất
      sameSite: 'strict',
    },
    value: (req) => req.cookies['csrfToken'], // Đặt tên token CSRF
  }));
  
  // Lắng nghe trên cổng 3000
  await app.listen(3000);
}

bootstrap();
