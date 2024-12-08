"use client";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebaseConfig";
import DataStructurePage from "../../components/DSAPage";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const RecursionPage = () => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const toast = useToast();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error || !user) {
    router.push("/sign-in"); // Redirect if there's no authenticated user
    return null;
  }

  const title = "Recursion";
  const description = `
Recursion is a method where a function calls itself to solve a problem.
It is useful for problems like tree traversals, factorial calculation, and backtracking algorithms.
  `;

  const problemDescription = `
Your task: Write a function to calculate the factorial of a given number using recursion.
The factorial of a number n is defined as the product of all integers from 1 to n.
Example:
Input: n = 5
Output: 120 (because 5 * 4 * 3 * 2 * 1 = 120)
  `;

  const initialCode = `
# Python: Factorial Calculation using Recursion
def factorial(n):
    # Write your code here
    return -1  # Replace this with your implementation

# Example Test Case
print(factorial(5))  # Expected Output: 120
  `;

  const language = "python";

  const testCases = [
    {
      input: "(5)",
      expectedOutput: "120",
    },
    {
      input: "(7)",
      expectedOutput: "5040",
    },
    {
      input: "(0)",
      expectedOutput: "1",
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
print(factorial${testCase.input})`,
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
      moduleId="Recursion" // Unique module identifier
      userId={user.uid} // Use the stored userId
    />
  );
};

export default RecursionPage;
