import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateProblem = () => {
  const host = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams(); // Fetching the problem ID from URL params
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    statement: "",
    inputFormat: "",
    outputFormat: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${host}/updateProblem/${id}`, formData);
      const { success, message } = response.data;
      if (success) {
        toast.success(message, { position: "bottom-right" });
        setTimeout(() => {
          navigate(`/individualProblem/${id}`);
        }, 1000);
      } else {
        toast.error(message, { position: "bottom-left" });
      }
    } catch (error) {
      console.error("Error updating problem:", error.message);
      alert("Error updating problem. Please try again.");
    }
  };

  return (
    <div style={{ width: '100%', padding: '2rem' }}>
      <button
            style={{
              marginBottom: "16px",
              padding: "8px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
            onClick={() => navigate(-1)}
          >
            Back
          </button>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', backgroundColor: '#f7f7f7', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>UPDATE PROBLEM</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Statement</label>
            <textarea
              id="statement"
              name="statement"
              value={formData.statement}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px' }}
            />
            <label style={{ display: 'block', marginTop: '1rem', marginBottom: '0.5rem' }}>Input Format</label>
            <textarea
              id="inputFormat"
              name="inputFormat"
              value={formData.inputFormat}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px' }}
            />
            <label style={{ display: 'block', marginTop: '1rem', marginBottom: '0.5rem' }}>Output Format</label>
            <textarea
              id="outputFormat"
              name="outputFormat"
              value={formData.outputFormat}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px' }}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
              Update Problem
            </button>
          </div>
        </form>
        <div style={{ marginTop: '1.5rem' }}>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
  
};

export default UpdateProblem;
