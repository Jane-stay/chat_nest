import * as bcrypt from 'bcrypt';

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<Boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export async function encryptPassword(
  plainTextPassword: string,
): Promise<String> {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(plainTextPassword, salt);

  return hashedPassword;
}
