import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { ID } from '../utilities/id';

export interface User {
  id: string;
  username: string;
  password: string;
}

const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export const UsersModel = mongoose.model('Users', userSchema);

const saveUser = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  console.log(bcrypt.hashSync(password, 10));
  const data = new UsersModel({
    username: username,
    password: bcrypt.hashSync(password, 10),
  });
  data.save();
};

export const findUser = async (username: string) => {
  const document = await UsersModel.findOne({ username });
  return document;
};

export const findUserAsync = async (username: string) => {
  const document = await UsersModel.findOne({ username });
  if (!document) {
    return undefined;
  }
  return {
    id: document.id,
    username: document.username,
    password: document.password,
  };
};

// export const findUserById = (id: string) => {
//   return users.find((u) => u.id === id);
// };

export const findUserById = async (id: string) => {
  const document = await UsersModel.findById(id);
  if (!document) {
    return undefined;
  }
  return { id: document.id, username: document.username };
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

export default {
  findUser,
  findUserById,
  comparePassword,
  findUserAsync,
  saveUser,
  UsersModel,
};
