import Chatbox from '@/components/chatbox';
import RoomChoice from '@/components/roomChoice';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <RoomChoice />
      <div className="bg-navy-light w-full flex flex-col max-h-screen">
        <div className="h-5/6">
          {children}
          {/* <div className="max-h-full">{children}</div> */}
        </div>
        <div className="bg-red-200 w-full h-1/6">
          <div className="p-3 h-full">
            <Chatbox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
