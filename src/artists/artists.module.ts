import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UuidMiddleware } from '../middleware/uuid.middleware';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService],
})
export class ArtistsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UuidMiddleware)
      .forRoutes(
        { path: 'artist', method: RequestMethod.POST },
        { path: 'artist/:id', method: RequestMethod.GET },
        { path: 'artist/:id', method: RequestMethod.DELETE },
        { path: 'artist/:id', method: RequestMethod.PUT },
      );
  }
}
