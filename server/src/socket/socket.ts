import {
  ConversationDto,
  CreateRoomResponse,
  Message,
  NewMessage,
  SocketUser,
  UserBasic,
} from '@not-another-chat-app/common';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { findUserById, getUsers } from '../controllers/usersController';
import * as messageController from '../controllers/messageController';
import * as userSessionController from '../controllers/userSessionController';

interface ServerToClientEvents {
  rooms: (msg: CreateRoomResponse) => void;
  message: (msg: NewMessage) => void;
  users: (socketUsers: SocketUser[]) => void;
  users_testnew: (users: UserBasic[]) => void;
  pm_conversations: (conversations: ConversationDto[]) => void;
  messages: (msgs: Message[]) => void;
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
  get_messages: (conversationId: string) => void;
}

interface SocketData {
  userId: string;
}

interface GetMessagesReq {
  conversationId?: string;
  users?: string[];
  // userId1: string;
  // userId2: string;
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

io.on('connection', async (socket) => {
  console.log(` a user connected ${socket.id} }`);
  const rooms = io.sockets.adapter.rooms;
  const userId = socket.data.userId as string;
  const user = await findUserById(userId);
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

  userSessionController.saveUserSession(userId, socket.id);

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
      `message from: ${msg.fromUserId} to: ${msg.conversationId} content: ${msg.content}`,
    );

    messageController.saveMessage(msg).then(async (msg) => {
      if (!msg) {
        return;
      }
      const conversation = await messageController.getConversationById(
        msg.conversationId,
      );
      if (!conversation) {
        return;
      }
      const userSessions = userSessionController.findUserSessionsByUserIds(
        conversation.memberIds,
      );
      console.log(socket.id);
      console.log(userSessions.map((us) => us.socketId));
      io.to(userSessions.map((us) => us.socketId)).emit('message', msg);
      console.log('got here');
    });
  });

  socket.on('get_messages', (conversationId) => {
    console.log('got here');
    messageController
      .getMessagesByConversationId(conversationId)
      .then((foundMessages) => {
        // console.log('then got here', foundMessages);
        // console.log(foundMessages);
        io.to(socket.id).emit('messages', foundMessages);
      });
  });

  socket.on('disconnect', (reason, description) => {
    console.log(`Socket: ${socket.id} disconnected`);
    socketUsers.delete(socket.id);
    userSessionController.deleteUserSession(socket.id);
  });

  //Get users

  getUsers().then((users) => {
    socket.emit('users_testnew', users);
  });

  messageController.getUserConversations(userId).then((conversations) => {
    socket.emit('pm_conversations', conversations);
  });

  // socket.join('testroom');
  console.log(rooms);
});

export default io;
