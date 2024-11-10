import { AlbumModel } from '../model/albums.model';

export class AlbumsDb {
  public static instance: AlbumsDb;

  public static getInstance() {
    if (!AlbumsDb.instance) {
      AlbumsDb.instance = new AlbumsDb();
    }
    return AlbumsDb.instance;
  }

  albums: AlbumModel[] = [];

  getAlbums() {
    return this.albums;
  }

  getAlbumById(id: string) {
    return this.albums.find((album) => album.id === id);
  }

  createAlbum(newAlbum: AlbumModel) {
    this.albums = [...this.albums, newAlbum];
    return newAlbum;
  }

  checkIfAlbumExist(id: string) {
    return this.albums.find((album) => album.id === id);
  }

  updateAlbumsInfo(id: string, updatedAlbumData: Partial<AlbumModel>) {
    let updatedAlbum = null;
    this.albums = this.albums.map((album) => {
      const updatedAlbumInfo = new AlbumModel(updatedAlbumData);
      if (album.id === id) {
        updatedAlbum = {
          ...album,
          ...updatedAlbumInfo,
        };

        return updatedAlbum as AlbumModel;
      }

      return album;
    });

    return updatedAlbum;
  }

  deleteAlbum(id: string) {
    this.albums = this.albums.filter((album) => album.id !== id);
    return true;
  }

  deleteArtistFromAlbums(artistId: string) {
    this.albums = this.albums.map((album) => {
      if (album.artistId == artistId) {
        return {
          ...album,
          artistId: null,
        };
      } else {
        return album;
      }
    });
  }
}
