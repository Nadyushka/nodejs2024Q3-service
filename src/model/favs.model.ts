export class FavsModel {
  artists: string[];
  albums: string[];
  tracks: string[];

  constructor(obj: Partial<FavsModel>) {
    Object.assign(this, obj);
  }
}
