import React from 'react';
import { Link } from 'react-router-dom';
import './styles/navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/customerlist">CustomerList</Link></li>
        <li><Link to="/customercrud">CustomerListCrud</Link></li>
        <li><Link to="/servicerequestcrud">ServiceRequestCrud</Link></li>
        <li><Link to="/servicetechniciancrud">ServiceTechnicianCrud</Link></li>
        <li><Link to="/partcrud">PartCrud</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
