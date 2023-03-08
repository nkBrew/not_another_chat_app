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
}

interface ClientToServerEvents {
  joinRoom: (name: string) => void;
  createRoom: (name: string) => void;
  leaveRoom: (name: string) => void;
}

const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
});

const rooms = new Map<string, string>();

io.on('connection', (socket) => {
  console.log(` a user connected ${socket.id} }`);

  socket.on('createRoom', (name: string) => {
    rooms.set(name, name);
    console.log('created room');
    console.log(rooms);
    socket.join(name);
    console.log(socket.rooms);
    console.log(socket.id);
    io.to(name).emit('rooms', { rooms: Array.from(socket.rooms) });
  });

  socket.on('joinRoom', (name: string) => {
    socket.join(name);
    // io.sockets.adapter.roo;
    io.to(name).emit('rooms', { rooms: Array.from(socket.rooms) });
  });

  socket.on('leaveRoom', (name: string) => {
    socket.leave(name);
    io.to(name).emit('rooms', { rooms: Array.from(socket.rooms) });
  });

  socket.join('testroom');
  // io.to('testroom').emit('connectToRoom', 'You are in room');
});

export default io;
