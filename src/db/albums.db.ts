import { AlbumModel } from '../model/albums.model';

export class AlbumsDb {
  public static instance: AlbumsDb;

  public static getInstance() {
    if (!AlbumsDb.instance) {
      AlbumsDb.instance = new AlbumsDb();
    }
    return AlbumsDb.instance;
  }

  albums: AlbumModel[] = [
    new AlbumModel({
      id: '200e4567-e89b-12d3-a456-426614174011',
      name: 'Any',
      year: 2012,
      artistId: '133e4567-e89b-12d3-a456-426614174010',
    }),
    new AlbumModel({
      id: '200e4567-e89b-12d3-a456-426614174010',
      name: 'Solntse',
      year: 2007,
      artistId: '133e4567-e89b-12d3-a456-426614174010',
    }),
  ];

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
    this.albums = this.albums.map((album) => {
      const updatedAlbumInfo = new AlbumModel(updatedAlbumData);
      if (album.id === id) {
        return {
          ...album,
          ...updatedAlbumInfo,
        };
      }

      return album;
    });

    return this.albums.find((album) => album.id === id);
  }

  deleteAlbum(id: string) {
    this.albums = this.albums.filter((album) => album.id !== id);
    return true;
  }
}
