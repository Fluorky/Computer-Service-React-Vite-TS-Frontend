import React from 'react';

const Logout: React.FC = () => {
  // Function to handle logoff
  const handleLogout = () => {
    // Remove token from local storage
    localStorage.removeItem('token');
    // Redirect to the login page or any other page as needed
    // For simplicity, let's redirect to the login page
    window.location.href = '/login'; // Replace '/login' with your login page route
  };

  return (
    <div>
      <h2>Logout</h2>
      <p>Are you sure you want to logout?</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;
