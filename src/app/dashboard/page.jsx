"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Grid,
  VStack,
  HStack,
  Link,
  Divider,
  Text,
} from "@chakra-ui/react";
import MultistepForm from "../components/MultistepForm";

export default function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [isQuestionnaireCompleted, setIsQuestionnaireCompleted] = useState(false);
  const [completedModules, setCompletedModules] = useState({});

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsQuestionnaireCompleted(userData.questionnaireTaken || false);
          setCompletedModules(userData.completedModules || {});
        } else {
          console.error("User document not found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user, loading, router]);

  const handleQuestionnaireCompletion = async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { questionnaireTaken: true });
      setIsQuestionnaireCompleted(true);
    } catch (error) {
      console.error("Error updating questionnaire status:", error);
    }
  };

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
    <Box p={6}>
      <HStack justifyContent="space-between" mb={6}>
        <Heading as="h1" size="lg">
          Dashboard
        </Heading>
      </HStack>

      {!isQuestionnaireCompleted ? (
        <MultistepForm onComplete={handleQuestionnaireCompletion} />
      ) : (
        <VStack spacing={8} align="stretch">
          <Section title="Algorithms">
            <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
              <LinkBox href="/algorithms/Backtracking" label="Backtracking" isCompleted={completedModules.Backtracking} />
              <LinkBox href="/algorithms/BFS" label="Breadth-First Search (BFS)" isCompleted={completedModules.BFS} />
              <LinkBox href="/algorithms/DFS" label="Depth-First Search (DFS)" isCompleted={completedModules.DFS} />
              <LinkBox href="/algorithms/DynamicProgramming" label="Dynamic Programming" isCompleted={completedModules.DynamicProgramming} />
              <LinkBox href="/algorithms/Greedy" label="Greedy Algorithms" isCompleted={completedModules.GreedyAlgorithms} />
              <LinkBox href="/algorithms/Recursion" label="Recursion" isCompleted={completedModules.Recursion} />
              <LinkBox href="/algorithms/SlidingWindow" label="Sliding Window" isCompleted={completedModules.SlidingWindow} />
              <LinkBox href="/algorithms/Sorting" label="Sorting" isCompleted={completedModules.Sorting} />
              <LinkBox href="/algorithms/TwoPointer" label="Two Pointer Techniques" isCompleted={completedModules.TwoPointer} />
            </Grid>
          </Section>

          <Divider />

          <Section title="Data Structures">
            <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
              <LinkBox href="/data-structures/arrays" label="Arrays" isCompleted={completedModules.Arrays} />
              <LinkBox href="/data-structures/graphs" label="Graphs" isCompleted={completedModules.Graphs} />
              <LinkBox href="/data-structures/hashmaps" label="Hashmaps" isCompleted={completedModules.Hashmaps} />
              <LinkBox href="/data-structures/linked-lists" label="Linked Lists" isCompleted={completedModules.LinkedLists} />
            </Grid>
          </Section>
        </VStack>
      )}
    </Box>
  );
}

function Section({ title, children }) {
  return (
    <Box>
      <Heading as="h2" size="md" mb={4}>
        {title}
      </Heading>
      {children}
    </Box>
  );
}

function LinkBox({ href, label, isCompleted }) {
  return (
    <Link
      href={href}
      p={4}
      border="1px solid"
      borderColor={isCompleted ? "green.500" : "gray.200"}
      borderRadius="md"
      bg={isCompleted ? "green.100" : "transparent"}
      _hover={{ textDecoration: "none", bg: "gray.100" }}
    >
      <Text textAlign="center" fontWeight="medium" color={isCompleted ? "green.800" : "black"}>
        {label}
      </Text>
    </Link>
  );
}
