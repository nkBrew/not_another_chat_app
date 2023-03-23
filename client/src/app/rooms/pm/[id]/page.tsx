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

  return (
    <div className="overflow-y-auto overflow-x-hidden h-full">
      <div className="px-10 py-3">
        {conversationMessages &&
          conversationMessages.map((msg, i) => (
            <div className="mt-2" key={`msg-${i}`}>
              {/* <h3>{su.username}</h3> */}
              <h3>{others.get(msg.fromUserId)?.username}</h3>
              <div>{msg.content}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PMPage;
