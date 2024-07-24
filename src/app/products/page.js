'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Drawer from '../drawer/page';
import useAuth from '@/hooks/useAuth';
import '../styles/globals.css';

const ProductsPage = () => {
  useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchProducts();
    const userEmail = localStorage.getItem('email');
    if (userEmail) {
      setEmail(userEmail);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/Product');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    calculateTotalPrice(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
    calculateTotalPrice(updatedCart);
  };

  const calculateTotalPrice = (cartItems) => {
    const total = cartItems.reduce((acc, item) => acc + Number(item.price), 0);
    setTotalPrice(total);
  };

  const submitOrder = async () => {
    try {
      if (!email) {
        console.error('Email is required to submit the order.');
        return;
      }

      const orderData = {
        products: cart,
        totalPrice: totalPrice,
        email: email,
      };

      const response = await axios.post('/api/sellproduct', orderData);
      console.log('Order submitted successfully:', response.data);

      setCart([]);
      setTotalPrice(0);
      alert('Your order has been submitted successfully!');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit your order. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Drawer />
      <div className="ml-64">
        <h1 className="text-3xl font-bold mb-4">Football Jerseys</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product._id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="rounded-lg mb-2"
                style={{ width: '200px', height: '200px' }}
              />
              <p className="text-gray-600">${Number(product.price).toFixed(2)}</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Cart Summary</h2>
          {cart.length > 0 ? (
            <>
              <ul className="mb-4">
                {cart.map((item) => (
                  <li key={item._id} className="flex justify-between items-center py-2 border-b">
                    <span>{item.name}</span>
                    <span>${Number(item.price).toFixed(2)}</span>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-600 ml-2 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">Total Price:</span>
                <span className="text-xl">${totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={submitOrder}
                className="mt-4 bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 focus:outline-none"
              >
                Submit Order
              </button>
            </>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
