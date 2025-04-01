import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["userEmail", "userToken"]);
  const email = cookies.userEmail;
  const token = cookies.userToken;
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status

  // Define fetchProblems outside of useEffect so it can be used elsewhere
  const fetchProblems = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/getAllProblems`,

      );
      setProblems(response.data);
    } catch (error) {
      console.error("Error fetching problems:", error.message);
      throw new Error("Error fetching problems");
    }
  };

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
          setIsAdmin(profile.role === 1); // Set isAdmin based on profile role
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
    fetchProblems();
  }, [email]);

  const handleDeleteProblem = async (problemId) => {
    try {
      const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/profile`,
          { email: email },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      const { success, profile } = response.data;
      if (success && profile.role === 1) {
        await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/deleteProblem/${problemId}`
        );
        setSuccessMessage("Problem deleted successfully");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 1000);
      } else {
        setErrorMessage("You are not an admin, you cannot delete a problem");
        setTimeout(() => {
          setErrorMessage(null);
        }, 1000);
      }
      // After successful deletion, update the problem list
      fetchProblems();
    } catch (error) {
      console.error("Error deleting problem:", error.message);
      setErrorMessage("Error deleting problem");
      setTimeout(() => {
        setErrorMessage(null);
      }, 1500);
    }
  };

  const getProblemByDifficulty = async (difficulty = "") => {
    try {
      const difficultyResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/getByDifficulty`,
        { params: { difficulty } }
      );
      setProblems(difficultyResponse.data);
    } catch (error) {
      console.error("Error fetching problems:", error.message);
      setErrorMessage("Error fetching problems");
      setTimeout(() => {
        setErrorMessage(null);
      }, 1500);
    }
  };

  const handleDifficultyChange = (event) => {
    const difficulty = event.target.value;
    setSelectedDifficulty(difficulty);
    getProblemByDifficulty(difficulty);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
      <nav style={{ marginBottom: "20px" }}>
        <button
          onClick={() => navigate("/home")}
          style={{
            marginRight: "10px",
            padding: "8px 16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            backgroundColor: "#007BFF",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Home
        </button>
        {isAdmin && (
          <button
            onClick={() => navigate("/addProblem")}
            style={{
              marginRight: "10px",
              padding: "8px 16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "#4CAF50",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Add Problem
          </button>
        )}
        <button
          onClick={() => navigate('/logout')} 
          style={{
            marginRight: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Log Out
        </button>
        <button
          style={{
            marginRight: "1rem",
            marginBottom: "16px",
            padding: "8px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button
          onClick={() => navigate("/profile")}
          style={{
            marginRight: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Profile
        </button>
        <button
          onClick={() => navigate("/getLeaderboard")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Leaderboard
        </button>
      </nav>

      <br />
      <hr />
      <div>
        <label htmlFor="difficulty">Filter by difficulty: </label>
        <select
          id="difficulty"
          value={selectedDifficulty}
          onChange={handleDifficultyChange}
          style={{
            marginBottom: "20px",
            padding: "8px 16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          <option value="All">All</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <br />
      {successMessage && (
        <div
          style={{
            backgroundColor: "#D4EDDA",
            color: "#155724",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "10px",
          }}
        >
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div
          style={{
            backgroundColor: "#F8D7DA",
            color: "#721C24",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "10px",
          }}
        >
          {errorMessage}
        </div>
      )}
      <div>
        {problems.map((problem) => (
          <div key={problem._id} style={{ marginBottom: "20px" }}>
            <h3>{problem.problemName}</h3>
            <p>Difficulty: {problem.difficulty}</p>
            <button
              onClick={() => navigate(`/individualProblem/${problem._id}`)}
              style={{
                marginRight: "10px",
                padding: "8px 16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#007BFF",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Code
            </button>
            {isAdmin && (
              <>
                <button
                  onClick={() => handleDeleteProblem(problem._id)}
                  style={{
                    marginRight: "10px",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    backgroundColor: "#DC3545",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Delete Problem
                </button>
                <button
                  onClick={() => navigate(`/updateProblem/${problem._id}`)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    backgroundColor: "#007BFF",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Update Problem
                </button>
              </>
            )}
            <br />
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemList;
