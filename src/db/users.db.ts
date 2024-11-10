import { UserModel } from '../model/user.model';

export class UsersDb {
  public static instance: UsersDb;

  public static getInstance() {
    if (!UsersDb.instance) {
      UsersDb.instance = new UsersDb();
    }
    return UsersDb.instance;
  }

  users: UserModel[] = [];

  getUsers() {
    return this.users;
  }

  getUserById(id: string) {
    return this.users.find((user) => user.id === id);
  }

  createUser(newUser: UserModel) {
    this.users = [...this.users, newUser];
    return newUser;
  }

  checkIfUserExist(id: string) {
    return this.users.find((user) => user.id === id);
  }

  checkIfUserWithSuchLoginExist(login: string) {
    return !!this.users.find((user) => user.login === login);
  }

  updateUserPassword(id: string, newPassword: string) {
    let updatedUser;
    this.users = this.users.map((user) => {
      if (user.id === id) {
        updatedUser = {
          ...user,
          password: newPassword,
          updatedAt: Date.now(),
          version: user.version + 1,
        };

        return updatedUser as UserModel;
      }
      return user;
    });

    return updatedUser;
  }

  deleteUser(id: string) {
    this.users = this.users.filter((user) => user.id !== id);
    return true;
  }
}
