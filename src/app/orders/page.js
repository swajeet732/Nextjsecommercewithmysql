'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/globals.css';
import Drawer from '../drawer/page';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); 

    useEffect(() => {
        const fetchOrders = async () => {
            const email = localStorage.getItem('email');
            if (!email) {
                setError('No email found in local storage.');
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`http://localhost:3000/api/getorders?email=${email}`);
                setOrders(res.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching orders.');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <p className="text-center mt-10 text-xl">Loading...</p>;
    }

    if (error) {
        return <p className="text-center mt-10 text-red-500">{error}</p>;
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Drawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
            <div className={`flex-1 py-10 px-5 transition-all duration-300 ${isDrawerOpen ? 'ml-64' : 'ml-0'}`}>
                <h1 className="text-3xl font-bold text-center mb-8">Orders for {localStorage.getItem('email')}</h1>
                {orders.length === 0 ? (
                    <p className="text-center text-lg">No orders found.</p>
                ) : (
                    <ul className="space-y-6 max-w-4xl mx-auto">
                        {orders.map((order) => (
                            <li key={order.id} className="bg-white p-6 rounded-lg shadow-lg">
                                <div className="mb-4">
                                    <p className="text-lg font-semibold">Order ID: <span className="text-gray-700">{order.id}</span></p>
                                    <p className="text-lg font-semibold">Total Price: <span className="text-gray-700">${(typeof order.totalPrice === 'number' ? order.totalPrice.toFixed(2) : order.totalPrice)}</span></p>
                                </div>
                                <ul className="space-y-3">
                                    {Array.isArray(order.products) ? order.products.map((product, index) => (
                                        <li key={index} className="border-t pt-3">
                                            <p className="text-base font-medium">Product Name: <span className="text-gray-700">{product.name}</span></p>
                                            <p className="text-base font-medium">Product Price: <span className="text-gray-700">${(typeof product.price === 'number' ? product.price.toFixed(2) : product.price)}</span></p>
                                        </li>
                                    )) : <p>No products found for this order.</p>}
                                </ul>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
