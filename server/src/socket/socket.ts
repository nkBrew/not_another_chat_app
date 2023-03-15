import {
  CreateRoomResponse,
  Message,
  SocketUser,
} from '@not-another-chat-app/common';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { findUserById } from '../controllers/usersController';

interface ServerToClientEvents {
  rooms: (msg: CreateRoomResponse) => void;
  message: (msg: Message) => void;
  users: (socketUsers: SocketUser[]) => void;
}

interface SocketIOResponse {
  status: string;
}

interface ClientToServerEvents {
  joinRoom: (name: string) => void;
  createRoom: (
    name: string,
    callback: (response: SocketIOResponse) => void,
  ) => void;
  leaveRoom: (name: string) => void;
  message: (msg: Message) => void;
}

interface SocketData {
  userId: string;
}

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  object,
  SocketData
>({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
});

const socketUsers = new Map<string, SocketUser>();

io.use((socket, next) => {
  const token = socket.handshake.query.token as string;
  jwt.verify(token, process.env.SESSION_SECRET, (err, userId) => {
    if (err) {
      console.log(err);
      return next(new Error('Authentication error in Socket'));
    }
    socket.data.userId = userId as string;
    next();
  });
});

io.on('connection', (socket) => {
  console.log(` a user connected ${socket.id} }`);
  const rooms = io.sockets.adapter.rooms;
  const userId = socket.data.userId as string;
  const user = findUserById(userId);
  if (!user) {
    console.log('user not found but socket was made. Closing socket');
    socket.disconnect();
    return;
  }
  const socketUser = {
    username: user.username,
    socketId: socket.id,
    rooms: new Set<string>(),
    userId: userId,
  };

  socketUsers.set(socket.id, socketUser);

  socket.on('createRoom', (name: string, callback) => {
    console.log('created room: ', name);
    socket.join(name);
    callback({ status: 'ok' });

    console.log(socket.rooms);
    io.to(name).emit('rooms', { rooms: Array.from(socket.rooms) });
  });

  socket.on('joinRoom', (name: string) => {
    const { rooms } = io.sockets.adapter;
    if (rooms.get(name)) {
      socket.join(name);
    }
  });

  socket.on('leaveRoom', (name: string) => {
    socket.leave(name);
    io.to(name).emit('rooms', { rooms: Array.from(socket.rooms) });
  });

  socket.on('message', (msg) => {
    console.log(
      `message from: ${msg.from} to: ${msg.to} content: ${msg.content}`,
    );
    if (rooms.get(msg.to)) {
      io.to(msg.to).emit('message', msg);
    } else if (socketUsers.get(msg.to)) {
      socket.to(msg.to).to(socket.id).emit('message', msg);
    }
  });

  socket.on('disconnect', (reason, description) => {
    console.log(`Socket: ${socket.id} disconnected`);
    socketUsers.delete(socket.id);
  });

  socket.emit('users', Array.from(socketUsers.values()));
  // socket.join('testroom');
  console.log(rooms);
});

export default io;
