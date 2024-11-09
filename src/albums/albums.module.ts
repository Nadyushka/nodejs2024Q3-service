import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UuidMiddleware } from '../middleware/uuid.middleware';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService],
})
export class AlbumsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UuidMiddleware)
      .forRoutes(
        { path: 'album', method: RequestMethod.POST },
        { path: 'album/:id', method: RequestMethod.GET },
        { path: 'album/:id', method: RequestMethod.DELETE },
        { path: 'album/:id', method: RequestMethod.PUT },
      );
  }
}
