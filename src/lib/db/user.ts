import db from './db';

export const getUserById = async (uid: number) => {
  const user = await db.user.findFirst({
    where: {
      uid
    }
  });
  return user;
}

export const getUserByEmail = async (email: string) => {
  const user = await db.user.findFirst({
    where: {
      email
    }
  });
  return user;
}

export const createNewUser = async (email: string, password: string, name: string) => {
  const user = await db.user.create({
    data: {
      email,
      password,
      name
    }
  });
  return user;
}