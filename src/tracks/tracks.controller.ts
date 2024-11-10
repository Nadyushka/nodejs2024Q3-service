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
import { TracksService } from './tracks.service';
import { TrackModel } from '../model/track.model';
import { CreateTrackDto, UpdateTrackDto } from './tracks.dto';
import { isUUID } from 'class-validator';
import { ErrorModel } from '../model/error.model';

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  @HttpCode(200)
  async getAllTracks() {
    try {
      return await this.tracksService.getAllTracks();
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @HttpCode(200)
  async getTrackById(@Param('id') id: string) {
    try {
      const res = await this.tracksService.getTrackById(id);

      if (!res) {
        throw new HttpException(
          'There is no track with such id',
          HttpStatus.NOT_FOUND,
        );
      }

      return res
    } catch (e) {
      errorHandler(e);
    }
  }

  @Post()
  @HttpCode(201)
  async createTrack(@Body() createTrackDto: CreateTrackDto) {
    try {
      const { name, duration, albumId, artistId } = createTrackDto;

      if (!name || !duration) {
        throw new HttpException(
          'Name and duration are required.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (typeof duration != 'number' || typeof name != 'string') {
        throw new HttpException(
          'Duration must be a number and name must be a string.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if ((albumId && !isUUID(albumId)) || (artistId && !isUUID(artistId))) {
        throw new HttpException(
          'AlbumId or artistId are not uuid.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const res = await this.tracksService.createTrack(createTrackDto);

      if (res instanceof ErrorModel) {
        throw new HttpException(res, HttpStatus.BAD_REQUEST);
      }

      return res
    } catch (e) {
      errorHandler(e);
    }
  }

  @Put(':id')
  @HttpCode(200)
  async updateTrack(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    try {
      const { name, duration, albumId, artistId } = updateTrackDto;

      if (
        (duration && typeof duration != 'number') ||
        (name && typeof name != 'string')
      ) {
        throw new HttpException(
          'Duration must be a number and name must be a string.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if ((albumId && !isUUID(albumId)) || (artistId && !isUUID(artistId))) {
        throw new HttpException(
          'AlbumId or artistId have invalid ID format.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const res = await this.tracksService.updateTrack({
        ...updateTrackDto,
        id,
      });

      if (res instanceof ErrorModel) {
        throw new HttpException(res.errorText, res.status);
      }

      return res
    } catch (e) {
      errorHandler(e);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTrack(@Param('id') id: string) {
    try {
      const res = await this.tracksService.deleteTrack(id);

      if (res instanceof ErrorModel) {
        throw new HttpException(res.errorText, res.status);
      }
    } catch (e) {
      errorHandler(e);
    }
  }
}
