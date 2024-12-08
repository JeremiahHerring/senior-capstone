'use client';
import React, { useState } from "react";
import DataStructurePage from "../../components/DSAPage";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const BacktrackingPage = () => {
  const [isCompleted, setIsCompleted] = useState(false);
  const toast = useToast();

  const title = "Backtracking Algorithms";
  const description = `
Backtracking is a systematic method for solving constraint satisfaction problems.
It builds incrementally towards a solution and abandons partial solutions that fail to satisfy the constraints.
Your task: Write a function to solve the N-Queens problem for a given board size n.
`;

  const initialCode = `
// Example: Solve N-Queens Problem
function solveNQueens(n) {
  // Write your code here
  return []; // Return an array of solutions
}

// Example test case
console.log(solveNQueens(4)); // Expected Output: [[".Q..","...Q","Q...","..Q."], ...]
`;

  const language = "javascript";

  const testCases = [
    { input: "4", expectedOutput: '[[".Q..","...Q","Q...","..Q."]]' },
    { input: "1", expectedOutput: '[["Q"]]' },
  ];

  const handleCodeExecution = async (userCode) => {
    const languageIdMap = {
      javascript: 63, // JavaScript (Node.js)
      python: 71, // Python 3
      java: 62, // Java (OpenJDK 13.0.1)
      c: 50, // C (GCC 9.2.0)
      cpp: 54, // C++ (GCC 9.2.0)
    };

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];

      try {
        // Submit user code with test case input
        const submissionResponse = await axios.post(
          "https://judge0-ce.p.rapidapi.com/submissions",
          {
            source_code: `${userCode}
            console.log(solveNQueens(${testCase.input}));`,
            language_id: languageIdMap[language],
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
              "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
            },
          }
        );

        const token = submissionResponse.data.token;

        // Poll for execution result
        let result = null;
        const maxRetries = 10;
        let retries = 0;

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
            resultResponse.data.status.id === 2 // In Queue
          ) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            retries += 1;
          } else {
            result = resultResponse.data;
            break;
          }
        }

        // Validate output
        if (result.stdout.trim() !== testCase.expectedOutput) {
          toast({
            title: "Test Case Failed",
            description: `Test Case ${i + 1} failed. Expected: ${testCase.expectedOutput}, but got: ${result.stdout.trim()}`,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return;
        }
      } catch (error) {
        console.error("Error executing user code:", error);
        toast({
          title: "Error",
          description: "There was an error executing your code.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    }

    // If all test cases pass
    setIsCompleted(true);
    toast({
      title: "Congratulations!",
      description: "All test cases passed. Module completed successfully!",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <DataStructurePage
      title={title}
      description={description}
      initialCode={initialCode}
      language={language}
      onRunCode={handleCodeExecution}
      isCompleted={isCompleted}
    />
  );
};

export default BacktrackingPage;
