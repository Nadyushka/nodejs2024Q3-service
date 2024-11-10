import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateArtisDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  grammy: boolean;
}

export class UpdateArtistDto {
  @IsString()
  name: string;

  @IsBoolean()
  grammy: boolean;

  @IsString()
  id: string;
}
