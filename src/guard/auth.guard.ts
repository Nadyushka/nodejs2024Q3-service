import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface AuthenticatedRequest extends Request {
  info: { userId: string; login: string; exp: number; iat: number };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const excludedRoutes = ['/auth/signup', '/auth/login', '/auth/refresh'];

    if (excludedRoutes.includes(request.url)) {
      return true;
    }

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token, {
        publicKey: process.env.JWT_SECRET_KEY,
      });
      request.info = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
