// src/app/drawer/Drawer.js
'use client';
import React, { useState, useEffect } from 'react';
import { MenuIcon, HomeIcon, UserIcon, BriefcaseIcon, ClipboardListIcon, LogoutIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FootballIcon } from '@heroicons/react/outline'; // Replace with the actual icon you choose
import '../styles/globals.css'

const Drawer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = () => {
            setIsOpen(false);
        };
        document.addEventListener('routeChangeStart', handleRouteChange);
        return () => {
            document.removeEventListener('routeChangeStart', handleRouteChange);
        };
    }, []);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        router.push('/login');
    };

    return (
        <>
            <button onClick={toggleDrawer} className="fixed top-4 left-4 text-white focus:outline-none z-50 bg-black rounded-full p-2">
                <MenuIcon className="w-8 h-8" />
            </button>
            <div className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64 z-40`}>
                <div className="p-4 flex justify-between items-center">
                    <HomeIcon className="w-24 h-auto text-white" /> {/* Replace with your chosen icon */}
                    <button onClick={toggleDrawer} className="text-white focus:outline-none">
                        <MenuIcon className="w-8 h-8" />
                    </button>
                </div>

                <nav className="flex-1">
                    <ul className="space-y-4">
                        <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer flex items-center" onClick={toggleDrawer}>
                            <Link href="/home">
                                <HomeIcon className="w-6 h-6 mr-2" />
                                <span className="text-white">Home</span>
                            </Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer flex items-center" onClick={toggleDrawer}>
                            <Link href="/dashboard">
                                <BriefcaseIcon className="w-6 h-6 mr-2" />
                                <span className="text-white">Dashboard</span>
                            </Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer flex items-center" onClick={toggleDrawer}>
                            <Link href="/customer">
                                <UserIcon className="w-6 h-6 mr-2" />
                                <span className="text-white">Customer Profile</span>
                            </Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer flex items-center" onClick={toggleDrawer}>
                            <Link href="/products">
                                <ClipboardListIcon className="w-6 h-6 mr-2" />
                                <span className="text-white">Products</span>
                            </Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer flex items-center" onClick={toggleDrawer}>
                            <Link href="/orders">
                                <ClipboardListIcon className="w-6 h-6 mr-2" />
                                <span className="text-white">See Orders</span>
                            </Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer flex items-center" onClick={handleLogout}>
                            <button className="flex items-center w-full text-left">
                                <LogoutIcon className="w-6 h-6 mr-2" />
                                <span className="text-white">Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Drawer;