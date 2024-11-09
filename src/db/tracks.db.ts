import { TrackModel } from '../model/track.model';

export class TracksDb {
  public static instance: TracksDb;

  public static getInstance() {
    if (!TracksDb.instance) {
      TracksDb.instance = new TracksDb();
    }
    return TracksDb.instance;
  }

  tracks: TrackModel[] = [
    new TrackModel({
      id: '123e4567-e89b-12d3-a456-426614174010',
      name: 'Nebesa',
      artistId: '113e4567-e89b-12d3-a456-426614174010',
      albumId: '223e4567-e89b-12d3-a456-426614174010',
      duration: 180,
    }),
    new TrackModel({
      id: '123e4567-e89b-12d3-a456-426614174011',
      name: 'Seyra',
      artistId: '113e4567-e89b-12d3-a456-426614174011',
      albumId: '223e4567-e89b-12d3-a456-426614174011',
      duration: 160,
    }),
  ];

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
    this.tracks = this.tracks.map((track) => {
      const updatedTrackInfo = new TrackModel(updatedTrackData);
      if (track.id === id) {
        return {
          ...track,
          ...updatedTrackInfo,
        };
      }

      return track;
    });
  }

  deleteTrack(id: string) {
    this.tracks = this.tracks.filter((track) => track.id !== id);
    return true;
  }
}
