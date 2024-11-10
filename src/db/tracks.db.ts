import { TrackModel } from '../model/track.model';

export class TracksDb {
  public static instance: TracksDb;

  public static getInstance() {
    if (!TracksDb.instance) {
      TracksDb.instance = new TracksDb();
    }
    return TracksDb.instance;
  }

  tracks: TrackModel[] = [];

  getTracks() {
    return this.tracks;
  }

  getTrackById(id: string) {
    return this.tracks.find((track) => track.id === id);
  }

  createTrack(newTrack: TrackModel) {
    this.tracks = [...this.tracks, newTrack];
    return newTrack;
  }

  checkIfTrackExist(id: string) {
    return this.tracks.find((track) => track.id === id);
  }

  updateTrackInfo(id: string, updatedTrackData: Partial<TrackModel>) {
    let updatedTrack = updatedTrackData;

    this.tracks = this.tracks.map((track) => {
      const updatedTrackInfo = new TrackModel(updatedTrackData);
      if (track.id === id) {
        updatedTrack = {
          ...track,
          ...updatedTrackInfo,
        };

        return updatedTrack as TrackModel;
      }

      return track;
    });

    return this.tracks.find((track) => track.id === id);
  }

  deleteTrack(id: string) {
    this.tracks = this.tracks.filter((track) => track.id !== id);
    return true;
  }

  deleteArtistFromTracks(artistId: string) {
    this.tracks = this.tracks.map((track) => {
      if (track.artistId == artistId) {
        return {
          ...track,
          artistId: null,
        };
      } else {
        return track;
      }
    });
  }

  deleteAlbumFromTracks(albumId: string) {
    this.tracks = this.tracks.map((track) => {
      if (track.albumId == albumId) {
        return {
          ...track,
          albumId: null,
        };
      } else {
        return track;
      }
    });
  }
}
