'use client';
import { test } from '@/apis/backend';
import usePMStore from '@/store/pmStore';
import useRoomStore from '@/store/roomStore';
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
  const { room, setRoom, setMessages, setConversationId } = useRoomStore(
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
      //First index is socketID
      // setRooms([...msg.rooms.slice(1, msg.rooms.length)]);
      setRooms([...msg.rooms]);
    });

    socket.on('users', (socketUsers: SocketUser[]) => {
      console.log(socketUsers);
      setSocketUsers(socketUsers);
    });

    socket.on('message', (msg: Message) => {
      console.log(`got message: ${msg}`);
      setMessages([msg]);
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
    <div className="h-full bg-red-500">
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
        {Array.from(conversations.values()).map((convo, i) => (
          <div key={`convo-${i}`}>
            <Link
              href={`/rooms/pm/${convo.conversationId}`}
              onClick={() => setRoom(convo.conversationId)}
            >
              <div className="bg-purple-500 m-3 rounded-full h-28">
                {/* {su.username} */}
                {convo.memberIds
                  .filter(
                    (id) => id !== user?.userId || convo.memberIds.length === 1,
                  )
                  .map((userId, j) => (
                    <div key={j}>
                      {`${others.get(userId)?.username}${
                        userId === user?.userId ? ' (You)' : ''
                      }`}
                    </div>
                  ))}
              </div>
            </Link>
          </div>
        ))}
        {rooms.map((r, i) => (
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
        ))}
      </div>
    </div>
  );
};

export default RoomChoice;
