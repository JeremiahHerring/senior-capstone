"use client";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebaseConfig";
import DataStructurePage from "../../components/DSAPage";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const DFSPage = () => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const toast = useToast();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error || !user) {
    router.push("/sign-in");
    return null;
  }

  const title = "Depth-First Search (DFS)";
  const description = `
Depth-First Search is an algorithm for traversing or searching tree or graph data structures.
It starts at the root (or any arbitrary node) and explores as far as possible along each branch before backtracking.
  `;

  const problemDescription = `
Your task: Implement DFS for a graph represented as an adjacency list.
Given a graph and a starting node, return a list of nodes in the order they are visited using DFS.
Example:
Input: graph = {'A': ['B', 'C'], 'B': ['D', 'E'], 'C': ['F'], 'D': [], 'E': ['F'], 'F': []}, start = 'A'
Output: ['A', 'B', 'D', 'E', 'F', 'C']
  `;

  const initialCode = `
# Python: DFS on a Graph
def dfs(graph, start, visited=None):
    # Write your code here
    return []  # Return the DFS traversal order

# Example Test Case
graph = {'A': ['B', 'C'], 'B': ['D', 'E'], 'C': ['F'], 'D': [], 'E': ['F'], 'F': []}
print(dfs(graph, 'A'))
# Expected Output: ['A', 'B', 'D', 'E', 'F', 'C']
  `;

  const language = "python";

  const testCases = [
    {
      input: `{ 'A': ['B', 'C'], 'B': ['D', 'E'], 'C': ['F'], 'D': [], 'E': ['F'], 'F': [] }, 'A'`,
      expectedOutput: "['A', 'B', 'D', 'E', 'F', 'C']",
    },
    {
      input: `{ '1': ['2', '3'], '2': ['4'], '3': [], '4': [] }, '1'`,
      expectedOutput: "['1', '2', '4', '3']",
    },
  ];

  const handleCodeExecution = async (userCode) => {
    const languageIdMap = {
      javascript: 63,
      python: 71,
      java: 62,
      c: 50,
      cpp: 54,
    };

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];

      try {
        const submissionResponse = await axios.post(
          "https://judge0-ce.p.rapidapi.com/submissions",
          {
            source_code: `${userCode}
print(dfs(${testCase.input}))`,
            language_id: languageIdMap[language],
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
              "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
            },
          },
        );

        const token = submissionResponse.data.token;

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
            },
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

        if (!result) {
          toast({
            title: "Error",
            description: "Code execution timed out.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return;
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
      problemDescription={problemDescription}
      initialCode={initialCode}
      language={language}
      onRunCode={handleCodeExecution}
      isCompleted={isCompleted}
      moduleId="DFS" // Unique module identifier
      userId={user.uid} // Pass userId from authentication
    />
  );
};

export default DFSPage;
