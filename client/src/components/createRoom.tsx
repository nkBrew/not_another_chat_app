'use client';
import React, { useState } from 'react';

interface CreateRoomModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

const CreateRoomModal = ({ show, setShow }: CreateRoomModalProps) => {
  const [roomName, setRoomName] = useState('');
  return (
    <>
      {show && (
        <div className="fixed z-10 left-0 top-0 w-full h-full bg-black bg-opacity-30 p-52 flex justify-center items-center">
          <div className="w-full bg-white rounded-lg  scale-100 transition-transform">
            <div className="flex flex-col p-10">
              <div className="flex justify-between">
                <div>Create Room</div>
                <button onClick={() => setShow(false)}>X</button>
              </div>
              <div className="">
                <input
                  className="bg-gray-200 rounded-sm p-1 w-full"
                  onChange={(e) => setRoomName(e.target.value)}
                  value={roomName}
                />
                <button
                  className="bg-blue-200 py-1 px-3 rounded-md"
                  type="submit"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateRoomModal;
