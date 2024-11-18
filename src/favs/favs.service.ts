import { HttpStatus, Injectable } from '@nestjs/common';
import { ErrorModel } from '../model/error.model';
import { AlbumModel } from '../model/albums.model';
import { ArtistModel } from '../model/artist.model';
import { TrackModel } from '../model/track.model';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}
  async getAllFavs(): Promise<{
    artists: ArtistModel[];
    albums: AlbumModel[];
    tracks: TrackModel[];
  }> {
    try {
      const artists = await this.prisma.favouriteArtist.findMany({
        include: { artist: true },
      });
      const albums = await this.prisma.favouriteAlbum.findMany({
        include: { album: true },
      });
      const tracks = await this.prisma.favouriteTrack.findMany({
        include: { track: true },
      });

      return {
        artists: artists.map((fav) => fav.artist),
        albums: albums.map((fav) => fav.album),
        tracks: tracks.map((fav) => fav.track),
      };
    } catch (error) {
      console.error('getAllFavs', error);
    }
  }

  async addTrack(id: string): Promise<string | ErrorModel> {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      return new ErrorModel({
        errorText: 'There is no track with such id',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    const isTackAdded = await this.prisma.favouriteTrack.findUnique({
      where: { trackId: id },
    });
    if (isTackAdded) {
      return 'Track is already added to favorites';
    } else {
      await this.prisma.favouriteTrack.create({
        data: { trackId: id },
      });
      return 'Track was added to favorites';
    }
  }

  async deleteTrack(id: string): Promise<string | ErrorModel> {
    const track = await this.prisma.favouriteTrack.findUnique({
      where: { trackId: id },
    });
    if (!track) {
      return new ErrorModel({
        errorText: 'There is no track with such id',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    await this.prisma.favouriteTrack.delete({
      where: { trackId: id },
    });
    return 'Track was deleted from favorites';
  }

  async addAlbum(id: string): Promise<string | ErrorModel> {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      return new ErrorModel({
        errorText: 'There is no album with such id',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    const isAlbumAdded = await this.prisma.favouriteAlbum.findUnique({
      where: { albumId: id },
    });
    if (isAlbumAdded) {
      return 'Album is already added to favorites';
    } else {
      await this.prisma.favouriteAlbum.create({
        data: { albumId: id },
      });
      return 'Album was added to favorites';
    }
  }

  async deleteAlbum(id: string): Promise<string | ErrorModel> {
    const album = await this.prisma.favouriteAlbum.findUnique({
      where: { albumId: id },
    });
    if (!album) {
      return new ErrorModel({
        errorText: 'There is no album with such id',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    try {
      await this.prisma.favouriteAlbum.delete({
        where: { albumId: id },
      });
      return 'Album was deleted from favorites';
    } catch (e) {
      console.error('deleteAlbum', e);
    }
  }

  async addArtist(id: string): Promise<string | ErrorModel> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      return new ErrorModel({
        errorText: 'There is no artist with such id',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    const isArtistAdded = await this.prisma.favouriteArtist.findUnique({
      where: { artistId: id },
    });
    if (isArtistAdded) {
      return 'Artist is already added to favorites';
    } else {
      await this.prisma.favouriteArtist.create({
        data: { artistId: id },
      });
      return 'Artist was added to favorites';
    }
  }

  async deleteArtist(id: string): Promise<string | ErrorModel> {
    const artist = await this.prisma.favouriteArtist.findUnique({
      where: { artistId: id },
    });
    if (!artist) {
      return new ErrorModel({
        errorText: 'There is no artist with such id',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    await this.prisma.favouriteArtist.delete({
      where: { artistId: id },
    });
    return 'Artist was deleted from favorites';
  }
}
