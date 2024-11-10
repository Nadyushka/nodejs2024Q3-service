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
  HttpCode,
} from '@nestjs/common';

import { UserModelWithoutPassword } from '../model/user.model';
import { ResponseModel } from '../model/response.model';
import { CreateUserDto, UpdatePasswordDto } from './users.dto';
import { UsersService } from './users.service';
import { errorHandler } from '../utils/errorHandler';
import { ErrorModel } from '../model/error.model';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  async getAllUsers() {
    try {
      return await this.usersService.getAllUsers();
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @HttpCode(200)
  async getUserById(@Param('id') id: string) {
    try {
      const res = await this.usersService.getUserById(id);

      if (!res) {
        throw new HttpException(
          'There is no user with such id',
          HttpStatus.NOT_FOUND,
        );
      }

      return res
    } catch (e) {
      errorHandler(e);
    }
  }

  @Post()
  @HttpCode(201)
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

      return res
    } catch (e) {
      errorHandler(e);
    }
  }

  @Put(':id')
  @HttpCode(200)
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

      if (res instanceof ErrorModel) {
        throw new HttpException(res.errorText, res.status);
      }

      return res;
    } catch (e) {
      errorHandler(e);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    try {
      const res = await this.usersService.deleteUser(id);

      if (res instanceof ErrorModel) {
        throw new HttpException(res.errorText, res.status);
      }

    } catch (e) {
      errorHandler(e);
    }
  }
}
