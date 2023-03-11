import useSocketStore from '@/store/store';
import React, { useState } from 'react';
import { ModalProps } from './createRoom';
const JoinRoomModal = ({ show, setShow }: ModalProps) => {
  const [roomName, setRoomName] = useState('');
  const socket = useSocketStore((state) => state.socket);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <>
      {show && (
        <div className="fixed z-10 left-0 top-0 w-full h-full bg-black bg-opacity-30 p-52 flex justify-center items-center">
          <div className="w-full bg-white rounded-lg  scale-100 transition-transform">
            <form onSubmit={handleSubmit}>
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
                    className="bg-blue-400 py-1 px-3 rounded-md hover:bg-blue-500"
                    type="submit"
                  >
                    Create
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default JoinRoomModal;
