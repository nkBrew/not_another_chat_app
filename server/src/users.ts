import bcrypt from 'bcrypt';
import { ID } from './utilities/id';

export interface User {
  id: string;
  email: string;
  password: string;
}
// bcrypt.has
const users: User[] = [
  { id: ID(), email: 'test', password: bcrypt.hashSync('nuts', 10) },
];

export const findUser = (username: string) => {
  return users.find((u) => u.email === username);
};

export const findUserById = (id: string) => {
  return users.find((u) => u.id === id);
};

export const comparePassword = (
  candidatePassword: string,
  userPassword: string,
  cb: (err: any, isMatch: boolean) => void,
) => {
  bcrypt.compare(candidatePassword, userPassword, (err, isMatch) =>
    cb(err, isMatch),
  );
};
