import users from '../models/usersModel';
import { TypedRequest } from '../types';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const login = (
  req: TypedRequest<{ email: string; password: string }>,
  res: Response,
) => {
  const { email, password } = req.body;
  const user = users.findUser(email);
  if (!user) {
    return res.status(400).send('User Not found');
  }
  users.comparePassword(password, user.password, (err, isMatch) => {
    if (err) {
      // res.status(500).send('Invalid credentials');
      console.log(err);
      return res.status(500).send();
    }
    if (!isMatch) {
      console.log('Invlaid credentials');
      return res.status(403).send('Invalid credentials');
    }

    const token = jwt.sign(user.id, process.env.SESSION_SECRET);
    return res.json({ userId: user.id, email: user.email, accessToken: token });
  });
};
