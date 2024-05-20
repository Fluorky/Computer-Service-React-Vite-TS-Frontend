import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import '../App.css';

interface Customer {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  address: string;
  service_requests: string[]; // Changed to array of strings
}

interface Address {
  id: number;
  address_line1: string;
  address_line2: string;
  city: string;
  country: string;
  postal_code: string;
}

interface ServiceRequest {
  id: number;
  name: string;
}

const CustomerCrud: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState<Customer>({
    id: 0,
    name: '',
    surname: '',
    email: '',
    phone_number: '',
    address: '',
    service_requests: [] // Changed to array of strings
  });
  const [addressData, setAddressData] = useState<Address[]>([]);
  const [serviceRequestsData, setServiceRequestsData] = useState<ServiceRequest[]>([]); 
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
    fetchAddress();
    fetchServiceRequests();
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

  const fetchAddress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/address/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch address data');
      }

      const addressData: Address[] = await response.json();
      setAddressData(addressData);
    } catch (error) {
      console.error('Error fetching address data:', error);
    }
  };

  const fetchServiceRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/service-requests/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch service requests data');
      }

      const serviceRequestsData: ServiceRequest[] = await response.json();
      setServiceRequestsData(serviceRequestsData);
    } catch (error) {
      console.error('Error fetching service requests data:', error);
    }
  };

  const handleSubmit = async (e: FormEvent, newCustomer: Customer) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('name', newCustomer.name);
      formData.append('surname', newCustomer.surname);
      formData.append('email', newCustomer.email);
      formData.append('phone_number', newCustomer.phone_number);
      formData.append('address', newCustomer.address);
      formData.append('service_requests', newCustomer.service_requests.join(','));

      const response = await fetch('http://127.0.0.1:8000/api/customers/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to add new customer');
      }

      fetchData();
    } catch (error) {
      console.error('Error adding new customer:', error);
    }
  };

  const handleEditCustomer = (customerId: number) => {
    setEditingCustomerId(customerId);
    const customerToEdit = customers.find(customer => customer.id === customerId);
    if (customerToEdit) {
      setNewCustomer(prevCustomer => ({
        ...prevCustomer,
        name: customerToEdit.name,
        surname: customerToEdit.surname,
        email: customerToEdit.email,
        phone_number: customerToEdit.phone_number,
        address: customerToEdit.address,
        service_requests: customerToEdit.service_requests
      }));
    }
  };

  const handleUpdateCustomer = async () => {
    if (editingCustomerId === null) return;

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('name', newCustomer.name);
      formData.append('surname', newCustomer.surname);
      formData.append('email', newCustomer.email);
      formData.append('phone_number', newCustomer.phone_number);
      formData.append('address', newCustomer.address);
      formData.append('service_requests', newCustomer.service_requests.join(','));

      const response = await fetch(`http://127.0.0.1:8000/api/customers/${editingCustomerId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update customer');
      }

      setEditingCustomerId(null);
      fetchData();
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleRemoveCustomer = async (customerId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/customers/${customerId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove customer');
      }

      fetchData();
    } catch (error) {
      console.error('Error removing customer:', error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer(prevCustomer => ({
      ...prevCustomer,
      [name]: value
    }));
  };

  const handleAddressChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedAddressId = e.target.value;
    setNewCustomer(prevCustomer => ({
      ...prevCustomer,
      address: selectedAddressId
    }));
  };

  const handleServiceRequestChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedServiceRequestId = e.target.value;
    setNewCustomer(prevCustomer => ({
      ...prevCustomer,
      service_requests: selectedServiceRequestId.split(',')
    }));
  };

  return (
    <div>
      <h1>Customer List</h1>
      <form onSubmit={(e) => handleSubmit(e, newCustomer)}>
        <input type="text" name="name" placeholder="Name" value={newCustomer.name} onChange={handleInputChange} />
        <input type="text" name="surname" placeholder="Surname" value={newCustomer.surname} onChange={handleInputChange} />
        <input type="email" name="email" placeholder="Email" value={newCustomer.email} onChange={handleInputChange} />
        <input type="text" name="phone_number" placeholder="Phone Number" value={newCustomer.phone_number} onChange={handleInputChange} />
        <select name="address" value={newCustomer.address} onChange={handleAddressChange}>
          <option value="">Select Address</option>
          {addressData.map(address => (
            <option key={address.id} value={address.id}>{`${address.address_line1}, ${address.address_line2}, ${address.city}, ${address.country}`}</option>
          ))}
        </select>
        <select name="service_requests" value={newCustomer.service_requests.join(',')} onChange={handleServiceRequestChange}>
          <option value="">Select Service Request</option>
          {serviceRequestsData.map(serviceRequest => (
            <option key={serviceRequest.id} value={serviceRequest.id.toString()}>{serviceRequest.name}</option>
          ))}
        </select>
        <button type="submit">Add Customer</button>
      </form>
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Service Requests</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.surname}</td>
              <td>{customer.email}</td>
              <td>{customer.phone_number}</td>
              <td>
                {customer.address && (
                  <>
                    <p>{addressData.find(address => address.id === Number(customer.address))?.address_line1}</p>
                    <p>{addressData.find(address => address.id === Number(customer.address))?.address_line2}</p>
                    <p>{addressData.find(address => address.id === Number(customer.address))?.city}</p>
                    <p>{addressData.find(address => address.id === Number(customer.address))?.country}</p>
                    <p>{addressData.find(address => address.id === Number(customer.address))?.postal_code}</p>
                  </>
                )}
              </td>
              <td>
                {customer.service_requests && (
                  <>
                    {customer.service_requests.map(requestId => (
                      <p key={requestId}>
                        {serviceRequestsData.find(serviceRequest => serviceRequest.id === Number(requestId))?.name}
                      </p>
                    ))}
                  </>
                )}
              </td>
              <td>
                {editingCustomerId === customer.id ? (
                  <button onClick={handleUpdateCustomer}>Save</button>
                ) : (
                  <>
                    <button onClick={() => handleEditCustomer(customer.id)}>Edit</button>
                    <button onClick={() => handleRemoveCustomer(customer.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerCrud;
