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
    <div className="w-1/2 bg-zinc-500 shadow-2xl rounded-lg">
      <form onSubmit={onSubmit}>
        <div className="flex flex-col p-10 h-full">
          <div className="mb-6">Login</div>
          <div className="mb-4">
            <label className="block">Email</label>
            <input
              className="rounded-lg w-full p-1 outlin-green-300 focus:outline-none"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="">
            <label className="block">Password</label>
            <input
              className="rounded-lg p-1 w-full focus:outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="h-12">{error}</div>
          <button
            type="submit"
            disabled={disableSubmit}
            className="bg-green-300 w-full h-10 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
