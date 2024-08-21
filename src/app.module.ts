import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './config/config.module';  // Import ConfigModule tùy chỉnh
import { ConfigService } from './config/config.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ArticlesModule } from './articles/articles.module';
import { RedisModule } from './redis/redis.module';

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
    RedisModule,
    UsersModule,
    AuthModule,
    ProfileModule,
    ArticlesModule,
  ],
})
export class AppModule {}
