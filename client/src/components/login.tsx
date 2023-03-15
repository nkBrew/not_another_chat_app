'use client';
import { login, test } from '@/apis/backend';
import useUserStore, { User } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface LoginProps {
  // setUser: (user: { userId: string; email: string }) => void;
}

const Login = ({}: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      .catch((reason) => console.log(reason));
  };

  return (
    <div className="w-1/2 bg-red-500 rounded-lg">
      <form onSubmit={onSubmit}>
        <div className="flex flex-col p-10 h-full">
          <div className="mb-6">Login</div>
          <div className="mb-4">
            <label className="block">Email</label>
            <input
              className="rounded-lg w-full px-1"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-16">
            <label className="block">Password</label>
            <input
              className="rounded-lg px-1 w-full"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-red-400 w-full h-10 rounded-lg"
            // onClick={onSubmit}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
