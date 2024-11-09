import { UserModel, UserModelWithoutPassword } from '../model/user.model';

export const deletePasswordInfo = (
  usersData: UserModel[] | UserModel | null,
): null | UserModelWithoutPassword | UserModelWithoutPassword[] => {
  if (!usersData )
    return null;

  if (Array.isArray(usersData)) {
    return [...usersData].map((user) => {
      const userCopy = { ...user };
      delete userCopy.password;
      return userCopy;
    }) as UserModelWithoutPassword[];
  }

  const userCopy = { ...usersData };

  if ( userCopy.password ) {
    delete userCopy.password;
    return userCopy;
  }
};
