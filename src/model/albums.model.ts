export class AlbumModel {
  id: string;
  name: string;
  year: number;
  artistId: string | null;

  constructor(obj: Partial<AlbumModel>) {
    Object.assign(this, obj);
  }
}
