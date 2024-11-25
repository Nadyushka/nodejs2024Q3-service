import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { LoginDto, RefreshDto, SignupDto } from './auth.dto';
import { getHash } from '../utils/getHash';
import { comparePasswordAndHash } from '../utils/comparePasswordAndHash';
import { UsersService } from '../users/users.service';
import { UserModelWithoutPassword } from '../model/user.model';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string =
    process.env.JWT_SECRET_KEY || 'secret123123';
  private readonly jwtSecretRefresh: string =
    process.env.JWT_SECRET_REFRESH_KEY || 'secret123123';
  private readonly tokenExpireTime: string =
    process.env.TOKEN_EXPIRE_TIME || '60m';
  private readonly tokenRefreshExpireTime: string =
    process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h';

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { login, password } = signupDto;

    const loginIsInUse = await this.userService.getUserByLogin(login);
    if (loginIsInUse) {
      throw new BadRequestException('There is a user with such login.');
    }

    const newUser = (await this.userService.createUser({
      login,
      password: await getHash(password),
    })) as UserModelWithoutPassword;

    const tokens = await this.generateTokens(newUser.id, newUser.login);

    return { id: newUser.id, ...tokens };
  }

  async login(loginDto: LoginDto) {
    const { login, password } = loginDto;

    const user = await this.userService.getUserByLogin(login);
    if (!user) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const isPasswordValid = await comparePasswordAndHash(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.login);

    return { id: user.id, ...tokens };
  }

  async refresh(refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.jwtSecretRefresh,
      });

      const tokens = await this.generateTokens(decoded.userId, decoded.login);
      return tokens;
    } catch {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(userId: string, login: string) {
    const accessToken = this.jwtService.sign(
      { userId, login },
      { secret: this.jwtSecret, expiresIn: this.tokenExpireTime },
    );
    const refreshToken = this.jwtService.sign(
      { userId, login },
      {
        secret: this.jwtSecretRefresh,
        expiresIn: this.tokenRefreshExpireTime,
      },
    );
    return { accessToken, refreshToken };
  }
}
