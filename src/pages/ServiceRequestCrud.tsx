import React, { useState, useEffect } from 'react';

interface ServiceRequest {
  id: number;
  name: string;
  price: string;
  tax: string;
  description: string;
  requested_at: string;
  completion_deadline: string;
  priority: string;
  state: string;
  requested_by: string;
  owned_by: string;
  billing_address: string;
  shipping_address: string;
}

interface Customer {
  id: number;
  name: string;
  surname: string;
}

interface Address {
  id: number;
  address_line1: string;
  address_line2: string;
  city: string;
  country: string;
}

interface ServiceTechnician {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

function ServiceRequestCrud() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [serviceTechnicians, setServiceTechnicians] = useState<ServiceTechnician[]>([]);
  const [newServiceRequest, setNewServiceRequest] = useState<ServiceRequest>({
    id: 0,
    name: '',
    price: '',
    tax: '',
    description: '',
    requested_at: '',
    completion_deadline: '',
    priority: '',
    state: '',
    requested_by: '',
    owned_by: '',
    billing_address: '',
    shipping_address: ''
  });
  const [editingServiceRequestId, setEditingServiceRequestId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
    fetchCustomers();
    fetchAddresses();
    fetchServiceTechnicians();
  }, []);

  const fetchData = async () => {
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
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setServiceRequests(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchCustomers = async () => {
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
        throw new Error('Failed to fetch customers data');
      }

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers data:', error);
    }
  };

  const fetchAddresses = async () => {
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
        throw new Error('Failed to fetch addresses data');
      }

      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      console.error('Error fetching addresses data:', error);
    }
  };

  const fetchServiceTechnicians = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/service-technicians/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch service technicians data');
      }

      const data = await response.json();
      setServiceTechnicians(data);
    } catch (error) {
      console.error('Error fetching service technicians data:', error);
    }
  };

  
  const handleSubmit = async (e: React.FormEvent, newServiceRequest: ServiceRequest) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
  
      (Object.keys(newServiceRequest) as (keyof ServiceRequest)[]).forEach((key) => {
        formData.append(key, newServiceRequest[key].toString());
      });
      for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
    }
      const response = await fetch('http://127.0.0.1:8000/api/service-requests/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`
        },
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Failed to add new service request');
      }
  
      fetchData();
    } catch (error) {
      console.error('Error adding new service request:', error);
    }
  };

  const handleEditServiceRequest = (serviceRequestId: number) => {
    setEditingServiceRequestId(serviceRequestId);
    const serviceRequestToEdit = serviceRequests.find(serviceRequest => serviceRequest.id === serviceRequestId);
    setNewServiceRequest(serviceRequestToEdit!);
  };

  const handleUpdateServiceRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      (Object.keys(newServiceRequest) as (keyof ServiceRequest)[]).forEach((key) => {
        formData.append(key, newServiceRequest[key].toString());
      });

      const response = await fetch(`http://127.0.0.1:8000/api/service-requests/${editingServiceRequestId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update service request');
      }

      setEditingServiceRequestId(null);
      fetchData();
    } catch (error) {
      console.error('Error updating service request:', error);
    }
  };

  const handleRemoveServiceRequest = async (serviceRequestId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/service-requests/${serviceRequestId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove service request');
      }

      fetchData();
    } catch (error) {
      console.error('Error removing service request:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewServiceRequest({ ...newServiceRequest, [e.target.name]: e.target.value });
  };

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return ''; // Handle case where date is empty

    const formattedDate = new Date(dateTime);

    const year = formattedDate.getFullYear();
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = formattedDate.getDate().toString().padStart(2, '0');
    const hours = formattedDate.getHours().toString().padStart(2, '0');
    const minutes = formattedDate.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div>
      <h1>Service Request List</h1>
      <form onSubmit={(e) => handleSubmit(e, newServiceRequest)}>
        <input type="text" name="name" placeholder="Name" value={newServiceRequest.name} onChange={handleInputChange} />
        <input type="text" name="price" placeholder="Price" value={newServiceRequest.price} onChange={handleInputChange} />
        <input type="text" name="tax" placeholder="Tax" value={newServiceRequest.tax} onChange={handleInputChange} />
        <input type="text" name="description" placeholder="Description" value={newServiceRequest.description} onChange={handleInputChange} />
        <input type="datetime-local" name="requested_at" placeholder="Requested At" value={formatDateTime(newServiceRequest.requested_at)} onChange={handleInputChange} />
        <input type="datetime-local" name="completion_deadline" placeholder="Completion Deadline" value={formatDateTime(newServiceRequest.completion_deadline)} onChange={handleInputChange} />
        <input type="text" name="priority" placeholder="Priority" value={newServiceRequest.priority} onChange={handleInputChange} />
        <input type="text" name="state" placeholder="State" value={newServiceRequest.state} onChange={handleInputChange} />
        <select name="requested_by" value={newServiceRequest.requested_by} onChange={handleInputChange}>
          <option value="">Select Requested By</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>{`${customer.name} ${customer.surname}`}</option>
          ))}
        </select>
        <select name="owned_by" value={newServiceRequest.owned_by} onChange={handleInputChange}>
          <option value="">Select Service Technician</option>
          {serviceTechnicians.map(technician => (
            <option key={technician.id} value={technician.id}>{`${technician.first_name} ${technician.last_name} ${technician.email}`}</option>
          ))}
        </select>

        <select name="billing_address" value={newServiceRequest.billing_address} onChange={handleInputChange}>
          <option value="">Select Billing Address</option>
          {addresses.map(address => (
            <option key={address.id} value={address.id}>{`${address.address_line1}, ${address.address_line2}, ${address.city}, ${address.country}`}</option>
          ))}
        </select>
        <select name="shipping_address" value={newServiceRequest.shipping_address} onChange={handleInputChange}>
          <option value="">Select Shipping Address</option>
          {addresses.map(address => (
            <option key={address.id} value={address.id}>{`${address.address_line1}, ${address.address_line2}, ${address.city}, ${address.country}`}</option>
          ))}
        </select>
        <button type="submit">Add Service Request</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Tax</th>
            <th>Description</th>
            <th>Requested At</th>
            <th>Completion Deadline</th>
            <th>Priority</th>
            <th>State</th>
            <th>Requested By</th>
            <th>Owned By</th>
            <th>Billing Address</th>
            <th>Shipping Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {serviceRequests.map(serviceRequest => (
            <tr key={serviceRequest.id}>
              <td>{serviceRequest.name}</td>
              <td>{serviceRequest.price}</td>
              <td>{serviceRequest.tax}</td>
              <td>{serviceRequest.description}</td>
              <td>{serviceRequest.requested_at ? new Date(serviceRequest.requested_at).toLocaleString() : ''}</td>
              <td>{serviceRequest.completion_deadline ? new Date(serviceRequest.completion_deadline).toLocaleString() : ''}</td>
              <td>{serviceRequest.priority}</td>
              <td>{serviceRequest.state}</td>
              <td>{customers.find(customer => customer.id.toString() === serviceRequest.requested_by)?.name}{customers.find(customer => customer.id.toString() === serviceRequest.requested_by)?.surname}</td>
              <td>{serviceTechnicians.find(technician => technician.id === parseInt(serviceRequest.owned_by))?.first_name} {serviceTechnicians.find(technician => technician.id === parseInt(serviceRequest.owned_by))?.last_name} {serviceTechnicians.find(technician => technician.id === parseInt(serviceRequest.owned_by))?.email}</td>
              <td>{addresses.find(address => address.id === parseInt(serviceRequest.billing_address))?.address_line1}, {addresses.find(address => address.id === parseInt(serviceRequest.billing_address))?.address_line2}, {addresses.find(address => address.id === parseInt(serviceRequest.billing_address))?.city}, {addresses.find(address => address.id === parseInt(serviceRequest.billing_address))?.country}</td>
              <td>{addresses.find(address => address.id === parseInt(serviceRequest.shipping_address))?.address_line1}, {addresses.find(address => address.id === parseInt(serviceRequest.shipping_address))?.address_line2}, {addresses.find(address => address.id === parseInt(serviceRequest.shipping_address))?.city}, {addresses.find(address => address.id === parseInt(serviceRequest.shipping_address))?.country}</td>
              <td>
                {editingServiceRequestId === serviceRequest.id ? (
                  <button onClick={handleUpdateServiceRequest}>Save</button>
                ) : (
                  <>
                    <button onClick={() => handleEditServiceRequest(serviceRequest.id)}>Edit</button>
                    <button onClick={() => handleRemoveServiceRequest(serviceRequest.id)}>Delete</button>
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

export default ServiceRequestCrud;

