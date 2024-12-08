"use client";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebaseConfig";
import DataStructurePage from "../../components/DSAPage";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const HashmapsPage = () => {
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

  const title = "Hashmaps";
  const description = `
Hashmaps (or Hash Tables) are a data structure that store key-value pairs.
They provide efficient lookup, insertion, and deletion operations.
Applications include caching, counting frequencies, and database indexing.
  `;

  const images = ["../assets/hashmaps.png"];

  const problemDescription = `
Your task: Write a function to count the frequencies of elements in a given list.
The function should return a dictionary where keys are elements of the list, and values are their frequencies.
Example:
Input: [1, 2, 2, 3, 3, 3]
Output: {1: 1, 2: 2, 3: 3}
  `;

  const initialCode = `
# Python: Counting Frequencies of Elements
def count_frequencies(arr):
    # Write your code here
    return {}  # Replace this with your implementation

# Example Test Case
print(count_frequencies([1, 2, 2, 3, 3, 3]))  
# Expected Output: {1: 1, 2: 2, 3: 3}
  `;

  const language = "python";

  const testCases = [
    {
      input: "[1, 2, 2, 3, 3, 3]",
      expectedOutput: "{1: 1, 2: 2, 3: 3}",
    },
    {
      input: "[4, 4, 4, 4, 4]",
      expectedOutput: "{4: 5}",
    },
    {
      input: "[]",
      expectedOutput: "{}",
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
            source_code: `${userCode}\nprint(count_frequencies(${testCase.input}))`,
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
      images={images}
      problemDescription={problemDescription}
      initialCode={initialCode}
      language={language}
      onRunCode={handleCodeExecution}
      isCompleted={isCompleted}
      moduleId="Hashmaps" // Unique module identifier
      userId={user.uid} // Use the stored userId
    />
  );
};

export default HashmapsPage;
