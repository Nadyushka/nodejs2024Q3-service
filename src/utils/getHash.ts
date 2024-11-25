import * as bcrypt from 'bcrypt';

export async function getHash(password: string) {
  const saltRounds = Number(process.env.CRYPT_SALT) || 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}
