import cors from 'cors';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import http from 'http';
import jwt from 'jsonwebtoken';
import * as usersController from './controllers/usersController';
import io from './socket/socket';
import mongoose from 'mongoose';
import messageModel from './models/messageModel';

const app = express();
const server = http.createServer(app);

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});
app.use(
  sessionMiddleware,
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/test');
const db = mongoose.connection;
db.on('error', (error) => {
  console.log(error);
});

db.once('connected', () => console.log('Connected to database'));

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

app.get('/register', (req, res) => {
  console.log('Registering');
});

app.get('/test', (req, res) => {
  messageModel.testSave();
  res.send();
});

// app.get('/test', authenticateJWt, (req, res) => {
//   res.send();
// });

app.post('/login', usersController.login);

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    return res.send();
  });
});

console.log('Server Started');
server.listen(3001);
