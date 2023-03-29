'use client';
import { test } from '@/apis/backend';
import usePMStore from '@/store/pmStore';
import useMessageStore from '@/store/messageStore';
import useSocketStore from '@/store/socketStore';
import useUserStore from '@/store/userStore';
import {
  ConversationDto,
  CreateRoomResponse,
  Message,
  SocketUser,
  UserBasic,
} from '@not-another-chat-app/common';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import CreateRoomModal from './createRoom';
import JoinRoomModal from './joinRoomModal';
import useOthersStore from '@/store/othersStore';
import useSocketUsersStore from '@/store/socketUsersStore';

const RoomChoice = () => {
  const [rooms, setRooms] = useState<string[]>([]);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);
  const [x, setX] = useState(0);
  const setSocket = useSocketStore((state) => state.setSocket);
  const { conversationId, setMessages, setConversationId } = useMessageStore(
    (state) => state,
  );
  const { socketUsers, setSocketUsers } = useSocketUsersStore((state) => state);
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const { conversations, setConversations } = usePMStore((state) => state);
  const { others, setOthers } = useOthersStore((state) => state);
  useEffect(() => {
    console.log('eeeee: ', user?.accessToken);
    const socket = io('http://localhost:3001', {
      // withCredentials: true,
      // query: { token: 'feafe' },
      query: { token: user?.accessToken },
    });
    socket.on('connect_error', (err) => {
      console.log(err);
      router.push('/');
    });

    socket.on('rooms', (msg: CreateRoomResponse) => {
      console.log(msg);
      setRooms([...msg.rooms]);
    });

    socket.on('users', (socketUsers: SocketUser[]) => {
      console.log(socketUsers);
      setSocketUsers(socketUsers);
    });

    socket.on('message', (msg: Message) => {
      console.log(`got message: ${msg}`);

      setMessages(msg.conversationId, [msg]);
    });

    socket.on('messages', (msgs: Message[]) => {
      console.log(`got message: ${msgs}`);

      if (!msgs || msgs.length < 1) {
        return;
      }
      setMessages(msgs[0].conversationId, msgs);
    });

    socket.on('users_testnew', (data: UserBasic[]) => {
      console.log(data);
      setOthers(data);
    });

    socket.on('pm_conversations', (data: ConversationDto[]) => {
      console.log(data);
      setConversations(data);
    });
    setSocket(socket);
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  // console.log(`others: `);
  return (
    <div className="bg-zinc-700 w-40 min-h-full">
      <CreateRoomModal
        show={showCreateRoomModal}
        setShow={setShowCreateRoomModal}
      />
      <JoinRoomModal show={showJoinRoomModal} setShow={setShowJoinRoomModal} />
      <div className="flex flex-col">
        <button
          className="m-3 bg-blue-300 rounded-lg"
          //  onClick={emitCreateRoom}
          onClick={() => setShowCreateRoomModal(true)}
        >
          Create room
        </button>

        <button
          className="m-3 bg-blue-300 rounded-lg"
          onClick={() => setShowJoinRoomModal(true)}
        >
          Join room
        </button>
        {/* {Array.from(socketUsers.values()).map((su, i) => ( */}
        <ul className="p-1">
          {Array.from(conversations.values()).map((convo, i) => (
            <li key={`convo-${i}`} className="hover:bg-zinc-600 p-3 rounded-md">
              <Link
                href={`/rooms/pm/${convo.conversationId}`}
                onClick={() => setConversationId(convo.conversationId)}
              >
                <h3 className="">
                  {/* {su.username} */}
                  {convo.memberIds
                    .filter(
                      (id) =>
                        id !== user?.userId || convo.memberIds.length === 1,
                    )
                    .map((userId, j) => (
                      <div key={j}>
                        {`${others.get(userId)?.username}${
                          userId === user?.userId ? ' (You)' : ''
                        }`}
                      </div>
                    ))}
                </h3>
              </Link>
            </li>
          ))}
        </ul>
        {/* {rooms.map((r, i) => (
          // <button
          //   className="bg-white m-3 rounded-full h-28"
          //   key={i}
          //   onClick={() => setRoom(r)}
          // >
          //   {r}
          // </button>
          <Link href={`/rooms/${r}`} key={i} onClick={() => setRoom(r)}>
            <div className="bg-white m-3 rounded-full h-28">{r}</div>
          </Link>
        ))} */}
      </div>
    </div>
  );
};

export default RoomChoice;
