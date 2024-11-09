import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { UserModelWithoutPassword } from '../model/user.model';
import { ResponseModel } from '../model/response.model';
import { CreateUserDto, UpdatePasswordDto } from './users.dto';
import { UsersService } from './users.service';
import { errorHandler } from '../utils/errorHandler';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    try {
      const users = await this.usersService.getAllUsers();
      return new ResponseModel<UserModelWithoutPassword[]>({
        statusCode: HttpStatus.OK,
        data: users,
      });
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    try {
      const res = await this.usersService.getUserById(id);

      if (!res) {
        throw new HttpException(
          'There is no user with such id',
          HttpStatus.NOT_FOUND,
        );
      }

      return new ResponseModel<UserModelWithoutPassword | null>({
        statusCode: HttpStatus.OK,
        data: res,
      });
    } catch (e) {
      errorHandler(e);
    }
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;

    if (!login || !password) {
      throw new HttpException(
        'Login and password are required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const res = await this.usersService.createUser({
        login,
        password,
      });

      if (typeof res == 'string') {
        throw new HttpException(res, HttpStatus.BAD_REQUEST);
      }

      return new ResponseModel({
        statusCode: HttpStatus.CREATED,
        data: res,
      });
    } catch (e) {
      errorHandler(e);
    }
  }

  @Put(':id')
  async updateUserPassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const { newPassword, oldPassword } = updatePasswordDto;

    if (!newPassword || !oldPassword) {
      throw new HttpException(
        'New password and old password are required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const res = await this.usersService.updatePassword({
        ...updatePasswordDto,
        id,
      });

      if (typeof res != 'boolean') {
        throw new HttpException(res.errorText, res.status);
      }

      return new ResponseModel({
        statusCode: HttpStatus.OK,
      });
    } catch (e) {
      errorHandler(e);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      const res = await this.usersService.deleteUser(id);

      if (typeof res != 'boolean') {
        throw new HttpException(res.errorText, res.status);
      }

      if (res) {
        return new ResponseModel({
          statusCode: HttpStatus.NO_CONTENT,
        });
      }
    } catch (e) {
      errorHandler(e);
    }
  }
}
