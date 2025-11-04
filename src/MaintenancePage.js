import React from 'react';
import '../src/assets/styles/MaintenancePage.css';
import logo from './assets/images/logo.png'

const MaintenancePage = () => {
  return (
    <div className="maintenance-page">
      <h1>Site Under Maintenance.</h1>
      <h1>We’ll be back soon!</h1>
      <p><h4>Sorry for the inconvenience but we’re performing some maintenance at the moment.</h4>
      <h4>We’ll be back online shortly! Thank you for your patience!</h4></p>
      <img src={logo} alt="logo" className="logo" The Team />
    </div>
  );
};

export default MaintenancePage;
