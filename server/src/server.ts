import cors from 'cors';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import * as usersController from './controllers/usersController';
import io from './socket/socket';
import mongoose from 'mongoose';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: '*',
    methods: ['GET, POST'],
  }),
);
app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/test');
// const db = mongoose.connection;
// db.on('error', (error) => {
//   console.log(error);
// });

const dbURL = process.env.MONGODB_URL;
const credentials = `${__dirname}/auth.pem`;

// console.log(
//   `mongodb+srv://${process.env.MONGODB_URL}:${process.env.MONGODB_PASSWORD}@not-another-chat-app.0herwk8.mongodb.net/?retryWrites=true&w=majority`,
// );
mongoose.connect(process.env.MONGODB_URL);

const db = mongoose.connection;

db.once('connected', () => console.log('Connected to database'));

// const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader && authHeader.split(' ')[1];
//   if (!token) {
//     return res.sendStatus(401);
//   }
//   //userid
//   jwt.verify(token, process.env.SESSION_SECRET, (err, user) => {
//     if (err) {
//       return res.sendStatus(403);
//     }
//     console.log('jwt user: ', user);
//     //Maybe change
//     req.user = { id: user as string };
//     next();
//   });
// };

io.attach(server);

app.get('/', (req, res) => {
  console.log('Here');
  res.status(500).send('Hi');
});

app.post('/register', usersController.register);
app.post('/login', usersController.login);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('Error Handling Middleware called');
  console.log('Path: ', req.path);
  console.error('Error: ', error);
});
console.log('Server Started');
console.log(port);

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
