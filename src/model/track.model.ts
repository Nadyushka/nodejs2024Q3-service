export class TrackModel {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;

  constructor(obj: Partial<TrackModel>) {
    Object.assign(this, obj);
  }
}
