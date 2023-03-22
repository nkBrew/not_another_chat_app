'use client';
import useOthersStore from '@/store/othersStore';
import useRoomStore from '@/store/roomStore';
import React from 'react';

const RoomPage = ({ params }: { params: { id: string } }) => {
  const [messages] = useRoomStore((state) => [state.messages]);
  // ? currently id is socket id. May Change
  // ? Should maybe be a selected user/room
  // const su = useSocketUsersStore((state) => state.socketUsers.get(params.id));
  // if (!su) {
  //   return;
  // }
  const { others } = useOthersStore((state) => state);

  return (
    <div className="overflow-y-auto overflow-x-hidden h-full">
      <div className="px-10 py-3">
        {messages.map((msg, i) => (
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

export default RoomPage;
