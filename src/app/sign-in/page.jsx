'use client';

import React, { useState } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebaseConfig';
import { useRouter } from 'next/navigation';

export default function SimpleCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const [signinWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  // Handle sign-in and form submission
  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await signinWithEmailAndPassword(email, password);
      console.log('User signed in:', res.user);
      sessionStorage.setItem('user', true);

      // Clear form fields after successful sign-in
      setEmail('');
      setPassword('');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (e) {
      console.error('Error signing in:', e);
    }
  };

  const handleGithubSignin = () => {
    console.log('Signing in with GitHub');
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool <Text color={'blue.400'}>features</Text> ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <form onSubmit={handleSignin}>
            <Stack spacing={4}>
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
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}>
                  <Checkbox>Remember me</Checkbox>
                  <Text color={'blue.400'}>Forgot password?</Text>
                </Stack>
                <Button
                  type="submit"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </form>
          <div className="flex items-center justify-between mt-4">
            <hr className="flex-grow border-gray-600" />
          </div>
          <Button
            onClick={handleGithubSignin}
            w="full"
            mt={4}
            bg={'gray.700'}
            color={'white'}
            _hover={{ bg: 'gray.600' }}>
            Sign in with GitHub
          </Button>
        </Box>
      </Stack>
    </Flex>
  );
}
