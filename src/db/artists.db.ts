import { ArtistModel } from '../model/artist.model';

export class ArtistsDb {
  public static instance: ArtistsDb;

  public static getInstance() {
    if (!ArtistsDb.instance) {
      ArtistsDb.instance = new ArtistsDb();
    }
    return ArtistsDb.instance;
  }

  artists: ArtistModel[] = [
    new ArtistModel({
      id: '133e4567-e89b-12d3-a456-426614174010',
      name: 'Meladze',
      grammy: false,
    }),
    new ArtistModel({
      id: '144e4567-e89b-12d3-a456-426614174011',
      name: 'Eminem',
      grammy: true,
    }),
  ];

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

  checkIfArtistExist(id: string, name: string) {
    return (
      this.artists.find((artist) => artist.id === id) ||
      this.artists.find((artist) => artist.name === name)
    );
  }

  updateArtistInfo(id: string, updatedArtistData: Partial<ArtistModel>) {
    this.artists = this.artists.map((artist) => {
      const updatedArtistInfo = new ArtistModel(updatedArtistData);
      if (artist.id === id) {
        return {
          ...artist,
          ...updatedArtistInfo,
        };
      }

      return artist;
    });

    return this.artists.find((artist) => artist.id === id);
  }

  deleteArtist(id: string) {
    this.artists = this.artists.filter((artist) => artist.id !== id);
    return true;
  }
}
