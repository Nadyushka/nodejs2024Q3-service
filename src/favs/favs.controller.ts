import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';

import { errorHandler } from '../utils/errorHandler';
import { ErrorModel } from '../model/error.model';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  @HttpCode(200)
  async getAllFavs() {
    try {
      return await this.favsService.getAllFavs();
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('track/:id')
  @HttpCode(201)
  async addTrackToFavs(@Param('id') id: string) {
    try {
      const res = await this.favsService.addTrack(id);

      if (res instanceof ErrorModel) {
        throw new HttpException(res.errorText, res.status);
      }

      return res;
    } catch (e) {
      errorHandler(e);
    }
  }

  @Delete('track/:id')
  @HttpCode(204)
  async deleteTrackFromFavs(@Param('id') id: string) {
    try {
      const res = await this.favsService.deleteTrack(id);

      if (res instanceof ErrorModel) {
        throw new HttpException(res.errorText, res.status);
      }

      return res;
    } catch (e) {
      errorHandler(e);
    }
  }

  @Post('artist/:id')
  @HttpCode(201)
  async addArtistToFavs(@Param('id') id: string) {
    try {
      const res = await this.favsService.addArtist(id);

      if (res instanceof ErrorModel) {
        throw new HttpException(res.errorText, res.status);
      }

      return res;
    } catch (e) {
      errorHandler(e);
    }
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async deleteArtistFromFavs(@Param('id') id: string) {
    try {
      const res = await this.favsService.deleteArtist(id);

      if (res instanceof ErrorModel) {
        throw new HttpException(res.errorText, res.status);
      }

      return res;
    } catch (e) {
      errorHandler(e);
    }
  }

  @Post('album/:id')
  @HttpCode(201)
  async addAlbumToFavs(@Param('id') id: string) {
    try {
      const res = await this.favsService.addAlbum(id);

      if (res instanceof ErrorModel) {
        throw new HttpException(res.errorText, res.status);
      }

      return res;
    } catch (e) {
      errorHandler(e);
    }
  }

  @Delete('album/:id')
  @HttpCode(204)
  async deleteAlbumFromFavs(@Param('id') id: string) {
    try {
      const res = await this.favsService.deleteAlbum(id);

      if (res instanceof ErrorModel) {
        throw new HttpException(res.errorText, res.status);
      }

      return res;
    } catch (e) {
      errorHandler(e);
    }
  }
}
