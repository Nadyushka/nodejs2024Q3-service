import { HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { TracksDb } from '../db/tracks.db';
import { TrackModel } from '../model/track.model';
import { CreateTrackDto, UpdateTrackDto } from './tracks.dto';

const tracksDb = TracksDb.getInstance();

@Injectable()
export class TracksService {
  async getAllTracks(): Promise<TrackModel[] | null> {
    try {
      const tracks = await tracksDb.getTracks();
      return tracks?.length ? tracks : null;
    } catch (error) {
      console.error('getAllTracks', error);
    }
  }

  async getTrackById(id: string): Promise<TrackModel | null> {
    try {
      const track = await tracksDb.getTrackById(id);
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
      id: uuidv4(),
      name,
      duration,
      albumId: albumId ?? null,
      artistId: artistId ?? null,
    });

    try {
      return await tracksDb.createTrack(newTrack);
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
  }: UpdateTrackDto & { id: string }): Promise<
    boolean | { errorText: string; status: HttpStatus }
  > {
    const trackToUpdate = tracksDb.checkIfTrackExist(id);

    if (!trackToUpdate) {
      return {
        errorText: 'There is no track with such id',
        status: HttpStatus.NOT_FOUND,
      };
    }

    try {
      await tracksDb.updateTrackInfo(id, { name, duration, albumId, artistId });
      return true;
    } catch (e) {
      console.error('updateTrack', e);
    }
  }

  async deleteTrack(
    id: string,
  ): Promise<boolean | { errorText: string; status: HttpStatus }> {
    try {
      const trackToUpdateDelete = tracksDb.checkIfTrackExist(id);

      if (!trackToUpdateDelete) {
        return {
          errorText: 'There is no track with such id',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      return await tracksDb.deleteTrack(id);
    } catch (e) {
      console.error('deleteTrack', e);
    }
  }
}
