import React, { useState, useEffect } from 'react';
import '../App.css';

interface Customer {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  address: string;
  service_requests: string; // Adjust this based on the actual type
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/customers/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data: Customer[] = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h1>Customer List</h1>
      <ul>
        {customers.map(customer => (
          <li key={customer.id}>
            Name: {customer.name} Surname: {customer.surname} Email: {customer.email} <br />
            Phone number: {customer.phone_number} Address: {customer.address} Service requests: {customer.service_requests}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CustomerList;
