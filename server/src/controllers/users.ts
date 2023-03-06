import { checkPrime } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { check } from 'express-validator';
import passport from 'passport';
import { IVerifyOptions } from 'passport-local';
import { User } from '../users';

export const postLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // await check('email', 'Email is not valid').isEmail().run(req);
  console.log('here');
  passport.authenticate(
    'local',
    (err: Error, user: User, info: IVerifyOptions) => {
      if (err) {
        console.log(err);
        console.log('milk');
        return next(err);
      }
      if (!user) {
        console.error(info.message);
        console.log(info);

        return res.status(501).send();
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.send();
      });
    },
  )(req, res, next);
};
