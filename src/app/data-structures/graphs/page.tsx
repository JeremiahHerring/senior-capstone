"use client";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebaseConfig";
import DataStructurePage from "../../components/DSAPage";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const GraphsPage = () => {
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

  const title = "Graphs";
  const description = `
Graphs are a versatile data structure that represent relationships between objects.
They consist of vertices (nodes) connected by edges and can be directed or undirected.
Applications include social networks, shortest path algorithms, and network routing.
  `;

  const images = ["../assets/graph1.png"];

  const problemDescription = `
Your task: Write a class to represent a graph using an adjacency list.
The class should support adding vertices, adding edges, and displaying the graph.
Example:
Input: Add vertices "A", "B", "C", and edges ("A", "B"), ("A", "C"), ("B", "C").
Output: 
A -> B, C
B -> A, C
C -> A, B
  `;

  const initialCode = `
# Python: Adjacency List Representation of a Graph
class Graph:
    def __init__(self):
        self.adjacency_list = {}

    def add_vertex(self, vertex):
        # Write your code here
        pass

    def add_edge(self, vertex1, vertex2):
        # Write your code here
        pass

    def display(self):
        # Write your code here
        pass

# Example Test Case
graph = Graph()
graph.add_vertex("A")
graph.add_vertex("B")
graph.add_vertex("C")
graph.add_edge("A", "B")
graph.add_edge("A", "C")
graph.add_edge("B", "C")
graph.display()
# Expected Output:
# A -> B, C
# B -> A, C
# C -> A, B
  `;

  const language = "python";

  const testCases = [
    {
      input: `
graph = Graph()
graph.add_vertex("A")
graph.add_vertex("B")
graph.add_vertex("C")
graph.add_edge("A", "B")
graph.add_edge("A", "C")
graph.add_edge("B", "C")
graph.display()`,
      expectedOutput: `A -> B, C\nB -> A, C\nC -> A, B`,
    },
    {
      input: `
graph = Graph()
graph.add_vertex("X")
graph.add_vertex("Y")
graph.add_edge("X", "Y")
graph.display()`,
      expectedOutput: `X -> Y\nY -> X`,
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
      images={images}
      problemDescription={problemDescription}
      initialCode={initialCode}
      language={language}
      onRunCode={handleCodeExecution}
      isCompleted={isCompleted}
      moduleId="Graphs" // Unique module identifier
      userId={user.uid} // Use the stored userId
    />
  );
};

export default GraphsPage;
