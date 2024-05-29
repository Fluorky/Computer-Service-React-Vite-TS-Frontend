import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import '../App.css';

interface Supplier {
  id: number;
  name: string;
  contact_person_email: string;
  phone_number: string;
  address: number;
}

interface Address {
  id: number;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

const SupplierCrud: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [newSupplier, setNewSupplier] = useState<Supplier>({
    id: 0,
    name: '',
    contact_person_email: '',
    phone_number: '',
    address: 0
  });
  const [addressData, setAddressData] = useState<Address[]>([]);
  const [editingSupplierId, setEditingSupplierId] = useState<number | null>(null);

  useEffect(() => {
    fetchSuppliers();
    fetchAddresses();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/supplier/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
      }

      const data: Supplier[] = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
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
        throw new Error('Failed to fetch addresses');
      }

      const data: Address[] = await response.json();
      setAddressData(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('name', newSupplier.name);
      formData.append('contact_person_email', newSupplier.contact_person_email);
      formData.append('phone_number', newSupplier.phone_number);
      formData.append('address', newSupplier.address.toString());

      const response = await fetch('http://127.0.0.1:8000/api/supplier/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to add new supplier');
      }

      fetchSuppliers();
    } catch (error) {
      console.error('Error adding new supplier:', error);
    }
  };

  const handleEditSupplier = (supplierId: number) => {
    setEditingSupplierId(supplierId);
    const supplierToEdit = suppliers.find(supplier => supplier.id === supplierId);
    if (supplierToEdit) {
      setNewSupplier(supplierToEdit);
    }
  };

  const handleUpdateSupplier = async () => {
    if (editingSupplierId === null) return;

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('name', newSupplier.name);
      formData.append('contact_person_email', newSupplier.contact_person_email);
      formData.append('phone_number', newSupplier.phone_number);
      formData.append('address', newSupplier.address.toString());

      const response = await fetch(`http://127.0.0.1:8000/api/supplier/${editingSupplierId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update supplier');
      }

      setEditingSupplierId(null);
      fetchSuppliers();
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  const handleRemoveSupplier = async (supplierId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/supplier/${supplierId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove supplier');
      }

      fetchSuppliers();
    } catch (error) {
      console.error('Error removing supplier:', error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSupplier(prevSupplier => ({
      ...prevSupplier,
      [name]: value
    }));
  };

  const handleAddressChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedAddressId = parseInt(e.target.value, 10);
    setNewSupplier(prevSupplier => ({
      ...prevSupplier,
      address: selectedAddressId
    }));
  };

  return (
    <div>
      <h1>Supplier List</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={newSupplier.name} onChange={handleInputChange} />
        <input type="email" name="contact_person_email" placeholder="Contact Person Email" value={newSupplier.contact_person_email} onChange={handleInputChange} />
        <input type="text" name="phone_number" placeholder="Phone Number" value={newSupplier.phone_number} onChange={handleInputChange} />
        <select name="address" value={newSupplier.address} onChange={handleAddressChange}>
          <option value={0}>Select Address</option>
          {addressData.map(address => (
            <option key={address.id} value={address.id}>{`${address.address_line1}, ${address.city}, ${address.country}`}</option>
          ))}
        </select>
        <button type="submit">Add Supplier</button>
      </form>
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact Person Email</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map(supplier => (
            <tr key={supplier.id}>
              <td>{supplier.name}</td>
              <td>{supplier.contact_person_email}</td>
              <td>{supplier.phone_number}</td>
              <td>
                {supplier.address && (
                  <>
                    <p>{addressData.find(address => address.id === supplier.address)?.address_line1}</p>
                    <p>{addressData.find(address => address.id === supplier.address)?.city}</p>
                    <p>{addressData.find(address => address.id === supplier.address)?.country}</p>
                  </>
                )}
              </td>
              <td>
                {editingSupplierId === supplier.id ? (
                  <button onClick={handleUpdateSupplier}>Save</button>
                ) : (
                  <>
                    <button onClick={() => handleEditSupplier(supplier.id)}>Edit</button>
                    <button onClick={() => handleRemoveSupplier(supplier.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierCrud;
