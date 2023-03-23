'use client';
import useMessageStore from '@/store/messageStore';
import React from 'react';

const RoomPage = () => {
  const [messages] = useMessageStore((state) => [state.messages]);
  return (
    <div className="overflow-y-auto overflow-x-hidden h-full">
      <div className="px-10 py-3">
        {/* {messages.map((msg, i) => (
          <div className="mt-2" key={`msg-${i}`}>
            <h3>Username</h3>
            <div>{msg.content}</div>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default RoomPage;
