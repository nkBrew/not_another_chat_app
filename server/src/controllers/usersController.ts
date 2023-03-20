import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import usersModel, { UsersModel } from '../models/usersModel';
import users from '../models/usersModel';
import { TypedRequest } from '../types';
import bcrypt from 'bcrypt';
import messageController from './messageController';
import { ConversationDto, UserBasic } from '@not-another-chat-app/common';

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
        // ...user,
      });
    });
  });
};

export const findUser = (username: string) => {
  return users.findUser(username);
};

export const findUserById = (id: string) => {
  return users.findUserById(id);
};

export interface UserDto {
  userId: string;
  username: string;
  conversations: ConversationDto[];
}

export const getUsersAndConversations = async () => {
  console.log('here');
  const userDocs = await UsersModel.find();
  const users: UserDto[] = userDocs.map((doc) => ({
    userId: doc.id,
    username: doc.username,
    conversations: [],
  }));
  for (const user of users) {
    const conversations = await messageController.getUserConversations(
      user.userId,
    );
    // user.conversations = conversations;
  }
  return users;
};

export const getUserMatchedConversations = async (userId: string) => {
  const userDocs = await UsersModel.find();
  const users: UserDto[] = userDocs.map((doc) => ({
    userId: doc.id,
    username: doc.username,
    conversations: [],
  }));
  for (const user of users) {
    const conversations = await messageController.getMatchingUserConversations([
      userId,
      user.userId,
    ]);
    // user.conversations = conversations;
  }
  return users;
};

export const getUsers = async () => {
  const userDocs = await UsersModel.find();
  const users: UserBasic[] = userDocs.map((doc) => ({
    userId: doc.id,
    username: doc.username,
  }));
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
  return res.sendStatus(201);
};
