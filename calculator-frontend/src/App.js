import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Register from './components/Register';
import Calculator from './components/Calculator';
import History from './components/History';
import NavBar from './components/NavBar';
import { logout } from './services/api.service';

function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      console.log('Restoring user session from localStorage');
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Verify if user data is complete
        if (parsedUser && parsedUser.id && parsedUser.username && parsedUser.role) {
          setUser(parsedUser);
          console.log('User session restored successfully');
        } else {
          console.error('Incomplete user data in localStorage:', parsedUser);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else {
      console.log('No user session found in localStorage');
    }
  }, []);

  const handleLogin = (userData) => {
    console.log('Login handler called with user data:', userData);
    
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update state
    setUser(userData);
    console.log('User state updated after login');
  };

  const handleLogout = () => {
    console.log('Logging out user:', user?.username);
    logout(); // This will clear localStorage
    setUser(null);
    console.log('User logged out successfully');
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