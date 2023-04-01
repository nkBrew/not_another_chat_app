'use client';
import Chatbox from '@/components/chatbox';
import RoomChoice from '@/components/roomChoice';
import Topbar from '@/components/topbar';
import React, { useEffect, useState } from 'react';
import { IconContext } from 'react-icons';
import { FiAlignLeft } from 'react-icons/fi';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [showSideBar, setShowSidebar] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <div className="flex flex-col h-full w-full text-gray-300">
      <div className="h-12 sm:h-0">
        <button onClick={() => setShowSidebar(!showSideBar)}>
          <div className="p-3 hover:text-green-300">
            <IconContext.Provider value={{ size: '2rem' }}>
              <FiAlignLeft />
            </IconContext.Provider>
          </div>
        </button>
      </div>
      <div className="flex flex-grow min-h-0">
        <div
          hidden={showSideBar && width < 640}
          className="overflow-y-scroll scrollbar"
        >
          <div className="">
            <RoomChoice />
          </div>
        </div>
        <div className="flex-grow bg-zinc-800 flex flex-col">
          <div className="flex-grow overflow-y-auto scrollbar">
            <div className="break-all">{children}</div>
          </div>
          <div className="p-3">
            <Chatbox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
