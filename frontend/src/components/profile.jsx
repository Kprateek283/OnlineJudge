import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [cookies] = useCookies(["userEmail", "userToken"]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = cookies.userToken;
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
        } else {
          console.error("Error fetching user profile");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("Unauthorized. Redirecting to login...");
          setTimeout(() => {
            navigate("/login");
          }, 100);
        } else {
          console.error("Error fetching data:", error.message);
        }
      }
    };

    fetchUserProfile();
  }, [cookies.userEmail, cookies.userToken]);

  const handleDeleteAccount = async () => {
    try {
      const token = cookies.userToken;
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/deleteUser`,
        { email: cookies.userEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { success } = response.data;
      if (success) {
        console.log("Account deleted successfully");
        navigate("/login");
      } else {
        console.error("Error deleting account");
      }
    } catch (error) {
      console.error("Error deleting account:", error.message);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
      <nav style={{ marginBottom: "20px" }}>
        <button
          onClick={() => navigate("/home")}
          style={{ marginRight: "10px", padding: "8px 16px", borderRadius: "4px", backgroundColor: "#007BFF", color: "#fff", cursor: "pointer" }}
        >
          Home
        </button>
        <button
          style={{ marginRight: "1rem", marginBottom: "16px", padding: "8px", backgroundColor: "#4CAF50", color: "#fff", borderRadius: "4px", cursor: "pointer" }}
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button
          onClick={() => navigate("/logout")}
          style={{ marginRight: "1rem", padding: "0.5rem 1rem", backgroundColor: "#4CAF50", color: "white", borderRadius: "4px", cursor: "pointer" }}
        >
          Log Out
        </button>
        <button
          onClick={() => navigate("/problemList")}
          style={{ marginRight: "10px", padding: "8px 16px", borderRadius: "4px", backgroundColor: "#007BFF", color: "#fff", cursor: "pointer" }}
        >
          Problem List
        </button>
        <button
          onClick={() => navigate("/updateProfile")}
          style={{ marginRight: "10px", padding: "8px 16px", borderRadius: "4px", backgroundColor: "#007BFF", color: "#fff", cursor: "pointer" }}
        >
          Update Profile
        </button>
        <button
          onClick={handleDeleteAccount}
          style={{ padding: "8px 16px", borderRadius: "4px", backgroundColor: "#DC3545", color: "#fff", cursor: "pointer" }}
        >
          Delete Account
        </button>
      </nav>
      <div>
        {userData ? (
          <div>
            <h2>User Profile</h2>
            <p>
              <strong>Name:</strong> {userData.username}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Role:</strong> {userData.role === 1 ? "Admin" : "User"}
            </p>
            <p>
              <strong>Problems Solved:</strong> {userData.problemsSolved.length}
            </p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
