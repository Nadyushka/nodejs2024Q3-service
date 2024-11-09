export class ArtistModel {
  id: string;
  name: string;
  grammy: boolean;

  constructor(obj: Partial<ArtistModel>) {
    Object.assign(this, obj);
  }
}
