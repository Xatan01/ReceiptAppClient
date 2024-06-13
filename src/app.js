  import React from 'react';
  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  import ScannerPage from './Pages/scannerPage';
  import 'bootstrap/dist/css/bootstrap.min.css';
import HistoryPage from './Pages/historyPage';
  
  function App() {
    return (
      <div className="App">
        <Router>
          <Routes>
            <Route path ="/scanner" element={<ScannerPage />} />
            <Route path ="/history" element={<HistoryPage/>} />
            <Route path="/" element={<Navigate to="/scanner" />} />
          </Routes>
        </Router>
      </div>
    );
  }
  
  export default App;
  
