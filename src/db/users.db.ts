import { UserModel } from '../model/user.model';

export class UsersDb {
  public static instance: UsersDb;

  public static getInstance() {
    if (!UsersDb.instance) {
      UsersDb.instance = new UsersDb();
    }
    return UsersDb.instance;
  }

  users: UserModel[] = [
    new UserModel({
      id: '123e4567-e89b-12d3-a456-426614174000',
      login: 'user1',
      password: 'user1',
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }),
    new UserModel({
      id: '123e4567-e89b-12d3-a456-426614174001',
      login: 'user2',
      password: 'user2',
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }),
  ];

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
    this.users = this.users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          password: newPassword,
          updatedAt: Date.now(),
          version: user.version + 1,
        };
      }
      return user;
    });

    return this.users.find((user) => user.id === id);
  }

  deleteUser(id: string) {
    this.users = this.users.filter((user) => user.id !== id);
    return true;
  }
}
