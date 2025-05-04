import React, { useState, useEffect } from 'react';
import { getHistory, getUserHistory, getUsers } from '../services/api.service';

const History = ({ user }) => {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);

  // Fetch calculation history
  const fetchHistory = async () => {
    try {
      setLoading(true);
      console.log('Fetching history for user:', user);
      
      let data;
      if (user.role === 'admin' && selectedUser) {
        // Admin viewing a specific user's history
        console.log('Admin fetching history for user:', selectedUser);
        data = await getUserHistory(selectedUser);
      } else {
        // Regular user or admin viewing all history
        console.log('Fetching history for current user or all (admin)');
        data = await getHistory();
      }
      
      console.log('History data received:', data);
      setCalculations(data);
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
      console.log('Admin fetching users for filter');
      const data = await getUsers();
      console.log('Users data received:', data);
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };
  
  useEffect(() => {
    console.log('History component mounted, user:', user);
    
    // Ensure we have a valid user with a role before proceeding
    if (user && user.id && user.role) {
      fetchHistory();
      if (user.role === 'admin') {
        fetchUsers();
      }
    } else {
      console.error('Invalid user object in History component:', user);
      setError('User information is incomplete. Please login again.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, selectedUser]);
  
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