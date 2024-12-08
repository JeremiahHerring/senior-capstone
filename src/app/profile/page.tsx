"use client";

import {
  Box,
  Flex,
  Avatar,
  Heading,
  Text,
  Button,
  Stack,
  useToast,
  Input,
  VStack,
  Spinner,
  Icon
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";

const Profile = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const toast = useToast();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/sign-in"); // Redirect if not authenticated
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setFirstName(data.firstName); 
          setLastName(data.lastName); 
        } else {
          toast({
            title: "Error",
            description: "User data not found.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, router, toast]);

  const handleUpdate = async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        firstName,
        lastName, 
      });

      setUserData((prev) => ({ ...prev, firstName, lastName }));
      toast({
        title: "Success",
        description: "Account information updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating account information:", error);
      toast({
        title: "Error",
        description: "Failed to update account information.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Step 1: Delete Firestore user document
      const userDocRef = doc(db, "users", user.uid);
      await deleteDoc(userDocRef);
  
      // Step 2: Delete Firebase Authentication user
      await auth.currentUser.delete();
  
      // Step 3: Notify success and redirect
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
  
      router.push("/"); // Redirect to the main page
    } catch (error) {
      console.error("Error deleting account:", error);
  
      // Handle re-authentication requirement
      if (error.code === "auth/requires-recent-login") {
        toast({
          title: "Re-authentication Required",
          description: "Please sign in again to delete your account.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
  
        // Redirect to sign-in page
        router.push("/sign-in");
      } else {
        toast({
          title: "Error",
          description: "Failed to delete account. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };
  
  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <Box p={6} maxW="600px" mx="auto" mt={8}>
      <Flex align="center" mb={6} direction="column">
        <Avatar 
          size="xl" 
          mb={4} 
          icon={<Icon as={FaUser} boxSize="2em"/>}
         />
        <Heading as="h1" size="lg">
          Hello, {userData.firstName}!
        </Heading>
        <Text color="gray.600" fontSize="lg">
          Welcome to your profile page.
        </Text>
      </Flex>

      {editMode ? (
        <VStack spacing={4} align="stretch">
          <Input
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Button colorScheme="blue" onClick={handleUpdate}>
            Save Changes
          </Button>
          <Button variant="ghost" onClick={() => setEditMode(false)}>
            Cancel
          </Button>
        </VStack>
      ) : (
        <VStack spacing={4} align="stretch">
          <Flex justify="space-between">
            <Text fontWeight="bold">First Name:</Text>
            <Text>{userData.firstName}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text fontWeight="bold">Last Name:</Text>
            <Text>{userData.lastName}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text fontWeight="bold">Email:</Text>
            <Text>{user ? user.email : "No user logged in"}</Text>{" "}
            {/* Safe fallback */}
          </Flex>
          <Button colorScheme="blue" onClick={() => setEditMode(true)}>
            Edit Account Information
          </Button>
          <Button
            colorScheme="red"
            variant="outline"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default Profile;
