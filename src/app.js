import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import `Routes` and `Navigate` from react-router-dom
import LoginPage from './Pages/loginPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function Apps() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="login" />} /> 
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default Apps;
