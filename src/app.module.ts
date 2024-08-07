import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }), // Đọc và cấu hình biến môi trường từ file .env
    MongooseModule.forRoot(process.env.MONGODB_URI, { 
      autoIndex: true
    }),
    
    ArticlesModule,
    UsersModule,
  ],
})
export class AppModule {}
