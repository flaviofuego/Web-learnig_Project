// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Register from './components/Register';
import Calculator from './components/Calculator';
import History from './components/History';
import NavBar from './components/NavBar';
import { logout } from './services/api.service';
import { jwtDecode } from 'jwt-decode'; // Necesitas instalar esta biblioteca: npm install jwt-decode

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Función para verificar si el token ha expirado
  const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };
  
  useEffect(() => {
    // Verificar si hay un usuario y token almacenados
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      // Verificar si el token ha expirado
      if (isTokenExpired(token)) {
        // Si ha expirado, intentar usar el refresh token (esto lo maneja el interceptor)
        console.log('Token expirado, cerrando sesión');
        logout();
        setUser(null);
      } else {
        // Si el token es válido, restaurar el usuario
        setUser(JSON.parse(storedUser));
      }
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

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