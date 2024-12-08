"use client";
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Select,
  Stack,
  Image,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const DataStructurePage = ({
  title,
  description,
  problemDescription,
  initialCode,
  language,
  images,
  moduleId, 
  userId, 
}) => {
  const [code, setCode] = useState(initialCode || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    language || "python"
  );
  const router = useRouter();
  const toast = useToast();

  const languageIdMap = {
    javascript: 63,
    python: 71,
    java: 62,
    c: 50,
    cpp: 54,
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running...");
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
          resultResponse.data.status.id === 1 ||
          resultResponse.data.status.id === 2
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
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const markAsCompleted = async () => {
    if (!userId) {
      console.error(
        "User ID is undefined. Cannot mark the module as completed."
      );
      toast({
        title: "Error",
        description: "User is not logged in. Please log in and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        [`completedModules.${moduleId}`]: true,
      });
      toast({
        title: "Module Completed",
        description:
          "Congratulations! You’ve successfully completed this module.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating module completion:", error);
      toast({
        title: "Error",
        description: "Failed to mark the module as completed.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="6xl" mx="auto" p={6}>
      <Button
        mb={6}
        colorScheme="gray"
        onClick={() => router.push("/dashboard")}
      >
        Back to Dashboard
      </Button>
      <Heading
        as="h1"
        fontSize="5xl"
        fontWeight="bold"
        textAlign="center"
        mb={6}
      >
        {title}
      </Heading>

      <Box mb={8}>
        <Heading as="h2" fontSize="3xl" fontWeight="bold" mb={4}>
          Description
        </Heading>
        <Text fontSize="lg" color="gray.600">
          {description}
        </Text>
      </Box>

      {images?.length > 0 && (
        <Box mb={8}>
          <Heading as="h2" fontSize="3xl" fontWeight="bold" mb={4}>
            Visualization
          </Heading>
          <Stack direction={["column", "row"]} spacing={4}>
            {images.map((imgSrc, index) => (
              <Image
                key={index}
                src={imgSrc}
                alt={`${title} visualization ${index + 1}`}
                borderRadius="md"
                boxShadow="lg"
              />
            ))}
          </Stack>
        </Box>
      )}

      <Box mb={8}>
        <Heading as="h2" fontSize="3xl" fontWeight="bold" mb={4}>
          Problem
        </Heading>
        <Text fontSize="lg" color="gray.600" mb={6}>
          {problemDescription}
        </Text>

        <Box>
          <Stack direction={["column", "row"]} justify="space-between" mb={4}>
            <Heading as="h3" fontSize="2xl">
              Try It Yourself
            </Heading>
            <Select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              width="200px"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
            </Select>
          </Stack>
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
          <Button
            mt={4}
            colorScheme="blue"
            isLoading={isRunning}
            onClick={runCode}
          >
            {isRunning ? "Running..." : "Run Code"}
          </Button>
          <Box mt={6} bg="gray.800" color="white" p={4} borderRadius="md">
            <Heading as="h3" fontSize="lg" mb={2}>
              Output:
            </Heading>
            <Text fontFamily="monospace" whiteSpace="pre-wrap">
              {output}
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Mark as Completed Button */}
      <Button
        colorScheme="green"
        size="lg"
        mt={6}
        width="full"
        onClick={markAsCompleted}
      >
        Mark as Completed
      </Button>
    </Box>
  );
};

export default DataStructurePage;
