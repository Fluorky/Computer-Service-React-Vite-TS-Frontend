import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import CustomerList from './pages/CustomerList';
import CustomerCrud from './pages/CustomerCrud';
import Logout from './pages/Logout';
import ServiceRequestCrud from './pages/ServiceRequestCrud';
import ServiceTechnicianCrud from './pages/ServiceTechnicianCrud';
import PartCrud from './pages/PartCrud';
import './App.css';
import InvoiceCrud from './pages/InvoiceCrud';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customerlist" element={<CustomerList />} />
        <Route path="/customercrud" element={<CustomerCrud />} />
        <Route path="/servicerequestcrud" element={<ServiceRequestCrud />} />
        <Route path="invoicecrud" element={<InvoiceCrud />} />
        <Route path="/servicetechniciancrud" element={<ServiceTechnicianCrud />} />
        <Route path="/partcrud" element={<PartCrud />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}

export default App;
