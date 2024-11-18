import { HttpStatus, Injectable } from '@nestjs/common';
import { TrackModel } from '../model/track.model';
import { CreateTrackDto, UpdateTrackDto } from './tracks.dto';
import { ErrorModel } from '../model/error.model';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async getAllTracks(): Promise<TrackModel[] | null> {
    try {
      return await this.prisma.track.findMany();
    } catch (error) {
      console.error('getAllTracks', error);
    }
  }

  async getTrackById(id: string): Promise<TrackModel | null> {
    try {
      const track = await this.prisma.track.findUnique({
        where: { id },
      });
      return track ?? null;
    } catch (error) {
      console.error('getTrackById', error);
    }
  }

  async createTrack({
    name,
    duration,
    albumId,
    artistId,
  }: CreateTrackDto): Promise<TrackModel | string> {
    const newTrack = new TrackModel({
      name,
      duration,
      albumId: albumId ?? null,
      artistId: artistId ?? null,
    });

    try {
      const createdTrack = await this.prisma.track.create({ data: newTrack });
      return createdTrack ?? newTrack;
    } catch (error) {
      console.error('createTrack', error);
    }
  }

  async updateTrack({
    name,
    duration,
    albumId,
    artistId,
    id,
  }: UpdateTrackDto & { id: string }): Promise<TrackModel | ErrorModel> {
    const trackToUpdate = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!trackToUpdate) {
      return new ErrorModel({
        errorText: 'There is no track with such id',
        status: HttpStatus.NOT_FOUND,
      });
    }

    try {
      return await this.prisma.track.update({
        where: { id },
        data: {
          name,
          duration,
          albumId,
          artistId,
        },
      });
    } catch (e) {
      console.error('updateTrack', e);
    }
  }

  async deleteTrack(id: string): Promise<any | ErrorModel> {
    try {
      const trackToDelete = await this.prisma.track.findUnique({
        where: { id },
      });

      if (!trackToDelete) {
        return new ErrorModel({
          errorText: 'There is no track with such id',
          status: HttpStatus.NOT_FOUND,
        });
      }

      await this.prisma.track.delete({
        where: { id },
      });

      await this.prisma.favouriteTrack.deleteMany({
        where: { trackId: id },
      });

      return this.prisma.track
    } catch (e) {
      console.error('deleteTrack', e);
    }
  }
}
