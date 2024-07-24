// pages/Home.js
'use client';
import React from 'react';
import Drawer from '../drawer/page';
import useAuth from '@/hooks/useAuth';
import '../styles/globals.css'
const Home = () => {
  useAuth();
  return (
    <div className="flex">
      <Drawer />
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Welcome to Lucifer Jersey Store!</h1>
          <p className="text-gray-600 text-center mb-6">
            This is a simple example of a Next.js application styled with Tailwind CSS.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img src="/images/goat.jpg" alt="Goat" className="rounded-lg shadow-lg"/>
            <img src="/images/goatt.jpg" alt="Goatt" className="rounded-lg shadow-lg"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
