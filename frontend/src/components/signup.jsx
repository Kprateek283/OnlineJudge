import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'User',
    secretKey: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErrorMessage('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      // Check if the role is "Admin" and the secret key is correct
      if (formData.role === 'Admin' && formData.secretKey !== '2853') {
        setErrorMessage('Incorrect Secret Key.');
        setLoading(false);
        return;
      }

      // Create payload for the POST request
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role === 'Admin' ? 1 : 0,
      };

      // Send signup request to backend
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/signup`, payload);
      const { success } = response.data;
      if (success) {
        setErrorMessage('');
        // Redirect to login page
        navigate('/login');
      } else {
        setErrorMessage('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error.message);
      setErrorMessage('An error occurred. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '28rem', margin: '0 auto', padding: '1.5rem', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '0.375rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>Sign Up</h2>
      {errorMessage && <div style={{ color: 'red', marginBottom: '1rem' }}>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="username" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Username</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', padding: '0.5rem', outline: 'none' }} required />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', padding: '0.5rem', outline: 'none' }} required />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', padding: '0.5rem', outline: 'none' }} required />
            <button type="button" style={{ position: 'absolute', top: '50%', right: '0.75rem', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: '0', cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="role" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Role</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', padding: '0.5rem', outline: 'none' }} required>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        {formData.role === 'Admin' && (
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="secretKey" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Secret Key</label>
            <input type="password" id="secretKey" name="secretKey" value={formData.secretKey} onChange={handleChange} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', padding: '0.5rem', outline: 'none' }} required />
          </div>
        )}
        <button type="submit" style={{ width: '100%', backgroundColor: '#4f46e5', color: 'white', fontWeight: '600', padding: '0.5rem 1rem', borderRadius: '0.375rem', cursor: 'pointer', border: 'none' }} disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        <button style={{ color: '#4f46e5', cursor: 'pointer', background: 'none', border: 'none', padding: '0' }} onClick={() => navigate('/login')}>Already a Member? Login</button>
        <button style={{ color: '#4f46e5', cursor: 'pointer', background: 'none', border: 'none', padding: '0' }} onClick={() => navigate('/login')}>Login</button>
      </div>
    </div>
  );
  
};

export default Signup;
