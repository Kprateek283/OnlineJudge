import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import Editor from 'react-simple-code-editor';
import { useCookies } from 'react-cookie';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';


const getDefaultBoilerplate = (language) => {
  switch (language) {
    case "c":
      return '#include <stdio.h>\nint main() {\n    printf("Hello, World!");\n    return 0;\n}';
    case "cpp":
      return '#include <iostream>\nint main() {\n    std::cout << "Hello, World!";\n    return 0;\n}';
    case "java":
      return 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}';
    case "python":
    default:
      return 'print("Hello, World!")';
  }
};

const getCookieValue = (cookieName) => {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
};

const IndividualProblem = () => {
  const [problemData, setProblemData] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const { id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState(getDefaultBoilerplate(selectedLanguage));
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState("Not Applicable");
  const [input, setInput] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(['userToken']);

  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        const token = cookies.userToken;
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/getIndividualProblem/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }

        );
        setProblemData(response.data);
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

    fetchProblemData();
  }, [id]);

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    setCode(getDefaultBoilerplate(newLanguage));
  };

  const executeCode = async () => {
    const payload = {
      language: selectedLanguage.toLowerCase(),
      code,
      input,
    };

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_COMPILER_URL}/compiler`,
        payload,
        {
          withCredentials: true,
        }
      );
      setOutput(data.output);
      setVerdict(data.verdict || "Code executed successfully");
    } catch (error) {
      console.error("Error in executeCode:", error);
      setOutput("");
      setVerdict("Error executing code");
    }
  };

  const handleSubmitClick = async () => {
    try {
      console.log(problemData);
      // Extract and log the userEmail cookie
      const userEmail = getCookieValue("userEmail");
      console.log(userEmail);

      const payload = {
        language: selectedLanguage.toLowerCase(),
        code,
        userEmail,
      };

      // Log the payload to ensure it's being created correctly
      console.log("Payload:", payload);

      const { data } = await axios.post(
        `${import.meta.env.VITE_COMPILER_URL}/submit/${id}`,
        payload,
        {
          withCredentials: true,
        }
      );
      console.log(data);
      console.log(data.success);
      if (data.success === true) {
        setVerdict("Code accepted");
      } else {
        setVerdict(`Code not accepted, ${data.message}`);
      }
    } catch (error) {
      console.error("Error in submitCode:", error);
      setVerdict("Error submitting code");
    }
  };

  const handleRunClick = async () => {
    await executeCode();
  };

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(#00d5ff, #0095ff, rgba(93, 0, 255, .555))",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        color: "#333"
      }}
    >
      <br />
      <br />
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "20px",
          backgroundColor: "dark",
          width: "100%"
        }}
      >
        <Link
          to="/Profile"
          style={{
            textDecoration: "none",
            color: "#fff",
            padding: "8px",
            borderRadius: "4px",
            backgroundColor: "#4CAF50"
          }}
        >
          Profile
        </Link>
        <Link
          to="/Home"
          style={{
            textDecoration: "none",
            color: "#fff",
            padding: "8px",
            borderRadius: "4px",
            backgroundColor: "#4CAF50"
          }}
        >
          Home
        </Link>
        <Link
          to="/AddProblem"
          style={{
            textDecoration: "none",
            color: "#fff",
            padding: "8px",
            borderRadius: "4px",
            backgroundColor: "#4CAF50"
          }}
        >
          Add Problem
        </Link>
      </div>
      <div style={{ display: "flex", height: "100%" }}>
        {/* Left Side */}
        <div style={{ width: "50%", padding: "16px" }}>
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
          {problemData ? (
            <div
              style={{
                padding: "16px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: "#fff"
              }}
            >
              <h2 style={{ marginBottom: "16px" }}>
                {problemData.problemName || "Problem Title"}
              </h2>
              <h3>Problem Statement:</h3>
              <p>{problemData.description.statement}</p>
              <h3>Difficulty:</h3>
              <p>{problemData.difficulty}</p>
              <h3>Example:</h3>
              <div style={{ marginBottom: "12px" }}>
                <h4>Input</h4>
                <div
                  style={{
                    padding: "12px",
                    marginBottom: "12px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    borderRadius: "4px"
                  }}
                >
                  {problemData.testCases[0].input}
                </div>
                <h4>Output</h4>
                <div
                  style={{
                    padding: "12px",
                    marginBottom: "12px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    borderRadius: "4px"
                  }}
                >
                  {problemData.testCases[0].expectedOutput}
                </div>
              </div>

              <>
                <h3>Input Description:</h3>
                <p>{problemData.description.inputFormat}</p>
              </>

              <>
                <h3>Output Description:</h3>
                <p>{problemData.description.outputFormat}</p>
              </>
            </div>
          ) : (
            <p>Loading problem data...</p>
          )}
        </div>
        {/* Right Side */}
        <div style={{ width: "50%", padding: "16px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", marginBottom: "12px" }}>
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              style={{
                marginRight: "8px",
                padding: "8px",
                borderRadius: "4px",
                backgroundColor: "#fff",
                color: "#333",
                border: "1px solid #ccc"
              }}
            >
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="java">Java</option>

            </select>
            <button
              style={{
                marginRight: "8px",
                padding: "8px",
                borderRadius: "4px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}
              onClick={handleRunClick}
            >
              Run
            </button>
            <button
              style={{
                padding: "8px",
                borderRadius: "4px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}
              onClick={handleSubmitClick}
            >
              Submit
            </button>
          </div>
          <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => highlight(code, languages.js)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              outline: 'none',
              border: 'none',
              backgroundColor: '#ffffff',
              height: '100%',
              overflowY: 'auto'
            }}
          />
          <div style={{ flexGrow: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <textarea
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  color: "#000",
                  marginBottom: "8px",
                  borderRadius: "4px",
                  padding: "12px",
                  border: "1px solid #ccc"
                }}
                placeholder="Input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <textarea
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  color: "#000",
                  marginBottom: "8px",
                  borderRadius: "4px",
                  padding: "12px",
                  border: "1px solid #ccc"
                }}
                placeholder="Output"
                value={output}
                readOnly
              />
              <textarea
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  color: "#000",
                  borderRadius: "4px",
                  padding: "12px",
                  border: "1px solid #ccc"
                }}
                placeholder="Verdict"
                value={verdict}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );


};

export default IndividualProblem;
