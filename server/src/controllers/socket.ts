import { CreateRoomResponse } from '@not-another-chat-app/common';
import { Server, Socket } from 'socket.io';

// const multiplyN = (n: number) => (n: number, m: string) => n * m;
// const triple = multiplyN(3);
// const answer = triple('x');

// const m = (fun: () => void) => (x: number) => fun(x);

//No official type docs for how to do this but it works

//TODO  AUTH
// const wrap =
//   (middleware: any) =>
//   (socket: Socket, next: (err?: ExtendedError | undefined) => void) =>
//     middleware(socket.request, {}, next);

// io.use(wrap(sessionMiddleware));
// io.use(wrap(passport.initialize()));
// io.use(wrap(passport.session()));

// io.use((socket, next) => {
//   console.log(socket.request);
//   next();
//   if (socket.request.user) {
//     next();
//   } else {
//     next(new Error('unauthorized'));
//   }
// });

interface ServerToClientEvents {
  rooms: (msg: CreateRoomResponse) => void;
  message: (msg: string) => void;
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
  message: (room: string, msg: string) => void;
}

interface SocketData {
  username: string;
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

// const rooms = new Map<string, string>();

interface SocketUser {
  name: string;
  id: string;
  rooms: Set<string>;
}

const socketUsers = new Map<string, SocketUser>();

io.on('connection', (socket) => {
  console.log(` a user connected ${socket.id} }`);
  const rooms = io.sockets.adapter.rooms;
  const socketUser = {
    name: '',
    id: socket.id,
    rooms: new Set<string>(),
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

  socket.on('message', (room, msg) => {
    console.log(`msg ${msg} in room ${room}`);
    if (rooms.get(room)) {
      io.to(room).emit('message', msg);
    }
  });

  socket.join('testroom');
  console.log(rooms);
  // socket.emit('rooms', { rooms: Array.from(rooms.keys()) });
});

export default io;
