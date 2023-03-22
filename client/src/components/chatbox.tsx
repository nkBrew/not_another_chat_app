'use client';
import useRoomStore from '@/store/roomStore';
import useSocketStore from '@/store/socketStore';
import useUserStore from '@/store/userStore';
import React, { useState } from 'react';

const Chatbox = () => {
  const [value, setValue] = useState('');
  const socket = useSocketStore((state) => state.socket);
  const room = useRoomStore((state) => state.room);
  const { user } = useUserStore((state) => state);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`room: ${room} msg: ${value}`);
    if (value.length === 0) {
      return;
    }
    // socket?.emit('message', { from: socket.id, to: room, content: value });
    socket?.emit('message', {
      fromUserId: user?.userId,
      conversationId: room,
      content: value,
    });
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="w-full h-full"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <input type="submit" hidden />
    </form>
  );
};

export default Chatbox;
