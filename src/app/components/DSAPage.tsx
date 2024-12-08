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
  HStack,
  Stack,
  Flex,
  Image,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const toast = useToast();

  const languageIdMap = {
    javascript: 63, // JavaScript (Node.js)
    python: 71, // Python 3
    java: 62, // Java (OpenJDK 13.0.1)
    c: 50, // C (GCC 9.2.0)
    cpp: 54, // C++ (GCC 9.2.0)
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

        if (resultResponse.data.status.id === 1 || resultResponse.data.status.id === 2) {
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
    <Box maxW="6xl" mx="auto" p={6}>
      {/* Back to Dashboard Button */}
      <Button
        mb={6}
        colorScheme="gray"
        onClick={() => router.push("/dashboard")}
      >
        Back to Dashboard
      </Button>

      {/* Title */}
      <Heading as="h1" fontSize="5xl" fontWeight="bold" textAlign="center" mb={6}>
        {title}
      </Heading>

      {/* Description Section */}
      <Box mb={8}>
        <Heading as="h2" fontSize="3xl" fontWeight="bold" mb={4}>
          Description
        </Heading>
        <Text fontSize="lg" color="gray.600">
          {description}
        </Text>
      </Box>

      {/* Code Editor Section */}
      <Box mb={8}>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading as="h2" fontSize="2xl">
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
        </Flex>
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

      {/* Visualization Section */}
      {images?.length > 0 && (
        <Box>
          <Heading as="h2" fontSize="2xl" fontWeight="bold" mb={4}>
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
    </Box>
  );
};

export default DataStructurePage;
