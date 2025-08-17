import React from 'react';
import Navbar from './Navbar';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="content-wrapper">
        {children}
      </div>
    </>
  );
};

export default Layout; 