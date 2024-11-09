import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';

import { ResponseModel } from '../model/response.model';
import { errorHandler } from '../utils/errorHandler';
import { isUUID } from 'class-validator';
import { ErrorModel } from '../model/error.model';
import { AlbumsService } from './albums.service';
import { AlbumModel } from '../model/albums.model';
import { CreateAlbumDto, UpdateAlbumDto } from './albums.dto';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  @HttpCode(200)
  async getAllAlbums() {
    try {
      const res = await this.albumsService.getAllAlbums();
      return new ResponseModel<AlbumModel[]>({
        statusCode: HttpStatus.OK,
        data: res,
      });
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @HttpCode(200)
  async getAlbumById(@Param('id') id: string) {
    try {
      const res = await this.albumsService.getAlbumById(id);

      if (!res) {
        throw new HttpException(
          'There is no album with such id',
          HttpStatus.NOT_FOUND,
        );
      }

      return new ResponseModel<AlbumModel | null>({
        statusCode: HttpStatus.OK,
        data: res,
      });
    } catch (e) {
      errorHandler(e);
    }
  }

  @Post()
  @HttpCode(201)
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    try {
      const { name, year, artistId } = createAlbumDto;

      if (!name || !year) {
        throw new HttpException(
          'Name and year are required.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (typeof year != 'number' || typeof name != 'string') {
        throw new HttpException(
          'Year must be a number and name must be a string.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (artistId && !isUUID(artistId)) {
        throw new HttpException(
          'ArtistId are not uuid.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const res = await this.albumsService.createAlbum(createAlbumDto);

      if (res instanceof ErrorModel) {
        throw new HttpException(res, HttpStatus.BAD_REQUEST);
      }

      return new ResponseModel({
        statusCode: HttpStatus.CREATED,
        data: res,
      });
    } catch (e) {
      errorHandler(e);
    }
  }

  @Put(':id')
  @HttpCode(200)
  async updateAlbum(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    try {
      const { name, year, artistId } = updateAlbumDto;

      if (
        (year && typeof year != 'number') ||
        (name && typeof name != 'string')
      ) {
        throw new HttpException(
          'Duration must be a number and name must be a string.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (artistId && !isUUID(artistId)) {
        throw new HttpException(
          'ArtistId have invalid ID format.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const res = await this.albumsService.updateAlbum({
        ...updateAlbumDto,
        id,
      });

      if (res instanceof ErrorModel) {
        throw new HttpException(res.errorText, res.status);
      }

      return new ResponseModel({
        statusCode: HttpStatus.OK,
        data: res,
      });
    } catch (e) {
      errorHandler(e);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteAlbum(@Param('id') id: string) {
    try {
      const res = await this.albumsService.deleteAlbum(id);

      if (res instanceof ErrorModel) {
        throw new HttpException(res.errorText, res.status);
      }
    } catch (e) {
      errorHandler(e);
    }
  }
}
