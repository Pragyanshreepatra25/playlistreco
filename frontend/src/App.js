import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';       // lowercase - matches your file
import Register from './components/Register';  // lowercase - create this file
import Home from './components/home';          // lowercase - matches your file
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/home" 
          element={isAuthenticated ? <Home setAuth={setIsAuthenticated} /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
