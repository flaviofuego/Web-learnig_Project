import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register, login } from '../services/api.service';

const Register = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Attempting to register user:', username);
      
      // Register the user using the service
      const response = await register(username, password);
      console.log('Registration successful:', response);
      
      // After registration, login
      const userData = await login(username, password);
      console.log('Login after registration successful, user data:', userData);
      
      // Verify that userData contains required fields
      if (!userData || !userData.id || !userData.username || !userData.role) {
        console.error('Incomplete user data received:', userData);
        throw new Error('Login successful but received incomplete user data');
      }
      
      // Call the login handler with user info
      onLogin(userData);
      console.log('User logged in successfully after registration');
      
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error status:', err.response.status);
        setError(err.response.data.message || 'Registration failed. Please try again.');
      } else if (err.request) {
        console.error('Error request:', err.request);
        setError('Network error. Please check your connection.');
      } else {
        console.error('Error message:', err.message);
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">Register</div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
            <div className="mt-3">
              Already have an account? <Link to="/login">Login here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;