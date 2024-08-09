// src/article/article.controller.ts
import { Controller, Get, Post, Body, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
async findAll(@Query('search') search?: string) {
  return this.articleService.findAll(search);
}


  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(id, updateArticleDto);
  }
}
