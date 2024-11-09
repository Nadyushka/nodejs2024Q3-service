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
} from '@nestjs/common';

import { ResponseModel } from '../model/response.model';
import { errorHandler } from '../utils/errorHandler';
import { TracksService } from './tracks.service';
import { TrackModel } from '../model/track.model';
import { CreateTrackDto, UpdateTrackDto } from './tracks.dto';
import { isUUID } from 'class-validator';

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  async getAllTracks() {
    try {
      const tracks = await this.tracksService.getAllTracks();
      return new ResponseModel<TrackModel[]>({
        statusCode: HttpStatus.OK,
        data: tracks,
      });
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getTrackById(@Param('id') id: string) {
    try {
      const res = await this.tracksService.getTrackById(id);

      if (!res) {
        throw new HttpException(
          'There is no track with such id',
          HttpStatus.NOT_FOUND,
        );
      }

      return new ResponseModel<TrackModel | null>({
        statusCode: HttpStatus.OK,
        data: res,
      });
    } catch (e) {
      errorHandler(e);
    }
  }

  @Post()
  async createTrack(@Body() createTrackDto: CreateTrackDto) {
    try {
      const { name, duration, albumId, artistId } = createTrackDto;

      if (!name || !duration) {
        throw new HttpException(
          'Name and duration are required.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (typeof duration != 'number') {
        throw new HttpException(
          'Duration must be a number.',
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

      if (typeof res == 'string') {
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
  async updateTrack(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    try {
      const { name, duration, albumId, artistId } = updateTrackDto;

      if (!name || !duration) {
        throw new HttpException(
          'Name and duration are required.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (typeof duration != 'number') {
        throw new HttpException(
          'Duration must be a number.',
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

      if (typeof res != 'boolean') {
        throw new HttpException(res.errorText, res.status);
      }

      return new ResponseModel({
        statusCode: HttpStatus.OK,
      });
    } catch (e) {
      errorHandler(e);
    }
  }

  @Delete(':id')
  async deleteTrack(@Param('id') id: string) {
    try {
      const res = await this.tracksService.deleteTrack(id);

      if (typeof res != 'boolean') {
        throw new HttpException(res.errorText, res.status);
      }

      if (res) {
        return new ResponseModel({
          statusCode: HttpStatus.NO_CONTENT,
        });
      }
    } catch (e) {
      errorHandler(e);
    }
  }
}
