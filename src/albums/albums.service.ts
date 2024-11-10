import { HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ErrorModel } from '../model/error.model';
import { AlbumsDb } from '../db/albums.db';
import { AlbumModel } from '../model/albums.model';
import { CreateAlbumDto, UpdateAlbumDto } from './albums.dto';
import { TracksDb } from '../db/tracks.db';

const albumsDb = AlbumsDb.getInstance();
const tracksDb = TracksDb.getInstance();

@Injectable()
export class AlbumsService {
  async getAllAlbums(): Promise<AlbumModel[] > {
    try {
      return await albumsDb.getAlbums();
    } catch (error) {
      console.error('getAllAlbums', error);
    }
  }

  async getAlbumById(id: string): Promise<AlbumModel | null> {
    try {
      return await albumsDb.getAlbumById(id);
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
      id: uuidv4(),
      name,
      year,
      artistId: artistId ?? null,
    });

    try {
      return await albumsDb.createAlbum(newAlbum);
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
    const albumToUpdate = albumsDb.checkIfAlbumExist(id);

    if (!albumToUpdate) {
      return new ErrorModel({
        errorText: 'There is no album with such id',
        status: HttpStatus.NOT_FOUND,
      });
    }

    try {
      return await albumsDb.updateAlbumsInfo(id, { name, year, artistId });
    } catch (e) {
      console.error('updateAlbum', e);
    }
  }

  async deleteAlbum(id: string): Promise<boolean | ErrorModel> {
    try {
      const albumToDelete = albumsDb.checkIfAlbumExist(id);

      if (!albumToDelete) {
        return new ErrorModel({
          errorText: 'There is no album with such id',
          status: HttpStatus.NOT_FOUND,
        });
      }

      await albumsDb.deleteAlbum(id);
      await tracksDb.deleteAlbumFromTracks(id);
      return true;
    } catch (e) {
      console.error('deleteAlbum', e);
    }
  }
}
