import {
  ConversationDto,
  CreateRoomResponse,
  Message,
  SocketUser,
  UserBasic,
} from '@not-another-chat-app/common';
import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import {
  findUserById,
  getUserMatchedConversations,
  getUsers,
  getUsersAndConversations,
  UserDto,
} from '../controllers/usersController';
import messageController from '../controllers/messageController';
import userSessionController from '../controllers/userSessionController';
import { NewMessage } from '../models/messageModel';

interface ServerToClientEvents {
  rooms: (msg: CreateRoomResponse) => void;
  message: (msg: Message) => void;
  users: (socketUsers: SocketUser[]) => void;
  get_messages: ({ messages }: { messages: NewMessage[] }) => void;
  users_testnew: (users: UserBasic[]) => void;
  pm_conversations: (conversations: ConversationDto[]) => void;
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
  get_messages: (req: GetMessagesReq) => void;
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
    // if (rooms.get(msg.to)) {
    //   io.to(msg.to).emit('message', msg);
    // } else if (socketUsers.get(msg.to)) {
    //   socket.to(msg.to).to(socket.id).emit('message', msg);
    //   messageController.saveMessage(msg);
    // }
    messageController.saveMessage(msg).then(async () => {
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

  socket.on('get_messages', (req) => {
    // const messages = messageController.getMessages(id);
    if (req.conversationId) {
      messageController
        .getMessagesByConversationId(req.conversationId)
        .then((foundMessages) => {
          socket
            .to(socket.id)
            .emit('get_messages', { messages: foundMessages });
        });
    }
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
