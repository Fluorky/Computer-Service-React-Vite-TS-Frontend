import React, { useState, useEffect } from 'react';

interface Invoice {
    id: number;
    name: string;
    total_amount: string;
    payment_status: boolean;
    service_requests: number[];
    parts: number[];
    billing_address: string;
    shipping_address: string;
}

interface ServiceRequest {
    id: number;
    name: string;
    price: string;
    tax: string;
}

interface Part {
    id: number;
    name: string;
    price: string;
    tax: string;
}

interface Address {
    id: number;
    address_line1: string;
    address_line2: string;
    city: string;
    country: string;
}

function InvoiceCrud() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
    const [parts, setParts] = useState<Part[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [newInvoice, setNewInvoice] = useState<Invoice>({
        id: 0,
        name: '',
        total_amount: '',
        payment_status: false,
        service_requests: [],
        parts: [],
        billing_address: '',
        shipping_address: ''
    });
    const [editingInvoiceId, setEditingInvoiceId] = useState<number | null>(null);

    useEffect(() => {
        fetchData();
        fetchServiceRequests();
        fetchParts();
        fetchAddresses();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:8000/api/invoices/', {
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
            setInvoices(data);
        } catch (error) {
            console.error('Error fetching data:', error);
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
                throw new Error('Failed to fetch service requests');
            }

            const data = await response.json();
            setServiceRequests(data);
        } catch (error) {
            console.error('Error fetching service requests:', error);
        }
    };

    const fetchParts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:8000/api/parts/', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch parts');
            }

            const data = await response.json();
            setParts(data);
        } catch (error) {
            console.error('Error fetching parts:', error);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            for (const key in newInvoice) {
                const value = newInvoice[key as keyof Invoice];
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        formData.append(key, item.toString());
                    });
                } else {
                    formData.append(key, value.toString());
                }
            }

            const response = await fetch('http://127.0.0.1:8000/api/invoices/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to add new invoice');
            }

            fetchData();
        } catch (error) {
            console.error('Error adding new invoice:', error);
        }
    };

    const handleEditInvoice = (invoiceId: number) => {
        setEditingInvoiceId(invoiceId);
        const invoiceToEdit = invoices.find(invoice => invoice.id === invoiceId);
        setNewInvoice(invoiceToEdit!);
    };

    const handleUpdateInvoice = async () => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            for (const key in newInvoice) {
                const value = newInvoice[key as keyof Invoice];
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        formData.append(key, item.toString());
                    });
                } else {
                    formData.append(key, value.toString());
                }
            }

            const response = await fetch(`http://127.0.0.1:8000/api/invoices/${editingInvoiceId}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Token ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to update invoice');
            }

            setEditingInvoiceId(null);
            fetchData();
        } catch (error) {
            console.error('Error updating invoice:', error);
        }
    };

    const handleRemoveInvoice = async (invoiceId: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:8000/api/invoices/${invoiceId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove invoice');
            }

            fetchData();
        } catch (error) {
            console.error('Error removing invoice:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'select-multiple') {
            const selectedOptions = Array.from((e.target as HTMLSelectElement).selectedOptions).map(option => option.value);
            setNewInvoice({ ...newInvoice, [name]: selectedOptions });
        } else {
            setNewInvoice({ ...newInvoice, [name]: value });
        }
    };

    const getAddress = (addressId: string) => {
        const address = addresses.find(address => address.id.toString() === addressId);
        if (address) {
            return `${address.address_line1}, ${address.address_line2}, ${address.city}, ${address.country}`;
        } else {
            return 'Address not found';
        }
    };
    

    return (
        <div>
            <h1>Invoice List</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Invoice Name" value={newInvoice.name} onChange={handleInputChange} />
                <input type="text" name="total_amount" placeholder="Total Amount" value={newInvoice.total_amount} onChange={handleInputChange} />
                <select name="payment_status" value={newInvoice.payment_status.toString()} onChange={handleInputChange}>
                    <option value="false">Unpaid</option>
                    <option value="true">Paid</option>
                </select>
                <select multiple name="service_requests" value={newInvoice.service_requests.map(sr => sr.toString())} onChange={handleInputChange}>
                    {serviceRequests.map(sr => (
                        <option key={sr.id} value={sr.id}>{sr.name}</option>
                    ))}
                </select>
                <select multiple name="parts" value={newInvoice.parts.map(part => part.toString())} onChange={handleInputChange}>
                    {parts.map(part => (
                        <option key={part.id} value={part.id}>{part.name}</option>
                    ))}
                </select>
                <select name="billing_address" value={newInvoice.billing_address} onChange={handleInputChange}>
                    <option value="">Select Billing Address</option>
                    {addresses.map(address => (
                        <option key={address.id} value={address.id}>{`${address.address_line1}, ${address.address_line2}, ${address.city}, ${address.country}`}</option>
                    ))}
                </select>
                <select name="shipping_address" value={newInvoice.shipping_address} onChange={handleInputChange}>
                    <option value="">Select Shipping Address</option>
                    {addresses.map(address => (
                        <option key={address.id} value={address.id}>{`${address.address_line1}, ${address.address_line2}, ${address.city}, ${address.country}`}</option>
                    ))}
                </select>
                <button type="submit">Add Invoice</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Total Amount</th>
                        <th>Payment Status</th>
                        <th>Service Requests</th>
                        <th>Parts</th>
                        <th>Billing Address</th>
                        <th>Shipping Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map(invoice => (
                        <tr key={invoice.id}>
                            <td>{invoice.name}</td>
                            <td>{invoice.total_amount}</td>
                            <td>{invoice.payment_status ? 'Paid' : 'Unpaid'}</td>
                            <td>{invoice.service_requests.map(srId => serviceRequests.find(sr => sr.id === srId)?.name).join(', ')}</td>
                            <td>{invoice.parts.map(partId => parts.find(part => part.id === partId)?.name).join(', ')}</td>
                            <td>{addresses.find(address => address.id === parseInt(invoice.billing_address))?.address_line1}, {addresses.find(address => address.id === parseInt(invoice.billing_address))?.address_line2}, {addresses.find(address => address.id === parseInt(invoice.billing_address))?.city}, {addresses.find(address => address.id === parseInt(invoice.billing_address))?.country}</td>
                            <td>{addresses.find(address => address.id === parseInt(invoice.shipping_address))?.address_line1}, {addresses.find(address => address.id === parseInt(invoice.shipping_address))?.address_line2}, {addresses.find(address => address.id === parseInt(invoice.shipping_address))?.city}, {addresses.find(address => address.id === parseInt(invoice.shipping_address))?.country}</td>
                            <td>
                                {editingInvoiceId === invoice.id ? (
                                    <button onClick={handleUpdateInvoice}>Save</button>
                                ) : (
                                    <>
                                        <button onClick={() => handleEditInvoice(invoice.id)}>Edit</button>
                                        <button onClick={() => handleRemoveInvoice(invoice.id)}>Delete</button>
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

export default InvoiceCrud;
