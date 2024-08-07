import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Hàm bootstrap để khởi tạo ứng dụng NestJS
async function bootstrap() {


  // Tạo ứng dụng NestJS
  const app = await NestFactory.create(AppModule);

  // Sử dụng ValidationPipe để tự động xác thực dữ liệu đầu vào
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Thiết lập middleware hoặc các cấu hình khác nếu cần

  // Lắng nghe trên cổng 3000
  await app.listen(3000);
}

bootstrap();
