import Chatbox from '@/components/chatbox';
import RoomChoice from '@/components/roomChoice';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-screen text-gray-300">
      <div className="shrink-0">
        <RoomChoice />
      </div>
      <div className="w-full min-w-0 bg-zinc-800 grow-0 flex flex-col max-h-screen text-gray-300">
        <div className="h-full overflow-y-scroll scrollbar">{children}</div>
        <div className="w-full">
          <div className="p-3 h-full">
            <Chatbox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
