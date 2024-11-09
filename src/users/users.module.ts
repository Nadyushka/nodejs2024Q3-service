import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UuidMiddleware } from '../middleware/uuid.middleware';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UuidMiddleware)
      .forRoutes(
        { path: 'user', method: RequestMethod.POST },
        { path: 'user/:id', method: RequestMethod.GET },
        { path: 'user/:id', method: RequestMethod.DELETE },
        { path: 'user/:id', method: RequestMethod.PUT },
      )
  }
}
