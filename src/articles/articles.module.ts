// src/article/article.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article, ArticleSchema } from './schemas/article.schema';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
  RolesModule
],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
