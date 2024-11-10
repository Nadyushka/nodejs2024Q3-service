import { HttpStatus, Injectable } from '@nestjs/common';
import { ErrorModel } from '../model/error.model';
import { AlbumsDb } from '../db/albums.db';
import { AlbumModel } from '../model/albums.model';
import { FavsDb } from '../db/favs.db';
import { ArtistModel } from '../model/artist.model';
import { TrackModel } from '../model/track.model';
import { ArtistsDb } from '../db/artists.db';
import { TracksDb } from '../db/tracks.db';

const favsDb = FavsDb.getInstance();
const artistsDb = ArtistsDb.getInstance();
const tracksDb = TracksDb.getInstance();
const albumsDb = AlbumsDb.getInstance();

@Injectable()
export class FavsService {
  async getAllFavs(): Promise<{
    artists: ArtistModel[];
    albums: AlbumModel[];
    tracks: TrackModel[];
  }> {
    try {
      return await favsDb.getALLFavs();
    } catch (error) {
      console.error('getAllFavs', error);
    }
  }

  async addTrack(id: string): Promise<string | ErrorModel> {
    const track = await tracksDb.checkIfTrackExist(id);
    if (!track) {
      return new ErrorModel({
        errorText: 'There is no track with such id',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    const isTackAdded = await favsDb.isAdded(id, 'tracks');
    if (isTackAdded) {
      return 'Track is already added to favorites';
    } else {
      await favsDb.addToFavs(id, 'tracks');
      return 'Track was added to favorites';
    }
  }

  async deleteTrack(id: string): Promise<string | ErrorModel> {
    const track = await tracksDb.checkIfTrackExist(id);
    if (!track) {
      return new ErrorModel({
        errorText: 'There is no track with such id',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    await favsDb.deleteFromFavs(id, 'tracks');
    return 'Track was deleted from favorites';
  }

  async addAlbum(id: string): Promise<string | ErrorModel> {
    const album = await albumsDb.checkIfAlbumExist(id);
    if (!album) {
      return new ErrorModel({
        errorText: 'There is no album with such id',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    const isAlbumAdded = await favsDb.isAdded(id, 'albums');
    if (isAlbumAdded) {
      return 'Album is already added to favorites';
    } else {
      await favsDb.addToFavs(id, 'albums');
      return 'Album was added to favorites';
    }
  }

  async deleteAlbum(id: string): Promise<string | ErrorModel> {
    const album = await albumsDb.checkIfAlbumExist(id);
    if (!album) {
      return new ErrorModel({
        errorText: 'There is no album with such id',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    try {
      await favsDb.deleteFromFavs(id, 'albums');
      return 'Album was deleted from favorites';
    } catch (e) {
      console.error('deleteAlbum', e);
    }
  }

  async addArtist(id: string): Promise<string | ErrorModel> {
    const artist = await artistsDb.checkIfArtistExist(id);
    if (!artist) {
      return new ErrorModel({
        errorText: 'There is no artist with such id',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    const isArtistAdded = await favsDb.isAdded(id, 'artists');
    if (isArtistAdded) {
      return 'Artist is already added to favorites';
    } else {
      await favsDb.addToFavs(id, 'artists');
      return 'Artist was added to favorites';
    }
  }

  async deleteArtist(id: string): Promise<string | ErrorModel> {
    const artist = await artistsDb.checkIfArtistExist(id);
    if (!artist) {
      return new ErrorModel({
        errorText: 'There is no artist with such id',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    await favsDb.deleteFromFavs(id, 'artists');
    return 'Artist was deleted from favorites';
  }
}
