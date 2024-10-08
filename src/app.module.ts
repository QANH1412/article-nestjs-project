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
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './token/jwt.strategy';
import { JwtAuthGuard } from './token/jwt-auth.guard';
import { MailModule } from './mail/mail.module';
import { UpdateLastActivityMiddleware } from './common/middleware/update-user-activity.middleware';
import { GoogleModule } from './google/google.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsGuard } from './auth/guards/permissions.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [ 
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.mongodbUri,
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.jwtSecret, // Sử dụng secret cho access token từ ConfigService
      }),
      inject: [ConfigService],
    }),
    GoogleModule,
    MailModule,
    ConfigModule, 
    TokenModule,
    RedisModule,
    RolesModule,
    UsersModule,
    AuthModule,
    ProfileModule,
    ArticlesModule,
  ],
  providers: [JwtStrategy, JwtAuthGuard, PermissionsGuard, RolesGuard],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UpdateLastActivityMiddleware)
      .forRoutes('*'); // Áp dụng cho tất cả các route
  }
}
