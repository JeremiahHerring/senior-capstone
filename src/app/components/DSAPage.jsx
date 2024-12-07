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
  const [selectedLanguage, setSelectedLanguage] = useState(language || "python");

  const languageIdMap = {
    javascript: 63, // JavaScript (Node.js)
    python: 71,     // Python 3
    java: 62,       // Java (OpenJDK 13.0.1)
    c: 50,          // C (GCC 9.2.0)
    cpp: 54,        // C++ (GCC 9.2.0)
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running...");
    const maxRetries = 10;
    let retries = 0;
    let result = null;

    try {
      const submissionResponse = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          source_code: code,
          language_id: languageIdMap[selectedLanguage],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
            useQueryString: true,
          },
        }
      );

      const token = submissionResponse.data.token;

      while (!result && retries < maxRetries) {
        const resultResponse = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
          {
            headers: {
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
              "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
            },
          }
        );

        if (
          resultResponse.data.status.id === 1 || // Submitted
          resultResponse.data.status.id === 2    // In Queue
        ) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          retries += 1;
        } else {
          result = resultResponse.data;
          break;
        }
      }

      if (!result) {
        setOutput("Error: Code execution timed out.");
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
      setOutput(`Error: ${error.response?.data?.error || "An unknown error occurred."}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-6 text-center">{title}</h1>

      {/* Description Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Description</h2>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">{description}</p>
      </section>

      {/* Code Editor Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Try It Yourself</h2>
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>
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
          className={`mt-4 px-6 py-2 rounded-lg ${
            isRunning
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          } transition-colors duration-200`}
        >
          {isRunning ? "Running..." : "Run Code"}
        </button>
        {/* Output Section */}
        <div className="mt-6 bg-gray-900 text-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Output:</h3>
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      </section>

      {/* Visualization Section */}
      {images?.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Visualization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                alt={`${title} visualization ${index + 1}`}
                className="w-full h-auto rounded-lg shadow"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DataStructurePage;
