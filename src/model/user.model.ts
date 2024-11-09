export class UserModel {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  constructor(obj: Partial<UserModel>) {
    Object.assign(this, obj);
  }
}

export type UserModelWithoutPassword = Omit<UserModel, 'password'>;
