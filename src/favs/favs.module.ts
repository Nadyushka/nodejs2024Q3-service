import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UuidMiddleware } from '../middleware/uuid.middleware';
import { FavsController } from './favs.controller';
import { FavsService } from './favs.service';

@Module({
  controllers: [FavsController],
  providers: [FavsService],
})
export class FavsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UuidMiddleware)
      .forRoutes(
        { path: 'favs/album/:id', method: RequestMethod.POST },
        { path: 'favs/album/:id', method: RequestMethod.DELETE },
        { path: 'favs/track/:id', method: RequestMethod.POST },
        { path: 'favs/track/:id', method: RequestMethod.DELETE },
        { path: 'favs/artist/:id', method: RequestMethod.POST },
        { path: 'favs/artist/:id', method: RequestMethod.DELETE },
      );
  }
}
