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

import { errorHandler } from '../utils/errorHandler';
import { ArtistsService } from './artists.service';
import { CreateArtisDto, UpdateArtistDto } from './artists.dto';
import { ErrorModel } from '../model/error.model';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  @HttpCode(200)
  async getAllArtists() {
    try {
      return await this.artistsService.getAllArtists();
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @HttpCode(200)
  async getArtistById(@Param('id') id: string) {
    try {
      const res = await this.artistsService.getArtistById(id);

      if (!res) {
        throw new HttpException(
          'There is no artist with such id',
          HttpStatus.NOT_FOUND,
        );
      }

      return res;
    } catch (e) {
      errorHandler(e);
    }
  }

  @Post()
  @HttpCode(201)
  async createArtist(@Body() createArtistDto: CreateArtisDto) {
    try {
      const { name, grammy } = createArtistDto;

      if (!name || !`${grammy}`) {
        throw new HttpException(
          'Name and grammy are required.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (typeof name != 'string' || typeof grammy != 'boolean') {
        throw new HttpException(
          'Name must be a string and grammy must be a boolean.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const res = await this.artistsService.createArtist(createArtistDto);

      if (typeof res == 'string') {
        throw new HttpException(res, HttpStatus.BAD_REQUEST);
      }

      return res;
    } catch (e) {
      errorHandler(e);
    }
  }

  @Put(':id')
  @HttpCode(200)
  async updateArtist(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    try {
      const { name, grammy } = updateArtistDto;

      if (!name || !`${grammy}`) {
        throw new HttpException(
          'Name and grammy are required.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (
        (name && typeof name != 'string') ||
        (grammy && typeof grammy != 'boolean')
      ) {
        throw new HttpException(
          'Name must be a string and grammy must be a boolean.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const res = await this.artistsService.updateArtist({
        name,
        id,
        grammy,
      });

      if (res instanceof ErrorModel) {
        throw new HttpException(res.errorText, res.status);
      }

      return res;
    } catch (e) {
      errorHandler(e);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteArtist(@Param('id') id: string) {
    try {
      const res = await this.artistsService.deleteArtist(id);

      if (res instanceof ErrorModel) {
        throw new HttpException(res.errorText, res.status);
      }
    } catch (e) {
      errorHandler(e);
    }
  }
}
