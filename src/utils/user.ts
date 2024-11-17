import {  UserModelWithoutPassword } from '../model/user.model';

export const deletePasswordInfo = (
  usersData: unknown
): null | UserModelWithoutPassword | UserModelWithoutPassword[] => {
  if (!usersData) return null;

  if (Array.isArray(usersData)) {
    return [...usersData].map((user) => {
      const userCopy = { ...user };
      delete userCopy.password;
      return userCopy;
    }) as UserModelWithoutPassword[];
  }

  // @ts-ignore
  const userCopy = { ...usersData };

  if (userCopy.password) {
    delete userCopy.password;
    return userCopy;
  }
};
