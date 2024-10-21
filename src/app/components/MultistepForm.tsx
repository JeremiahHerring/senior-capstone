'use client'

import { useState } from 'react'
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Textarea,
  FormHelperText,
} from '@chakra-ui/react'

import { useToast } from '@chakra-ui/react'

const Form1 = () => {
  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
        Data Structures & Algorithms Knowledge
      </Heading>
      <FormControl>
        <FormLabel htmlFor="ds_algo_knowledge" fontWeight={'normal'}>
          How would you rate your knowledge of Data Structures and Algorithms?
        </FormLabel>
        <Select id="ds_algo_knowledge" placeholder="Select your knowledge level">
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </Select>
      </FormControl>
    </>
  )
}

const Form2 = () => {
  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
        Practice Preferences & Goals
      </Heading>
      <FormControl>
        <FormLabel htmlFor="algorithms_to_practice" fontWeight={'normal'}>
          Are there any specific algorithms you want to practice more?
        </FormLabel>
        <Input
          id="algorithms_to_practice"
          placeholder="e.g., Dynamic Programming, Graph Algorithms"
        />
      </FormControl>

      <FormControl mt="4%">
        <FormLabel htmlFor="goals" fontWeight={'normal'}>
          What are your main goals for improving your algorithmic skills?
        </FormLabel>
        <Textarea
          id="goals"
          placeholder="e.g., Preparing for coding interviews, solving more competitive programming problems"
        />
      </FormControl>
    </>
  )
}

const Form3 = () => {
  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal">
        Additional Thoughts
      </Heading>
      <SimpleGrid columns={1} spacing={6}>
        <FormControl>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: 'gray.50',
            }}>
            Do you have any additional comments or preferences you'd like to share?
          </FormLabel>
          <Textarea
            id="additional_comments"
            placeholder="e.g., Preferred learning resources, feedback on this questionnaire"
            rows={3}
            shadow="sm"
            focusBorderColor="brand.400"
          />
          <FormHelperText>
            Any additional information that might help us tailor your experience.
          </FormHelperText>
        </FormControl>
      </SimpleGrid>
    </>
  )
}

export default function MultistepForm() {
  const toast = useToast()
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(33.33)

  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form">
        <Progress hasStripe value={progress} mb="5%" mx="5%" isAnimated></Progress>
        {step === 1 ? <Form1 /> : step === 2 ? <Form2 /> : <Form3 />}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(step - 1)
                  setProgress(progress - 33.33)
                }}
                isDisabled={step === 1}
                colorScheme="teal"
                variant="solid"
                w="7rem"
                mr="5%">
                Back
              </Button>
              <Button
                w="7rem"
                isDisabled={step === 3}
                onClick={() => {
                  setStep(step + 1)
                  if (step === 3) {
                    setProgress(100)
                  } else {
                    setProgress(progress + 33.33)
                  }
                }}
                colorScheme="teal"
                variant="outline">
                Next
              </Button>
            </Flex>
            {step === 3 ? (
              <Button
                w="7rem"
                colorScheme="red"
                variant="solid"
                onClick={() => {
                  toast({
                    title: 'Questionnaire submitted.',
                    description: 'Thank you for sharing your feedback!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  })
                }}>
                Submit
              </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
      </Box>
    </>
  )
}
