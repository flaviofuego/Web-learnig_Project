import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Register from './components/Register';
import Calculator from './components/Calculator';
import History from './components/History';
import NavBar from './components/NavBar';

// ... importaciones ...

function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Verificar si el usuario ya está logueado
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    console.log('Login exitoso, datos de usuario:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="App">
        <NavBar user={user} onLogout={handleLogout} />
        <div className="container mt-4">
          <Routes>
            <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/calculator" />} />
            <Route path="/register" element={!user ? <Register onLogin={handleLogin} /> : <Navigate to="/calculator" />} />
            <Route path="/calculator" element={user ? <Calculator user={user} /> : <Navigate to="/login" />} />
            <Route path="/history" element={user ? <History user={user} /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={user ? "/calculator" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;