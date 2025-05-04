import React, { useState, useEffect } from 'react';
import axios from 'axios';

const History = ({ user }) => {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);

  // Setup axios with auth token
  const getAuthAxios = () => {
    const token = localStorage.getItem('token');
    return axios.create({
      baseURL: 'http://localhost:3001',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };

  // Fetch calculation history
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const authAxios = getAuthAxios();
      
      let response;
      if (user.role === 'admin' && selectedUser) {
        // Admin viewing a specific user's history
        console.log('Admin fetching history for user:', selectedUser);
        response = await authAxios.get(`/calculations/history/${selectedUser}`);
      } else {
        // Regular user or admin viewing all history
        console.log('Fetching history for current user or all (admin)');
        response = await authAxios.get('/calculations/history');
      }
      
      console.log('History response:', response.data);
      setCalculations(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching history:', err);
      setError(err.response?.data?.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };
  
  // For admin only: fetch all users to allow filtering
  const fetchUsers = async () => {
    if (user.role !== 'admin') return;
    
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };
  
  useEffect(() => {
    console.log('History component mounted, user:', user);
    fetchHistory();
    if (user.role === 'admin') {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.role, selectedUser]);
  
  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };
  
  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>Calculation History</span>
            
            {/* User filter dropdown for admins */}
            {user.role === 'admin' && (
              <div className="user-filter">
                <select 
                  className="form-select" 
                  value={selectedUser} 
                  onChange={handleUserChange}
                >
                  <option value="">All Users</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.username}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            
            {loading ? (
              <div className="text-center my-3">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : calculations.length === 0 ? (
              <p className="text-center">No calculation history found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Expression</th>
                      <th>Result</th>
                      <th>Date</th>
                      {user.role === 'admin' && <th>User</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {calculations.map(calc => (
                      <tr key={calc.id}>
                        <td>{calc.expression}</td>
                        <td>{calc.result}</td>
                        <td>{new Date(calc.timestamp).toLocaleString()}</td>
                        {user.role === 'admin' && calc.user && (
                          <td>{calc.user.username}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;