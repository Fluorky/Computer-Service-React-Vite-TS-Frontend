import React, { useState, useEffect } from 'react';
import '../App.css';

interface Part {
  id: number;
  name: string;
  price: string;
  tax: string;
  description: string;
  quantity_in_stock: string;
  supplier: string;
}

interface Supplier {
  id: number;
  name: string;
}

const PartCrud: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [newPart, setNewPart] = useState<Part>({
    id: 0,
    name: '',
    price: '',
    tax: '',
    description: '',
    quantity_in_stock: '',
    supplier: ''
  });
  const [editingPartId, setEditingPartId] = useState<number | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const partsResponse = await fetch('http://127.0.0.1:8000/api/parts/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!partsResponse.ok) {
        throw new Error('Failed to fetch parts data');
      }

      const partsData: Part[] = await partsResponse.json();
      setParts(partsData);

      const suppliersResponse = await fetch('http://127.0.0.1:8000/api/supplier/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!suppliersResponse.ok) {
        throw new Error('Failed to fetch suppliers data');
      }

      const suppliersData: Supplier[] = await suppliersResponse.json();
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getSupplierNameById = (supplierId: string): string => {
    const supplier = suppliers.find(supplier => supplier.id === parseInt(supplierId));
    return supplier ? supplier.name : '';
  };

  const handleSubmit = async (e: React.FormEvent, newPart: Part) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const supplierId = suppliers.find(supplier => supplier.name === newPart.supplier)?.id;
      const formData = new URLSearchParams();

      Object.entries(newPart).forEach(([key, value]) => {
        if (key === 'supplier') {
          formData.append(key, String(supplierId || ''));
        } else {
          formData.append(key, value);
        }
      });

      const response = await fetch('http://127.0.0.1:8000/api/parts/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      if (!response.ok) {
        throw new Error('Failed to add new part');
      }

      fetchData();
    } catch (error) {
      console.error('Error adding new part:', error);
    }
  };

  const handleEditPart = (partId: number) => {
    setEditingPartId(partId);
    const partToEdit = parts.find(part => part.id === partId);
    // Find the name of the supplier based on its ID
    const supplierName = getSupplierNameById(partToEdit?.supplier || '');
    // Update the newPart state to include the supplier name
    setNewPart(partToEdit ? { ...partToEdit, supplier: supplierName } : newPart);
  };

  const handleUpdatePart = async () => {
    try {
      const token = localStorage.getItem('token');
      const supplierId = suppliers.find(supplier => supplier.name === newPart.supplier)?.id;
      const formData = new URLSearchParams();

      Object.entries(newPart).forEach(([key, value]) => {
        if (key === 'supplier') {
          formData.append(key, String(supplierId || ''));
        } else {
          formData.append(key, value);
        }
      });

      const response = await fetch(`http://127.0.0.1:8000/api/parts/${editingPartId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      if (!response.ok) {
        throw new Error('Failed to update part');
      }

      setEditingPartId(null);
      fetchData();
    } catch (error) {
      console.error('Error updating part:', error);
    }
  };

  const handleRemovePart = async (partId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/parts/${partId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove part');
      }

      fetchData();
    } catch (error) {
      console.error('Error removing part:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewPart({ ...newPart, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Part List</h1>
      <form onSubmit={(e) => handleSubmit(e, newPart)}>
        <input type="text" name="name" placeholder="Name" value={newPart.name} onChange={handleInputChange} />
        <input type="number" name="price" placeholder="Price" value={newPart.price} onChange={handleInputChange} />
        <input type="text" name="tax" placeholder="Tax" value={newPart.tax} onChange={handleInputChange} />
        <textarea name="description" placeholder="Description" value={newPart.description} onChange={handleInputChange} />
        <input type="number" name="quantity_in_stock" placeholder="Quantity in Stock" value={newPart.quantity_in_stock} onChange={handleInputChange} />
        <input type="text" name="supplier" placeholder="Supplier" value={newPart.supplier} onChange={handleInputChange} />
        <button type="submit">Add Part</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Tax</th>
            <th>Description</th>
            <th>Quantity in Stock</th>
            <th>Supplier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parts.map(part => (
            <tr key={part.id}>
              <td>{part.name}</td>
              <td>{part.price}</td>
              <td>{part.tax}</td>
              <td>{part.description}</td>
              <td>{part.quantity_in_stock}</td>
              <td>{getSupplierNameById(part.supplier)}</td>
              <td>
                {editingPartId === part.id ? (
                  <button onClick={handleUpdatePart}>Save</button>
                ) : (
                  <>
                    <button onClick={() => handleEditPart(part.id)}>Edit</button>
                    <button onClick={() => handleRemovePart(part.id)}>Delete</button>
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

export default PartCrud;

