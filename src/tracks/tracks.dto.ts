import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  artistId: string | null;
  albumId: string | null;
}

export class UpdateTrackDto {
  @IsString()
  name: string;

  @IsNumber()
  duration: number;

  artistId: string | null;
  albumId: string | null;
}
