'use client';
import useRoomStore from '@/store/roomStore';
import useSocketStore from '@/store/store';
import React, { useState } from 'react';

const Chatbox = () => {
  const [value, setValue] = useState('');
  const socket = useSocketStore((state) => state.socket);
  const room = useRoomStore((state) => state.room);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.length === 0) {
      return;
    }
    socket?.emit('message', room, value);
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
