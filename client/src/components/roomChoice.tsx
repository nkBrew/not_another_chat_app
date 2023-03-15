'use client';
import { test } from '@/apis/backend';
import useRoomStore from '@/store/roomStore';
import useSocketUsersStore from '@/store/socketUsersStore';
import useSocketStore from '@/store/store';
import useUserStore from '@/store/userStore';
import {
  CreateRoomResponse,
  Message,
  SocketUser,
} from '@not-another-chat-app/common';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import CreateRoomModal from './createRoom';
import JoinRoomModal from './joinRoomModal';

const RoomChoice = () => {
  const [rooms, setRooms] = useState<string[]>([]);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);
  const [x, setX] = useState(0);
  const setSocket = useSocketStore((state) => state.setSocket);
  const [room, setRoom, setMessages] = useRoomStore((state) => [
    state.room,
    state.setRoom,
    state.setMessages,
  ]);
  const { socketUsers, setSocketUsers } = useSocketUsersStore((state) => state);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    console.log('eeeee: ', user?.accessToken);
    const socket = io('http://localhost:3001', {
      // withCredentials: true,
      // query: { token: 'feafe' },
      query: { token: user?.accessToken },
    });
    socket.on('connect_error', (err) => {
      console.log(err);
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
      setMessages([msg]);
    });
    setSocket(socket);
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  console.log(room);
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
        {Array.from(socketUsers.values()).map((su, i) => (
          <div key={`su-${i}`}>
            <Link
              href={`/rooms/pm/${su.socketId}`}
              onClick={() => setRoom(su.socketId)}
            >
              <div className="bg-purple-500 m-3 rounded-full h-28">
                {su.username}
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
