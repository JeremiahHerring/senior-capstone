"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Link,
  Divider,
} from "@chakra-ui/react";

import MultistepForm from "../components/MultistepForm";

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [isQuestionnaireCompleted, setIsQuestionnaireCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestionnaireStatus = async () => {
      if (!user) {
        if (!sessionStorage.getItem("user")) {
          router.push("/sign-in");
          return;
        }
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsQuestionnaireCompleted(userData.questionnaireTaken || false);
        } else {
          console.error("User document not found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching user questionnaire status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchQuestionnaireStatus();
  }, [user, router]);

  const handleLogout = () => {
    signOut(auth);
    sessionStorage.removeItem("user");
    router.push("/sign-in");
  };

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
    return <p>Loading...</p>;
  }

  return (
    <Box p={6}>
      <HStack justifyContent="space-between" mb={6}>
        <Heading as="h1" size="lg">
          Dashboard
        </Heading>
        <Button colorScheme="red" onClick={handleLogout}>
          Log out
        </Button>
      </HStack>

      {!isQuestionnaireCompleted ? (
        <MultistepForm onComplete={handleQuestionnaireCompletion} />
      ) : (
        <VStack spacing={8} align="stretch">
          <Section title="Algorithms">
            <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
              <LinkBox href="/algorithms/Backtracking" label="Backtracking" />
              <LinkBox href="/algorithms/BFS" label="Breadth-First Search (BFS)" />
              <LinkBox href="/algorithms/DFS" label="Depth-First Search (DFS)" />
              <LinkBox href="/algorithms/DynamicProgramming" label="Dynamic Programming" />
              <LinkBox href="/algorithms/Greedy" label="Greedy Algorithms" />
              <LinkBox href="/algorithms/Recursion" label="Recursion" />
              <LinkBox href="/algorithms/SlidingWindow" label="Sliding Window" />
              <LinkBox href="/algorithms/Sorting" label="Sorting" />
              <LinkBox href="/algorithms/TwoPointer" label="Two Pointer Techniques" />
            </Grid>
          </Section>

          <Divider />

          <Section title="Data Structures">
            <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
              <LinkBox href="/data-structures/arrays" label="Arrays" />
              <LinkBox href="/data-structures/graphs" label="Graphs" />
              <LinkBox href="/data-structures/hashmaps" label="Hashmaps" />
              <LinkBox href="/data-structures/linked-lists" label="Linked Lists" />
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

function LinkBox({ href, label }) {
  return (
    <Link
      href={href}
      p={4}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      _hover={{ textDecoration: "none", bg: "gray.100" }}
    >
      <Text textAlign="center" fontWeight="medium">
        {label}
      </Text>
    </Link>
  );
}
