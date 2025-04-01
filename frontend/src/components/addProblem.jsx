import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

const CreateProblem = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['userEmail' , 'userToken']);
  const token = cookies.userToken;
  const navigate = useNavigate();
  const host = import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState({
    problemName: "",
    description: {
      statement: "",
      inputFormat: "",
      outputFormat: "",
    },
    tags: [""],
    testCases: [{ input: "", expectedOutput: "" }],
    difficulty: "Easy",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("description.")) {
      const [_, key] = name.split(".");
      setFormData({
        ...formData,
        description: {
          ...formData.description,
          [key]: value,
        },
      });
    } else if (name.startsWith("tags.")) {
      const index = parseInt(name.split(".")[1], 10);
      const tags = [...formData.tags];
      tags[index] = value;
      setFormData({ ...formData, tags });
    } else if (name.startsWith("testCases.")) {
      const [_, index, key] = name.split(".");
      const testCases = [...formData.testCases];
      testCases[index][key] = value;
      setFormData({ ...formData, testCases });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addTag = () => {
    setFormData({
      ...formData,
      tags: [...formData.tags, ""],
    });
  };

  const removeTag = (index) => {
    const tags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags });
  };

  const removeTest = (index) => {
    const testCases = formData.testCases.filter((_, i) => i !== index);
    setFormData({ ...formData, testCases });
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: "", expectedOutput: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        tags: formData.tags.filter((tag) => tag.trim()), // Filter out any empty tags
      };
      console.log(data.testCases);
      const response = await axios.post(
        `${host}/addProblem`, data,
        {headers:{
          Authorization:`Bearer ${token}`,
        }}
      );
      const { success, message } = response.data;
      if (success) toast.success(message, { position: "bottom-right" });
      else toast.error(message, { position: "bottom-left" });
      setFormData({
        problemName: "",
        description: {
          statement: "",
          inputFormat: "",
          outputFormat: "",
        },
        tags: [""],
        testCases: [{ input: "", expectedOutput: "" }],
        difficulty: "Easy",
      });
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

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <nav style={{ marginBottom: "2rem" }}>
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
        <button
            style={{
              marginRight: "1rem",
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
          onClick={() => navigate("/problemList")}
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
          Problem List
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
      <div>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          CREATE A NEW PROBLEM
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Title
            </label>
            <input
              type="text"
              name="problemName"
              value={formData.problemName}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Statement
            </label>
            <textarea
              id="statement"
              name="description.statement"
              value={formData.description.statement}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                minHeight: "100px",
              }}
            />
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                marginTop: "1rem",
              }}
            >
              Input Format
            </label>
            <textarea
              id="inputFormat"
              name="description.inputFormat"
              value={formData.description.inputFormat}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                minHeight: "100px",
              }}
            />
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                marginTop: "1rem",
              }}
            >
              Output Format
            </label>
            <textarea
              id="outputFormat"
              name="description.outputFormat"
              value={formData.description.outputFormat}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                minHeight: "100px",
              }}
            />
          </div>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Tags:
          </label>
          <div style={{ marginBottom: "1rem" }}>
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <input
                  type="text"
                  id={`tag-${index}`}
                  name={`tags.${index}`}
                  value={tag}
                  onChange={handleChange}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  style={{
                    marginLeft: "0.5rem",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    backgroundColor: "#ff4d4d",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTag}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Add Tag
            </button>
          </div>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Test Cases:
          </label>
          <div style={{ marginBottom: "1rem" }}>
            {formData.testCases.map((testCase, index) => (
              <div key={index} style={{ marginBottom: "1rem" }}>
                <label
                  htmlFor={`input-${index}`}
                  style={{ display: "block", marginBottom: "0.5rem" }}
                >
                  Input:
                </label>
                <textarea
                  id={`input-${index}`}
                  name={`testCases.${index}.input`}
                  value={testCase.input}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    minHeight: "50px",
                  }}
                />
                <label
                  htmlFor={`expectedOutput-${index}`}
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    marginTop: "1rem",
                  }}
                >
                  Expected Output:
                </label>
                <textarea
                  id={`expectedOutput-${index}`}
                  name={`testCases.${index}.expectedOutput`}
                  value={testCase.expectedOutput}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    minHeight: "50px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeTest(index)}
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    backgroundColor: "#ff4d4d",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTestCase}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Add Test Case
            </button>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div style={{ textAlign: "center" }}>
            <button
              type="submit"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "4px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Create Problem
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default CreateProblem;
