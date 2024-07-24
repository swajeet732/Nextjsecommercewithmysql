// src/pages/dashboard.js
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Drawer from '../drawer/page';
import useAuth from '@/hooks/useAuth';
import '../styles/globals.css'


const DashboardPage = () => {
  useAuth();
  const router = useRouter();
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    // Manually add image details from the public/photos directory
    const localImages = [
      { id: 1, src: '/photos/1.jpg', author: 'Author 1' },
      { id: 2, src: '/photos/3.avif', author: 'Author 2' },
      { id: 3, src: '/photos/4.webp', author: 'Author 3' },
      { id: 4, src: '/photos/5.avif', author: 'Author 4' },
      { id: 5, src: '/photos/6.jpg', author: 'Author 5' },
      { id: 6, src: '/photos/7.png', author: 'Author 6' },
      { id: 7, src: '/photos/9.webp', author: 'Author 7' },
      { id: 8, src: '/goat.jpg', author: 'Author 8' },
      { id: 9, src: '/goatt.jpg', author: 'Author 9' },
      { id: 10, src: '/images/bellingham.jpg', author: 'Author 10' },
      { id: 11, src: '/images/beckham.jpg', author: 'Author 11' },
      { id: 12, src: '/images/zidane.webp', author: 'Author 12' },
    ];
    setImages(localImages);
  };

  const handleShopNowClick = () => {
    router.push('/products');
  };

  return (
    <div className="container mx-auto px-4 py-8 flex">
      <Drawer />

      <div className="flex-grow ml-64">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {images.map((image) => (
            <div key={image.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <img
                src={image.src}
                alt={`Image ${image.id}`}
                className="h-48 w-full object-cover rounded-lg mb-4"
              />
              <p className="text-gray-800 font-medium text-center">{image.author}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <button
            onClick={handleShopNowClick}
            className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
