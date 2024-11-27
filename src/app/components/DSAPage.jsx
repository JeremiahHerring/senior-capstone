// src/components/DataStructurePage.jsx
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const DataStructurePage = ({
  title,
  description,
  initialCode,
  language,
  images,
}) => {
  const [code, setCode] = useState(initialCode || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    language || "javascript"
  );
  const [userInput, setUserInput] = useState("");

  const languageIdMap = {
    javascript: 63, // JavaScript (Node.js)
    python: 71,     // Python 3
    java: 62,       // Java (OpenJDK 13.0.1)
    c: 50,          // C (GCC 9.2.0)
    cpp: 54,        // C++ (GCC 9.2.0)
    // Add more languages as needed
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running...");
    const maxRetries = 10; // Maximum number of polling attempts
    let retries = 0;
    let result = null;
  
    try {
      // Step 1: Create a submission
      const submissionResponse = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          source_code: code,
          language_id: languageIdMap[selectedLanguage],
          stdin: userInput, // Pass user input to the API
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY, // Correct usage
            useQueryString: true,
          },
        }
      );
  
      const token = submissionResponse.data.token;
      console.log("Submission Token:", token); // Debugging
  
      // Step 2: Poll for the result
      while (!result && retries < maxRetries) {
        const resultResponse = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
          {
            headers: {
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
              "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY, // Correct usage
            },
          }
        );
  
        console.log(
          `Polling Attempt ${retries + 1}:`,
          resultResponse.data.status.id,
          resultResponse.data.status.description
        ); // Enhanced Logging
  
        if (
          resultResponse.data.status.id === 1 || // Submitted
          resultResponse.data.status.id === 2    // In Queue
        ) {
          // Still processing
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
          retries += 1;
        } else {
          result = resultResponse.data;
          break; // Exit the loop immediately
        }
      }
  
      if (!result) {
        setOutput("Error: Code execution timed out.");
        console.warn("Code execution timed out after maximum retries.");
        return;
      }
  
      if (result.stdout) {
        setOutput(result.stdout);
      } else if (result.stderr) {
        setOutput(result.stderr);
      } else if (result.compile_output) {
        setOutput(result.compile_output);
      } else {
        setOutput("No output");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        setOutput(`Error: ${error.response.data.error || "Unknown error occurred."}`);
      } else if (error.request) {
        // Request was made but no response received
        setOutput("Error: No response from the server.");
      } else {
        // Something else caused the error
        setOutput(`Error: ${error.message}`);
      }
      console.error("Run Code Error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-4 text-center">{title}</h1>

      {/* Description Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">{description}</p>
      </section>

      {/* Code Editor Section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
          <h2 className="text-2xl font-semibold">Try It Yourself</h2>
          {/* Language Selector */}
          <div className="mt-2 md:mt-0">
            <label htmlFor="language" className="mr-2 font-medium">
              Language:
            </label>
            <select
              id="language"
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              {/* Add more options as needed */}
            </select>
          </div>
        </div>
        {/* Input Section */}
        <div className="mt-4">
          <label htmlFor="stdin" className="block text-gray-700 font-medium mb-2">
            Input (stdin):
          </label>
          <textarea
            id="stdin"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows="4"
            placeholder="Enter input here..."
          ></textarea>
        </div>
        <Editor
          height="400px"
          language={selectedLanguage}
          value={code}
          onChange={(value) => setCode(value)}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
          }}
        />
        <button
          onClick={runCode}
          disabled={isRunning}
          className={`mt-4 px-4 py-2 rounded ${
            isRunning
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          } transition-colors duration-200`}
        >
          {isRunning ? "Running..." : "Run Code"}
        </button>
        {/* Loading Indicator */}
        {isRunning && (
          <div className="flex items-center mt-4">
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span>Executing...</span>
          </div>
        )}
        {/* Output Section */}
        <div className="mt-4 bg-gray-800 text-white p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">Output:</h3>
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      </section>

      {/* Visualization Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Visualization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images &&
            images.map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                alt={`${title} visualization ${index + 1}`}
                className="w-full h-auto rounded shadow object-contain"
              />
            ))}
        </div>
      </section>
    </div>
  );
};

export default DataStructurePage;
