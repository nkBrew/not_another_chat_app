'use client';
import LoadSpinner from '@/components/loadSpinner';
import Login from '@/components/login';
import useLoadingStore from '@/store/loadingStore';
import useUserStore from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  // const [loading, setLoading] = useState(true);
  const { loading, setLoading } = useLoadingStore((state) => state);
  const { user } = useUserStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/rooms');
      return;
    }
    // setLoading(false);
  }, [user, router]);

  return (
    <main className="flex justify-center items-center h-full">
      {/* <div className="bg-red-500">Hello</div> */}
      {/* {user ? <RoomChoice /> : <Login setUser={setUser} />} */}
      {/* {loading ? <LoadSpinner /> : <Login />} */}
      <Login />
    </main>
  );
}
