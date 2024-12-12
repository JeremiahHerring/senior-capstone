'use client';
import React, { useState } from "react";
import DataStructurePage from "../../components/DSAPage";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const BacktrackingPage = () => {
  const [isCompleted, setIsCompleted] = useState(false);
  const toast = useToast();

  const title = "Backtracking";
  const description = `
Backtracking is a systematic method for solving constraint satisfaction problems.
It builds incrementally towards a solution and abandons partial solutions that fail to satisfy the constraints.
`;
const problemDescription = `
Your task: Write a function to find all possible subsets of a given list of grocery items.
For example, given ['apple', 'banana', 'grapes'], your function should return all subsets, including the empty set and the full set.
`;

  const initialCode = `
# Python: Find All Subsets of Grocery Items
def find_subsets(items):
    # Write your code here
    return []  # Return all subsets

# Example Test Case
print(find_subsets(['apple', 'banana', 'grapes']))
# Expected Output: [[], ['apple'], ['banana'], ['grapes'], ['apple', 'banana'], ['apple', 'grapes'], ['banana', 'grapes'], ['apple', 'banana', 'grapes']]
`;

  const language = "python";

  const testCases = [
    {
      input: `['apple', 'banana', 'grapes']`,
      expectedOutput: "[[], ['apple'], ['banana'], ['grapes'], ['apple', 'banana'], ['apple', 'grapes'], ['banana', 'grapes'], ['apple', 'banana', 'grapes']]",
    },
    {
      input: `['milk', 'bread']`,
      expectedOutput: "[[], ['milk'], ['bread'], ['milk', 'bread']]",
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
        // Submit user code with test case input
        const submissionResponse = await axios.post(
          "https://judge0-ce.p.rapidapi.com/submissions",
          {
            source_code: `${userCode}
print(find_subsets(${testCase.input}))`,
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
      problemDescription={problemDescription}
      initialCode={initialCode}
      language={language}
      onRunCode={handleCodeExecution}
      isCompleted={isCompleted}
    />
  );
};

export default BacktrackingPage;
