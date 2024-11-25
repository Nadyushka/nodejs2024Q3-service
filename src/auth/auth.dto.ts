import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class SignupDto {
  @IsString()
  @IsNotEmpty({ message: 'Login is required' })
  login: string;


  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class LoginDto extends SignupDto {}
