'use client';
import { login } from '@/apis/backend';
import React, { useState } from 'react';

interface LoginProps {
  setUser: (user: { userId: string; email: string }) => void;
}

const Login = ({ setUser }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email);
    console.log(password);
    login(email, password)
      .then((data) => {
        console.log(data);
        setUser(data);
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
