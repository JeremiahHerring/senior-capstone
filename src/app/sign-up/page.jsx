"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export async function addUserToDatabase(userId, userData) {
  try {
    await setDoc(doc(db, "users", userId), userData);
    console.log("User added to database with ID:", userId);
    return true;
  } catch (error) {
    console.error("Error adding user to database", error);
    throw error; // Propagate the error to handle it upstream
  }
}

export default function SignupCard() {
  // State for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Destructure all values from the hook
  const [
    createUserWithEmailAndPassword,
    userCredential,
    loading,
    firebaseError,
  ] = useCreateUserWithEmailAndPassword(auth);

  const toast = useToast();

  // Handle sign up and form submission
  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      toast({
        title: "Missing information.",
        description: "Please provide both email and password.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Optionally, add more validation (e.g., email format, password strength)

    // Attempt to create a user with email and password
    await createUserWithEmailAndPassword(email, password);
  };

  useEffect(() => {
    if (userCredential) {
      const user = userCredential.user;
      console.log("User signed up:", user);

      const userData = {
        firstName,
        lastName,
        email: user.email,
        createdAt: new Date(),
        questionnaireTaken: false
      };

      addUserToDatabase(user.uid, userData)
        .then(() => {
          console.log("User added to database successfully");

          // Store user status in session storage
          sessionStorage.setItem("user", true);

          // Clear the form fields after submission
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");
          router.push("/dashboard");
        })
        .catch((error) => {
          console.error("Error adding user to database:", error);
          toast({
            title: "Database error.",
            description: `Error: ${error.message}`,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
  }, [userCredential, firstName, lastName, email, router, toast]);

  useEffect(() => {
    if (firebaseError) {
      console.error("Signup error:", firebaseError);
      // Handle specific Firebase Auth error codes with toast notifications
      switch (firebaseError.code) {
        case "auth/email-already-in-use":
          toast({
            title: "Email already in use.",
            description: "Please use a different email or log in.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          break;
        case "auth/invalid-email":
          toast({
            title: "Invalid email address.",
            description: "Please enter a valid email address.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          break;
        case "auth/weak-password":
          toast({
            title: "Weak password.",
            description: "Please choose a stronger password.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          break;
        default:
          toast({
            title: "Sign up error.",
            description: `Error: ${firebaseError.message}`,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
      }
    }
  }, [firebaseError, toast]);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={handleSignup}>
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl id="firstName" isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName">
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  type="submit"
                  isLoading={loading}
                  loadingText="Submitting"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Already a user?{" "}
                  <Link href="/login" color={"blue.400"}>
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
