import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  artistId: string | null;
}

export class UpdateAlbumDto {
  @IsString()
  name: string;

  @IsNumber()
  year: number;

  artistId: string | null;
}
