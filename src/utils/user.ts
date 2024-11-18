import { UserModelWithoutPassword } from '../model/user.model';

export const deletePasswordInfo = (usersData): unknown => {
  if (!usersData) return null;

  if (Array.isArray(usersData)) {
    return [...usersData].map((user) => {
      const userCopy = { ...user };
      delete userCopy.password;
      return userCopy;
    }) as UserModelWithoutPassword[];
  } else if (usersData) {
    const userCopy = {
      id: usersData.id,
      login: usersData.login,
      version: usersData.version,
      createdAt: usersData.updatedAt,
      updatedAt: usersData.updatedAt,
    };

    return userCopy;
  }

  return null;
};
