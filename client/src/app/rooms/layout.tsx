import Chatbox from '@/components/chatbox';
import RoomChoice from '@/components/roomChoice';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen text-gray-300">
      <RoomChoice />
      <div className="w-full bg-zinc-800  flex flex-col max-h-screen text-gray-300">
        <div className="h-full overflow-y-scroll scrollbar">
          {children}
          {/* <div className="max-h-full">{children}</div> */}
        </div>
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
