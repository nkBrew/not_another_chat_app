import bcrypt from 'bcrypt';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import * as usersController from './controllers/users';
import * as passportConfig from './passport-config';
import { TypedRequest } from './types';

const app = express();

//Use this until I actually use it
passportConfig;

console.log(process.env.SESSION_SECRET);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
  cors({
    origin: 'http://localhost:3000',
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

app.get('/', (req, res) => {
  console.log('Here');
  res.status(500).send('Hi');
});

const users: string[] = [];

app.get('/test', (req, res) => {
  console.log('yep');
  res.send();
});

app.post(
  '/login',
  (req: TypedRequest<{ email: string; password: string }>, res, next) => {
    usersController.postLogin(req, res, next);
  },
);

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    return res.send();
  });
});

// app.post()

app.listen(3001);
