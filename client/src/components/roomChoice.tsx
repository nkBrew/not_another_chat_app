'use client';
import { test } from '@/apis/backend';
import useRoomStore from '@/store/roomStore';
import useSocketStore from '@/store/store';
import { CreateRoomResponse } from '@not-another-chat-app/common';
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

  useEffect(() => {
    const socket = io('http://localhost:3001', {
      withCredentials: true,
    });
    socket.on('rooms', (msg: CreateRoomResponse) => {
      console.log(msg);
      //First index is socketID
      // setRooms([...msg.rooms.slice(1, msg.rooms.length)]);
      setRooms([...msg.rooms]);
    });
    socket.on('message', (msg: string) => {
      setMessages(msg);
    });
    setSocket(socket);
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const emitCreateRoom = () => {
    // socket?.emit('createRoom', 'created-test-room');
  };

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
