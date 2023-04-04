'use client';
import { register } from '@/apis/backend';
import useUserStore, { User } from '@/store/userStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Register = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, setUser } = useUserStore((state) => state);
  const router = useRouter();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    register(userName, password)
      .then((data: User) => {
        console.log('registered:', data);
        setUser(data);
        router.push('/rooms');
      })
      .catch((err) => {
        console.log(err);
        setError('Username taken');
      });
  };

  return (
    <div className="w-[500px] h-96 bg-zinc-800 text-zinc-100 p-10 rounded-lg shadow-2xl">
      <h2 className="mb-6 font-bold ">Register</h2>
      <form onSubmit={onSubmit}>
        <label className="block">Username</label>
        <input
          className="rounded-lg w-full p-1 outlin-green-300
        text-zinc-900
        bg-zinc-100
        focus:outline-none"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <div className="">
          <label className="block">Password</label>
          <input
            className="rounded-lg p-1 w-full focus:outline-none bg-zinc-100 text-zinc-900"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <p className=" p-1 italic text-sm">
          {`If you'd prefer not to register, you can use 5 test accounts! 
        Dev1, Dev2, ..., Dev5 can signin with the password of foobar`}
        </p>
        <div className="h-12">{error}</div>
        <div className="flex justify-between">
          <Link href="/login" className="py-2 px-3 rounded hover:bg-zinc-600">
            Already Have An Account?
          </Link>
          <button
            disabled={!(userName && password)}
            className="px-3 py-2 bg-green-600 rounded disabled:bg-zinc-600"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
