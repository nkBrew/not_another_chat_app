'use client';
import { login } from '@/apis/backend';
import useUserStore, { User } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(email, password)
      .then((data: User) => {
        console.log(data);
        setUser(data);
        router.push('/rooms');
      })
      .catch((reason) => {
        console.log(reason);
        setError('Invalid Credentials');
      });
  };
  const disableSubmit = !(email && password);
  return (
    <div className="w-1/2 bg-zinc-800 shadow-2xl rounded-lg">
      <form onSubmit={onSubmit}>
        <div className="flex flex-col p-10 h-full text-zinc-100">
          <h2 className="mb-6 font-bold ">Login</h2>
          <div className="mb-4">
            <label className="block">Username</label>
            <input
              className="rounded-lg w-full p-1 outlin-green-300
              text-zinc-900
              bg-zinc-100
              focus:outline-none"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="">
            <label className="block">Password</label>
            <input
              className="rounded-lg p-1 w-full focus:outline-none bg-zinc-100 text-zinc-900"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="h-12">{error}</div>
          <button
            type="submit"
            disabled={disableSubmit}
            className="bg-green-500 hover:bg-green-700 font-bold w-full h-10 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
