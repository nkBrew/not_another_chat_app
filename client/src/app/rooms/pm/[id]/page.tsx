'use client';
import useOthersStore from '@/store/othersStore';
import useMessagStore from '@/store/messageStore';
import useSocketStore from '@/store/socketStore';
import React, { useEffect } from 'react';

const PMPage = ({ params }: { params: { id: string } }) => {
  const { conversationId, messages } = useMessagStore((state) => state);

  const conversationMessages = messages.get(conversationId);
  const { others } = useOthersStore((state) => state);
  const { socket } = useSocketStore((state) => state);
  useEffect(() => {
    if (messages.get(conversationId)) {
      return;
    }
    socket?.emit('get_messages', conversationId);
  }, []);

  Date.now().toLocaleString();

  const formatDate = (timestamp: number) => {
    const now = Date.now();
    console.log(timestamp);
    let display = '';
    if (Math.round((now - timestamp) / (1000 * 60 * 60 * 24)) > 1) {
      display = display.concat(`${new Date(timestamp).toLocaleDateString()} `);
    }
    display = display.concat(new Date(timestamp).toLocaleTimeString());
    return display;
  };
  return (
    <div className="h-full max-w-full ">
      <div className="px-10 py-3">
        {conversationMessages &&
          conversationMessages.map((msg, i) => (
            <div className="mt-2" key={`msg-${i}`}>
              <div className="flex">
                <h3 className="pr-8">{others.get(msg.fromUserId)?.username}</h3>
                <div>{formatDate(msg.timestamp)}</div>
              </div>
              <div className="break-words">{msg.content}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PMPage;
