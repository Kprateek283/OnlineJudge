import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const [userData, setUserData] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("");
  const [securityKey, setSecurityKey] = useState("");
  const [showSecurityKey, setShowSecurityKey] = useState(false);
  const [cookies, setCookie] = useCookies(["userID"], ["userToken"]);
  const email = cookies.userEmail;
  const token = cookies.userToken;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/profile`,
          { email: cookies.userEmail },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { success, profile } = response.data;
        if (success) {
          setUserData(profile);
          setNewName(profile.username);
          setNewEmail(profile.email);
          setNewRole(profile.role);
        } else {
          console.error("Error fetching user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
      }
    };

    fetchUserProfile();
  }, [email]);

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setNewRole(role);
    if (role === "admin") {
      setShowSecurityKey(true);
    } else {
      setShowSecurityKey(false);
      setSecurityKey("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newRole === "admin" && securityKey !== "2853") {
      alert("Invalid security key");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/updateProfile`,
        { email, updatedName: newName, updatedEmail: newEmail, updatedRole: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { success } = response.data;
      if (success) {
        alert("Profile updated successfully");

        // Update the email cookie if the email was updated
        if (newEmail !== email) {
          setCookie("userEmail", newEmail, { path: "/" });
        }

        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      } else {
        console.error("Error updating profile");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Unauthorized. Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        console.error("Error fetching data:", error.message);
      }
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
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
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Update Profile</h2>
      {userData && (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>New Name:</label>
            <input
              type="text"
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>New Email:</label>
            <input
              type="email"
              id="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="role" style={{ display: 'block', marginBottom: '0.5rem' }}>New Role:</label>
            <select
              id="role"
              value={newRole}
              onChange={handleRoleChange}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {showSecurityKey && (
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="securityKey" style={{ display: 'block', marginBottom: '0.5rem' }}>Security Key:</label>
              <input
                type="password"
                id="securityKey"
                value={securityKey}
                onChange={(e) => setSecurityKey(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          )}
          <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '4px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>Update Profile</button>
        </form>
      )}
    </div>
  );
  
};

export default UpdateProfile;
