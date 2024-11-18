import { HttpStatus, Injectable } from '@nestjs/common';
import { ErrorModel } from '../model/error.model';
import { AlbumModel } from '../model/albums.model';
import { CreateAlbumDto, UpdateAlbumDto } from './albums.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  async getAllAlbums(): Promise<AlbumModel[]> {
    try {
      return this.prisma.album.findMany();
    } catch (error) {
      console.error('getAllAlbums', error);
    }
  }

  async getAlbumById(id: string): Promise<AlbumModel | null> {
    try {
      return await this.prisma.album.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error('getAlbumById', error);
    }
  }

  async createAlbum({
    name,
    year,
    artistId,
  }: CreateAlbumDto): Promise<AlbumModel | string> {
    const newAlbum = new AlbumModel({
      name,
      year,
      artistId: artistId ?? null,
    });

    try {
      const createdAlbum = await this.prisma.album.create({ data: newAlbum });
      return createdAlbum ?? newAlbum;
    } catch (error) {
      console.error('createAlbum', error);
    }
  }

  async updateAlbum({
    name,
    year,
    artistId,
    id,
  }: UpdateAlbumDto & { id: string }): Promise<AlbumModel | ErrorModel> {
    const albumToUpdate = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!albumToUpdate) {
      return new ErrorModel({
        errorText: 'There is no album with such id',
        status: HttpStatus.NOT_FOUND,
      });
    }

    try {
      return this.prisma.album.update({
        where: { id },
        data: {
          name,
          year,
          artistId,
        },
      });
    } catch (e) {
      console.error('updateAlbum', e);
    }
  }

  async deleteAlbum(id: string): Promise<boolean | ErrorModel> {
    try {
      const albumToDelete = await this.prisma.album.findUnique({
        where: { id },
      });

      if (!albumToDelete) {
        return new ErrorModel({
          errorText: 'There is no album with such id',
          status: HttpStatus.NOT_FOUND,
        });
      }

      await this.prisma.album.delete({
        where: { id },
      });

      await this.prisma.track.updateMany({
        where: { albumId: id },
        data: { albumId: null },
      });

      await this.prisma.favouriteAlbum.deleteMany({
        where: { albumId: id },
      });

      return true;
    } catch (e) {
      console.error('deleteAlbum', e);
    }
  }
}
