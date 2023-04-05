import useUserStore from '@/store/userStore';
import io from 'socket.io-client';
import Router from 'next/router';
import {
  ConversationDto,
  CreateRoomResponse,
  Message,
  UserBasic,
} from '@not-another-chat-app/common';
import useMessageStore from '@/store/messageStore';
import useOthersStore from '@/store/othersStore';
import usePMStore from '@/store/pmStore';
import { baseURL } from './config';

const socketInit = () => {
  const socket = io(baseURL, {
    query: { token: useUserStore.getState().user?.accessToken },
    autoConnect: false,
  });

  socket.on('connect_error', (err) => {
    console.log(err);
    Router.push('/');
  });

  socket.on('rooms', (msg: CreateRoomResponse) => {
    console.log(msg);
  });

  socket.on('message', (msg: Message) => {
    console.log(`got message: ${msg}`);

    useMessageStore.getState().setMessages(msg.conversationId, [msg]);
  });

  socket.on('messages', (msgs: Message[]) => {
    console.log(`got message: ${msgs}`);

    if (!msgs || msgs.length < 1) {
      return;
    }
    useMessageStore.getState().setMessages(msgs[0].conversationId, msgs);
  });

  socket.on('users_testnew', (data: UserBasic[]) => {
    console.log(data);
    useOthersStore.getState().setOthers(data);
  });

  socket.on('pm_conversations', (data: ConversationDto[]) => {
    console.log(data);
    usePMStore.getState().setConversations(data);
  });

  socket.on('update_user', (user: UserBasic) => {
    useOthersStore.getState().setOther(user);
  });
  return socket;
};

export default socketInit;
