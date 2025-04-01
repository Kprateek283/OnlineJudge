import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie'; // Import useCookies

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['userEmail', 'userToken']); // Define cookies for email and token

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErrorMessage('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      // Send login request to the backend
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, formData);
      const { success, token, email } = response.data; // Get the token and email from the response

      if (success) {
        setErrorMessage('');
        
        // Store the email and token in cookies
        setCookie('userEmail', email, { path: '/' });
        setCookie('userToken', token, { path: '/' });

        // Redirect to home page after successful login
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else {
        setErrorMessage('Incorrect email or password.');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      setErrorMessage('An error occurred. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>Log In</h2>
      {errorMessage && (
        <div style={{ color: "red", marginBottom: "16px" }}>{errorMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              marginBottom: "8px"
            }}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="password">Password</label>
          <div style={{ display: "flex" }}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "calc(100% - 40px)",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginBottom: "8px"
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                padding: "8px",
                borderRadius: "4px",
                marginLeft: "8px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div style={{ marginTop: "16px" }}>
        <p>
          Not a user?{" "}
          <button
            onClick={() => navigate("/signup")}
            style={{
              backgroundColor: "#007BFF",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Signup
          </button>
        </p>
      </div>
    </div>
  );
  
  
};

export default Login;
