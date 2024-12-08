"use client";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebaseConfig";
import DataStructurePage from "../../components/DSAPage";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const LinkedListsPage = () => {
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

  const title = "Linked Lists";
  const description = `
Linked Lists are linear data structures where each element (node) contains data and a reference (or pointer) to the next node.
They are dynamic in nature and allow efficient insertion and deletion.
Applications include implementing stacks, queues, and adjacency lists for graphs.
  `;

  const problemDescription = `
Your task: Implement a singly linked list in Python with the following functionalities:
1. **Append**: Add a new node to the end of the list.
2. **Display**: Print all elements in the linked list in order.
3. **Size**: Return the number of elements in the list.

Example:
Input:
  list.append(1)
  list.append(2)
  list.append(3)
  list.display()
Output:
  1 -> 2 -> 3 -> null
  Size: 3
  `;

  const initialCode = `
# Python: Singly Linked List Implementation
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
        self.size = 0

    def append(self, value):
        # Write your code here
        pass

    def display(self):
        # Write your code here
        pass

    def size(self):
        return self.size

# Example Test Case
list = LinkedList()
list.append(1)
list.append(2)
list.append(3)
list.display()  # Expected Output: 1 -> 2 -> 3 -> null
print("Size:", list.size())  # Expected Output: Size: 3
  `;

  const language = "python";

  const testCases = [
    {
      input: `
list = LinkedList()
list.append(1)
list.append(2)
list.append(3)
list.display()
print("Size:", list.size())
      `,
      expectedOutput: "1 -> 2 -> 3 -> null\nSize: 3",
    },
    {
      input: `
list = LinkedList()
list.append(10)
list.append(20)
list.display()
print("Size:", list.size())
      `,
      expectedOutput: "10 -> 20 -> null\nSize: 2",
    },
    {
      input: `
list = LinkedList()
list.display()
print("Size:", list.size())
      `,
      expectedOutput: "null\nSize: 0",
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
            source_code: `${userCode}\n${testCase.input}`,
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
      moduleId="LinkedLists" // Unique module identifier
      userId={user.uid} // Use the stored userId
    />
  );
};

export default LinkedListsPage;
