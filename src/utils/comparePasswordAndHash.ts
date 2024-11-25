import * as bcrypt from "bcrypt";

export async function comparePasswordAndHash(
  confirmPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(confirmPassword, hashedPassword);
}
