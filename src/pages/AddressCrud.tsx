import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import '../App.css';

interface Address {
  id: number;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

const AddressCrud: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Address>({
    id: 0,
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    postal_code: ''
  });
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
        throw new Error('Failed to fetch data');
      }

      const data: Address[] = await response.json();
      setAddresses(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('address_line1', newAddress.address_line1);
      formData.append('address_line2', newAddress.address_line2);
      formData.append('city', newAddress.city);
      formData.append('state', newAddress.state);
      formData.append('country', newAddress.country);
      formData.append('postal_code', newAddress.postal_code);

      const response = await fetch('http://127.0.0.1:8000/api/address/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to add new address');
      }

      fetchData();
    } catch (error) {
      console.error('Error adding new address:', error);
    }
  };

  const handleEditAddress = (addressId: number) => {
    setEditingAddressId(addressId);
    const addressToEdit = addresses.find(address => address.id === addressId);
    if (addressToEdit) {
      setNewAddress(addressToEdit);
    }
  };

  const handleUpdateAddress = async () => {
    if (editingAddressId === null) return;

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('address_line1', newAddress.address_line1);
      formData.append('address_line2', newAddress.address_line2);
      formData.append('city', newAddress.city);
      formData.append('state', newAddress.state);
      formData.append('country', newAddress.country);
      formData.append('postal_code', newAddress.postal_code);

      const response = await fetch(`http://127.0.0.1:8000/api/address/${editingAddressId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update address');
      }

      setEditingAddressId(null);
      fetchData();
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleRemoveAddress = async (addressId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/address/${addressId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove address');
      }

      fetchData();
    } catch (error) {
      console.error('Error removing address:', error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress(prevAddress => ({
      ...prevAddress,
      [name]: value
    }));
  };

  return (
    <div>
      <h1>Address List</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="address_line1" placeholder="Address Line 1" value={newAddress.address_line1} onChange={handleInputChange} />
        <input type="text" name="address_line2" placeholder="Address Line 2" value={newAddress.address_line2} onChange={handleInputChange} />
        <input type="text" name="city" placeholder="City" value={newAddress.city} onChange={handleInputChange} />
        <input type="text" name="state" placeholder="State" value={newAddress.state} onChange={handleInputChange} />
        <input type="text" name="country" placeholder="Country" value={newAddress.country} onChange={handleInputChange} />
        <input type="text" name="postal_code" placeholder="Postal Code" value={newAddress.postal_code} onChange={handleInputChange} />
        <button type="submit">Add Address</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Address Line 1</th>
            <th>Address Line 2</th>
            <th>City</th>
            <th>State</th>
            <th>Country</th>
            <th>Postal Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map(address => (
            <tr key={address.id}>
              <td>{address.address_line1}</td>
              <td>{address.address_line2}</td>
              <td>{address.city}</td>
              <td>{address.state}</td>
              <td>{address.country}</td>
              <td>{address.postal_code}</td>
              <td>
                {editingAddressId === address.id ? (
                  <button onClick={handleUpdateAddress}>Save</button>
                ) : (
                  <>
                    <button onClick={() => handleEditAddress(address.id)}>Edit</button>
                    <button onClick={() => handleRemoveAddress(address.id)}>Delete</button>
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

export default AddressCrud;
