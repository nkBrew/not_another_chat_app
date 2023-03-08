'use client';
import { test } from '@/apis/backend';
import { CreateRoomResponse } from '@not-another-chat-app/common';
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import CreateRoomModal from './createRoom';

const RoomChoice = () => {
  // test();
  const [socket, setSocket] = useState<Socket | undefined>();
  const [messages, setMessages] = useState(['']);
  const [rooms, setRooms] = useState(['']);
  const [showCreateRoomModal, setCreateRoomModal] = useState(false);
  const [x, setX] = useState(0);
  useEffect(() => {
    const socket = io('http://localhost:3001', {
      withCredentials: true,
    });
    socket.on('rooms', (msg: CreateRoomResponse) => {
      console.log(msg);
      setRooms(msg.rooms);
    });
    setSocket(socket);
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const emitCreateRoom = () => {
    socket?.emit('createRoom', 'created-test-room');
  };

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
          <div key={i}>{r}</div>
        ))}
      </div>
    </div>
  );
};

export default RoomChoice;
