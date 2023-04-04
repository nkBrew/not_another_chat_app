import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { UsersModel } from '../models/usersModel';
import users from '../models/usersModel';
import { TypedRequest } from '../types';
import bcrypt from 'bcrypt';
import * as messageController from './messageController';
import { ConversationDto, UserBasic } from '@not-another-chat-app/common';
import { findUserSessionByUserId } from './userSessionController';

export const login = (
  req: TypedRequest<{ email: string; password: string }>,
  res: Response,
) => {
  const { email, password } = req.body;
  users.findUser(email).then((doc) => {
    if (!doc) {
      return res.status(400).send('User Not found');
    }
    const user = {
      userId: doc.id,
      username: doc.username,
      password: doc.password,
    };
    users.comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      if (!isMatch) {
        console.log('Invlaid credentials');
        return res.status(403).send('Invalid credentials');
      }

      const token = jwt.sign(user.userId, process.env.SESSION_SECRET);
      return res.json({
        userId: user.userId,
        username: user.username,
        accessToken: token,
      });
    });
  });
};

export const findUser = (username: string) => {
  return users.findUser(username);
};

export const findUserById = async (id: string) => {
  const doc = await UsersModel.findById(id);
  if (!doc) {
    return undefined;
  }
  const { id: userId, username } = doc;
  const online = !!!!findUserSessionByUserId(userId);
  const user: UserBasic = { userId: userId, username, online };
  return user;
};

export interface UserDto {
  userId: string;
  username: string;
  conversations: ConversationDto[];
}

export const getUsers = async () => {
  const userDocs = await UsersModel.find();
  const users: UserBasic[] = userDocs.map((doc) => {
    const userId = doc.id;
    const online = !!findUserSessionByUserId(userId);
    return {
      userId: doc.id,
      username: doc.username,
      online,
    };
  });

  return users;
};

export const register = async (
  req: TypedRequest<{ username: string; password: string }>,
  res: Response,
) => {
  const { username, password } = req.body;
  const checkUser = await users.findUserAsync(username);
  if (checkUser) {
    console.log('Registration failed username already exists');
    return res.status(500).send('Username already taken');
  }
  const document = new users.UsersModel({
    username,
    password: bcrypt.hashSync(password, 10),
  });

  await document.save();

  console.log(`New user created ${document.id}`);
  messageController.createConversationsForNewUser(document.id);

  const token = jwt.sign(document.id, process.env.SESSION_SECRET);
  const user = { userId: document.id, username, accessToken: token };
  return res.status(201).json(user);
};
