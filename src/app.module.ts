import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './config/config.module';  // Import ConfigModule tùy chỉnh
import { ConfigService } from './config/config.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ArticlesModule } from './articles/articles.module';
import { RedisModule } from './redis/redis.module';
import { TokenModule } from './token/token.module';
import { UserActivityMiddleware } from './common/middleware/user-activity.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,  
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.mongodbUri,
      }),
      inject: [ConfigService],
    }),
    JwtModule,
    TokenModule,
    RedisModule,
    UsersModule,
    AuthModule,
    ProfileModule,
    ArticlesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserActivityMiddleware)
      .exclude(
        '/auth/login',
        '/auth/register',
        '/auth/refresh',
      ) // Loại trừ các route khỏi middleware
      .forRoutes('*'); // Áp dụng middleware cho tất cả các routes
      
  }
}
