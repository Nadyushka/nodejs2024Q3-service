import { HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { TracksDb } from '../db/tracks.db';
import { TrackModel } from '../model/track.model';
import { CreateTrackDto, UpdateTrackDto } from './tracks.dto';
import { ErrorModel } from '../model/error.model';

const tracksDb = TracksDb.getInstance();

@Injectable()
export class TracksService {
  async getAllTracks(): Promise<TrackModel[] | null> {
    try {
      return await tracksDb.getTracks();
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
  }: UpdateTrackDto & { id: string }): Promise<TrackModel | ErrorModel> {
    const trackToUpdate = tracksDb.checkIfTrackExist(id);

    if (!trackToUpdate) {
      return new ErrorModel({
        errorText: 'There is no track with such id',
        status: HttpStatus.NOT_FOUND,
      });
    }

    try {
      return await tracksDb.updateTrackInfo(id, {
        name,
        duration,
        albumId,
        artistId,
      });
    } catch (e) {
      console.error('updateTrack', e);
    }
  }

  async deleteTrack(id: string): Promise<boolean | ErrorModel> {
    try {
      const trackToDelete = tracksDb.checkIfTrackExist(id);

      if (!trackToDelete) {
        return new ErrorModel({
          errorText: 'There is no track with such id',
          status: HttpStatus.NOT_FOUND,
        });
      }

      return await tracksDb.deleteTrack(id);
    } catch (e) {
      console.error('deleteTrack', e);
    }
  }
}
