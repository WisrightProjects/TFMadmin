import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../src/pages/app/App';
import reportWebVitals from './reportWebVitals';
import MaintenancePage from '../src/MaintenancePage';

const isMaintenanceMode = process.env.REACT_APP_MAINTENANCE_MODE==="true";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   {isMaintenanceMode ? <MaintenancePage /> : <App />}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
