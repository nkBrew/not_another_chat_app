'use client';
import Login from '@/components/login';
import RoomChoice from '@/components/roomChoice';
import { useState } from 'react';

interface User {
  userId: string;
  email: string;
}

export default function Home() {
  // const [user, setUser] = useState<User | undefined>(undefined);
  return (
    <main className="flex justify-center items-center h-full">
      {/* <div className="bg-red-500">Hello</div> */}
      {/* {user ? <RoomChoice /> : <Login setUser={setUser} />} */}
      <Login />
    </main>
  );
}
