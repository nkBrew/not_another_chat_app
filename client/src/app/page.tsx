'use client';
import LoadSpinner from '@/components/loadSpinner';
import Login from '@/components/login';
import useLoadingStore from '@/store/loadingStore';
import useUserStore from '@/store/userStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiGithub } from 'react-icons/fi';

export default function Home() {
  // const [loading, setLoading] = useState(true);
  const { loading, setLoading } = useLoadingStore((state) => state);
  const { user } = useUserStore((state) => state);
  const router = useRouter();

  // useEffect(() => {
  //   if (user) {
  //     router.push('/rooms');
  //     return;
  //   }
  //   // setLoading(false);
  // }, [user, router]);

  return (
    <main className="w-full max-w-screen h-full overflow-x-hidden">
      <div className="bg-green-600 font-bold text-slate-100 h-96 w-full flex flex-col justify-center items-center">
        <h4 className="text-xl font-bold">oh no...</h4>
        <h1 className="text-5xl font-extrabold mb-5">Not Another Chat App!</h1>
        <div className="flex w-4/5 justify-center flex-wrap gap-10 ">
          <Link
            href="/login"
            className="py-1 px-10 text-zinc-900 bg-white rounded-lg hover:shadow-lg hover:text-green-700"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="py-1 px-10 bg-zinc-900 text-white rounded-lg hover:shadow-lg hover:bg-zinc-800 transition-all duration-75"
          >
            Register
          </Link>
        </div>
      </div>
      <div className=" ">
        <div className="[&>*:nth-child(even)]:bg-green-600 [&>*:nth-child(even)]:text-right bg-zinc-900 text-slate-100">
          <section className="px-5 flex justify-center">
            <div className="w-4/5">
              <h2>{`Don't Be Scared...!`}</h2>
              <p>
                {`It's just another chat application, and its here to take on the 
            countless other applications vying for your time! Who knows, maybe 
            it'll be the next MSN (hopefully not)`}
              </p>
            </div>
          </section>
          <section className="px-5 flex justify-center">
            <div className="w-4/5">
              <h2>Real Time!</h2>
              <p>{`I built Not Another Chat App using sockets so you can talk to 
            your friends in real time! You probably won't, and that's fine! My 
            goal was to learn Web Sockets. Currently it's built using socket-io, 
            however I hope to implement it with standard WebSockets in the future.
            `}</p>
            </div>
          </section>
          <section className="px-5 flex justify-center">
            <div className="w-4/5">
              <h2>Like an Elephant...</h2>
              <p>
                {`Not another chat app remembers everything! Except when I dont
            want it to or when a scheduled job runs through to clear the database 
            and save my wallet! The goal was to learn MongoDB so I figured it's a
            great way to store your messages!`}
              </p>
            </div>
          </section>
          <section className="px-5 flex justify-center">
            <div className="w-4/5">
              <h2>Next, React, Tailwind...</h2>
              <p>{`I built this beautifull Front End using Next and React, two 
            of my favorite tech stack tools. Tailwind was used to style everything, 
            and it's been a tool ive been meaning to learn `}</p>
            </div>
          </section>
          <section className="px-5 flex justify-center">
            <div className="w-4/5">
              <h2>Custom Back End!</h2>
              <p>
                {`Since I wanted to do Sockets, and MongoDB, that meant Not Another Chat App had 
              to have a custom backend server. A Perfect time to learn Express!`}
              </p>
            </div>
          </section>
          <section className="px-5 flex justify-center">
            <div className="w-4/5">
              <h2>
                MongoDB, Express, React, Next? Oh no, this is just another...
              </h2>
              <p>
                {`Yup, Not Another Chat App is also just Another MERN app!`}
              </p>
            </div>
          </section>
          <section className="px-5  flex justify-center">
            <div className="w-4/5 ">
              <div className="mb-5">
                <h4>Contact</h4>
                <p>nichoalsjwb@gmail.com</p>
                <p>nicholasbrunoro.com</p>
              </div>
              <Link
                href="https://github.com/nkBrew/not_another_chat_app"
                rel="noopener noreferrer"
                target="_blank"
                className="bg-green-600 hover:bg-green-800 py-2 px-4 rounded-lg"
              >
                <span className="pr-2">Check Out the Repo</span>
                <FiGithub className="inline" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
