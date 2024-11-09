import { HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ErrorModel } from '../model/error.model';
import { AlbumsDb } from '../db/albums.db';
import { AlbumModel } from '../model/albums.model';
import { CreateAlbumDto, UpdateAlbumDto } from './albums.dto';

const albumsDb = AlbumsDb.getInstance();

@Injectable()
export class AlbumsService {
  async getAllAlbums(): Promise<AlbumModel[] | null> {
    try {
      const albums = await albumsDb.getAlbums();
      return albums?.length ? albums : null;
    } catch (error) {
      console.error('getAllAlbums', error);
    }
  }

  async getAlbumById(id: string): Promise<AlbumModel | null> {
    try {
      const album = await albumsDb.getAlbumById(id);
      return album ?? null;
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
          status: HttpStatus.BAD_REQUEST,
        });
      }

      return await albumsDb.deleteAlbum(id);
    } catch (e) {
      console.error('deleteAlbum', e);
    }
  }
}
