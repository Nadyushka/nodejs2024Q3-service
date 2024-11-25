import { UserModel, UserModelWithoutPassword } from '../model/user.model';
import { deletePasswordInfo } from '../utils/user';
import { CreateUserDto, UpdatePasswordDto } from './users.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ErrorModel } from '../model/error.model';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<any[] | null> {
    try {
      return this.prisma.user.findMany();
    } catch (error) {
      console.error('getAllUsers', error);
    }
  }

  async getUserById(id: string): Promise<UserModelWithoutPassword | null> {
    try {
      const res = await this.prisma.user.findUnique({
        where: { id },
      });
      return res ? (deletePasswordInfo(res) as UserModelWithoutPassword) : null;
    } catch (error) {
      console.error('getUserById', error);
    }
  }

  async getUserByLogin(login: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { login },
      });
      if (user) {
        return user;
      }
    } catch (error) {
      console.error('getUserByLogin', error);
    }
  }

  async createUser({
    login,
    password,
  }: CreateUserDto) {
    const isUserExist = await this.prisma.user.findUnique({
      where: { login },
    });
    if (isUserExist) {
      return 'Login is already in use';
    }

    const newUser = new UserModel({
      login,
      password,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    });

    try {
      await this.prisma.user.create({
        data: newUser,
      });
      return deletePasswordInfo(newUser) as UserModelWithoutPassword;
    } catch (error) {
      console.error('createUser', error);
    }
  }

  async updatePassword({
    newPassword,
    oldPassword,
    id,
  }: UpdatePasswordDto & { id: string }): Promise<
    UserModelWithoutPassword | ErrorModel
  > {
    const userToUpdatePassword = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userToUpdatePassword) {
      return new ErrorModel({
        errorText: 'There is no user with such id',
        status: HttpStatus.NOT_FOUND,
      });
    }

    if (userToUpdatePassword.password !== oldPassword) {
      return new ErrorModel({
        errorText: 'Incorrect old password',
        status: HttpStatus.FORBIDDEN,
      });
    }

    try {
      const res = await this.prisma.user.update({
        where: { id },
        data: {
          password: newPassword,
          updatedAt: Date.now(),
          version: userToUpdatePassword.version + 1,
        },
      });
      return deletePasswordInfo(res) as UserModelWithoutPassword;
    } catch (e) {
      console.error('updatePassword', e);
    }
  }

  async deleteUser(id: string): Promise<boolean | ErrorModel> {
    try {
      const isUserExist = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!isUserExist) {
        return new ErrorModel({
          errorText: 'There is no user with such id',
          status: HttpStatus.NOT_FOUND,
        });
      }

      await this.prisma.user.delete({
        where: { id },
      });
    } catch (e) {
      console.error('deleteUser', e);
    }
  }
}
