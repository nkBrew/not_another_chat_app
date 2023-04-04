'use client';
import usePMStore from '@/store/pmStore';
import useMessageStore from '@/store/messageStore';
import useSocketStore from '@/store/socketStore';
import useUserStore from '@/store/userStore';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import CreateRoomModal from './createRoom';
import JoinRoomModal from './joinRoomModal';
import useOthersStore from '@/store/othersStore';
import { FiLogOut } from 'react-icons/fi';
import { IconContext } from 'react-icons';
import { useRouter } from 'next/navigation';
import socketInit from '@/apis/socket';

const RoomChoice = () => {
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);
  const { setSocket, removeSocket } = useSocketStore((state) => state);
  const { setConversationId } = useMessageStore((state) => state);
  const { user, logout } = useUserStore((state) => state);
  const { conversations, removeConversations } = usePMStore((state) => state);
  const { others } = useOthersStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    console.log('eeeee: ', user?.accessToken);
    const socket = socketInit();
    socket.connect();

    socket.on('connect', () => {
      setSocket(socket);
    });
    return () => {
      socket.disconnect();
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const onLogoutClick = () => {
    logout();
    // socket.disconnect();
    removeSocket();
    removeConversations();
    router.push('/');
  };

  return (
    <div className="bg-zinc-700 w-40 h-full">
      {
        // * coming soon
        /* <CreateRoomModal
        show={showCreateRoomModal}
        setShow={setShowCreateRoomModal}
      />
      <JoinRoomModal show={showJoinRoomModal} setShow={setShowJoinRoomModal} /> */
      }
      <div className="flex flex-col">
        {
          // * coming soon
          /* <button
          className="m-3 bg-blue-300 rounded-lg"
          onClick={() => setShowCreateRoomModal(true)}
        >
          Create room
        </button>

        <button
          className="m-3 bg-blue-300 rounded-lg"
          onClick={() => setShowJoinRoomModal(true)}
        >
          Join room
        </button> */
        }

        <ul className="p-1">
          <li className="p-3">
            <button
              className="flex justify-center hover:text-green-300"
              onClick={onLogoutClick}
            >
              <IconContext.Provider value={{ size: '2rem' }}>
                <FiLogOut />
              </IconContext.Provider>
            </button>
          </li>
          {Array.from(conversations.values()).map((convo, i) => (
            <li key={`convo-${i}`}>
              <Link
                href={`/rooms/pm/${convo.conversationId}`}
                onClick={() => setConversationId(convo.conversationId)}
              >
                <h3 className="hover:bg-zinc-600 p-3 rounded-md ">
                  {convo.memberIds
                    .filter(
                      (id) =>
                        id !== user?.userId || convo.memberIds.length === 1,
                    )
                    .map((userId, j) => (
                      <div
                        key={j}
                        className={`border-r-2 ${
                          others.get(userId)?.online
                            ? 'border-green-400'
                            : 'border-grey-400'
                        }`}
                      >
                        {`${others.get(userId)?.username}${
                          userId === user?.userId ? ' (You)' : ''
                        }`}
                      </div>
                    ))}
                </h3>
              </Link>
            </li>
          ))}
          {/* {Array.from(Array(40).keys()).map(() => (
            <h3>hi</h3>
          ))} */}
        </ul>
      </div>
    </div>
  );
};

export default RoomChoice;
