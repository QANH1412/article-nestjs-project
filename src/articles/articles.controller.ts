// src/article/article.controller.ts
import { Controller, Get, Post, Body, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../token/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Articles') // Thêm tag cho controller
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  // @Roles('admin')
  // @Permissions('view_update')
  // @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
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
