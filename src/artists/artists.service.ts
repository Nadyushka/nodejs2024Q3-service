import { HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ArtistsDb } from '../db/artists.db';
import { ArtistModel } from '../model/artist.model';
import { CreateArtisDto, UpdateArtistDto } from './artists.dto';
import { ErrorModel } from '../model/error.model';

const artistDb = ArtistsDb.getInstance();

@Injectable()
export class ArtistsService {
  async getAllArtists(): Promise<ArtistModel[] | null> {
    try {
      const res = await artistDb.getArtists();
      return res?.length ? res : null;
    } catch (error) {
      console.error('getAllArtists', error);
    }
  }

  async getArtistById(id: string): Promise<ArtistModel | null> {
    try {
      const res = await artistDb.getArtistById(id);
      return res ?? null;
    } catch (error) {
      console.error('getArtistById', error);
    }
  }

  async createArtist({
    name,
    grammy,
  }: CreateArtisDto): Promise<ArtistModel | string> {
    const newArtist = new ArtistModel({
      id: uuidv4(),
      name,
      grammy,
    });

    try {
      return await artistDb.createArtist(newArtist);
    } catch (error) {
      console.error('createArtist', error);
    }
  }

  async updateArtist({
    name,
    grammy,
    id,
  }: UpdateArtistDto & { id: string }): Promise<ArtistModel | ErrorModel> {
    const artistToUpdate = artistDb.checkIfArtistExist(id, name);

    if (!artistToUpdate) {
      return new ErrorModel({
        errorText: 'There is no artist with such id',
        status: HttpStatus.NOT_FOUND,
      });
    }

    try {
      return await artistDb.updateArtistInfo(id, { name, grammy });
    } catch (e) {
      console.error('updateArtist', e);
    }
  }

  async deleteArtist(id: string): Promise<boolean | ErrorModel> {
    try {
      const artistToDelete = artistDb.checkIfArtistExist(id, '');

      if (!artistToDelete) {
        return new ErrorModel({
          errorText: 'There is no artist with such id',
          status: HttpStatus.BAD_REQUEST,
        });
      }

      return await artistDb.deleteArtist(id);
    } catch (e) {
      console.error('deleteArtist', e);
    }
  }
}
