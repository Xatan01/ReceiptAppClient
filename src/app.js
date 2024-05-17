  import React from 'react';
  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  import LoginPage from './Pages/loginPage';
  import ScannerPage from './Pages/scannerPage';
  import 'bootstrap/dist/css/bootstrap.min.css';
  
  function App() {
    //const isAuthenticated = () => {
    // Check if the user is authenticated (e.g., by checking if the session token or JWT exists)
    //return localStorage.getItem('token') != null;
    return (
      <div className="App">
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path ="/scanner" element={<ScannerPage />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </div>
    );
  }
  
  export default App;
  
