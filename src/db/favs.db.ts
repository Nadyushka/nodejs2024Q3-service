import { FavsModel } from '../model/favs.model';
import { ArtistsDb } from './artists.db';
import { TracksDb } from './tracks.db';
import { AlbumsDb } from './albums.db';

const artistsDb = ArtistsDb.getInstance();
const tracksDb = TracksDb.getInstance();
const albumsDb = AlbumsDb.getInstance();

export class FavsDb {
  public static instance: FavsDb;

  public static getInstance() {
    if (!FavsDb.instance) {
      FavsDb.instance = new FavsDb();
    }
    return FavsDb.instance;
  }

  favs: FavsModel = new FavsModel({
    artists: [],
    tracks: [],
    albums: [],
  });

  getALLFavs() {
    const tracks = tracksDb.getTracks();
    const albums = albumsDb.getAlbums();
    const artists = artistsDb.getArtists();

    const fullArtistsData = this.favs.artists
      .map((artistId) => artists.find((artist) => artist.id === artistId))
      .filter((a) => a);
    const fullAlbumsData = this.favs.albums
      .map((albumId) => albums.find((album) => album.id === albumId))
      .filter((a) => a);
    const fullTracksData = this.favs.tracks
      .map((trackId) => tracks.find((track) => track.id === trackId))
      .filter((t) => t);

    return {
      artists: fullArtistsData,
      albums: fullAlbumsData,
      tracks: fullTracksData,
    };
  }

  isAdded(id: string, type: 'tracks' | 'artists' | 'albums') {
    return !!this.favs[type].find((typeId) => id === typeId);
  }

  addToFavs(id: string, type: 'tracks' | 'artists' | 'albums') {
    this.favs[type].push(id);
  }

  deleteFromFavs(id: string, type: 'tracks' | 'artists' | 'albums') {
    this.favs = {
      ...this.favs,
      [type]: this.favs[type].filter((typeId) => typeId !== id),
    };
  }
}
