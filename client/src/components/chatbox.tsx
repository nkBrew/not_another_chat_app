'use client';
import useMessageStore from '@/store/messageStore';
import useSocketStore from '@/store/socketStore';
import useUserStore from '@/store/userStore';
import React, { useState } from 'react';

const Chatbox = () => {
  const [value, setValue] = useState('');
  const socket = useSocketStore((state) => state.socket);
  const { conversationId } = useMessageStore((state) => state);
  const { user } = useUserStore((state) => state);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`room: ${conversationId} msg: ${value}`);
    if (value.length === 0) {
      return;
    }
    socket?.emit('message', {
      fromUserId: user?.userId,
      conversationId,
      content: value,
    });
    setValue('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full h-full p-2 rounded-lg outline-none bg-zinc-700"
          value={value}
          placeholder={'Say Something!'}
          onChange={(e) => setValue(e.target.value)}
        />
        <input type="submit" hidden />
      </form>
    </div>
  );
};

export default Chatbox;
