import * as bcrypt from 'bcrypt';

export const bcryptHash = async (password: string): Promise<string> => {
  const saltOrRounds = 10;
  return await bcrypt.hash(password, saltOrRounds);
};

export const isHashMatch = async (
  value: string,
  hashedValue: string,
): Promise<boolean> => {
  return await bcrypt.compare(value, hashedValue);
};
