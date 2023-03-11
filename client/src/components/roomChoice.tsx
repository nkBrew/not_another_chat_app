'use client';
import { test } from '@/apis/backend';
import useRoomStore from '@/store/roomStore';
import useSocketStore from '@/store/store';
import { CreateRoomResponse } from '@not-another-chat-app/common';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import CreateRoomModal from './createRoom';

const RoomChoice = () => {
  // test();
  // const [socket, setSocket] = useState<Socket | undefined>();
  const [messages, setMessages] = useState(['']);
  const [rooms, setRooms] = useState<string[]>([]);
  const [showCreateRoomModal, setCreateRoomModal] = useState(false);
  const [x, setX] = useState(0);
  const setSocket = useSocketStore((state) => state.setSocket);
  const [room, setRoom] = useRoomStore((state) => [state.room, state.setRoom]);

  useEffect(() => {
    const socket = io('http://localhost:3001', {
      withCredentials: true,
    });
    socket.on('rooms', (msg: CreateRoomResponse) => {
      console.log(msg);
      //First index is socketID
      setRooms([...msg.rooms.slice(1, msg.rooms.length)]);
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
    <div className="fixed left-0 h-full bg-red-500">
      <CreateRoomModal
        show={showCreateRoomModal}
        setShow={setCreateRoomModal}
      />
      <div className="flex flex-col">
        <button
          className="m-3 bg-blue-300 rounded-lg"
          //  onClick={emitCreateRoom}
          onClick={() => setCreateRoomModal(true)}
        >
          Create room
        </button>

        <button className="m-3 bg-blue-300 rounded-lg">Join room</button>
        {rooms.map((r, i) => (
          // <button
          //   className="bg-white m-3 rounded-full h-28"
          //   key={i}
          //   onClick={() => setRoom(r)}
          // >
          //   {r}
          // </button>
          <Link href={`/rooms/${r}`} key={i}>
            <div className="bg-white m-3 rounded-full h-28">{r}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RoomChoice;
