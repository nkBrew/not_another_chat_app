import cors from 'cors';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import http from 'http';
import jwt from 'jsonwebtoken';
import * as usersController from './controllers/usersController';
import io from './socket/socket';

const app = express();
const server = http.createServer(app);

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});
console.log(process.env.SESSION_SECRET);
app.use(
  sessionMiddleware,
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json());

const authenticateJWt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }
  //userid
  jwt.verify(token, process.env.SESSION_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    console.log('jwt user: ', user);
    //Maybe change
    req.user = { id: user as string };
    next();
  });
};

io.attach(server);

app.get('/', (req, res) => {
  console.log('Here');
  res.status(500).send('Hi');
});

app.get('/test', authenticateJWt, (req, res) => {
  res.send();
});

app.post('/login', usersController.login);

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    return res.send();
  });
});

server.listen(3001);
