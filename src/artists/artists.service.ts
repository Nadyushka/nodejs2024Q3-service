import { HttpStatus, Injectable } from '@nestjs/common';
import { ArtistModel } from '../model/artist.model';
import { CreateArtisDto, UpdateArtistDto } from './artists.dto';
import { ErrorModel } from '../model/error.model';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService) {}

  async getAllArtists(): Promise<ArtistModel[] | null> {
    try {
      return this.prisma.artist.findMany();
    } catch (error) {
      console.error('getAllArtists', error);
    }
  }

  async getArtistById(id: string): Promise<ArtistModel | null> {
    try {
      const artist = await this.prisma.artist.findUnique({
        where: { id },
      });
      return artist ?? null;
    } catch (error) {
      console.error('getArtistById', error);
    }
  }

  async createArtist({
    name,
    grammy,
  }: CreateArtisDto): Promise<ArtistModel | string> {
    const newArtist = new ArtistModel({
      name,
      grammy,
    });

    try {
      const createdArtist = await this.prisma.artist.create({
        data: newArtist,
      });
      return createdArtist ?? newArtist;
    } catch (error) {
      console.error('createArtist', error);
    }
  }

  async updateArtist({
    name,
    grammy,
    id,
  }: UpdateArtistDto & { id: string }): Promise<ArtistModel | ErrorModel> {
    const artistToUpdate = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artistToUpdate) {
      return new ErrorModel({
        errorText: 'There is no artist with such id',
        status: HttpStatus.NOT_FOUND,
      });
    }

    try {
      return await this.prisma.artist.update({
        where: { id },
        data: {
          name,
          grammy,
        },
      });
    } catch (e) {
      console.error('updateArtist', e);
    }
  }

  async deleteArtist(id: string): Promise<boolean | ErrorModel> {
    try {
      const artistToDelete = await this.prisma.artist.findUnique({
        where: { id },
      });

      if (!artistToDelete) {
        return new ErrorModel({
          errorText: 'There is no artist with such id',
          status: HttpStatus.NOT_FOUND,
        });
      }

      await this.prisma.artist.delete({
        where: { id },
      });

      await this.prisma.track.updateMany({
        where: { artistId: id },
        data: { artistId: null },
      });

      await this.prisma.album.updateMany({
        where: { artistId: id },
        data: { artistId: null },
      });

      await this.prisma.favArtist.deleteMany({
        where: { artistId: id },
      });
      return;
    } catch (e) {
      console.error('deleteArtist', e);
    }
  }
}
