'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToasts, ToastProvider } from 'react-toast-notifications';
import "../styles/globals.css";

const CustomerForm = () => {
  const { addToast } = useToasts();
  const [customer, setCustomer] = useState({
    id: '', // Adjusted from _id to id
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });

  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(false); // Track whether we're editing a customer

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  const fetchAllCustomers = async () => {
    try {
      const response = await axios.get('/api/Customer');
      console.log(response.data, 'data');
      const email = localStorage.getItem('email');
      const filteredCustomers = response.data.filter(cust => cust.email === email);
      setCustomers(filteredCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem('email');
      const customerData = { ...customer, email };
      console.log(customerData, 'Customer data being sent');

      let response;
      if (editing) {
        response = await axios.put(`/api/Customer?id=${encodeURIComponent(customer.id)}`, customerData);
        addToast('Customer updated successfully', { appearance: 'success' });
      } else {
        response = await axios.post('/api/Customer', customerData);
        addToast('Customer created successfully', { appearance: 'success' });
      }

      console.log(response.data, 'Response from server');
      setCustomers([...customers, response.data]);

      clearForm();
      fetchAllCustomers();
    } catch (error) {
      console.error('Customer form submission error:', error);
      addToast('Failed to submit customer form', { appearance: 'error' });
    }
  };

  const clearForm = () => {
    setCustomer({
      id: '', // Adjusted from _id to id
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: '',
    });
    setEditing(false);
  };

  const handleEdit = async (id) => {
    if (!id) {
      console.error('ID is missing for editing');
      return;
    }

    try {
      const response = await axios.get(`/api/Customer?id=${encodeURIComponent(id)}`);
      const selectedCustomer = response.data;
      console.log(selectedCustomer); // Data is logged correctly

      setCustomer(selectedCustomer); // Update state with fetched data
      setEditing(true); // Set editing mode to true

    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  const handleUpdate = async () => {
    // This function is now handled by handleSubmit
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Customer Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={customer.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={customer.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={customer.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={customer.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">State</label>
            <input
              type="text"
              name="state"
              value={customer.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Zip Code</label>
            <input
              type="text"
              name="zipCode"
              value={customer.zipCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              value={customer.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={customer.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            {editing ? 'Update' : 'Submit'}
          </button>
        </form>
        {customers.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h2 className="text-xl font-bold mb-2">Existing Customers</h2>
            <ul>
              {customers.map((cust) => (
                <li key={cust.id}>
                  {cust.firstName} {cust.lastName}
                  <button
                    className="text-blue-500 hover:text-blue-700 ml-2"
                    onClick={() => handleEdit(cust.id)}
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const WrappedCustomerForm = () => (
  <ToastProvider>
    <CustomerForm />
  </ToastProvider>
);

export default WrappedCustomerForm;
