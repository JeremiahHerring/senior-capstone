"use client";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import {
  Box,
  Heading,
  Text,
  CircularProgress,
  CircularProgressLabel,
  List,
  ListItem,
  ListIcon,
  Flex,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

const ProgressPage = () => {
  const [user, loading, error] = useAuthState(auth);
  const [progress, setProgress] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [totalModules, setTotalModules] = useState(13);
  useEffect(() => {
    if (loading) return;

    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const fetchProgress = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const completed = Object.keys(userData.completedModules || {}).filter(
            (key) => userData.completedModules[key],
          );
          setCompletedModules(completed);
          setProgress((completed.length / totalModules) * 100);
        } else {
          console.error("User document not found.");
        }
      } catch (error) {
        console.error("Error fetching user progress:", error);
      }
    };

    fetchProgress();
  }, [user, loading, totalModules]);

  if (loading) {
    return (
      <Box textAlign="center" mt={8}>
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={8}>
        <Text color="red.500">An error occurred: {error.message}</Text>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="4xl" mx="auto">
      <Heading as="h1" size="lg" textAlign="center" mb={6}>
        Progress Dashboard
      </Heading>
      <Flex direction="column" align="center" mb={8}>
        <CircularProgress value={progress} size="150px" color="green.400">
          <CircularProgressLabel>{Math.round(progress)}%</CircularProgressLabel>
        </CircularProgress>
        <Text mt={4} fontSize="lg" fontWeight="medium">
          Modules Completed: {completedModules.length}/{totalModules}
        </Text>
      </Flex>
      <Box>
        <Heading as="h2" size="md" mb={4}>
          Completed Modules
        </Heading>
        {completedModules.length > 0 ? (
          <List spacing={3}>
            {completedModules.map((module, index) => (
              <ListItem key={index}>
                <ListIcon as={CheckCircleIcon} color="green.400" />
                {module}
              </ListItem>
            ))}
          </List>
        ) : (
          <Text color="gray.500">No modules completed yet.</Text>
        )}
      </Box>
    </Box>
  );
};

export default ProgressPage;
