import { ArtistModel } from '../model/artist.model';

export class ArtistsDb {
  public static instance: ArtistsDb;

  public static getInstance() {
    if (!ArtistsDb.instance) {
      ArtistsDb.instance = new ArtistsDb();
    }
    return ArtistsDb.instance;
  }

  artists: ArtistModel[] = [];

  getArtists() {
    return this.artists;
  }

  getArtistById(id: string) {
    return this.artists.find((artist) => artist.id === id);
  }

  createArtist(newArtist: ArtistModel) {
    this.artists = [...this.artists, newArtist];
    return newArtist;
  }

  checkIfArtistExist(id: string) {
    return this.artists.find((artist) => artist.id === id);
  }

  updateArtistInfo(id: string, updatedArtistData: Partial<ArtistModel>) {
    let updatedArtist = updatedArtistData;
    this.artists = this.artists.map((artist) => {
      const updatedArtistInfo = new ArtistModel(updatedArtistData);
      if (artist.id === id) {
        updatedArtist = {
          ...artist,
          ...updatedArtistInfo,
        };

        return updatedArtist as ArtistModel;
      }

      return artist;
    });

    return updatedArtist as ArtistModel;
  }

  deleteArtist(id: string) {
    this.artists = this.artists.filter((artist) => artist.id !== id);
    return true;
  }
}
