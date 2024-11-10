import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UuidMiddleware } from '../middleware/uuid.middleware';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';

@Module({
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UuidMiddleware)
      .forRoutes(
        { path: 'track', method: RequestMethod.POST },
        { path: 'track/:id', method: RequestMethod.GET },
        { path: 'track/:id', method: RequestMethod.DELETE },
        { path: 'track/:id', method: RequestMethod.PUT },
      );
  }
}
