import React from 'react';
import Navbar from './Navbar';

const Home: React.FC = () => {
  const token = localStorage.getItem('token');
  console.log(token);

  return (
    <div>
      <h2>Home</h2>
      <header className="App-header">
        <div>
          <Navbar />
        </div>
      </header>
    </div>
  );
}

export default Home;
