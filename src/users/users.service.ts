import { UsersDb } from '../db/users.db';
import { UserModel, UserModelWithoutPassword } from '../model/user.model';
import { deletePasswordInfo } from '../utils/user';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto, UpdatePasswordDto } from './users.dto';
import { HttpStatus, Injectable } from '@nestjs/common';

const usersDb = UsersDb.getInstance();

@Injectable()
export class UsersService {
  async getAllUsers(): Promise<UserModelWithoutPassword[] | null> {
    try {
      const users = await usersDb.getUsers();
      return users?.length
        ? (deletePasswordInfo(users) as UserModelWithoutPassword[])
        : null;
    } catch (error) {
      console.error('getAllUsers', error);
    }
  }

  async getUserById(id: string): Promise<UserModelWithoutPassword | null> {
    try {
      const user = usersDb.getUserById(id);
      return user
        ? (deletePasswordInfo(user) as UserModelWithoutPassword)
        : null;
    } catch (error) {
      console.error('getUserById', error);
    }
  }

  async createUser({
    login,
    password,
  }: CreateUserDto): Promise<UserModelWithoutPassword | string> {
    const isUserExist = await usersDb.checkIfUserWithSuchLoginExist(login);
    if (isUserExist) {
      return 'Login is already in use';
    }

    const newUser = new UserModel({
      id: uuidv4(),
      login,
      password,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    });

    try {
      await usersDb.createUser(newUser);
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
    boolean | { errorText: string; status: HttpStatus }
  > {
    const userToUpdatePassword = usersDb.checkIfUserExist(id);

    if (!userToUpdatePassword) {
      return {
        errorText: 'There is no user with such id',
        status: HttpStatus.NOT_FOUND,
      };
    }

    if (userToUpdatePassword.password !== oldPassword) {
      return {
        errorText: 'Incorrect old password',
        status: HttpStatus.FORBIDDEN,
      };
    }

    try {
      usersDb.updateUserPassword(id, newPassword);

      return true;
    } catch (e) {
      console.error('updatePassword', e);
    }
  }

  async deleteUser(
    id: string,
  ): Promise<boolean | { errorText: string; status: HttpStatus }> {
    try {
      const isUserExist = usersDb.checkIfUserExist(id);

      if (!isUserExist) {
        return {
          errorText: 'There is no user with such id',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      return await usersDb.deleteUser(id);
    } catch (e) {
      console.error('deleteUser', e);
    }
  }
}